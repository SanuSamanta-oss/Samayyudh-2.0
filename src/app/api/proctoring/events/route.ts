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
    const { sessionId, eventType, severity, details } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }

    const { db } = await getCommandDataClient();

    let eventRecord = null;
    try {
      // Find proctoring session UUID if sessionId passed was exam_session_id
      let finalSessionId = sessionId;
      const { data: sessionRow } = await db
        .from('proctoring_sessions')
        .select('id')
        .or(`id.eq.${sessionId},exam_session_id.eq.${sessionId}`)
        .maybeSingle();

      if (sessionRow?.id) {
        finalSessionId = sessionRow.id;
      }

      const { data: inserted, error: insertErr } = await db
        .from('proctoring_events')
        .insert({
          session_id: finalSessionId,
          student_id: user.id,
          event_type: eventType,
          severity: severity || 'info',
          details: details || {},
        })
        .select('*')
        .single();

      if (insertErr && !isMissingSchemaError(insertErr)) {
        console.warn('[proctoring/events] Insert notice:', insertErr);
      }
      eventRecord = inserted;
    } catch (err) {
      console.warn('[proctoring/events] Event logging notice:', err);
    }

    return NextResponse.json({ success: true, event: eventRecord });
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

    // Check if session exists by UUID or exam_session_id
    let finalSessionId = sessionId;
    const { data: sessionRow } = await db
      .from('proctoring_sessions')
      .select('id')
      .or(`id.eq.${sessionId},exam_session_id.eq.${sessionId}`)
      .maybeSingle();

    if (sessionRow?.id) {
      finalSessionId = sessionRow.id;
    }

    const { data: events, error } = await db
      .from('proctoring_events')
      .select('*')
      .eq('session_id', finalSessionId)
      .order('created_at', { ascending: true });

    if (error && !isMissingSchemaError(error)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ events: events || [] });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
