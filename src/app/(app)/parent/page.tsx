import { Metadata } from 'next';
import { ParentLiveMonitoringView } from '@/components/parent/ParentLiveMonitoringView';

export const metadata: Metadata = {
  title: 'Parent Live Monitoring — SamayYudh 2.0',
  description: 'Live examination supervision and camera monitoring for parents.',
};

export default function ParentMonitoringPage() {
  return <ParentLiveMonitoringView />;
}
