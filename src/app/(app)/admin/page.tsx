'use client';

import { Suspense } from 'react';
import { CommandCenterShell } from '@/components/admin/CommandCenterShell';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F6FC] dark:bg-[#0B1120]" />}>
      <CommandCenterShell />
    </Suspense>
  );
}
