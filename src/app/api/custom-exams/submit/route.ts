import { NextResponse } from 'next/server';
import { submitStudentExam } from '@/lib/exams/custom-exam-service';

export async function POST(req: Request) {
  try {
    const { exam_id, student_id, answers, submission_type } = await req.json();
    if (!exam_id || !student_id) {
      return NextResponse.json({ error: 'Exam ID and Student ID are required.' }, { status: 400 });
    }

    const result = await submitStudentExam(
      exam_id,
      student_id,
      answers || {},
      submission_type || 'normal'
    );

    return NextResponse.json({
      success: true,
      message: 'Examination successfully finalized and submitted.',
      score: result.score,
      accuracy: result.accuracy,
    });
  } catch (err: any) {
    console.error('[API /custom-exams/submit POST] Error:', err);
    return NextResponse.json({ error: 'Failed to record examination submission.' }, { status: 500 });
  }
}
