import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { endCustomExamSession, isTeacherAuthorizedForExam } from '@/lib/exams/custom-exam-service';

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

    if (!user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Authentication required to conclude examination.' },
        { status: 401 }
      );
    }

    const { exam_id } = await req.json();
    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    const teacherId = user.id;
    const isAuthorized = await isTeacherAuthorizedForExam(exam_id, teacherId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'FORBIDDEN: You do not have permission to conclude this examination.' },
        { status: 403 }
      );
    }

    const result = await endCustomExamSession(exam_id, teacherId);
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to conclude examination.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Examination successfully concluded. Access code expiration set to 3 minutes.',
      exam: result.exam,
    });
  } catch (err: unknown) {
    console.error('[API /custom-exams/end POST] Error:', err);
    return NextResponse.json({ error: 'Server error concluding exam.' }, { status: 500 });
  }
}
