import { NextResponse } from 'next/server';
import {
  getCustomExamByCode,
  generateSupervisionReport,
} from '@/lib/exams/custom-exam-service';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json({ error: 'Exam code is required.' }, { status: 400 });
    }

    const exam = await getCustomExamByCode(code);
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found.' }, { status: 404 });
    }

    const report = await generateSupervisionReport(exam.id);
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error('[API /custom-exams/[code]/report GET] Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate supervision audit report.' },
      { status: 500 }
    );
  }
}
