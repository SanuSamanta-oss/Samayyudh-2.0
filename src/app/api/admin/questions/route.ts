import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { extractClientIp, requireCommandSession, writeAuditLog } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';
import { questionBank as staticQuestionBank } from '@/lib/questions';
import type { CommandQuestion, ExtendedQuestionType, QuestionStatus } from '@/types/admin';

function mapStaticQuestion(sq: (typeof staticQuestionBank)[number]): CommandQuestion {
  return {
    id: sq.id,
    question_number: sq.question_number || 1,
    question_text: sq.question_text,
    exam_category: sq.exam_category || 'ENGINEERING',
    exam_code: sq.exam_code || 'GENERAL',
    subject: sq.subject,
    chapter: '',
    topic: sq.topic,
    subtopic: sq.subtopic,
    question_type: (sq.question_type as ExtendedQuestionType) || 'mcq',
    marks: sq.marks,
    negative_marks: 0,
    difficulty: sq.difficulty,
    recommended_minutes: sq.recommended_minutes || 2,
    options: (sq.options || []).map((opt) => ({
      id: opt.id,
      text: opt.text,
      is_correct: Array.isArray(sq.correct_answer)
        ? sq.correct_answer.includes(opt.id)
        : sq.correct_answer === opt.id,
    })),
    correct_answer: sq.correct_answer,
    model_answer: sq.model_answer || '',
    solution_steps: '',
    evaluation_rubric: sq.evaluation_rubric || `${sq.marks} marks`,
    expected_points: sq.expected_points || [],
    keywords: sq.keywords || [],
    diagram_url: sq.diagram_url,
    year: sq.year,
    source: sq.source,
    tags: [sq.exam_code, sq.subject, sq.topic].filter(Boolean),
    visibility: 'public',
    status: 'published',
    author_id: null,
    is_static: true,
    created_at: sq.created_at || '2026-01-01T00:00:00.000Z',
    updated_at: sq.updated_at || '2026-01-01T00:00:00.000Z',
  };
}

function normalizeDbQuestion(row: Record<string, unknown>): CommandQuestion {
  const rawOpts = Array.isArray(row.options) ? row.options : [];
  const options = rawOpts.map((item, idx) => {
    const obj = (item || {}) as Record<string, unknown>;
    return {
      id: String(obj.id || String.fromCharCode(97 + idx)),
      text: String(obj.text || ''),
      is_correct: Boolean(obj.is_correct),
    };
  });

  return {
    id: String(row.id),
    question_number: Number(row.question_number ?? 1),
    question_text: String(row.question_text || ''),
    exam_category: String(row.exam_category || 'ENGINEERING'),
    exam_code: String(row.exam_code || 'JEE-MAIN'),
    subject: String(row.subject || 'Physics'),
    chapter: String(row.chapter || ''),
    topic: String(row.topic || 'General'),
    subtopic: typeof row.subtopic === 'string' ? row.subtopic : undefined,
    question_type: (row.question_type as ExtendedQuestionType) || 'mcq',
    marks: Number(row.marks ?? 4),
    negative_marks: Number(row.negative_marks ?? 1),
    difficulty: (row.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    recommended_minutes: Number(row.recommended_minutes ?? 2),
    options,
    correct_answer:
      (row.correct_answer as string | string[] | undefined) ??
      options.find((o) => o.is_correct)?.id,
    model_answer: String(row.model_answer || ''),
    solution_steps: String(row.solution_steps || ''),
    evaluation_rubric: String(row.evaluation_rubric || ''),
    expected_points: Array.isArray(row.expected_points) ? (row.expected_points as string[]) : [],
    keywords: Array.isArray(row.keywords) ? (row.keywords as string[]) : [],
    case_passage: typeof row.case_passage === 'string' ? row.case_passage : undefined,
    diagram_url: typeof row.diagram_url === 'string' ? row.diagram_url : undefined,
    year: typeof row.year === 'string' ? row.year : undefined,
    exam_shift: typeof row.exam_shift === 'string' ? row.exam_shift : undefined,
    source: typeof row.source === 'string' ? row.source : undefined,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    visibility: (row.visibility as 'public' | 'classroom' | 'private') || 'public',
    status: (row.status as QuestionStatus) || 'published',
    author_id: typeof row.author_id === 'string' ? row.author_id : null,
    is_static: false,
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: String(row.updated_at || row.created_at || new Date().toISOString()),
  };
}

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const sp = req.nextUrl.searchParams;
  const search = (sp.get('search') || '').trim().toLowerCase();
  const exam = sp.get('exam') || '';
  const subject = sp.get('subject') || '';
  const questionType = sp.get('type') || '';
  const difficulty = sp.get('difficulty') || '';
  const status = sp.get('status') || '';
  const origin = sp.get('origin') || 'all';
  const sort = sp.get('sort') || 'newest';
  const page = Math.max(1, parseInt(sp.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(5, parseInt(sp.get('pageSize') || '20', 10)));

  let dbQuestions: CommandQuestion[] = [];
  let schemaReady = true;

  if (origin !== 'builtin') {
    const { data, error } = await guard.ctx.db
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      if (isMissingSchemaError(error)) schemaReady = false;
    } else if (data) {
      dbQuestions = data.map((row) => normalizeDbQuestion(row as Record<string, unknown>));
    }
  }

  const builtinQuestions =
    origin !== 'database' ? staticQuestionBank.map(mapStaticQuestion) : [];

  let combined = [...dbQuestions, ...builtinQuestions];

  if (search) {
    combined = combined.filter(
      (q) =>
        q.question_text.toLowerCase().includes(search) ||
        q.topic.toLowerCase().includes(search) ||
        q.subject.toLowerCase().includes(search) ||
        q.tags.some((t) => t.toLowerCase().includes(search))
    );
  }
  if (exam) combined = combined.filter((q) => q.exam_code === exam);
  if (subject) combined = combined.filter((q) => q.subject === subject);
  if (questionType) combined = combined.filter((q) => q.question_type === questionType);
  if (difficulty) combined = combined.filter((q) => q.difficulty === difficulty);
  if (status) combined = combined.filter((q) => q.status === status);

  if (sort === 'marks_desc') {
    combined.sort((a, b) => b.marks - a.marks);
  } else if (sort === 'oldest') {
    combined.sort((a, b) => a.created_at.localeCompare(b.created_at));
  } else {
    combined.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const total = combined.length;
  const start = (page - 1) * pageSize;
  const items = combined.slice(start, start + pageSize);

  return NextResponse.json({
    schemaReady,
    total,
    page,
    pageSize,
    items,
    facets: {
      exams: Array.from(new Set([...dbQuestions, ...builtinQuestions].map((q) => q.exam_code))).sort(),
      subjects: Array.from(new Set([...dbQuestions, ...builtinQuestions].map((q) => q.subject))).sort(),
    },
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const ipAddress = extractClientIp(req);
  const body = (await req.json().catch(() => null)) as Partial<CommandQuestion> & {
    id?: string;
    isUpdate?: boolean;
  } | null;

  if (!body || !body.question_text?.trim()) {
    return NextResponse.json({ error: 'Question text is required.' }, { status: 400 });
  }

  const qType: ExtendedQuestionType = body.question_type || 'mcq';
  const optionsPayload = (body.options || []).map((opt, idx) => ({
    id: opt.id || String.fromCharCode(97 + idx),
    text: opt.text || '',
    is_correct: Boolean(opt.is_correct),
  }));

  const correctIds = optionsPayload.filter((o) => o.is_correct).map((o) => o.id);
  const correctAnswer =
    body.correct_answer ??
    (qType === 'msq' ? correctIds : correctIds[0] || '');

  const rowPayload: Record<string, unknown> = {
    question_number: Number(body.question_number ?? 1),
    question_text: body.question_text.trim(),
    exam_category: body.exam_category || 'ENGINEERING',
    exam_code: (body.exam_code || 'JEE-MAIN').trim(),
    subject: (body.subject || 'Physics').trim(),
    chapter: (body.chapter || '').trim(),
    topic: (body.topic || 'General').trim(),
    subtopic: body.subtopic?.trim() || '',
    question_type: qType,
    difficulty: body.difficulty || 'medium',
    marks: Number(body.marks ?? 4),
    negative_marks: Number(body.negative_marks ?? 1),
    recommended_minutes: Number(body.recommended_minutes ?? 2),
    options: optionsPayload,
    correct_answer: Array.isArray(correctAnswer) ? JSON.stringify(correctAnswer) : String(correctAnswer || ''),
    model_answer: body.model_answer?.trim() || '',
    solution_steps: body.solution_steps?.trim() || '',
    evaluation_rubric: body.evaluation_rubric?.trim() || `${Number(body.marks ?? 4)} marks`,
    expected_points: Array.isArray(body.expected_points) ? body.expected_points : [],
    keywords: Array.isArray(body.keywords) ? body.keywords : [],
    case_passage: body.case_passage || '',
    diagram_url: body.diagram_url || '',
    tags: Array.isArray(body.tags) ? body.tags : [],
    status: body.status || 'draft',
    visibility: body.visibility || 'public',
    updated_at: new Date().toISOString(),
  };

  if (body.isUpdate && body.id && !body.is_static) {
    let updateQuery = ctx.db.from('questions').update(rowPayload).eq('id', body.id);
    if (ctx.role === 'teacher') {
      updateQuery = updateQuery.eq('author_id', ctx.user.id);
    }
    const { data, error } = await updateQuery.select('*').maybeSingle();
    if (error) {
      if (isMissingSchemaError(error)) {
        return NextResponse.json({ error: 'Run admin_command_center.sql first.', schemaReady: false }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Question not found or permission denied.' }, { status: 404 });
    }

    await syncChildren(ctx.db, String(data.id), optionsPayload, String(rowPayload.solution_steps || ''), ctx.user.id);
    await writeAuditLog(ctx.db, {
      actorId: ctx.user.id,
      actorRole: ctx.role,
      action: 'question.updated',
      targetType: 'question',
      targetId: String(data.id),
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      question: normalizeDbQuestion(data as Record<string, unknown>),
    });
  }

  const newId = `cmd-${crypto.randomUUID()}`;
  const { data: created, error: insertErr } = await ctx.db
    .from('questions')
    .insert({
      id: newId,
      ...rowPayload,
      author_id: ctx.user.id,
    })
    .select('*')
    .single();

  if (insertErr) {
    if (isMissingSchemaError(insertErr)) {
      return NextResponse.json({ error: 'Run admin_command_center.sql first.', schemaReady: false }, { status: 503 });
    }
    return NextResponse.json({ error: insertErr.message }, { status: 400 });
  }

  await syncChildren(ctx.db, String(created.id), optionsPayload, String(rowPayload.solution_steps || ''), ctx.user.id);
  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'question.created',
    targetType: 'question',
    targetId: String(created.id),
    ipAddress,
    metadata: { status: rowPayload.status, type: qType },
  });

  return NextResponse.json(
    {
      success: true,
      question: normalizeDbQuestion(created as Record<string, unknown>),
    },
    { status: 201 }
  );
}

async function syncChildren(
  db: Parameters<typeof writeAuditLog>[0],
  questionId: string,
  optionsPayload: Array<{ id: string; text: string; is_correct: boolean }>,
  solutionMarkdown: string,
  authorId: string
) {
  await db.from('question_options').delete().eq('question_id', questionId);
  if (optionsPayload.length > 0) {
    await db.from('question_options').insert(
      optionsPayload.map((opt, idx) => ({
        question_id: questionId,
        option_key: opt.id,
        option_text: opt.text,
        is_correct: opt.is_correct,
        sort_order: idx,
      }))
    );
  }

  await db.from('question_solutions').insert({
    question_id: questionId,
    solution_markdown: solutionMarkdown,
    author_id: authorId,
    updated_at: new Date().toISOString(),
  });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as {
    action?: 'publish' | 'archive' | 'draft' | 'duplicate' | 'set_visibility';
    ids?: string[];
    visibility?: 'public' | 'classroom' | 'private';
  };

  const ids = Array.isArray(body.ids) ? body.ids.filter((id) => id.startsWith('cmd-') || id.length > 20) : [];
  if (!body.action || ids.length === 0) {
    return NextResponse.json({ error: 'Select database questions for bulk action.' }, { status: 400 });
  }

  if (body.action === 'duplicate') {
    const { data: originals, error } = await ctx.db.from('questions').select('*').in('id', ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const rows = (originals || []).map((orig) => ({
      ...(orig as Record<string, unknown>),
      id: `cmd-${crypto.randomUUID()}`,
      question_text: `${String((orig as Record<string, unknown>).question_text || '')} (Copy)`,
      status: 'draft',
      author_id: ctx.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
      const { error: insErr } = await ctx.db.from('questions').insert(rows);
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400 });
    }
  } else {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.action === 'publish') updates.status = 'published';
    else if (body.action === 'archive') updates.status = 'archived';
    else if (body.action === 'draft') updates.status = 'draft';
    else if (body.action === 'set_visibility' && body.visibility) updates.visibility = body.visibility;

    let query = ctx.db.from('questions').update(updates).in('id', ids);
    if (ctx.role === 'teacher') query = query.eq('author_id', ctx.user.id);
    const { error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, count: ids.length });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as { ids?: string[] };
  const ids = Array.isArray(body.ids) ? body.ids : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: 'Provide database question IDs.' }, { status: 400 });
  }

  let query = ctx.db.from('questions').delete().in('id', ids);
  if (ctx.role === 'teacher') query = query.eq('author_id', ctx.user.id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'question.deleted',
    targetType: 'question',
    metadata: { count: ids.length, ids },
    ipAddress: extractClientIp(req),
  });

  return NextResponse.json({ success: true, deleted: ids.length });
}
