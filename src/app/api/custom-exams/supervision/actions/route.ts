import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import {
  executeSupervisionAction,
  isTeacherAuthorizedForExam,
} from '@/lib/exams/custom-exam-service';
import type { TeacherSupervisionActionPayload } from '@/types/custom-exam';

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

    // Task 1: Enforce authenticated teacher session — Remove any unauthenticated fallback
    if (!user?.id) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED: An authenticated teacher session is required to perform supervision actions.' },
        { status: 401 }
      );
    }

    const payload = (await req.json()) as TeacherSupervisionActionPayload;

    if (!payload.exam_id || !payload.action) {
      return NextResponse.json(
        { error: 'Missing required supervision action parameters.' },
        { status: 400 }
      );
    }

    const teacherId = user.id;

    // Verify teacher authorization for this examination
    const isAuthorized = await isTeacherAuthorizedForExam(payload.exam_id, teacherId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'FORBIDDEN: You do not have permission to supervise this examination.' },
        { status: 403 }
      );
    }

    // Validate action-specific parameters
    const isBulkAction = payload.action === 'approve_all' || payload.action === 'admit_all';
    if (!isBulkAction && !payload.student_id) {
      return NextResponse.json(
        { error: 'Target student_id is required for individual supervision action.' },
        { status: 400 }
      );
    }

    const result = await executeSupervisionAction(payload, teacherId);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to execute supervision action.' },
        { status: result.error === 'DATABASE_ERROR' ? 500 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      action: payload.action,
      event: result.event,
      participant: result.participant,
    });
  } catch (err: unknown) {
    console.error('[API /custom-exams/supervision/actions POST] Error:', err);
    return NextResponse.json(
      { error: 'Failed to process supervision action.' },
      { status: 500 }
    );
  }
}
