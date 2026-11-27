/**
 * SamayYudh 2.0 — Zoom Meeting SDK & S2S OAuth Types
 */

export interface ZoomMeetingDetails {
  meetingId: string;
  topic: string;
  password?: string;
  joinUrl: string;
  startUrl?: string; // Host only (teacher/super_admin)
  createdAt: string;
  durationMinutes: number;
  examId: string;
  status: 'scheduled' | 'started' | 'ended';
  hostId?: string;
}

export interface ZoomSignatureRequest {
  meetingNumber: string;
  role: 0 | 1; // 0 = attendee (student), 1 = host (teacher)
  examId: string;
  studentId?: string;
  userName?: string;
}

export interface ZoomSignatureResponse {
  signature: string;
  sdkKey: string;
  meetingNumber: string;
  role: 0 | 1;
  userName: string;
  password?: string;
  joinUrl?: string;
}

export interface ZoomConfigStatus {
  isConfigured: boolean;
  hasAccountId: boolean;
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasSdkClientId: boolean;
  hasSdkClientSecret: boolean;
}

export interface ZoomWebhookEvent {
  event: string;
  event_ts: number;
  payload: {
    account_id?: string;
    object?: {
      id?: string;
      topic?: string;
      type?: number;
      start_time?: string;
      duration?: number;
      timezone?: string;
      host_id?: string;
      participant?: {
        user_id?: string;
        user_name?: string;
        id?: string;
        join_time?: string;
        leave_time?: string;
        email?: string;
        participant_user_id?: string;
      };
    };
    plainToken?: string;
  };
}
