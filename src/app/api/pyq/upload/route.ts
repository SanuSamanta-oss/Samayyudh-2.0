// ============================================================
// API Route: POST /api/pyq/upload
// Triggers the Python extractor on a newly placed PDF file
// in data/pyq_uploads and returns the extraction result
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const maxDuration = 120; // seconds – PDF extraction can be slow

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'data', 'pyq_uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const savedFiles: string[] = [];
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith('.pdf')) continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const savePath = path.join(uploadDir, file.name);
      await writeFile(savePath, buffer);
      savedFiles.push(file.name);
    }

    if (savedFiles.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid PDF files provided.' }, { status: 400 });
    }

    // Run the Python extractor script
    const scriptPath = path.join(process.cwd(), 'scripts', 'pyq_extractor.py');
    const { stdout, stderr } = await execAsync(`python "${scriptPath}"`, {
      cwd: process.cwd(),
      timeout: 110_000,
    });

    // Parse output summary
    const totalPapersMatch = stdout.match(/Total Papers in Database:\s+(\d+)\s+\(\+(\d+) new\)/);
    const totalQsMatch = stdout.match(/Total Questions in Database:\s+(\d+)\s+\(\+(\d+) new\)/);

    return NextResponse.json({
      success: true,
      savedFiles,
      summary: {
        totalPapers: totalPapersMatch ? parseInt(totalPapersMatch[1]) : null,
        newPapers: totalPapersMatch ? parseInt(totalPapersMatch[2]) : null,
        totalQuestions: totalQsMatch ? parseInt(totalQsMatch[1]) : null,
        newQuestions: totalQsMatch ? parseInt(totalQsMatch[2]) : null,
      },
      log: stdout.trim(),
    });
  } catch (error: any) {
    console.error('Error in POST /api/pyq/upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload and extraction failed.' },
      { status: 500 }
    );
  }
}
