import { NextResponse } from 'next/server';
import { getCustomExamByCode } from '@/lib/exams/custom-exam-service';

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
      return NextResponse.json(
        { error: `No examination found matching code "${code}". Please verify the code and try again.` },
        { status: 404 }
      );
    }

    if (exam.status === 'archived' || exam.status === 'draft') {
      return NextResponse.json(
        { error: 'This examination is currently not open for participation.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, exam });
  } catch (err: any) {
    console.error('[API /custom-exams/[code] GET] Error:', err);
    return NextResponse.json(
      { error: 'Server error while checking examination code.' },
      { status: 500 }
    );
  }
}
