import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { autosaveStudentAnswers } from '@/lib/exams/custom-exam-service';

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
        { error: 'UNAUTHORIZED: Authentication required to autosave examination answers.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { exam_id, student_id, answers, revision } = body;

    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    // Never trust client-supplied student_id; strictly bind to authenticated session
    if (student_id && student_id !== user.id) {
      return NextResponse.json(
        { error: 'FORBIDDEN: Cannot autosave answers on behalf of another student.' },
        { status: 403 }
      );
    }

    const revisionNumber = typeof revision === 'number' && Number.isInteger(revision) ? revision : 1;

    const result = await autosaveStudentAnswers(
      exam_id,
      user.id,
      answers || {},
      revisionNumber
    );

    if (!result.success) {
      if (result.code === 'STUDENT_SUSPENDED') {
        return NextResponse.json(
          { error: 'STUDENT_SUSPENDED: Autosave rejected due to active proctoring suspension.', code: 'STUDENT_SUSPENDED' },
          { status: 403 }
        );
      }
      if (result.code === 'ALREADY_SUBMITTED') {
        return NextResponse.json(
          { error: 'ALREADY_SUBMITTED: Cannot autosave answers for an already finalized examination.', code: 'ALREADY_SUBMITTED' },
          { status: 409 }
        );
      }
      if (result.code === 'STALE_REVISION') {
        return NextResponse.json(
          { error: 'STALE_REVISION: Newer answers have already been persisted.', code: 'STALE_REVISION' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: result.error || 'Failed to autosave answers.', code: result.code },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      revision: result.revision,
      saved_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('[API /custom-exams/autosave POST] Error:', err);
    return NextResponse.json({ error: 'Server error autosaving answers.' }, { status: 500 });
  }
}
