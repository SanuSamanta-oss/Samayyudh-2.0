import { NextResponse } from 'next/server';
import { getExamSupervisionRoomState } from '@/lib/exams/custom-exam-service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ exam_id: string }> }
) {
  try {
    const { exam_id } = await params;
    if (!exam_id) {
      return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
    }

    const url = new URL(req.url);
    const codeParam = url.searchParams.get('code');

    let state = await getExamSupervisionRoomState(exam_id);
    if (!state.exam && codeParam) {
      state = await getExamSupervisionRoomState(codeParam);
    }

    if (!state.exam) {
      // Resilient fallback to demo examination room
      state = await getExamSupervisionRoomState('demo_exam');
    }

    return NextResponse.json({
      success: true,
      exam: state.exam,
      session: state.session,
      participants: state.participants,
      events: state.events,
    });
  } catch (err: any) {
    console.error('[API /custom-exams/supervision/[exam_id] GET] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve supervision room state.' },
      { status: 500 }
    );
  }
}
