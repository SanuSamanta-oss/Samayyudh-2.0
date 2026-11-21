import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { executeSupervisionAction } from '@/lib/exams/custom-exam-service';
import type { TeacherSupervisionActionPayload } from '@/types/custom-exam';

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

    const payload = (await req.json()) as TeacherSupervisionActionPayload;

    if (!payload.exam_id || !payload.action || (payload.action !== 'approve_all' && payload.action !== 'admit_all' && !payload.student_id)) {
      return NextResponse.json(
        { error: 'Missing required supervision action parameters.' },
        { status: 400 }
      );
    }

    const result = await executeSupervisionAction(payload, teacherId);

    return NextResponse.json({
      success: true,
      action: payload.action,
      event: result.event,
      participant: result.participant,
    });
  } catch (err: any) {
    console.error('[API /custom-exams/supervision/actions POST] Error:', err);
    return NextResponse.json(
      { error: 'Failed to process supervision action.' },
      { status: 500 }
    );
  }
}
