import { NextRequest, NextResponse } from 'next/server';
import { requireCommandSession } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';
import { questionBank as staticQuestionBank } from '@/lib/questions';
import type { GlobalSearchResult } from '@/types/admin';

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const q = (req.nextUrl.searchParams.get('q') || '').trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const lower = q.toLowerCase();
  const results: GlobalSearchResult[] = [];

  const [questionsRes, resourcesRes, assignmentsRes, classroomsRes, groupsRes, profilesRes] =
    await Promise.all([
      ctx.db
        .from('questions')
        .select('id, question_text, subject, exam_code, status')
        .ilike('question_text', `%${q}%`)
        .limit(6),
      ctx.db
        .from('resources')
        .select('id, title, file_name, category, subject')
        .ilike('title', `%${q}%`)
        .limit(6),
      ctx.db
        .from('assignments')
        .select('id, title, status')
        .ilike('title', `%${q}%`)
        .limit(5),
      ctx.db
        .from('classrooms')
        .select('id, name, subject, teacher_id')
        .ilike('name', `%${q}%`)
        .limit(5),
      ctx.db
        .from('student_groups')
        .select('id, name, teacher_id')
        .ilike('name', `%${q}%`)
        .limit(5),
      ctx.db
        .from('profiles')
        .select('id, public_id, username, display_name')
        .or(`display_name.ilike.%${q}%,username.ilike.%${q}%,public_id.ilike.%${q}%`)
        .limit(6),
    ]);

  if (!questionsRes.error) {
    for (const row of questionsRes.data || []) {
      results.push({
        id: String(row.id),
        category: 'questions',
        title: String(row.question_text || '').slice(0, 90),
        subtitle: `${row.exam_code} · ${row.subject} · ${row.status || 'published'}`,
        section: 'questions',
      });
    }
  }

  for (const sq of staticQuestionBank) {
    if (results.filter((r) => r.category === 'questions').length >= 8) break;
    if (
      sq.question_text.toLowerCase().includes(lower) ||
      sq.topic.toLowerCase().includes(lower) ||
      sq.subject.toLowerCase().includes(lower)
    ) {
      results.push({
        id: sq.id,
        category: 'questions',
        title: sq.question_text.slice(0, 90),
        subtitle: `${sq.exam_code} · ${sq.subject} · Built-in`,
        section: 'questions',
      });
    }
  }

  if (!resourcesRes.error) {
    for (const r of resourcesRes.data || []) {
      results.push({
        id: r.id,
        category: 'resources',
        title: r.title || r.file_name,
        subtitle: `${r.category}${r.subject ? ` · ${r.subject}` : ''}`,
        section: 'resources',
      });
    }
  }

  if (!assignmentsRes.error) {
    for (const a of assignmentsRes.data || []) {
      results.push({
        id: a.id,
        category: 'assignments',
        title: a.title,
        subtitle: `Assignment · ${a.status}`,
        section: 'assignments',
      });
    }
  }

  if (!classroomsRes.error) {
    for (const c of classroomsRes.data || []) {
      if (ctx.role === 'teacher' && c.teacher_id !== ctx.user.id) continue;
      results.push({
        id: c.id,
        category: 'classrooms',
        title: c.name,
        subtitle: c.subject || 'Classroom',
        section: 'classrooms',
      });
    }
  }

  if (!groupsRes.error) {
    for (const g of groupsRes.data || []) {
      if (ctx.role === 'teacher' && g.teacher_id !== ctx.user.id) continue;
      results.push({
        id: g.id,
        category: 'groups',
        title: g.name,
        subtitle: 'Private Student Group',
        section: 'classrooms',
      });
    }
  }

  if (!profilesRes.error && !isMissingSchemaError(profilesRes.error)) {
    for (const p of profilesRes.data || []) {
      results.push({
        id: p.id,
        category: 'students',
        title: p.display_name || p.username || p.public_id || 'Aspirant',
        subtitle: `${p.public_id || 'SY-'}${p.username ? ` · @${p.username}` : ''}`,
        section: 'students',
      });
    }
  }

  return NextResponse.json({ results });
}
