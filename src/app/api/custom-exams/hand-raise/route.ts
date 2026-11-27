import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { studentRaiseHand, getStudentParticipantStatus } from '@/lib/exams/custom-exam-service';

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
        { error: 'UNAUTHORIZED: Authentication required to raise hand.' },
        { status: 401 }
      );
    }

    const { exam_id, student_id } = await req.json();
    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    const authStudentId = user.id;
    if (student_id && student_id !== authStudentId) {
      return NextResponse.json(
        { error: 'FORBIDDEN: Cannot raise hand for another student.' },
        { status: 403 }
      );
    }

    const statusData = await getStudentParticipantStatus(exam_id, authStudentId);
    if (statusData.participant && (statusData.participant.is_suspended || statusData.participant.exam_status === 'suspended')) {
      return NextResponse.json(
        { error: 'STUDENT_SUSPENDED: Cannot raise hand while suspended.', code: 'STUDENT_SUSPENDED' },
        { status: 403 }
      );
    }

    const success = await studentRaiseHand(exam_id, authStudentId);
    if (!success) {
      return NextResponse.json({ error: 'Failed to notify proctor.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Proctor notified: Hand successfully raised.',
    });
  } catch (err: unknown) {
    console.error('[API /custom-exams/hand-raise POST] Error:', err);
    return NextResponse.json({ error: 'Failed to notify proctor.' }, { status: 500 });
  }
}
