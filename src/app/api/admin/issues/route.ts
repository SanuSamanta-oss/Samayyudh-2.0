import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SupervisionIssueItem } from '@/types/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const supabase = await createClient();

    let query = supabase
      .from('supervision_issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[AdminIssuesAPI] Table might not exist or error:', error.message);
      return NextResponse.json({ items: [], total: 0 });
    }

    let items: SupervisionIssueItem[] = data || [];

    if (search) {
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search) ||
          (i.student_name && i.student_name.toLowerCase().includes(search)) ||
          (i.assigned_to && i.assigned_to.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ items, total: items.length });
  } catch (err: any) {
    console.error('[AdminIssuesAPI] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      exam_id,
      teacher_id,
      student_id,
      student_name,
      category = 'other',
      priority = 'medium',
      title,
      description,
      assigned_to,
    } = body;

    if (!exam_id || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required parameters: exam_id, title, and description.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('supervision_issues')
      .insert({
        exam_id,
        teacher_id: teacher_id || null,
        student_id: student_id || null,
        student_name: student_name || null,
        category,
        priority,
        title,
        description,
        assigned_to: assigned_to || null,
        status: 'open',
      })
      .select('*')
      .single();

    if (error) {
      console.error('[AdminIssuesAPI] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error('[AdminIssuesAPI] POST exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, assigned_to, resolution_notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing issue id.' }, { status: 400 });
    }

    const supabase = await createClient();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (resolution_notes !== undefined) updates.resolution_notes = resolution_notes;

    const { data, error } = await supabase
      .from('supervision_issues')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[AdminIssuesAPI] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (err: any) {
    console.error('[AdminIssuesAPI] PATCH exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
