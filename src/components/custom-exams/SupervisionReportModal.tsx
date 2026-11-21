'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  FileText,
  Download,
  Users,
  AlertTriangle,
  Pause,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import type { CustomExamReport } from '@/types/custom-exam';

interface SupervisionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: CustomExamReport | null;
}

export function SupervisionReportModal({
  isOpen,
  onClose,
  report,
}: SupervisionReportModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !report) return null;

  const handleExportJson = () => {
    setDownloading(true);
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `supervision_report_${report.exam.exam_code}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } finally {
      setDownloading(false);
    }
  };

  const handleExportCsv = () => {
    setDownloading(true);
    try {
      const headers = ['Student Name', 'LCE Code', 'Email', 'Exam Status', 'Warnings', 'Suspended', 'Suspended Reason', 'Joined At'];
      const rows = report.participants.map((p) => [
        `"${p.student_name}"`,
        `"${p.student_lce_code}"`,
        `"${p.student_email || ''}"`,
        `"${p.exam_status}"`,
        p.warning_count,
        p.is_suspended ? 'Yes' : 'No',
        `"${p.suspended_reason || ''}"`,
        `"${p.joined_at}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodeURI(csvContent));
      downloadAnchor.setAttribute('download', `supervision_audit_${report.exam.exam_code}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-[#111A2E] shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto border-0 outline-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Supervision Audit Report
              </h2>
              <p className="text-xs text-slate-400">
                {report.exam.title} • Code: {report.exam.exam_code}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-0 outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-6">
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162032] shadow-xs text-center border-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Enrolled Candidates</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {report.total_participants}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162032] shadow-xs text-center border-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Completed Exam</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                {report.completed_count}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162032] shadow-xs text-center border-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Warned Students</span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
                {report.warned_count}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162032] shadow-xs text-center border-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Suspended Students</span>
              <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">
                {report.suspended_count}
              </span>
            </div>
          </div>

          {/* Participant Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
              Candidate Telemetry &amp; Infraction History
            </h4>
            <div className="rounded-2xl bg-slate-50/50 dark:bg-[#141B2D]/50 shadow-xs overflow-hidden border-0">
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-[#162032] text-slate-500 font-bold uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Warnings</th>
                      <th className="p-3">Suspended</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                    {report.participants.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">
                          No candidates joined this session.
                        </td>
                      </tr>
                    ) : (
                      report.participants.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 dark:text-white block">{p.student_name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{p.student_lce_code}</span>
                          </td>
                          <td className="p-3 capitalize text-slate-700 dark:text-slate-300">
                            {p.exam_status}
                          </td>
                          <td className="p-3">
                            <span className={`font-mono font-bold ${p.warning_count > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                              {p.warning_count}
                            </span>
                          </td>
                          <td className="p-3">
                            {p.is_suspended ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                Suspended
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Normal</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Generated: {new Date(report.generated_at).toLocaleString()}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={downloading}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] dark:hover:bg-[#1D2B44] text-slate-700 dark:text-slate-200 font-bold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                disabled={downloading}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Audit</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
