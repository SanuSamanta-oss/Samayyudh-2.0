import { NextResponse } from 'next/server';
import {
  getStudentParticipantStatus,
  updateStudentParticipantHeartbeat,
} from '@/lib/exams/custom-exam-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('exam_id');
    const studentId = searchParams.get('student_id');

    if (!examId || !studentId) {
      return NextResponse.json(
        { error: 'Missing exam_id or student_id parameter.' },
        { status: 400 }
      );
    }

    const data = await getStudentParticipantStatus(examId, studentId);
    return NextResponse.json({
      success: true,
      participant: data.participant,
      latestEvent: data.latestEvent,
    });
  } catch (err: any) {
    console.error('[API /custom-exams/student-status GET] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve student participant status.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { exam_id, student_id, updates } = body;

    if (!exam_id || !student_id) {
      return NextResponse.json(
        { error: 'Missing exam_id or student_id.' },
        { status: 400 }
      );
    }

    const success = await updateStudentParticipantHeartbeat(
      exam_id,
      student_id,
      updates || {}
    );

    return NextResponse.json({ success });
  } catch (err: any) {
    console.error('[API /custom-exams/student-status POST] Error:', err);
    return NextResponse.json(
      { error: 'Failed to record student heartbeat.' },
      { status: 500 }
    );
  }
}
