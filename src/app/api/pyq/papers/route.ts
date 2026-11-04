// ============================================================
// API Route: GET /api/pyq/papers
// Returns all imported exam papers with dynamic statistical counts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { loadServerPyqData, calculatePyqStats } from '@/lib/pyq/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const examFilter = searchParams.get('exam');

    let { papers, questions } = loadServerPyqData();
    if (examFilter && examFilter !== 'All') {
      papers = papers.filter((p) => p.exam.toLowerCase() === examFilter.toLowerCase());
      questions = questions.filter((q) => q.exam.toLowerCase() === examFilter.toLowerCase());
    }

    const stats = calculatePyqStats(questions, papers);

    return NextResponse.json({
      success: true,
      papers,
      stats,
    });
  } catch (error: any) {
    console.error('Error in GET /api/pyq/papers:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

