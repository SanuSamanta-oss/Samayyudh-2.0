import { Metadata } from 'next';
import { GuardianDashboardView } from '@/components/guardian/GuardianDashboardView';

export const metadata: Metadata = {
  title: 'Guardian Connect & Live Supervision — SamayYudh 2.0',
  description: 'Live examination supervision, attendance, and camera monitoring for parents and guardians.',
};

export default function GuardianPortalPage() {
  return <GuardianDashboardView />;
}
