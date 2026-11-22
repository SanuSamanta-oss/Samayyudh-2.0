'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import {
  X,
  Sliders,
  Sparkles,
  Clock,
  Award,
  Video,
  Mic,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Users,
  Shuffle,
  Share2,
  Send,
} from 'lucide-react';
import type { CustomExam, CreateCustomExamInput } from '@/types/custom-exam';

interface CreateCustomExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (exam: CustomExam) => void;
}

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'General Aptitude & Reasoning',
  'Computer Science & IT',
];

export function CreateCustomExamModal({
  isOpen,
  onClose,
  onCreated,
}: CreateCustomExamModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetClass, setTargetClass] = useState('Grade 12 Advanced Batch A');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [supervisionEnabled, setSupervisionEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(false);
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [instructions, setInstructions] = useState(
    'Please ensure your webcam remains centered on your face throughout the entire exam session. Tab switching or camera obstruction is automatically reported to the supervisor.'
  );

  const [submitting, setSubmitting] = useState(false);
  const [createdExam, setCreatedExam] = useState<CustomExam | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = (examCode: string, examTitle: string, url: string) => {
    const text = `You are invited to join custom examination "${examTitle}" on SamayYudh 2.0!\n\nUniversal Link: ${url}\nExam Code: ${examCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please provide an examination title.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const input: CreateCustomExamInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      target_class: targetClass.trim() || undefined,
      duration_minutes: durationMinutes,
      total_marks: totalMarks,
      supervision_enabled: supervisionEnabled,
      mic_enabled: micEnabled,
      negative_marking: negativeMarking,
      randomize_questions: randomizeQuestions,
      randomize_options: randomizeOptions,
      max_participants: maxParticipants,
      subjects: selectedSubjects,
      instructions: instructions.trim() || undefined,
    };

    try {
      const res = await fetch('/api/custom-exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create custom examination.');
        setSubmitting(false);
        return;
      }

      setCreatedExam(data.exam);
    } catch {
      setError('Network error while creating examination.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!createdExam) return;
    navigator.clipboard.writeText(createdExam.exam_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  const joinUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/join/${createdExam?.exam_code}`
      : `https://samayyudh-2-0.vercel.app/join/${createdExam?.exam_code}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        className="relative w-full max-w-xl rounded-[32px] bg-white dark:bg-[#111A2E] shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.8)] p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto border-0 outline-none"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {createdExam ? 'Examination Published' : 'Create Custom Examination'}
              </h2>
              <p className="text-xs text-slate-400">
                {createdExam
                  ? 'Your unique CE code & QR join link are ready'
                  : 'Configure syllabus, supervision policies, and timing'}
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

        {/* SUCCESS STATE: CE CODE & QR DISPLAY */}
        {createdExam ? (
          <div className="py-4 text-center space-y-5">
            <div className="w-14 h-14 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Successfully Generated &amp; Scheduled
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {createdExam.title}
              </h3>
            </div>

            {/* Side-by-side CE Code + QR Code Card */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#162032] shadow-xs border-0 flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* QR Code */}
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <QRCode value={joinUrl} size={110} />
                <span className="text-[10px] text-slate-500 block mt-1.5 font-bold">Scan to Join</span>
              </div>

              {/* CE Code */}
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  Examination Access Code
                </span>

                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <span className="font-mono text-3xl font-extrabold tracking-wider text-purple-600 dark:text-purple-400">
                    {createdExam.exam_code}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center gap-1 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(joinUrl)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(createdExam.exam_code, createdExam.title, joinUrl)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                  Universal link works across Android, iOS, desktop and mobile browsers.
                </p>
              </div>
            </div>

            {/* Action to Supervision Room */}
            <button
              type="button"
              onClick={() => onCreated(createdExam)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer border-0 outline-none flex items-center justify-center gap-2"
            >
              <span>Launch Live Supervision Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* CREATION FORM WORKFLOW */
          <div className="py-4 space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            {step === 1 ? (
              /* STEP 1: BASIC DETAILS & SUBJECTS */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Examination Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Physics & Mechanics Midterm 2026"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Class / Batch
                    </label>
                    <input
                      type="text"
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      placeholder="e.g. Grade 12 Batch A"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Participant Capacity
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={10}
                        max={1000}
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration & Marks */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Duration (Minutes)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={10}
                        max={360}
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Total Marks
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={10}
                        max={1000}
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Selector Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Participating Subjects
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SUBJECTS.map((s) => {
                      const selected = selectedSubjects.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSubject(s)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-0 outline-none ${
                            selected
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!title.trim()) {
                        setError('Please provide an examination title.');
                        return;
                      }
                      setError(null);
                      setStep(2);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer border-0 outline-none flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Supervision Policies</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 2: SUPERVISION CONTROLS & SECURITY */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-[#162032] shadow-xs border-0 space-y-3">
                  {/* Webcam Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Mandatory Webcam Live Supervision
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Candidates must keep front camera active throughout
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSupervisionEnabled((prev) => !prev)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer border-0 outline-none ${
                        supervisionEnabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                          supervisionEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Negative Marking Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1D2B44] text-slate-600 dark:text-slate-300 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Negative Marking Policy
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Deduct standard 0.25 penalty on incorrect answers
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNegativeMarking((prev) => !prev)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer border-0 outline-none ${
                        negativeMarking ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                          negativeMarking ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Randomize Questions Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1D2B44] text-slate-600 dark:text-slate-300 flex items-center justify-center">
                        <Shuffle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Randomize Question Order
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Shuffle question display sequence per candidate
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRandomizeQuestions((prev) => !prev)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer border-0 outline-none ${
                        randomizeQuestions ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                          randomizeQuestions ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Candidate Instructions &amp; Conduct Rules
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-slate-100 dark:bg-[#162032] border-0 outline-none text-xs text-slate-900 dark:text-white resize-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-0 outline-none"
                  >
                    Back to Details
                  </button>

                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={submitting}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-tight shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer border-0 outline-none flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>{submitting ? 'Generating CE Code...' : 'Publish & Generate Code'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
