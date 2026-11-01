// ============================================================
// API Route: GET /api/pyq/questions
// Returns filtered + paginated PYQ questions from the local JSON database
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { loadServerPyqData, filterPyqQuestions } from '@/lib/pyq/store';
import type { PyqFilterParams, PyqSubject, PyqSection, PyqQuestionType } from '@/lib/pyq/types';

export async function GET(req: NextRequest) {
  try {
    const { questions } = loadServerPyqData();
    const searchParams = req.nextUrl.searchParams;

    const filters: PyqFilterParams = {
      subject: (searchParams.get('subject') || 'All') as PyqSubject | 'All',
      date: searchParams.get('date') || 'All',
      shift: searchParams.get('shift') || 'All',
      section: (searchParams.get('section') || 'All') as PyqSection | 'All',
      questionType: (searchParams.get('type') || 'All') as PyqQuestionType | 'All',
      searchQuery: searchParams.get('q') || '',
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '20', 10),
    };

    const { questions: filtered, total } = filterPyqQuestions(questions, filters);

    return NextResponse.json({
      success: true,
      questions: filtered,
      total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
      totalPages: Math.ceil(total / (filters.pageSize || 20)),
    });
  } catch (error: any) {
    console.error('Error in GET /api/pyq/questions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

