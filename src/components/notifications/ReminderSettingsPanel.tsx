'use client';

import { ReminderDashboard } from '@/components/reminders/ReminderDashboard';

interface ReminderSettingsPanelProps {
  className?: string;
}

/**
 * Preserved export wrapper so embedded usage (e.g. inside Profile Settings tab)
 * renders the modernized productivity dashboard cleanly.
 */
export function ReminderSettingsPanel({ className = '' }: ReminderSettingsPanelProps) {
  return <ReminderDashboard embedded className={className} />;
}
