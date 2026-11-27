import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import {
  createOrGetExamMeeting,
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
    if (!effectiveUserId && (!isSupabaseConfigured || process.env.NODE_ENV !== 'production')) {
      const authHeader = req.headers.get('Authorization') || '';
      const testUserId = req.headers.get('x-user-id') || req.headers.get('x-teacher-id') || req.headers.get('x-student-id');
      if (testUserId) {
        effectiveUserId = testUserId;
      } else if (authHeader.includes('teacher')) effectiveUserId = 'teacher_demo';
      else if (authHeader.includes('student')) effectiveUserId = 'student_demo';
    }

    if (!effectiveUserId) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Authentication required to manage Zoom meeting.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { exam_id } = body;

    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    // Verify parent exam
    const exam = await getCustomExamById(exam_id);
    if (!exam) {
      return NextResponse.json({ error: 'EXAM_NOT_FOUND: The requested exam does not exist.' }, { status: 404 });
    }

    // Check teacher authorization
    const isTeacher = await isTeacherAuthorizedForExam(exam_id, effectiveUserId);

    if (isTeacher) {
      // Teacher / Super Admin: Create or fetch live meeting with host controls
      const meeting = await createOrGetExamMeeting({
        examId: exam_id,
        teacherId: effectiveUserId,
        examTitle: exam.title,
        durationMinutes: exam.duration_minutes || 60,
      });

      return NextResponse.json({
        success: true,
        meeting: {
          meetingId: meeting.meetingId,
          meetingNumber: meeting.meetingId,
          topic: meeting.topic,
          password: meeting.password,
          joinUrl: meeting.joinUrl,
          startUrl: meeting.startUrl, // Only provided to authorized teacher
          status: meeting.status,
          role: 1, // Host
        },
      });
    }

    // Student Caller: Check registration and admission status in SamayYudh
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
          error: 'STUDENT_NOT_ADMITTED: You must be admitted by the teacher before joining the live video meeting.',
          code: 'STUDENT_NOT_ADMITTED',
        },
        { status: 403 }
      );
    }

    if (partStatus.participant.is_suspended || partStatus.participant.exam_status === 'suspended') {
      return NextResponse.json(
        { error: 'STUDENT_SUSPENDED: Examination is locked due to active proctoring suspension.', suspended: true },
        { status: 403 }
      );
    }

    // Retrieve already-created meeting (students cannot initiate new meetings)
    const existingMeeting = getCachedExamMeeting(exam_id);
    if (!existingMeeting) {
      return NextResponse.json(
        {
          error: 'MEETING_NOT_READY: The teacher has not yet initiated the live meeting for this examination.',
          code: 'MEETING_NOT_READY',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      meeting: {
        meetingId: existingMeeting.meetingId,
        meetingNumber: existingMeeting.meetingId,
        topic: existingMeeting.topic,
        password: existingMeeting.password,
        joinUrl: existingMeeting.joinUrl,
        // NEVER expose startUrl to students
        status: existingMeeting.status,
        role: 0, // Attendee
      },
    });
  } catch (err: unknown) {
    console.error('[API /zoom/meeting POST] Error:', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to resolve Zoom meeting.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const exam_id = url.searchParams.get('exam_id');

    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    const meeting = getCachedExamMeeting(exam_id);
    if (!meeting) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      meeting: {
        meetingId: meeting.meetingId,
        topic: meeting.topic,
        status: meeting.status,
        joinUrl: meeting.joinUrl,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Failed to inspect meeting.' }, { status: 500 });
  }
}
