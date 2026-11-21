import { NextRequest, NextResponse } from 'next/server';
import { getCustomExamReport } from '@/lib/exams/custom-exam-service';
import { generateSupervisionExcelWorkbook } from '@/lib/exams/excel-report-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json({ error: 'Exam code is required' }, { status: 400 });
    }

    const report = await getCustomExamReport(code);
    if (!report) {
      return NextResponse.json({ error: 'Examination report not found' }, { status: 404 });
    }

    const buffer = await generateSupervisionExcelWorkbook(report);

    const safeFilename = `SamayYudh_Report_${code}_${new Date().toISOString().split('T')[0]}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('[ExportExcelAPI] Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel report', details: error?.message },
      { status: 500 }
    );
  }
}
