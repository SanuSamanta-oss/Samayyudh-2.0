// ============================================================
// API Route: GET /api/pyq/papers
// Returns all imported exam papers with dynamic statistical counts
// ============================================================

import { NextResponse } from 'next/server';
import { loadServerPyqData, calculatePyqStats } from '@/lib/pyq/store';

export async function GET() {
  try {
    const { papers, questions } = loadServerPyqData();
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

