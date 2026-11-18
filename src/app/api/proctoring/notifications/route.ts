import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// ============================================================
// SamayYudh 2.0 — Guardian Notification Queue & Dispatcher
// Event-driven triggers for exam start, submit, complete, connectivity
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, eventType, examTitle, details } = body;

    if (!studentId || !eventType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Find linked guardians
    const { data: relationships } = await admin
      .from('guardian_student_relationships')
      .select('guardian_id, student_lce_code')
      .eq('student_id', studentId)
      .eq('status', 'active');

    if (!relationships || relationships.length === 0) {
      return NextResponse.json({ message: 'No linked guardians found for this student.' });
    }

    const studentLceCode = relationships[0]?.student_lce_code || 'LCE';

    // Build notification message based on event type
    let title = '';
    let message = '';

    switch (eventType) {
      case 'exam_started':
        title = 'Examination Commenced';
        message = `Student ${studentLceCode} has begun examination "${examTitle || 'Live Test'}". Live proctoring session is active.`;
        break;
      case 'exam_submitted':
        title = 'Examination Submitted';
        message = `Student ${studentLceCode} has completed and submitted answers for "${examTitle || 'Live Test'}".`;
        break;
      case 'exam_completed':
        title = 'Examination Concluded';
        message = `The examination session for "${examTitle || 'Live Test'}" has concluded. Session logs have been securely archived.`;
        break;
      case 'connectivity_interrupted':
        title = 'Temporary Connection Interruption';
        message = `We noticed a temporary network fluctuation for student ${studentLceCode}. Reconnection protocols are active.`;
        break;
      case 'proctor_advisory':
        title = 'Invigilator Advisory';
        message = details?.message || `An invigilation notice was logged for student ${studentLceCode}.`;
        break;
      default:
        title = 'Examination Update';
        message = `Notification event recorded for student ${studentLceCode}.`;
    }

    // Insert notification record for each linked guardian with idempotency key
    for (const rel of relationships) {
      const idempotencyKey = `notif_${rel.guardian_id}_${studentId}_${eventType}_${Math.floor(Date.now() / 60000)}`;

      await admin.from('guardian_notification_logs').upsert(
        {
          guardian_id: rel.guardian_id,
          student_id: studentId,
          event_type: eventType,
          title,
          message,
          channels: ['in_app', 'sms'],
          delivery_status: 'delivered',
          idempotency_key: idempotencyKey,
        },
        { onConflict: 'idempotency_key' }
      );
    }

    return NextResponse.json({ success: true, count: relationships.length });
  } catch (err: any) {
    console.error('Notification dispatch error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
