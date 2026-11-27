import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import {
  getStudentParticipantStatus,
  updateStudentParticipantHeartbeat,
  isTeacherAuthorizedForExam,
} from '@/lib/exams/custom-exam-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('exam_id');
    const studentId = searchParams.get('student_id');

    if (!examId || !studentId) {
      return NextResponse.json(
        { error: 'Missing exam_id or student_id parameter.' },
        { status: 400 }
      );
    }

    const data = await getStudentParticipantStatus(examId, studentId);
    return NextResponse.json({
      success: true,
      participant: data.participant,
      latestEvent: data.latestEvent,
    });
  } catch (err: unknown) {
    console.error('[API /custom-exams/student-status GET] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve student participant status.' },
      { status: 500 }
    );
  }
}

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

    // Task 1: Enforce authentication for student telemetry and heartbeats
    if (!user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Authentication required to update examination telemetry.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { exam_id, student_id, updates } = body;

    if (!exam_id || !student_id) {
      return NextResponse.json(
        { error: 'Missing exam_id or student_id.' },
        { status: 400 }
      );
    }

    // Caller must be the student themselves OR an authorized teacher/admin
    const callerId = user.id;
    if (callerId !== student_id) {
      const isAuthorized = await isTeacherAuthorizedForExam(exam_id, callerId);
      if (!isAuthorized) {
        return NextResponse.json(
          { error: 'FORBIDDEN: Cannot submit telemetry on behalf of another student.' },
          { status: 403 }
        );
      }
    }

    // Check suspension state: Reject writes from suspended students
    const currentStatus = await getStudentParticipantStatus(exam_id, student_id);
    if (currentStatus.participant && (currentStatus.participant.is_suspended || currentStatus.participant.exam_status === 'suspended')) {
      return NextResponse.json(
        {
          error: 'STUDENT_SUSPENDED: Telemetry writes rejected due to active suspension.',
          code: 'STUDENT_SUSPENDED',
        },
        { status: 403 }
      );
    }

    // Whitelist telemetry fields ONLY — Never accept arbitrary object spreading
    const whitelistedUpdates: {
      camera_active?: boolean;
      connection_quality?: 'good' | 'fair' | 'poor' | 'offline';
      questions_answered?: number;
      current_question_index?: number;
    } = {};

    if (typeof updates?.camera_active === 'boolean') {
      whitelistedUpdates.camera_active = updates.camera_active;
    }
    if (['good', 'fair', 'poor', 'offline'].includes(updates?.connection_quality)) {
      whitelistedUpdates.connection_quality = updates.connection_quality;
    }
    if (
      typeof updates?.questions_answered === 'number' &&
      Number.isInteger(updates.questions_answered) &&
      updates.questions_answered >= 0
    ) {
      whitelistedUpdates.questions_answered = updates.questions_answered;
    }
    if (
      typeof updates?.current_question_index === 'number' &&
      Number.isInteger(updates.current_question_index) &&
      updates.current_question_index >= 0
    ) {
      whitelistedUpdates.current_question_index = updates.current_question_index;
    }

    const success = await updateStudentParticipantHeartbeat(
      exam_id,
      student_id,
      whitelistedUpdates
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to record student heartbeat (student may be suspended or not found).' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[API /custom-exams/student-status POST] Error:', err);
    return NextResponse.json(
      { error: 'Failed to record student heartbeat.' },
      { status: 500 }
    );
  }
}
