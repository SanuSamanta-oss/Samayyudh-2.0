import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTeacherEmail } from '@/lib/email/teacher-email-service';
import type { TeacherCommunicationItem } from '@/types/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    const supabase = await createClient();

    let query = supabase
      .from('teacher_communications')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('[AdminCommunicationsAPI] Table might not exist or error:', error.message);
      return NextResponse.json({ items: [], total: 0 });
    }

    let items: TeacherCommunicationItem[] = data || [];

    if (search) {
      items = items.filter(
        (c) =>
          c.subject.toLowerCase().includes(search) ||
          c.teacher_email.toLowerCase().includes(search) ||
          (c.teacher_name && c.teacher_name.toLowerCase().includes(search)) ||
          c.message.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ items, total: items.length });
  } catch (err: any) {
    console.error('[AdminCommunicationsAPI] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      examId,
      teacherId,
      teacherEmail,
      teacherName,
      subject,
      category = 'general',
      priority = 'normal',
      message,
    } = body;

    if (!teacherId || !teacherEmail || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters: teacherId, teacherEmail, subject, or message.' },
        { status: 400 }
      );
    }

    const result = await sendTeacherEmail({
      examId,
      teacherId,
      teacherEmail,
      teacherName,
      subject,
      category,
      priority,
      message,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to dispatch email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    console.error('[AdminCommunicationsAPI] POST exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
