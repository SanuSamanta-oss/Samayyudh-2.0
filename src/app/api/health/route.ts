import { NextResponse } from 'next/server';
import { LOAD_BALANCER_NODE_ID } from '@/lib/load-balancer';
import { getCacheHealthInfo } from '@/lib/cache';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let redisStatus = 'healthy';
  let redisPingResult = 'PONG';

  try {
    const ping = await (redis as any).ping();
    redisPingResult = typeof ping === 'string' ? ping : 'PONG';
  } catch (error) {
    redisStatus = 'degraded';
    redisPingResult = error instanceof Error ? error.message : 'Ping error';
  }

  const memory = process.memoryUsage();
  const latencyMs = Date.now() - startTime;

  const payload = {
    status: 'healthy',
    clusterNodeId: LOAD_BALANCER_NODE_ID,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs,
    cache: {
      ...getCacheHealthInfo(),
      redisPing: redisPingResult,
      redisStatus,
    },
    system: {
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      rssMb: Math.round(memory.rss / 1024 / 1024),
    },
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-LB-Node': LOAD_BALANCER_NODE_ID,
    },
  });
}

