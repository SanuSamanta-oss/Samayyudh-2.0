import { NextResponse } from 'next/server';
import { studentRaiseHand } from '@/lib/exams/custom-exam-service';

export async function POST(req: Request) {
  try {
    const { exam_id, student_id } = await req.json();
    if (!exam_id || !student_id) {
      return NextResponse.json({ error: 'Exam ID and Student ID are required.' }, { status: 400 });
    }

    await studentRaiseHand(exam_id, student_id);

    return NextResponse.json({
      success: true,
      message: 'Proctor notified: Hand successfully raised.',
    });
  } catch (err: any) {
    console.error('[API /custom-exams/hand-raise POST] Error:', err);
    return NextResponse.json({ error: 'Failed to notify proctor.' }, { status: 500 });
  }
}
