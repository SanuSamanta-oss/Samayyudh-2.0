import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import {
  submitStudentExam,
  getStudentParticipantStatus,
  getCustomExamById,
  isTeacherAuthorizedForExam,
} from '@/lib/exams/custom-exam-service';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let user: User | null = null;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const cookieStore = await cookies();
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: () => {},
          },
        });
        const { data } = await supabase.auth.getUser();
        user = data.user;
      } catch {
        user = null;
      }
    }

    // Task 1: Enforce authenticated session
    if (!user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Authentication required to submit examination.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { exam_id, student_id, answers, submission_type } = body;
    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    // Authoritative score integrity: strictly discard any client-supplied score/accuracy fields
    if ('score' in body || 'accuracy' in body || 'final_score' in body || 'p_score' in body) {
      console.warn(`[API /custom-exams/submit] Discarded client-supplied score parameters from actor ${user.id}`);
    }

    const idempotencyKey =
      body.idempotency_key ||
      req.headers.get('idempotency-key') ||
      req.headers.get('x-idempotency-key') ||
      null;

    let targetStudentId = user.id;
    let safeSubmissionType: 'normal' | 'early_exit' | 'timeout' | 'teacher_forced' = 'normal';

    // Handle Teacher-Forced submission vs Student submission
    if (submission_type === 'teacher_forced') {
      const isTeacherAuthorized = await isTeacherAuthorizedForExam(exam_id, user.id);
      if (!isTeacherAuthorized) {
        return NextResponse.json(
          { error: 'FORBIDDEN: You do not have permission to force submission for this examination.' },
          { status: 403 }
        );
      }
      safeSubmissionType = 'teacher_forced';
      if (student_id) {
        targetStudentId = student_id;
      }
    } else {
      // For student submissions, never trust client-supplied student_id; strictly bind to authenticated session
      if (student_id && student_id !== user.id) {
        return NextResponse.json(
          { error: 'FORBIDDEN: Cannot submit examination on behalf of another student.' },
          { status: 403 }
        );
      }
      safeSubmissionType = ['normal', 'early_exit', 'timeout'].includes(submission_type)
        ? submission_type
        : 'normal';
    }

    // Check participant existence and suspension status
    const statusData = await getStudentParticipantStatus(exam_id, targetStudentId);
    if (!statusData.participant) {
      return NextResponse.json(
        { error: 'PARTICIPANT_NOT_FOUND: The student is not registered for this examination.' },
        { status: 404 }
      );
    }

    if (
      safeSubmissionType !== 'teacher_forced' &&
      (statusData.participant.is_suspended || statusData.participant.exam_status === 'suspended')
    ) {
      return NextResponse.json(
        {
          error: 'STUDENT_SUSPENDED: Examination is locked due to active proctoring suspension.',
          code: 'STUDENT_SUSPENDED',
          suspended_at: statusData.participant.suspended_at,
          suspended_reason: statusData.participant.suspended_reason,
        },
        { status: 403 }
      );
    }

    // Verify parent exam status
    const exam = await getCustomExamById(exam_id);
    if (exam && ['completed', 'archived'].includes(exam.status) && safeSubmissionType !== 'teacher_forced') {
      return NextResponse.json(
        { error: 'EXAM_CONCLUDED: The examination has concluded and submissions are closed.' },
        { status: 403 }
      );
    }

    const result = await submitStudentExam(
      exam_id,
      targetStudentId,
      answers || {},
      safeSubmissionType,
      {
        idempotencyKey,
        actorId: user.id,
      }
    );

    if (result.idempotent) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        already_submitted: true,
        message: 'Submission already recorded (idempotent replay).',
        score: result.score,
        accuracy: result.accuracy,
        submitted_at: result.submitted_at,
      });
    }

    if (result.already_submitted && !result.success) {
      return NextResponse.json(
        {
          error: 'ALREADY_SUBMITTED: Examination has already been submitted and finalized.',
          code: 'ALREADY_SUBMITTED',
          already_submitted: true,
          score: result.score,
          accuracy: result.accuracy,
          submitted_at: result.submitted_at,
        },
        { status: 409 }
      );
    }

    if (result.error === 'STUDENT_SUSPENDED') {
      return NextResponse.json(
        {
          error: 'STUDENT_SUSPENDED: Examination is locked due to active proctoring suspension.',
          code: 'STUDENT_SUSPENDED',
        },
        { status: 403 }
      );
    }

    if (result.error === 'EXAM_CONCLUDED') {
      return NextResponse.json(
        {
          error: 'EXAM_CONCLUDED: The examination has concluded and submissions are closed.',
          code: 'EXAM_CONCLUDED',
        },
        { status: 403 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to submit examination.', code: result.code },
        { status: result.code === 'DATABASE_ERROR' ? 500 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Examination successfully finalized and submitted.',
      score: result.score,
      accuracy: result.accuracy,
      submitted_at: result.submitted_at,
    });
  } catch (err: unknown) {
    console.error('[API /custom-exams/submit POST] Error:', err);
    return NextResponse.json({ error: 'Failed to record examination submission.' }, { status: 500 });
  }
}
