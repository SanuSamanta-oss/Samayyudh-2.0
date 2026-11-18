import { NextRequest, NextResponse } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { examSessionId, examCode, examTitle, classroomId, totalQuestions } = body;

    if (!examSessionId || !examCode) {
      return NextResponse.json({ error: 'Missing required session parameters' }, { status: 400 });
    }

    const { db } = await getCommandDataClient();

    // Check if proctoring config exists for this exam or classroom
    let config = {
      live_video_enabled: true,
      parent_stream_enabled: true,
      calculator_enabled: true,
      fullscreen_enforced: false,
      tab_switch_limit: 3,
      record_session: false,
    };

    try {
      const { data: configRow } = await db
        .from('proctoring_configs')
        .select('*')
        .or(`exam_code.eq.${examCode}${classroomId ? `,classroom_id.eq.${classroomId}` : ''}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (configRow) {
        config = { ...config, ...configRow };
      }
    } catch (err) {
      if (!isMissingSchemaError(err as any)) {
        console.warn('[proctoring/session] Config fetch notice:', err);
      }
    }

    // Upsert proctoring session record
    let sessionRecord = null;
    try {
      const { data: upserted, error: upsertErr } = await db
        .from('proctoring_sessions')
        .upsert(
          {
            exam_session_id: examSessionId,
            student_id: user.id,
            classroom_id: classroomId || null,
            exam_code: examCode,
            exam_title: examTitle || 'Examination',
            status: 'active',
            camera_active: true,
            connection_status: 'connected',
            total_questions: totalQuestions || 0,
            last_heartbeat: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'exam_session_id' }
        )
        .select('*')
        .single();

      if (upsertErr && !isMissingSchemaError(upsertErr)) {
        console.warn('[proctoring/session] DB upsert notice:', upsertErr);
      }
      sessionRecord = upserted;
    } catch (err) {
      console.warn('[proctoring/session] Upsert fallback:', err);
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionRecord?.id || examSessionId,
      examSessionId,
      config,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { examSessionId, currentQuestionIndex, questionsAnswered, cameraActive, status } = body;

    if (!examSessionId) {
      return NextResponse.json({ error: 'Missing examSessionId' }, { status: 400 });
    }

    const { db } = await getCommandDataClient();

    const updatePayload: Record<string, any> = {
      last_heartbeat: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (typeof currentQuestionIndex === 'number') updatePayload.current_question_index = currentQuestionIndex;
    if (typeof questionsAnswered === 'number') updatePayload.questions_answered = questionsAnswered;
    if (typeof cameraActive === 'boolean') updatePayload.camera_active = cameraActive;
    if (status) {
      updatePayload.status = status;
      if (status === 'completed' || status === 'terminated') {
        updatePayload.ended_at = new Date().toISOString();
      }
    }

    try {
      await db
        .from('proctoring_sessions')
        .update(updatePayload)
        .eq('exam_session_id', examSessionId)
        .eq('student_id', user.id);
    } catch (err) {
      if (!isMissingSchemaError(err as any)) {
        console.warn('[proctoring/session] Heartbeat update notice:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const examSessionId = searchParams.get('examSessionId');

    if (!examSessionId) {
      return NextResponse.json({ error: 'Missing examSessionId' }, { status: 400 });
    }

    const { db } = await getCommandDataClient();
    const { data: session, error } = await db
      .from('proctoring_sessions')
      .select('*')
      .eq('exam_session_id', examSessionId)
      .maybeSingle();

    if (error && !isMissingSchemaError(error)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ session });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
