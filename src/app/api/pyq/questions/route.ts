// ============================================================
// API Route: GET /api/pyq/questions
// Returns filtered + paginated PYQ questions from the local JSON database
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { loadServerPyqData, filterPyqQuestions } from '@/lib/pyq/store';
import type { PyqFilterParams, PyqSubject, PyqSection, PyqQuestionType } from '@/lib/pyq/types';
import { getOrSetCache } from '@/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const filters: PyqFilterParams = {
      exam: searchParams.get('exam') || 'All',
      year: searchParams.get('year') && searchParams.get('year') !== 'all' && searchParams.get('year') !== 'All' ? parseInt(searchParams.get('year')!, 10) : undefined,
      subject: (searchParams.get('subject') || 'All') as PyqSubject | 'All',
      chapter: searchParams.get('chapter') || 'All',
      date: searchParams.get('date') || 'All',
      shift: searchParams.get('shift') || 'All',
      section: (searchParams.get('section') || 'All') as PyqSection | 'All',
      questionType: (searchParams.get('type') || 'All') as PyqQuestionType | 'All',
      searchQuery: searchParams.get('q') || '',
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '20', 10),
    };

    // Cache key uniquely hashes all filter parameters
    const cacheKey = `samayyudh:pyq:questions:${JSON.stringify(filters)}`;

    const { data, source } = await getOrSetCache(
      cacheKey,
      async () => {
        const { questions } = loadServerPyqData();
        const { questions: filtered, total } = filterPyqQuestions(questions, filters);
        return {
          questions: filtered,
          total,
          page: filters.page || 1,
          pageSize: filters.pageSize || 20,
          totalPages: Math.ceil(total / (filters.pageSize || 20)),
        };
      },
      { ttlSeconds: 600 }
    );

    return NextResponse.json(
      {
        success: true,
        ...data,
      },
      {
        headers: {
          'X-Cache-Status': source.toUpperCase(),
        },
      }
    );
  } catch (error: any) {
    console.error('Error in GET /api/pyq/questions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

