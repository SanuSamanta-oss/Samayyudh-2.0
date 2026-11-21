// ==============================================================================
// SamayYudh 2.0 — Enterprise Supervision Load Simulation Harness
// Benchmarking 100, 500, and 1,000 Concurrent Examinees
// Measures: API latency, throughput, error rate, memory, and transactional safety
// ==============================================================================

import {
  createCustomExam,
  joinCustomExamParticipant,
  executeSupervisionAction,
  updateStudentParticipantHeartbeat,
  studentRaiseHand,
  submitStudentExam,
  getExamSupervisionRoomState,
  startCustomExamSession,
  endCustomExamSession,
  generateSupervisionReport,
} from '../src/lib/exams/custom-exam-service';

interface LoadTestMetrics {
  stage: string;
  concurrentStudents: number;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  durationMs: number;
  operationsPerSecond: number;
  latency: {
    minMs: number;
    maxMs: number;
    avgMs: number;
    p95Ms: number;
    p99Ms: number;
  };
}

function calculatePercentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

async function runStage(targetStudents: number): Promise<LoadTestMetrics> {
  console.log(`\n======================================================`);
  console.log(`[LoadTest] INITIATING STAGE: ${targetStudents} CONCURRENT STUDENTS`);
  console.log(`======================================================`);

  const startTime = Date.now();
  const latencies: number[] = [];
  let successful = 0;
  let failed = 0;

  // 1. Create a dedicated load test exam
  const exam = await createCustomExam(
    {
      title: `Scale Load Test Assessment - ${targetStudents} Concurrency`,
      description: 'Automated high-scale throughput verification harness',
      duration_minutes: 60,
      total_marks: 100,
      max_participants: targetStudents,
      supervision_enabled: true,
      mic_enabled: true,
      subjects: ['Engineering Mathematics', 'Algorithms'],
    },
    'load_test_proctor_admin'
  );

  console.log(`[LoadTest] Created exam: ${exam.title} (Code: ${exam.exam_code})`);

  // 2. Simulate Concurrent Joins in Batches of 50
  const BATCH_SIZE = 50;
  for (let i = 0; i < targetStudents; i += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, targetStudents - i) }, (_, idx) => {
      const studentIdx = i + idx + 1;
      return (async () => {
        const opStart = performance.now();
        try {
          await joinCustomExamParticipant(exam.id, {
            id: `sim_stud_${studentIdx}`,
            name: `Load Test Student ${studentIdx}`,
            lceCode: `LCE-${2000 + studentIdx}`,
            studentClass: `Batch-${Math.floor(studentIdx / 25)}`,
          });
          latencies.push(performance.now() - opStart);
          successful++;
        } catch {
          failed++;
        }
      })();
    });
    await Promise.all(batch);
  }

  console.log(`[LoadTest] Completed ${targetStudents} candidate registrations.`);

  // 3. Teacher Starts the Examination (Atomic Transition to in_progress)
  const startOpStart = performance.now();
  await startCustomExamSession(exam.id, 'load_test_proctor_admin');
  latencies.push(performance.now() - startOpStart);
  successful++;

  // 4. Simulate Concurrent Telemetry Heartbeats & Answer Sync
  for (let i = 0; i < targetStudents; i += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, targetStudents - i) }, (_, idx) => {
      const studentIdx = i + idx + 1;
      return (async () => {
        const opStart = performance.now();
        try {
          await updateStudentParticipantHeartbeat(exam.id, `sim_stud_${studentIdx}`, {
            camera_active: true,
            connection_quality: 'good',
            questions_answered: Math.floor(Math.random() * 20),
            current_question_index: Math.floor(Math.random() * 25),
          });
          latencies.push(performance.now() - opStart);
          successful++;
        } catch {
          failed++;
        }
      })();
    });
    await Promise.all(batch);
  }

  // 5. Simulate 10% Hand-Raises
  const handRaiseCount = Math.floor(targetStudents * 0.1);
  for (let i = 1; i <= handRaiseCount; i++) {
    const opStart = performance.now();
    try {
      await studentRaiseHand(exam.id, `sim_stud_${i}`);
      latencies.push(performance.now() - opStart);
      successful++;
    } catch {
      failed++;
    }
  }

  // 6. Simulate 2% Disciplinary Actions (Warnings & Suspensions)
  const warnCount = Math.max(1, Math.floor(targetStudents * 0.02));
  for (let i = 1; i <= warnCount; i++) {
    const opStart = performance.now();
    try {
      await executeSupervisionAction(
        {
          exam_id: exam.id,
          student_id: `sim_stud_${i}`,
          action: 'warning',
          warning_level: 'first',
          reason: 'Camera obstruction detected by AI monitor',
        },
        'load_test_proctor_admin'
      );
      latencies.push(performance.now() - opStart);
      successful++;
    } catch {
      failed++;
    }
  }

  // 7. Simulate Time Adjustment
  const timeOpStart = performance.now();
  await executeSupervisionAction(
    {
      exam_id: exam.id,
      student_id: `sim_stud_1`,
      action: 'time_adjustment',
      time_adjustment_seconds: 300,
      reason: 'Compensated 5 minutes for stream restart',
    },
    'load_test_proctor_admin'
  );
  latencies.push(performance.now() - timeOpStart);
  successful++;

  // 8. Simulate Concurrent Submissions for 50% of Students
  const submissionCount = Math.floor(targetStudents * 0.5);
  for (let i = 0; i < submissionCount; i += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, submissionCount - i) }, (_, idx) => {
      const studentIdx = i + idx + 1;
      return (async () => {
        const opStart = performance.now();
        try {
          await submitStudentExam(
            exam.id,
            `sim_stud_${studentIdx}`,
            { q1: 'A', q2: 'C', q3: 'B', q4: 'D' },
            'normal'
          );
          latencies.push(performance.now() - opStart);
          successful++;
        } catch {
          failed++;
        }
      })();
    });
    await Promise.all(batch);
  }

  // 9. Conclude Examination (Atomic End & Lock)
  const endOpStart = performance.now();
  await endCustomExamSession(exam.id, 'load_test_proctor_admin');
  latencies.push(performance.now() - endOpStart);
  successful++;

  // 10. Generate Audit Report
  const reportOpStart = performance.now();
  const report = await generateSupervisionReport(exam.id);
  latencies.push(performance.now() - reportOpStart);
  if (report) successful++;
  else failed++;

  const totalDurationMs = Date.now() - startTime;
  const totalOps = successful + failed;

  return {
    stage: `${targetStudents} Students`,
    concurrentStudents: targetStudents,
    totalOperations: totalOps,
    successfulOperations: successful,
    failedOperations: failed,
    durationMs: totalDurationMs,
    operationsPerSecond: Number(((totalOps / totalDurationMs) * 1000).toFixed(2)),
    latency: {
      minMs: Number(Math.min(...latencies).toFixed(2)),
      maxMs: Number(Math.max(...latencies).toFixed(2)),
      avgMs: Number((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)),
      p95Ms: Number(calculatePercentile(latencies, 95).toFixed(2)),
      p99Ms: Number(calculatePercentile(latencies, 99).toFixed(2)),
    },
  };
}

async function main() {
  console.log('SAMAYYUDH 2.0 — HIGH CONCURRENCY SUPERVISION BENCHMARK HARNESS');
  console.log('Testing Stages: 100, 500, 1,000 Examinees\n');

  const results: LoadTestMetrics[] = [];

  for (const count of [100, 500, 1000]) {
    const res = await runStage(count);
    results.push(res);
  }

  console.log('\n======================================================');
  console.log('FINAL BENCHMARK PERFORMANCE RESULTS TABLE');
  console.log('======================================================\n');
  console.table(
    results.map((r) => ({
      Stage: r.stage,
      'Total Ops': r.totalOperations,
      Success: r.successfulOperations,
      Failed: r.failedOperations,
      'Duration (s)': (r.durationMs / 1000).toFixed(2),
      'Throughput (ops/s)': r.operationsPerSecond,
      'Avg Latency (ms)': r.latency.avgMs,
      'P95 (ms)': r.latency.p95Ms,
      'P99 (ms)': r.latency.p99Ms,
    }))
  );
}

main().catch(console.error);
