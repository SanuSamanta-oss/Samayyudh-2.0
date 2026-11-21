'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  RefreshCw,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import type { TeacherCommunicationItem } from '@/types/admin';

interface TeacherCommunicationCenterProps {
  initialRecipient?: {
    email: string;
    name?: string;
    examId?: string;
    examCode?: string;
  } | null;
}

const EMAIL_TEMPLATES = [
  {
    id: 'clarification',
    label: 'Exam Clarification Request',
    category: 'supervision_clarification' as const,
    priority: 'normal' as const,
    subject: 'Request for Examination Protocol Clarification',
    message: `Dear Educator,\n\nThe Examination Administration requires urgent clarification regarding proctoring incidents or question paper structure for your examination.\n\nPlease log into the SamayYudh Console at your earliest convenience to review flagged candidate logs and submit your remarks.\n\nWarm regards,\nSuper Admin Command Office`,
  },
  {
    id: 'investigation',
    label: 'Proctoring Investigation & Cheating Flags',
    category: 'compliance_warning' as const,
    priority: 'high' as const,
    subject: 'Action Required: High-Severity Proctoring Flags Detected',
    message: `Dear Faculty,\n\nOur automated proctoring surveillance system has detected multiple high-severity integrity violations (such as multi-face anomalies, persistent tab switches, or audio triggers) during the live session.\n\nPlease inspect the candidate session recordings and confirm whether disciplinary actions (suspension/disqualification) should be validated.\n\nWarm regards,\nIntegrity Review Board`,
  },
  {
    id: 'schedule_notice',
    label: 'Schedule Confirmation & Server Notice',
    category: 'schedule_notice' as const,
    priority: 'normal' as const,
    subject: 'Examination Schedule Confirmation & Server Readiness',
    message: `Dear Educator,\n\nYour scheduled examination has been approved and pre-allocated on the SamayYudh examination servers.\n\nPlease ensure you join the Teacher Supervision Control Room at least 15 minutes prior to candidate entry to initialize webcam monitoring and answer examinee inquiries.\n\nWarm regards,\nExamination Operations`,
  },
  {
    id: 'urgent_compliance',
    label: 'Urgent Compliance Warning',
    category: 'compliance_warning' as const,
    priority: 'urgent' as const,
    subject: 'URGENT: Examination Supervision Compliance Warning',
    message: `Dear Faculty Supervisor,\n\nImmediate attention is required. The Examination Command Center has identified that the designated supervision room is unattended or examinees have raised hands without response for over 5 minutes.\n\nPlease connect immediately to maintain regulatory compliance.\n\nSuper Admin Command Desk`,
  },
];

export function TeacherCommunicationCenter({
  initialRecipient,
}: TeacherCommunicationCenterProps) {
  const [recipientEmail, setRecipientEmail] = useState(initialRecipient?.email || '');
  const [recipientName, setRecipientName] = useState(initialRecipient?.name || '');
  const [examId, setExamId] = useState(initialRecipient?.examId || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TeacherCommunicationItem['category']>('general');
  const [priority, setPriority] = useState<TeacherCommunicationItem['priority']>('normal');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [communications, setCommunications] = useState<TeacherCommunicationItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Sync initialRecipient if passed
  useEffect(() => {
    if (initialRecipient) {
      if (initialRecipient.email) setRecipientEmail(initialRecipient.email);
      if (initialRecipient.name) setRecipientName(initialRecipient.name);
      if (initialRecipient.examId) setExamId(initialRecipient.examId);
    }
  }, [initialRecipient]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/admin/communications');
      if (res.ok) {
        const data = await res.json();
        setCommunications(data.items || []);
      }
    } catch (err) {
      console.error('[TeacherCommunicationCenter] Error:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleApplyTemplate = (tmpl: (typeof EMAIL_TEMPLATES)[0]) => {
    setCategory(tmpl.category);
    setPriority(tmpl.priority);
    setSubject(tmpl.subject);
    setMessage(tmpl.message);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !subject || !message) {
      setSendError('Please fill in recipient email, subject, and message.');
      return;
    }

    setSending(true);
    setSendError(null);
    setSendSuccess(false);

    try {
      const res = await fetch('/api/admin/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: recipientEmail,
          teacherEmail: recipientEmail,
          teacherName: recipientName || undefined,
          examId: examId || undefined,
          subject,
          category,
          priority,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch email notice');
      }

      setSendSuccess(true);
      fetchHistory();
      setTimeout(() => setSendSuccess(false), 5000);
    } catch (err: any) {
      setSendError(err.message || 'Error sending email');
    } finally {
      setSending(false);
    }
  };

  const formatIST = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-[28px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Teacher Communication & Incident Dispatch Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Send official administrative notices, proctoring clarification demands, and schedule confirmations to educators.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHistory}
          disabled={loadingHistory}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border-0 outline-none shadow-xs"
          title="Refresh history"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Composer (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-[28px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Compose Official Teacher Notice
            </h3>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              Transactional Dispatch
            </span>
          </div>

          {/* Quick Pre-fill Templates */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Templates
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {EMAIL_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 text-xs font-semibold transition-all cursor-pointer border-0 outline-none"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Teacher Email *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="faculty@institution.ac.in"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-purple-500/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Teacher Name (Optional)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Dr. Rajesh Sharma"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Notice Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none"
                >
                  <option value="exam_issue">Exam Issue & Technical Incident</option>
                  <option value="supervision_clarification">Supervision Clarification</option>
                  <option value="schedule_notice">Schedule & Protocol Notice</option>
                  <option value="compliance_warning">Compliance & Cheating Warning</option>
                  <option value="general">General Administrative Inquiry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none font-bold"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">URGENT Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Official Notice regarding Custom Exam..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-purple-500/50"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Message Body *
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your official administrative message..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-purple-500/50 font-mono text-xs leading-relaxed"
                required
              />
            </div>

            {sendSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Notice successfully sent and registered in platform communications!</span>
              </div>
            )}

            {sendError && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{sendError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-2 shadow-md shadow-purple-600/30"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Dispatching Notice...' : 'Send Official Notice'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Sent History (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-[28px] bg-white dark:bg-[#111A2E] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-0 ring-0 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Dispatched Notices History
            </h3>
            <span className="text-xs text-slate-400">
              {communications.length} Recorded
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[560px] pr-1">
            {loadingHistory ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Loading communication history...
              </div>
            ) : communications.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/3 text-center text-xs text-slate-400">
                No teacher notices sent yet.
              </div>
            ) : (
              communications.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/3 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {comm.teacher_name || comm.teacher_email}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatIST(comm.created_at)}
                    </span>
                  </div>

                  <div className="font-medium text-slate-700 dark:text-slate-300 text-[11px] line-clamp-1">
                    {comm.subject}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {comm.message}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        comm.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-600'
                          : comm.priority === 'high'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {comm.priority}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{comm.status.toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
