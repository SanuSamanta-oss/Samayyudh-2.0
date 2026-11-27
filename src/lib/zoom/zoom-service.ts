import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  ZoomMeetingDetails,
  ZoomSignatureResponse,
  ZoomConfigStatus,
  ZoomWebhookEvent,
} from '@/types/zoom';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { createServiceRoleClient } from '@/lib/supabase/admin';

// ── In-Memory Token & Meeting Cache with Multi-Instance Persistence ──────────

interface CachedOAuthToken {
  accessToken: string;
  expiresAt: number; // Unix epoch in ms
}

interface ZoomGlobalStore {
  cachedToken: CachedOAuthToken | null;
  meetings: Map<string, ZoomMeetingDetails>;
  inFlightCreations: Map<string, Promise<ZoomMeetingDetails>>;
}

const GLOBAL_ZOOM_STORE_KEY = '__samayyudh_zoom_store__';

function getZoomMeetingDiskPath(): string {
  try {
    const tmp = process.env.TEMP || process.env.TMPDIR || '/tmp';
    return path.join(tmp, 'samayyudh_zoom_meetings_v1.json');
  } catch {
    return '';
  }
}

function syncZoomMeetingsFromDisk(store: ZoomGlobalStore): void {
  try {
    const p = getZoomMeetingDiskPath();
    if (p && fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.meetings)) {
        data.meetings.forEach((m: ZoomMeetingDetails) => {
          if (m && m.examId) {
            store.meetings.set(m.examId, m);
          }
        });
      }
    }
  } catch {}
}

function syncZoomMeetingToDisk(store: ZoomGlobalStore): void {
  try {
    const p = getZoomMeetingDiskPath();
    if (p) {
      const meetings = Array.from(store.meetings.values());
      fs.writeFileSync(p, JSON.stringify({ meetings, updated_at: new Date().toISOString() }), 'utf8');
    }
  } catch {}
}

export function getZoomGlobalStore(): ZoomGlobalStore {
  const g = globalThis as unknown as { [GLOBAL_ZOOM_STORE_KEY]?: ZoomGlobalStore };
  if (!g[GLOBAL_ZOOM_STORE_KEY]) {
    g[GLOBAL_ZOOM_STORE_KEY] = {
      cachedToken: null,
      meetings: new Map<string, ZoomMeetingDetails>(),
      inFlightCreations: new Map<string, Promise<ZoomMeetingDetails>>(),
    };
    syncZoomMeetingsFromDisk(g[GLOBAL_ZOOM_STORE_KEY]);
  }
  return g[GLOBAL_ZOOM_STORE_KEY];
}

// ── Environment Configuration Helpers ────────────────────────────────────────

export function getZoomCredentials() {
  const accountId = (process.env.ZOOM_ACCOUNT_ID || '').trim();
  const clientId = (process.env.ZOOM_CLIENT_ID || '').trim();
  const clientSecret = (process.env.ZOOM_CLIENT_SECRET || '').trim();

  // Support both SDK naming conventions (Client ID / Client Secret and Key / Secret)
  const sdkClientId = (
    process.env.ZOOM_MEETING_SDK_CLIENT_ID ||
    process.env.ZOOM_MEETING_SDK_KEY ||
    ''
  ).trim();
  const sdkClientSecret = (
    process.env.ZOOM_MEETING_SDK_CLIENT_SECRET ||
    process.env.ZOOM_MEETING_SDK_SECRET ||
    ''
  ).trim();

  const webhookSecret = (
    process.env.ZOOM_WEBHOOK_SECRET_TOKEN ||
    clientSecret ||
    sdkClientSecret ||
    ''
  ).trim();

  return {
    accountId,
    clientId,
    clientSecret,
    sdkClientId,
    sdkClientSecret,
    webhookSecret,
  };
}

export function getZoomConfigStatus(): ZoomConfigStatus {
  const creds = getZoomCredentials();
  const hasAccountId = Boolean(creds.accountId);
  const hasClientId = Boolean(creds.clientId);
  const hasClientSecret = Boolean(creds.clientSecret);
  const hasSdkClientId = Boolean(creds.sdkClientId);
  const hasSdkClientSecret = Boolean(creds.sdkClientSecret);

  return {
    isConfigured:
      hasAccountId &&
      hasClientId &&
      hasClientSecret &&
      hasSdkClientId &&
      hasSdkClientSecret,
    hasAccountId,
    hasClientId,
    hasClientSecret,
    hasSdkClientId,
    hasSdkClientSecret,
  };
}

// ── Server-to-Server OAuth Token Generation & Caching ────────────────────────

export async function getZoomAccessToken(): Promise<string> {
  const creds = getZoomCredentials();

  if (!creds.accountId || !creds.clientId || !creds.clientSecret) {
    throw new Error('ZOOM_CONFIG_MISSING: Zoom Server-to-Server OAuth credentials are not fully configured.');
  }

  const store = getZoomGlobalStore();
  const now = Date.now();
  // Reuse cached token if it has more than 5 minutes of validity remaining
  if (store.cachedToken && store.cachedToken.expiresAt > now + 5 * 60 * 1000) {
    return store.cachedToken.accessToken;
  }

  const basicAuth = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString('base64');
  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(
    creds.accountId
  )}`;

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error('[Zoom OAuth] Token request failed with status:', res.status, errorBody);
      throw new Error(`ZOOM_AUTH_FAILED: Failed to obtain Server-to-Server access token (${res.status}).`);
    }

    const data = (await res.json()) as { access_token: string; expires_in: number };
    if (!data.access_token) {
      throw new Error('ZOOM_AUTH_INVALID: Access token missing in Zoom OAuth response.');
    }

    // Cache token with safe expiration
    store.cachedToken = {
      accessToken: data.access_token,
      expiresAt: now + (data.expires_in || 3600) * 1000,
    };

    return store.cachedToken.accessToken;
  } catch (err: unknown) {
    if (process.env.NODE_ENV !== 'production' || process.env.ZOOM_MOCK_FALLBACK === 'true') {
      console.warn('[Zoom OAuth] Outbound network unavailable in local environment, using S2S token simulation.');
      store.cachedToken = {
        accessToken: 'mock_s2s_access_token_' + Date.now(),
        expiresAt: now + 3600 * 1000,
      };
      return store.cachedToken.accessToken;
    }
    throw err;
  }
}

// ── Meeting Creation & Idempotency ───────────────────────────────────────────

export async function createOrGetExamMeeting(params: {
  examId: string;
  teacherId: string;
  examTitle?: string;
  durationMinutes?: number;
}): Promise<ZoomMeetingDetails> {
  const { examId, teacherId, examTitle, durationMinutes = 60 } = params;
  const store = getZoomGlobalStore();

  // 1. Memory Tier: Return existing active meeting
  const existingMeeting = store.meetings.get(examId);
  if (existingMeeting && existingMeeting.status !== 'ended') {
    return existingMeeting;
  }

  // 2. Concurrency Lock: Coalesce in-flight creation calls for same examId
  const inFlight = store.inFlightCreations.get(examId);
  if (inFlight) {
    return inFlight;
  }

  // 3. Database Tier: Check if meeting was already persisted to Supabase
  if (isSupabaseConfigured) {
    try {
      const admin = createServiceRoleClient();
      if (admin) {
        const { data } = await admin
          .from('custom_exam_zoom_meetings')
          .select('*')
          .eq('exam_id', examId)
          .single();

        if (data && data.meeting_id) {
          const dbMeeting: ZoomMeetingDetails = {
            meetingId: data.meeting_id,
            topic: data.topic,
            password: data.password || '',
            joinUrl: data.join_url,
            startUrl: data.start_url,
            createdAt: data.created_at,
            durationMinutes: data.duration_minutes || durationMinutes,
            examId,
            status: data.status,
            hostId: data.host_id,
          };
          store.meetings.set(examId, dbMeeting);
          syncZoomMeetingToDisk(store);
          return dbMeeting;
        }
      }
    } catch {}
  }

  // Execute creation under in-flight promise map
  const creationPromise = (async () => {
    try {
      const accessToken = await getZoomAccessToken();

      // Create scheduled meeting under authorized host account
      const apiUrl = 'https://api.zoom.us/v2/users/me/meetings';
      const meetingPayload = {
        topic: `[SamayYudh Exam] ${examTitle || examId}`,
        type: 2, // Scheduled meeting
        duration: durationMinutes,
        timezone: 'UTC',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: false,
          audio: 'both',
          auto_recording: 'none',
          approval_type: 2, // No Zoom registration required
          meeting_authentication: false,
        },
      };

      let meetingDetails: ZoomMeetingDetails;

      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meetingPayload),
        });

        if (!res.ok) {
          const errorDetails = await res.text().catch(() => '');
          console.error('[Zoom API] Create meeting failed:', res.status, errorDetails);
          throw new Error(`ZOOM_MEETING_CREATE_FAILED: Unable to create live examination meeting (${res.status}).`);
        }

        const zoomData = (await res.json()) as {
          id: number | string;
          topic: string;
          password?: string;
          join_url: string;
          start_url?: string;
          created_at: string;
          duration: number;
          host_id?: string;
        };

        meetingDetails = {
          meetingId: String(zoomData.id),
          topic: zoomData.topic || `SamayYudh Exam: ${examId}`,
          password: zoomData.password || '',
          joinUrl: zoomData.join_url,
          startUrl: zoomData.start_url,
          createdAt: zoomData.created_at || new Date().toISOString(),
          durationMinutes: zoomData.duration || durationMinutes,
          examId,
          status: 'scheduled',
          hostId: teacherId,
        };
      } catch (networkErr: unknown) {
        if (process.env.NODE_ENV !== 'production' || process.env.ZOOM_MOCK_FALLBACK === 'true') {
          console.warn('[Zoom API] Outbound API unavailable in local environment, providing resilient exam meeting details.');
          meetingDetails = {
            meetingId: '988' + Math.floor(10000000 + Math.random() * 90000000),
            topic: `[SamayYudh Exam] ${examTitle || examId}`,
            password: 'sy_' + Math.random().toString(36).substring(2, 8),
            joinUrl: `https://zoom.us/j/9880000000?pwd=mock`,
            startUrl: `https://zoom.us/s/9880000000?zak=mock`,
            createdAt: new Date().toISOString(),
            durationMinutes,
            examId,
            status: 'scheduled',
            hostId: teacherId,
          };
        } else {
          throw networkErr;
        }
      }

      // Persist to Memory and Disk
      store.meetings.set(examId, meetingDetails);
      syncZoomMeetingToDisk(store);

      // Persist to Supabase when configured
      if (isSupabaseConfigured) {
        try {
          const admin = createServiceRoleClient();
          if (admin) {
            await admin.from('custom_exam_zoom_meetings').upsert({
              exam_id: examId,
              meeting_id: meetingDetails.meetingId,
              topic: meetingDetails.topic,
              password: meetingDetails.password,
              join_url: meetingDetails.joinUrl,
              start_url: meetingDetails.startUrl,
              host_id: meetingDetails.hostId,
              duration_minutes: meetingDetails.durationMinutes,
              status: meetingDetails.status,
            });
          }
        } catch {}
      }

      return meetingDetails;
    } finally {
      store.inFlightCreations.delete(examId);
    }
  })();

  store.inFlightCreations.set(examId, creationPromise);
  return creationPromise;
}

export function getCachedExamMeeting(examId: string): ZoomMeetingDetails | null {
  const store = getZoomGlobalStore();
  const existing = store.meetings.get(examId);
  if (existing) return existing;

  // Sync from disk if not yet populated in current memory map
  syncZoomMeetingsFromDisk(store);
  return store.meetings.get(examId) || null;
}

// ── Meeting SDK Signature Generation ─────────────────────────────────────────

export function generateMeetingSignature(params: {
  meetingNumber: string;
  role: 0 | 1; // 0 = attendee (student), 1 = host (teacher)
  userName: string;
}): ZoomSignatureResponse {
  const creds = getZoomCredentials();

  if (!creds.sdkClientId || !creds.sdkClientSecret) {
    throw new Error('ZOOM_SDK_CONFIG_MISSING: Zoom Meeting SDK Client ID and Secret are required for signature generation.');
  }

  const iat = Math.floor(Date.now() / 1000) - 30;
  // Expiration set to 2 hours
  const exp = iat + 60 * 60 * 2;

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    appKey: creds.sdkClientId,
    sdkKey: creds.sdkClientId,
    mn: String(params.meetingNumber).replace(/\s+/g, ''),
    role: params.role,
    iat,
    exp,
    tokenExp: exp,
  };

  const base64UrlEncode = (obj: Record<string, any>) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const message = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', creds.sdkClientSecret)
    .update(message)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${message}.${signature}`;

  return {
    signature: jwt,
    sdkKey: creds.sdkClientId,
    meetingNumber: String(params.meetingNumber).replace(/\s+/g, ''),
    role: params.role,
    userName: params.userName,
  };
}

// ── Webhook Verification & CRC Challenge Response ────────────────────────────

export function generateWebhookCrcResponse(plainToken: string): { plainToken: string; encryptedToken: string } {
  const creds = getZoomCredentials();
  const secret = creds.webhookSecret;

  if (!secret) {
    throw new Error('ZOOM_WEBHOOK_SECRET_MISSING: Webhook secret token is not configured.');
  }

  const encryptedToken = crypto
    .createHmac('sha256', secret)
    .update(plainToken)
    .digest('hex');

  return {
    plainToken,
    encryptedToken,
  };
}

export function verifyWebhookSignature(params: {
  signatureHeader?: string | null;
  timestampHeader?: string | null;
  rawBody: string;
}): boolean {
  const { signatureHeader, timestampHeader, rawBody } = params;

  if (!signatureHeader || !timestampHeader || !rawBody) {
    return false;
  }

  const creds = getZoomCredentials();
  const secret = creds.webhookSecret;
  if (!secret) {
    return false;
  }

  // Prevent replay attacks (timestamp within 5 minutes)
  const timestamp = parseInt(timestampHeader, 10);
  const now = Math.floor(Date.now() / 1000);
  if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {
    console.warn('[Zoom Webhook] Signature rejected due to expired/invalid timestamp:', timestamp);
    return false;
  }

  const message = `v0:${timestampHeader}:${rawBody}`;
  const computedHash = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
  const expectedSignature = `v0=${computedHash}`;

  try {
    const signatureBuffer = Buffer.from(signatureHeader);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
