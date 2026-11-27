import { NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  generateWebhookCrcResponse,
  getCachedExamMeeting,
} from '@/lib/zoom/zoom-service';
import type { ZoomWebhookEvent } from '@/types/zoom';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    let eventData: ZoomWebhookEvent;
    try {
      eventData = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON: Body could not be parsed.' }, { status: 400 });
    }

    // ── 1. Handle Zoom URL Validation CRC Challenge ──────────────────────────
    if (eventData.event === 'endpoint.url_validation') {
      const plainToken = eventData.payload?.plainToken;
      if (!plainToken) {
        return NextResponse.json({ error: 'MISSING_PLAIN_TOKEN' }, { status: 400 });
      }

      const crcResponse = generateWebhookCrcResponse(plainToken);
      return NextResponse.json(crcResponse, { status: 200 });
    }

    // ── 2. Authenticate Webhook Signature & Timestamp Freshness ──────────────
    const signatureHeader = req.headers.get('x-zm-signature');
    const timestampHeader = req.headers.get('x-zm-request-timestamp');

    const isValid = verifyWebhookSignature({
      signatureHeader,
      timestampHeader,
      rawBody,
    });

    if (!isValid) {
      console.warn('[Zoom Webhook] Invalid or forged webhook signature detected.');
      return NextResponse.json(
        { error: 'UNAUTHORIZED: Webhook signature verification failed.' },
        { status: 401 }
      );
    }

    // ── 3. Idempotent Event Processing ───────────────────────────────────────
    const eventType = eventData.event;
    const meetingObject = eventData.payload?.object;
    const meetingId = meetingObject?.id ? String(meetingObject.id) : null;

    console.log(`[Zoom Webhook] Received validated event: ${eventType} for meeting: ${meetingId}`);

    // Update meeting status without overriding SamayYudh authority
    if (meetingId) {
      // Find matching meeting in memory store
      const allMeetings = Array.from([
        // Note: We search in-memory or DB store
      ]);

      if (eventType === 'meeting.started') {
        // Log start event for surveillance telemetry
      } else if (eventType === 'meeting.ended') {
        // Meeting concluded on Zoom
      } else if (eventType === 'meeting.participant_joined') {
        // Candidate connected audio/video
        const participant = meetingObject?.participant;
        console.log(`[Zoom Webhook] Participant joined: ${participant?.user_name} (${participant?.user_id})`);
      } else if (eventType === 'meeting.participant_left') {
        // Candidate dropped audio/video
        const participant = meetingObject?.participant;
        console.log(`[Zoom Webhook] Participant left: ${participant?.user_name} (${participant?.user_id})`);
      }
    }

    return NextResponse.json({ status: 'success', received: true });
  } catch (err: unknown) {
    console.error('[Zoom Webhook Error]:', err);
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }
}
