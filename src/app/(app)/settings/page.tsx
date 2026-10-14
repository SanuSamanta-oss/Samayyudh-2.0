'use client';

// ============================================================
// SamayYudh 2.0 — Study Reminders & Daily Schedule Page
// Dark Theme (Seamless all-over dark aesthetic, no harsh borders):
// Background: #0B0A17 | Surfaces: #15102A | Cards: #1C1636
// Highlights: #7C71B2 | Text: #FFFFFF & #C4B7DE
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { ReminderSettingsPanel } from '@/components/notifications/ReminderSettingsPanel';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F0EEF7] dark:bg-[#0B0A17] text-[#2A2244] dark:text-[#FFFFFF] pb-24 md:pb-16 selection:bg-[#7C71B2] selection:text-white transition-colors duration-200">
      {/* Top Header - Borderless with soft backdrop blur */}
      <div className="bg-[#F0EEF7]/85 dark:bg-[#0B0A17]/85 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-2xl bg-white dark:bg-[#1C1636] hover:bg-[#E1D8EB] dark:hover:bg-[#261E48] text-[#7C71B2] dark:text-[#C4B7DE] hover:text-[#2A2244] dark:hover:text-white transition-all shadow-xs"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2A2244] dark:text-white tracking-tight flex items-center gap-2">
                <span>Reminders & Schedule</span>
                <span className="text-xl">⏰</span>
              </h1>
              <p className="text-xs text-[#5A4E7A] dark:text-[#A59AC0] font-medium">
                Daily study alarms, vibration, and push notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1C1636] text-[#7C71B2] dark:text-[#C4B7DE] shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#7C71B2]" />
              <span>Smart Simulator</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <ReminderSettingsPanel />
        </motion.div>
      </main>
    </div>
  );
}
