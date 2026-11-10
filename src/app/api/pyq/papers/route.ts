// ============================================================
// API Route: GET /api/pyq/papers
// Returns all imported exam papers with dynamic statistical counts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { loadServerPyqData, calculatePyqStats } from '@/lib/pyq/store';
import { getOrSetCache } from '@/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const examFilter = searchParams.get('exam') || 'All';

    const cacheKey = `samayyudh:pyq:papers:${examFilter.toLowerCase()}`;

    const { data, source } = await getOrSetCache(
      cacheKey,
      async () => {
        let { papers, questions } = loadServerPyqData();
        if (examFilter !== 'All') {
          papers = papers.filter((p) => p.exam.toLowerCase() === examFilter.toLowerCase());
          questions = questions.filter((q) => q.exam.toLowerCase() === examFilter.toLowerCase());
        }
        const stats = calculatePyqStats(questions, papers);
        return { papers, stats };
      },
      { ttlSeconds: 900 }
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
    console.error('Error in GET /api/pyq/papers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

