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
    const { sessionId, studentId, action, message } = body;

    if (!sessionId || !studentId || !action || !message) {
      return NextResponse.json({ error: 'Missing required intervention fields' }, { status: 400 });
    }

    const { db } = await getCommandDataClient();

    // Verify session
    let finalSessionId = sessionId;
    const { data: sessionRow } = await db
      .from('proctoring_sessions')
      .select('id, exam_session_id')
      .or(`id.eq.${sessionId},exam_session_id.eq.${sessionId}`)
      .maybeSingle();

    if (sessionRow?.id) {
      finalSessionId = sessionRow.id;
    }

    // Insert intervention
    let interventionRecord = null;
    try {
      const { data: inserted, error: insertErr } = await db
        .from('proctoring_interventions')
        .insert({
          session_id: finalSessionId,
          teacher_id: user.id,
          student_id: studentId,
          action,
          message: message.trim(),
        })
        .select('*')
        .single();

      if (insertErr && !isMissingSchemaError(insertErr)) {
        console.warn('[proctoring/interventions] Insert notice:', insertErr);
      }
      interventionRecord = inserted;

      // Also log as a proctoring event
      await db.from('proctoring_events').insert({
        session_id: finalSessionId,
        student_id: studentId,
        event_type: 'warning_received',
        severity: action === 'pause' ? 'critical' : 'warning',
        details: { action, message, teacher_id: user.id },
      });

      // If action is pause/resume, update proctoring session status
      if (action === 'pause') {
        await db
          .from('proctoring_sessions')
          .update({ status: 'paused', updated_at: new Date().toISOString() })
          .eq('id', finalSessionId);
      } else if (action === 'resume') {
        await db
          .from('proctoring_sessions')
          .update({ status: 'active', updated_at: new Date().toISOString() })
          .eq('id', finalSessionId);
      }
    } catch (err) {
      console.warn('[proctoring/interventions] DB action notice:', err);
    }

    return NextResponse.json({ success: true, intervention: interventionRecord });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const { db } = await getCommandDataClient();

    let finalSessionId = sessionId;
    const { data: sessionRow } = await db
      .from('proctoring_sessions')
      .select('id')
      .or(`id.eq.${sessionId},exam_session_id.eq.${sessionId}`)
      .maybeSingle();

    if (sessionRow?.id) {
      finalSessionId = sessionRow.id;
    }

    const { data: interventions, error } = await db
      .from('proctoring_interventions')
      .select('*')
      .eq('session_id', finalSessionId)
      .order('created_at', { ascending: false });

    if (error && !isMissingSchemaError(error)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ interventions: interventions || [] });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
