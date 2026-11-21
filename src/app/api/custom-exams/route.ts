import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  createCustomExam,
  listTeacherCustomExams,
} from '@/lib/exams/custom-exam-service';
import type { CreateCustomExamInput } from '@/types/custom-exam';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let userId: string | null = null;
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      });
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    const exams = await listTeacherCustomExams(userId);
    return NextResponse.json({ success: true, exams });
  } catch (err: any) {
    console.error('[API /custom-exams GET] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve custom examinations.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let userId: string | null = null;
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      });
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    const body = (await req.json()) as CreateCustomExamInput;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Examination title is required.' },
        { status: 400 }
      );
    }

    const exam = await createCustomExam(body, userId);
    return NextResponse.json({ success: true, exam });
  } catch (err: any) {
    console.error('[API /custom-exams POST] Error:', err);
    return NextResponse.json(
      { error: 'Failed to create custom examination.' },
      { status: 500 }
    );
  }
}
