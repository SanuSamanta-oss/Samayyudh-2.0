import React from 'react';
import type { Metadata } from 'next';
import { SmartInvitationLanding } from '@/components/invitation/SmartInvitationLanding';

interface JoinPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
  const { code } = await params;
  const cleanCode = code ? code.toUpperCase() : 'EXAM';
  return {
    title: `Examination Invitation ${cleanCode} — SamayYudh 2.0`,
    description: `Official invitation to join custom examination ${cleanCode} on SamayYudh 2.0.`,
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;
  return <SmartInvitationLanding initialCode={code} />;
}
