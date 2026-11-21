import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { endCustomExamSession } from '@/lib/exams/custom-exam-service';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let teacherId = 'teacher_system';
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      });
      const { data } = await supabase.auth.getUser();
      if (data.user?.id) teacherId = data.user.id;
    }

    const { exam_id } = await req.json();
    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
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
  } catch (err: any) {
    console.error('[API /custom-exams/end POST] Error:', err);
    return NextResponse.json({ error: 'Server error concluding exam.' }, { status: 500 });
  }
}
