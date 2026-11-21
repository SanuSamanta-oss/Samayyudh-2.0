import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PlatformStudentDirectoryItem } from '@/types/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';

    const supabase = await createClient();

    // Query participants across all exams with participant records
    const { data: participants, error } = await supabase
      .from('custom_exam_participants')
      .select(`
        id,
        student_id,
        student_name,
        student_email,
        student_lce_code,
        exam_status,
        warning_count,
        is_suspended,
        accuracy_percentage,
        created_at,
        joined_at
      `)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('[AdminStudentsAPI] Error fetching participants:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by student_id or email
    const studentMap: Record<string, {
      id: string;
      name: string;
      email: string;
      lce_code?: string;
      examsTaken: number;
      examsInProgress: number;
      warnings: number;
      suspensions: number;
      accuracies: number[];
      lastExamDate: string | null;
      created_at: string;
    }> = {};

    for (const p of participants || []) {
      const key = p.student_id || p.student_email || p.id;
      if (!studentMap[key]) {
        studentMap[key] = {
          id: p.student_id || p.id,
          name: p.student_name || 'Examinee',
          email: p.student_email || '',
          lce_code: p.student_lce_code || undefined,
          examsTaken: 0,
          examsInProgress: 0,
          warnings: 0,
          suspensions: 0,
          accuracies: [],
          lastExamDate: null,
          created_at: p.created_at,
        };
      }

      studentMap[key].examsTaken += 1;
      if (p.exam_status === 'in_progress') {
        studentMap[key].examsInProgress += 1;
      }
      studentMap[key].warnings += p.warning_count || 0;
      if (p.is_suspended) {
        studentMap[key].suspensions += 1;
      }
      if (typeof p.accuracy_percentage === 'number' && p.accuracy_percentage > 0) {
        studentMap[key].accuracies.push(p.accuracy_percentage);
      }
      if (p.joined_at && (!studentMap[key].lastExamDate || new Date(p.joined_at) > new Date(studentMap[key].lastExamDate!))) {
        studentMap[key].lastExamDate = p.joined_at;
      }
    }

    const items: PlatformStudentDirectoryItem[] = Object.values(studentMap)
      .map((s) => {
        const avgAcc = s.accuracies.length > 0
          ? Math.round(s.accuracies.reduce((a, b) => a + b, 0) / s.accuracies.length)
          : 0;

        return {
          id: s.id,
          name: s.name,
          email: s.email,
          lce_code: s.lce_code,
          total_exams_taken: s.examsTaken,
          total_exams_in_progress: s.examsInProgress,
          total_warnings_received: s.warnings,
          total_suspensions: s.suspensions,
          average_accuracy: avgAcc,
          last_exam_date: s.lastExamDate,
          created_at: s.created_at,
        };
      })
      .filter((s) => {
        if (!search) return true;
        return (
          s.name.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          (s.lce_code && s.lce_code.toLowerCase().includes(search))
        );
      });

    return NextResponse.json({ items, total: items.length });
  } catch (err: any) {
    console.error('[AdminStudentsAPI] Exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
