import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  generateMeetingSignature,
  getCachedExamMeeting,
  getZoomConfigStatus,
} from '@/lib/zoom/zoom-service';
import {
  isTeacherAuthorizedForExam,
  getCustomExamById,
  getStudentParticipantStatus,
} from '@/lib/exams/custom-exam-service';

export async function POST(req: Request) {
  try {
    const configStatus = getZoomConfigStatus();
    if (!configStatus.isConfigured) {
      return NextResponse.json(
        {
          error: 'ZOOM_NOT_CONFIGURED: Zoom Meeting SDK credentials are not configured on this server.',
          code: 'ZOOM_NOT_CONFIGURED',
        },
        { status: 503 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let user: User | null = null;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        if (allCookies.length > 0) {
          const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
              getAll: () => allCookies,
              setAll: () => {},
            },
          });
          const { data } = await supabase.auth.getUser();
          user = data.user;
        }
      } catch {
        user = null;
      }
    }

    // Support demo/offline mode or development testing
    let effectiveUserId = user?.id;
    let userName = user?.user_metadata?.full_name || user?.email || 'SamayYudh Candidate';

    if (!effectiveUserId && (!isSupabaseConfigured || process.env.NODE_ENV !== 'production')) {
      const authHeader = req.headers.get('Authorization') || '';
      const testUserId = req.headers.get('x-user-id') || req.headers.get('x-teacher-id') || req.headers.get('x-student-id');
      if (testUserId) {
        effectiveUserId = testUserId;
      } else if (authHeader.includes('teacher')) {
        effectiveUserId = 'teacher_demo';
        userName = 'Teacher Invigilator (Demo)';
      } else if (authHeader.includes('student')) {
        effectiveUserId = 'student_demo';
        userName = 'Student Candidate (Demo)';
      }
    }

    if (!effectiveUserId) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Authentication required to generate Meeting SDK signature.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { exam_id } = body;

    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    const exam = await getCustomExamById(exam_id);
    if (!exam) {
      return NextResponse.json({ error: 'EXAM_NOT_FOUND: The requested exam does not exist.' }, { status: 404 });
    }

    // Check meeting existence
    const meeting = getCachedExamMeeting(exam_id);
    if (!meeting) {
      return NextResponse.json(
        {
          error: 'MEETING_NOT_INITIALIZED: Live meeting for this examination has not been created yet.',
          code: 'MEETING_NOT_INITIALIZED',
        },
        { status: 404 }
      );
    }

    // Check teacher authorization
    const isTeacher = await isTeacherAuthorizedForExam(exam_id, effectiveUserId);
    let role: 0 | 1 = 0;

    if (isTeacher) {
      role = 1; // Host
      userName = `[Invigilator] ${user?.user_metadata?.full_name || 'Teacher'}`;
    } else {
      // Student Verification: Check registration and suspension status in SamayYudh
      const partStatus = await getStudentParticipantStatus(exam_id, effectiveUserId);
      if (!partStatus.participant) {
        return NextResponse.json(
          { error: 'FORBIDDEN: You are not enrolled in this examination.' },
          { status: 403 }
        );
      }

      const isAdmitted = Boolean(partStatus.participant.admitted || partStatus.participant.exam_status === 'in_progress');
      if (!isAdmitted) {
        return NextResponse.json(
          {
            error: 'STUDENT_NOT_ADMITTED: You must be admitted by the teacher before acquiring a live meeting signature.',
            code: 'STUDENT_NOT_ADMITTED',
          },
          { status: 403 }
        );
      }

      if (partStatus.participant.is_suspended || partStatus.participant.exam_status === 'suspended') {
        return NextResponse.json(
          {
            error: 'STUDENT_SUSPENDED: Cannot join live video while suspended by proctor.',
            code: 'STUDENT_SUSPENDED',
            suspended: true,
          },
          { status: 403 }
        );
      }

      role = 0; // Attendee
      userName = partStatus.participant.student_name || userName;
    }

    // Authoritatively generate Meeting SDK signature
    const sigResult = generateMeetingSignature({
      meetingNumber: meeting.meetingId,
      role,
      userName,
    });

    return NextResponse.json({
      success: true,
      signature: sigResult.signature,
      sdkKey: sigResult.sdkKey,
      meetingNumber: meeting.meetingId,
      password: meeting.password || '',
      role,
      userName,
    });
  } catch (err: unknown) {
    console.error('[API /zoom/signature POST] Error:', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to generate Meeting SDK signature.' },
      { status: 500 }
    );
  }
}
