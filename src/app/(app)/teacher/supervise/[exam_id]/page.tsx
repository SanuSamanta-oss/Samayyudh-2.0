'use client';

import React, { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LiveTeacherSupervisionRoom } from '@/components/custom-exams/LiveTeacherSupervisionRoom';

function TeacherSuperviseInner({ examId }: { examId: string }) {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || undefined;
  const isSuperAdmin = searchParams.get('super_admin') === 'true';

  return (
    <LiveTeacherSupervisionRoom
      examId={examId}
      examCode={code}
      isSuperAdmin={isSuperAdmin}
      onBackToDashboard={() => {
        if (typeof window !== 'undefined') {
          window.location.href = isSuperAdmin ? '/admin?section=super_admin_exams' : '/exams';
        }
      }}
    />
  );
}

export default function TeacherSupervisePage({
  params,
}: {
  params: Promise<{ exam_id: string }>;
}) {
  const { exam_id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TeacherSuperviseInner examId={exam_id} />
    </Suspense>
  );
}
