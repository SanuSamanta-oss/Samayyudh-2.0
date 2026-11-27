import { NextResponse } from 'next/server';
import { getZoomConfigStatus } from '@/lib/zoom/zoom-service';

export async function GET() {
  try {
    const status = getZoomConfigStatus();
    return NextResponse.json({
      success: true,
      config: status,
    });
  } catch {
    return NextResponse.json(
      { success: false, config: { isConfigured: false } },
      { status: 500 }
    );
  }
}
