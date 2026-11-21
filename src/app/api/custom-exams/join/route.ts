import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  getCustomExamByCode,
  joinCustomExamParticipant,
  getStudentParticipantStatus,
} from '@/lib/exams/custom-exam-service';

export async function POST(req: Request) {
  try {
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

    const body = (await req.json()) as {
      exam_code: string;
      student_name?: string;
      student_id?: string;
      student_lce_code?: string;
    };

    if (!body.exam_code || !body.exam_code.trim()) {
      return NextResponse.json({ error: 'Examination code is required.' }, { status: 400 });
    }

    const exam = await getCustomExamByCode(body.exam_code);
    if (!exam) {
      return NextResponse.json(
        { error: `Examination code "${body.exam_code}" does not exist.` },
        { status: 404 }
      );
    }

    // Check deadlines if configured
    if (exam.end_time) {
      const deadline = new Date(exam.end_time).getTime();
      if (Date.now() > deadline) {
        return NextResponse.json(
          { error: 'This examination has already concluded. Joining is closed.' },
          { status: 403 }
        );
      }
    }

    const studentId = user?.id || body.student_id || `student_${Date.now()}`;
    const studentName =
      body.student_name ||
      user?.user_metadata?.display_name ||
      user?.user_metadata?.full_name ||
      'Candidate Student';
    const studentEmail = user?.email || null;
    const studentLceCode = body.student_lce_code || 'LCE001';

    // Check existing participant record
    const { participant: existing } = await getStudentParticipantStatus(exam.id, studentId);
    if (existing && existing.is_suspended) {
      return NextResponse.json(
        {
          error: 'Your examination attempt has been suspended by the proctor.',
          suspended: true,
          reason: existing.suspended_reason,
        },
        { status: 403 }
      );
    }

    const participant = await joinCustomExamParticipant(exam.id, {
      id: studentId,
      name: studentName,
      email: studentEmail,
      lceCode: studentLceCode,
    });

    return NextResponse.json({
      success: true,
      exam,
      participant,
      session_channel: `custom_exam_${exam.exam_code.toLowerCase()}`,
    });
  } catch (err: any) {
    console.error('[API /custom-exams/join POST] Error:', err);
    return NextResponse.json(
      { error: 'Failed to join custom examination.' },
      { status: 500 }
    );
  }
}
