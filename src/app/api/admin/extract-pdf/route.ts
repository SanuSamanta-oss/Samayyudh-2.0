import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { requireCommandSession, writeAuditLog, extractClientIp } from '@/lib/security/admin-auth';
import { checkRateLimit } from '@/lib/load-balancer';
import type { ExtractedPdfQuestionDraft, ExtendedQuestionType } from '@/types/admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 90;

const BUCKET_NAME = 'educational-resources';

function parseQuestionsHeuristically(
  rawText: string,
  defaultExam: string,
  defaultSubject: string
): ExtractedPdfQuestionDraft[] {
  const blocks = rawText
    .split(/(?=(?:^|\n)\s*(?:Q\.?\s*\d+|\d+\.)\s+)/gi)
    .map((b) => b.trim())
    .filter((b) => b.length > 25);

  const drafts: ExtractedPdfQuestionDraft[] = [];

  for (let i = 0; i < Math.min(blocks.length, 30); i++) {
    const block = blocks[i];
    const cleanBlock = block.replace(/^(?:Q\.?\s*\d+|\d+\.)\s*/i, '').trim();

    const optMatches = Array.from(
      cleanBlock.matchAll(/(?:^|\n|\s)\(([A-Da-d])\)\s*([^\n(]+)/g)
    );

    let questionText = cleanBlock;
    const options: Array<{ id: string; text: string; is_correct: boolean }> = [];

    if (optMatches.length >= 2) {
      const firstIdx = optMatches[0].index ?? cleanBlock.length;
      questionText = cleanBlock.slice(0, firstIdx).trim();
      for (let j = 0; j < optMatches.length && j < 4; j++) {
        const label = optMatches[j][1].toUpperCase();
        options.push({
          id: label.toLowerCase(),
          text: optMatches[j][2].trim(),
          is_correct: false,
        });
      }
    }

    const ansMatch = cleanBlock.match(/(?:Ans(?:wer)?|Key)\s*[:\-]\s*\(?([A-Da-d0-9.-]+)\)?/i);
    let correctAnswer: string | undefined;
    if (ansMatch && options.length > 0) {
      const ansChar = ansMatch[1].toLowerCase();
      correctAnswer = ansChar;
      for (const opt of options) {
        if (opt.id === ansChar) opt.is_correct = true;
      }
    }

    drafts.push({
      temp_id: `draft-${i + 1}`,
      selected: true,
      question_text: questionText.slice(0, 1200),
      question_type: options.length >= 2 ? 'mcq' : 'numerical',
      exam_code: defaultExam,
      subject: defaultSubject,
      chapter: '',
      topic: 'Imported PDF Topic',
      difficulty: 'medium',
      marks: 4,
      negative_marks: 1,
      options,
      correct_answer: correctAnswer,
      model_answer: '',
      confidence: options.length >= 4 && correctAnswer ? 0.8 : 0.45,
      needs_review: true,
    });
  }

  return drafts;
}

export async function POST(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const rl = await checkRateLimit(`extract-pdf:${ctx.user.id}`, 'ai');
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded for PDF extraction. Please wait a minute.' },
      { status: 429 }
    );
  }

  let pdfBuffer: Buffer | null = null;
  let defaultExam = 'JEE-MAIN';
  let defaultSubject = 'Physics';
  let useAi = true;
  let resourceId: string | null = null;

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData().catch(() => null);
    const file = formData?.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'PDF file is required.' }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 400 });
    }
    pdfBuffer = Buffer.from(await file.arrayBuffer());
    defaultExam = String(formData?.get('exam') || 'JEE-MAIN');
    defaultSubject = String(formData?.get('subject') || 'Physics');
    useAi = formData?.get('useAi') !== 'false';
  } else {
    const body = (await req.json().catch(() => ({}))) as {
      resourceId?: string;
      exam?: string;
      subject?: string;
      useAi?: boolean;
    };
    resourceId = body.resourceId || null;
    defaultExam = body.exam || 'JEE-MAIN';
    defaultSubject = body.subject || 'Physics';
    useAi = body.useAi !== false;

    if (!resourceId) {
      return NextResponse.json({ error: 'Provide either a PDF file or resourceId.' }, { status: 400 });
    }

    const { data: resRow, error: resErr } = await ctx.db
      .from('resources')
      .select('file_path, mime_type')
      .eq('id', resourceId)
      .maybeSingle();

    if (resErr || !resRow?.file_path) {
      return NextResponse.json({ error: 'Referenced PDF resource not found.' }, { status: 404 });
    }

    const { data: blob, error: dlErr } = await ctx.db.storage
      .from(BUCKET_NAME)
      .download(resRow.file_path);

    if (dlErr || !blob) {
      return NextResponse.json({ error: 'Unable to download PDF from storage.' }, { status: 400 });
    }
    pdfBuffer = Buffer.from(await blob.arrayBuffer());
  }

  let rawText = '';
  let pageCount = 0;

  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: pdfBuffer });
  try {
    const parsed = await parser.getText();
    rawText = (parsed.text || '').trim();
    pageCount = parsed.total || parsed.pages?.length || 0;
  } catch (parseErr) {
    console.error('[extract-pdf] parse failure:', parseErr);
    return NextResponse.json(
      { error: 'Unable to read text layer from PDF. Ensure it is not password-locked.' },
      { status: 422 }
    );
  } finally {
    await parser.destroy().catch(() => undefined);
  }

  if (rawText.length < 20) {
    return NextResponse.json(
      {
        error: 'No readable text layer found in this PDF (image-only scans require OCR before extraction).',
        pageCount,
      },
      { status: 422 }
    );
  }

  let drafts: ExtractedPdfQuestionDraft[] = [];
  let usedAi = false;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (useAi && geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const truncated = rawText.slice(0, 26000);
      const prompt = `Extract exam questions cleanly from the academic text below into valid JSON ONLY (no markdown fences).
Use LaTeX wrapped in $...$ or $$...$$ for math formulas.
Return an array of objects with schema:
[
  {
    "question_text": string,
    "question_type": "mcq" | "msq" | "numerical" | "integer" | "short_answer" | "true_false",
    "topic": string,
    "difficulty": "easy" | "medium" | "hard",
    "options": [{"id": "a", "text": string, "is_correct": boolean}],
    "correct_answer": string | null,
    "model_answer": string,
    "confidence": number
  }
]
Exam context: ${defaultExam}, Subject: ${defaultSubject}.
Text:
${truncated}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const txt = (response.text || '')
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsedJson = JSON.parse(txt) as Array<Record<string, unknown>>;
      if (Array.isArray(parsedJson) && parsedJson.length > 0) {
        usedAi = true;
        drafts = parsedJson.slice(0, 40).map((item, idx) => {
          const opts = Array.isArray(item.options)
            ? item.options.map((o, oIdx) => {
                const oo = (o || {}) as Record<string, unknown>;
                return {
                  id: String(oo.id || String.fromCharCode(97 + oIdx)),
                  text: String(oo.text || ''),
                  is_correct: Boolean(oo.is_correct),
                };
              })
            : [];
          const conf = typeof item.confidence === 'number' ? item.confidence : 0.7;
          return {
            temp_id: `ai-${idx + 1}`,
            selected: true,
            question_text: String(item.question_text || ''),
            question_type: (item.question_type as ExtendedQuestionType) || 'mcq',
            exam_code: defaultExam,
            subject: defaultSubject,
            chapter: '',
            topic: String(item.topic || 'General'),
            difficulty: (item.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
            marks: 4,
            negative_marks: 1,
            options: opts,
            correct_answer: typeof item.correct_answer === 'string' ? item.correct_answer : undefined,
            model_answer: String(item.model_answer || ''),
            confidence: conf,
            needs_review: true,
          };
        });
      }
    } catch (aiErr) {
      console.warn('[extract-pdf] Gemini fallback to heuristic parser:', aiErr);
    }
  }

  if (drafts.length === 0) {
    drafts = parseQuestionsHeuristically(rawText, defaultExam, defaultSubject);
  }

  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'pdf.extracted_drafts',
    targetType: resourceId ? 'resource' : 'upload',
    targetId: resourceId,
    ipAddress: extractClientIp(req),
    metadata: { extractedCount: drafts.length, usedAi, pageCount },
  });

  return NextResponse.json({
    success: true,
    usedAi,
    pageCount,
    rawCharCount: rawText.length,
    drafts,
  });
}
