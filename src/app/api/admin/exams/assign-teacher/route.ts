import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { examId, teacherId, teacherName, teacherEmail } = await req.json();

    if (!examId || !teacherId) {
      return NextResponse.json({ error: 'Missing examId or teacherId.' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('custom_exams')
      .update({
        assigned_teacher_id: teacherId,
        assigned_teacher_name: teacherName || null,
        assigned_teacher_email: teacherEmail || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', examId)
      .select('id, exam_code, title, assigned_teacher_id, assigned_teacher_name')
      .single();

    if (error) {
      console.error('[AssignTeacherAPI] Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, exam: data });
  } catch (err: any) {
    console.error('[AssignTeacherAPI] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
