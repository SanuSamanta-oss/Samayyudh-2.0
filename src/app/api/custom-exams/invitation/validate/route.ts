import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  getCustomExamByCode,
  getCustomExamById,
  getStudentParticipantStatus,
} from '@/lib/exams/custom-exam-service';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import type { InvitationValidationResult, CustomExam } from '@/types/custom-exam';

export async function GET(req: Request) {
  return handleValidation(req);
}

export async function POST(req: Request) {
  return handleValidation(req);
}

async function handleValidation(req: Request) {
  try {
    const url = new URL(req.url);
    let code = url.searchParams.get('code') || url.searchParams.get('token');

    if (!code && req.method === 'POST') {
      try {
        const body = await req.json();
        code = body.code || body.token;
      } catch {}
    }

    if (!code || !code.trim()) {
      return NextResponse.json<InvitationValidationResult>(
        {
          valid: false,
          status: 'not_found',
          message: 'Examination invitation code is required.',
          exam: null,
          invitation: null,
        },
        { status: 400 }
      );
    }

    const rawCode = code.trim();
    // Normalize: remove dashes or spaces (e.g. CE-4821 -> CE4821)
    const normalizedCode = rawCode.replace(/[\s-]/g, '').toUpperCase();

    // 1. Resolve exam from database or memory store
    let exam: CustomExam | null = await getCustomExamByCode(normalizedCode);
    if (!exam && rawCode.includes('-') && rawCode.length > 20) {
      exam = await getCustomExamById(rawCode);
    }

    if (!exam) {
      return NextResponse.json<InvitationValidationResult>(
        {
          valid: false,
          status: 'not_found',
          message: `No examination found matching invitation code "${rawCode}". Please check your link or QR code.`,
          exam: null,
          invitation: null,
        },
        { status: 404 }
      );
    }

    // 2. Check if a dedicated invitation record exists
    let invitationRecord: any = null;
    if (isSupabaseConfigured) {
      try {
        const adminClient = createServiceRoleClient();
        if (adminClient) {
          const { data } = await adminClient
            .from('custom_exam_invitations')
            .select('*')
            .or(`invitation_code.eq.${normalizedCode},invitation_code.eq.${rawCode}`)
            .maybeSingle();
          invitationRecord = data;
        }
      } catch {}
    }

    // Check invitation-specific revocation or expiration
    if (invitationRecord) {
      if (invitationRecord.status === 'revoked' || invitationRecord.revoked_at) {
        return NextResponse.json<InvitationValidationResult>(
          {
            valid: false,
            status: 'revoked',
            message: 'This examination invitation has been revoked by the invigilator.',
            exam: null,
            invitation: { code: rawCode },
          },
          { status: 403 }
        );
      }

      if (invitationRecord.expires_at && new Date(invitationRecord.expires_at).getTime() < Date.now()) {
        return NextResponse.json<InvitationValidationResult>(
          {
            valid: false,
            status: 'expired',
            message: 'This examination invitation has expired.',
            exam: null,
            invitation: { code: rawCode, expires_at: invitationRecord.expires_at },
          },
          { status: 410 }
        );
      }

      if (invitationRecord.max_uses && invitationRecord.use_count >= invitationRecord.max_uses) {
        return NextResponse.json<InvitationValidationResult>(
          {
            valid: false,
            status: 'full',
            message: 'Maximum participant capacity for this invitation has been reached.',
            exam: null,
            invitation: { code: rawCode },
          },
          { status: 403 }
        );
      }
    }

    // 3. Check Exam status & lifecycle
    if (exam.status === 'archived') {
      return NextResponse.json<InvitationValidationResult>(
        {
          valid: false,
          status: 'ended',
          message: 'This examination has been archived or cancelled.',
          exam: null,
          invitation: { code: rawCode },
        },
        { status: 403 }
      );
    }

    const now = Date.now();
    if (exam.end_time && new Date(exam.end_time).getTime() < now) {
      return NextResponse.json<InvitationValidationResult>(
        {
          valid: false,
          status: 'ended',
          message: 'This examination has already concluded. Joining is closed.',
          exam: null,
          invitation: { code: rawCode },
        },
        { status: 403 }
      );
    }

    // 4. Authenticate current student if logged in
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let user: any = null;
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      });
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    let alreadySubmitted = false;
    let isSuspended = false;

    if (user?.id) {
      try {
        const { participant } = await getStudentParticipantStatus(exam.id, user.id);
        if (participant) {
          if (participant.exam_status === 'submitted') {
            alreadySubmitted = true;
          }
          if (participant.is_suspended) {
            isSuspended = true;
          }
        }
      } catch {}
    }

    if (alreadySubmitted) {
      return NextResponse.json<InvitationValidationResult>({
        valid: false,
        status: 'already_submitted',
        message: 'You have already completed and submitted this examination.',
        exam: {
          id: exam.id,
          exam_code: exam.exam_code,
          title: exam.title,
          description: exam.description,
          subject: exam.subject || (exam.subjects && exam.subjects[0]) || 'General',
          target_class: exam.target_class,
          duration_minutes: exam.duration_minutes,
          total_marks: exam.total_marks,
          start_time: exam.start_time,
          end_time: exam.end_time,
          supervision_enabled: exam.supervision_enabled,
          mic_enabled: exam.mic_enabled,
          negative_marking: exam.negative_marking,
          instructions: exam.instructions,
          status: exam.status,
          total_questions: exam.selected_questions?.length || 0,
        },
        invitation: { code: rawCode },
        student_status: {
          is_authenticated: true,
          student_id: user?.id,
          already_submitted: true,
          is_suspended: isSuspended,
        },
      });
    }

    // 5. Sanitised Success Result
    return NextResponse.json<InvitationValidationResult>({
      valid: true,
      status: 'valid',
      message: 'Examination invitation verified.',
      exam: {
        id: exam.id,
        exam_code: exam.exam_code,
        title: exam.title,
        description: exam.description,
        subject: exam.subject || (exam.subjects && exam.subjects[0]) || 'General',
        target_class: exam.target_class,
        duration_minutes: exam.duration_minutes,
        total_marks: exam.total_marks,
        start_time: exam.start_time,
        end_time: exam.end_time,
        supervision_enabled: exam.supervision_enabled,
        mic_enabled: exam.mic_enabled,
        negative_marking: exam.negative_marking,
        instructions: exam.instructions,
        status: exam.status,
        total_questions: exam.selected_questions?.length || 0,
      },
      invitation: {
        code: rawCode,
        expires_at: invitationRecord?.expires_at || exam.end_time,
      },
      student_status: {
        is_authenticated: Boolean(user?.id),
        student_id: user?.id || null,
        already_submitted: false,
        is_suspended: isSuspended,
      },
    });
  } catch (err: any) {
    console.error('[API /custom-exams/invitation/validate] Error:', err);
    return NextResponse.json<InvitationValidationResult>(
      {
        valid: false,
        status: 'not_found',
        message: 'Server error while validating examination invitation.',
        exam: null,
        invitation: null,
      },
      { status: 500 }
    );
  }
}
