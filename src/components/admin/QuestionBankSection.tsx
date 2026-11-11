'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  Archive,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { MathText } from '@/components/pyq/MathText';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import type {
  CommandQuestion,
  ExtendedQuestionType,
  QuestionStatus,
} from '@/types/admin';

const QUESTION_TYPES: Array<{ value: ExtendedQuestionType; label: string }> = [
  { value: 'mcq', label: 'MCQ (Single)' },
  { value: 'msq', label: 'MSQ (Multi)' },
  { value: 'numerical', label: 'Numerical' },
  { value: 'integer', label: 'Integer' },
  { value: 'assertion_reason', label: 'Assertion & Reason' },
  { value: 'match_following', label: 'Match Following' },
  { value: 'true_false', label: 'True / False' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'long_answer', label: 'Long Answer' },
  { value: 'descriptive', label: 'Descriptive' },
  { value: 'diagram_based', label: 'Diagram Based' },
  { value: 'case_based', label: 'Case / Passage' },
];

const BLANK_QUESTION = (): CommandQuestion => ({
  id: '',
  question_number: 1,
  exam_category: 'ENGINEERING',
  exam_code: 'JEE-MAIN',
  subject: 'Physics',
  chapter: '',
  topic: '',
  subtopic: '',
  question_type: 'mcq',
  difficulty: 'medium',
  marks: 4,
  negative_marks: 1,
  recommended_minutes: 2,
  question_text: '',
  options: [
    { id: 'a', text: '', is_correct: true },
    { id: 'b', text: '', is_correct: false },
    { id: 'c', text: '', is_correct: false },
    { id: 'd', text: '', is_correct: false },
  ],
  correct_answer: 'a',
  model_answer: '',
  solution_steps: '',
  evaluation_rubric: '4 marks',
  expected_points: [],
  keywords: [],
  tags: [],
  status: 'draft',
  visibility: 'public',
  author_id: null,
  is_static: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

interface QuestionBankSectionProps {
  externalOpenComposer?: boolean;
  onComposerOpened?: () => void;
}

export function QuestionBankSection({
  externalOpenComposer,
  onComposerOpened,
}: QuestionBankSectionProps) {
  const [items, setItems] = useState<CommandQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [originFilter, setOriginFilter] = useState<'all' | 'database' | 'builtin'>('all');
  const [examsFacet, setExamsFacet] = useState<string[]>([]);
  const [subjectsFacet, setSubjectsFacet] = useState<string[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<CommandQuestion>(BLANK_QUESTION);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<string[] | null>(null);
  const [tagInput, setTagInput] = useState('');

  const pageSize = 15;

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        origin: originFilter,
      });
      if (search.trim()) qs.set('search', search.trim());
      if (examFilter) qs.set('exam', examFilter);
      if (subjectFilter) qs.set('subject', subjectFilter);
      if (typeFilter) qs.set('type', typeFilter);
      if (statusFilter) qs.set('status', statusFilter);

      const res = await fetch(`/api/admin/questions?${qs.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as {
          items: CommandQuestion[];
          total: number;
          facets?: { exams: string[]; subjects: string[] };
        };
        setItems(data.items || []);
        setTotal(data.total || 0);
        if (data.facets) {
          setExamsFacet(data.facets.exams);
          setSubjectsFacet(data.facets.subjects);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [page, originFilter, search, examFilter, subjectFilter, typeFilter, statusFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadQuestions();
    });
  }, [loadQuestions]);

  useEffect(() => {
    if (externalOpenComposer) {
      Promise.resolve().then(() => {
        setDraft(BLANK_QUESTION());
        setTagInput('');
        setIsEditingExisting(false);
        setEditorOpen(true);
        onComposerOpened?.();
      });
    }
  }, [externalOpenComposer, onComposerOpened]);

  function openNew() {
    setDraft(BLANK_QUESTION());
    setTagInput('');
    setIsEditingExisting(false);
    setEditorOpen(true);
  }

  function openEdit(q: CommandQuestion) {
    const cloned = JSON.parse(JSON.stringify(q)) as CommandQuestion;
    if (!cloned.options || cloned.options.length === 0) {
      cloned.options = BLANK_QUESTION().options;
    }
    setDraft(cloned);
    setTagInput((cloned.tags || []).join(', '));
    setIsEditingExisting(!q.is_static);
    setEditorOpen(true);
  }

  async function saveQuestion() {
    if (!draft.question_text.trim()) {
      setFeedback('Question statement is required.');
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const parsedTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          tags: parsedTags,
          isUpdate: isEditingExisting,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFeedback(data.error || 'Unable to save question.');
        setSaving(false);
        return;
      }
      setEditorOpen(false);
      setFeedback('Question saved successfully.');
      await loadQuestions();
    } finally {
      setSaving(false);
    }
  }

  async function runBulkAction(action: 'publish' | 'archive' | 'draft' | 'duplicate') {
    const dbIds = items
      .filter((i) => selectedIds.includes(i.id) && !i.is_static)
      .map((i) => i.id);

    if (dbIds.length === 0) {
      setFeedback('Select custom database questions for bulk updates.');
      return;
    }
    const res = await fetch('/api/admin/questions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids: dbIds }),
    });
    if (res.ok) {
      setSelectedIds([]);
      setFeedback(`Updated ${dbIds.length} question(s).`);
      await loadQuestions();
    }
  }

  async function confirmDelete() {
    if (!deleteConfirmIds || deleteConfirmIds.length === 0) return;
    const res = await fetch('/api/admin/questions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: deleteConfirmIds }),
    });
    if (res.ok) {
      setSelectedIds([]);
      setDeleteConfirmIds(null);
      setFeedback('Selected database question(s) deleted.');
      await loadQuestions();
    }
  }

  function exportSelectedJson() {
    const chosen = selectedIds.length > 0 ? items.filter((i) => selectedIds.includes(i.id)) : items;
    const blob = new Blob([JSON.stringify(chosen, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samayyudh-questions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const opts = draft.options || [];

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search question statement, topic, or tags..."
              className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] focus:bg-white dark:focus:bg-[#19263F] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportSelectedJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-[#162032] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[#EAE6F5] dark:hover:bg-[#231B3E] outline-none focus:outline-none cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6C63FF] via-[#635BFF] to-[#564AE6] hover:brightness-105 text-white text-xs sm:text-sm font-medium shadow-[0_8px_20px_-4px_rgba(99,91,255,0.45)] outline-none focus:outline-none cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Question</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <SmoothSelect
            value={examFilter}
            onChange={(val) => {
              setExamFilter(val);
              setPage(1);
            }}
            ariaLabel="Filter by Exam"
            size="sm"
            className="w-full"
            options={[
              { value: '', label: 'All Exams' },
              ...examsFacet.map((ex) => ({ value: ex, label: ex })),
            ]}
          />

          <SmoothSelect
            value={subjectFilter}
            onChange={(val) => {
              setSubjectFilter(val);
              setPage(1);
            }}
            ariaLabel="Filter by Subject"
            size="sm"
            searchPlaceholder="Search subject..."
            className="w-full"
            options={[
              { value: '', label: 'All Subjects' },
              ...subjectsFacet.map((sub) => ({ value: sub, label: sub })),
            ]}
          />

          <SmoothSelect
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setPage(1);
            }}
            ariaLabel="Filter by Question Type"
            size="sm"
            searchPlaceholder="Search type..."
            className="w-full"
            options={[
              { value: '', label: 'All Types (12)' },
              ...QUESTION_TYPES.map((t) => ({ value: t.value, label: t.label })),
            ]}
          />

          <SmoothSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            ariaLabel="Filter by Status"
            size="sm"
            className="w-full"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
              { value: 'private', label: 'Private' },
              { value: 'archived', label: 'Archived' },
            ]}
          />

          <SmoothSelect
            value={originFilter}
            onChange={(val) => {
              setOriginFilter(val as 'all' | 'database' | 'builtin');
              setPage(1);
            }}
            ariaLabel="Filter by Origin"
            size="sm"
            align="right"
            className="w-full col-span-2 sm:col-span-1"
            options={[
              { value: 'all', label: `All Sources (${total})` },
              { value: 'database', label: 'Custom DB Only' },
              { value: 'builtin', label: 'Built-in Exam Bank' },
            ]}
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#EAE6F5]/80 dark:bg-[#231B3E] px-4 py-2.5 text-xs">
            <span className="font-semibold text-[#6D28D9] dark:text-[#DDD6FE]">
              {selectedIds.length} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => runBulkAction('publish')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#111A2E] text-emerald-700 dark:text-emerald-300 font-medium cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Publish
              </button>
              <button
                type="button"
                onClick={() => runBulkAction('duplicate')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => runBulkAction('archive')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#111A2E] text-amber-700 dark:text-amber-300 font-medium cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
              <button
                type="button"
                onClick={() =>
                  setDeleteConfirmIds(
                    items.filter((i) => selectedIds.includes(i.id) && !i.is_static).map((i) => i.id)
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-600 text-white font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div className="rounded-2xl bg-stone-100 dark:bg-[#162032] px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between">
            <span>{feedback}</span>
            <button type="button" onClick={() => setFeedback(null)} className="text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 h-24 animate-pulse shadow-[0_6px_24px_-6px_rgba(88,28,135,0.04)]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] py-14 px-6 text-center text-xs text-slate-500 shadow-[0_8px_28px_-8px_rgba(88,28,135,0.06)]">
          No questions match your filters. Click Create Question to author a new item.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((q, idx) => {
            const checked = selectedIds.includes(q.id);
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.025, 0.2), ease: 'easeOut' }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl transition-all duration-200 hover:-translate-y-0.5 ${
                  checked
                    ? 'bg-[#F3F0FF] dark:bg-[#1C1A3A] shadow-[0_10px_28px_-6px_rgba(99,91,255,0.2)]'
                    : 'bg-white dark:bg-[#111A2E] shadow-[0_6px_24px_-8px_rgba(88,28,135,0.06)] dark:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] hover:shadow-[0_14px_32px_-8px_rgba(99,91,255,0.14)]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`Select question ${q.id}`}
                    onClick={() => {
                      if (checked) setSelectedIds((p) => p.filter((x) => x !== q.id));
                      else setSelectedIds((p) => [...p, q.id]);
                    }}
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 outline-none focus:outline-none cursor-pointer ${
                      checked
                        ? 'bg-gradient-to-br from-[#6C63FF] to-[#564AE6] text-white shadow-[0_4px_12px_-2px_rgba(99,91,255,0.45)]'
                        : 'bg-stone-100 dark:bg-[#162032] hover:bg-[#EAE6F5] dark:hover:bg-[#1E2A47] text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE6F5] text-[#564AE6] dark:bg-[#231B3E] dark:text-[#C4B5FD]">
                        {q.exam_code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200">
                        {q.subject}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-[#162032] text-slate-600 dark:text-slate-300 uppercase">
                        {q.question_type.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          q.status === 'published'
                            ? 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-amber-500/12 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {q.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {q.is_static ? 'Built-in Bank' : 'Custom DB'}
                      </span>
                    </div>

                    <div className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed line-clamp-2">
                      <MathText text={q.question_text} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => openEdit(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 dark:bg-[#162032] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#EAE6F5] hover:text-[#564AE6] dark:hover:bg-[#231B3E] dark:hover:text-[#DDD6FE] transition-colors cursor-pointer"
                  >
                    {q.is_static ? (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Clone to DB</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                  {!q.is_static && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmIds([q.id])}
                      aria-label="Delete question"
                      className="p-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="rounded-3xl bg-white dark:bg-[#111A2E] px-5 py-3.5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl bg-stone-100 dark:bg-[#162032] disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-xl bg-stone-100 dark:bg-[#162032] disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {editorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditorOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              className="relative z-10 w-full max-w-6xl max-h-[92vh] rounded-3xl bg-white dark:bg-[#111A2E] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-stone-50 dark:bg-[#162032]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#6D28D9] dark:text-[#C4B5FD]" />
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {isEditingExisting ? 'Edit Database Question' : 'Author New Question'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-2 rounded-xl bg-white dark:bg-[#111A2E] text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Exam</label>
                      <input
                        type="text"
                        value={draft.exam_code}
                        onChange={(e) => setDraft({ ...draft, exam_code: e.target.value })}
                        className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Subject</label>
                      <input
                        type="text"
                        value={draft.subject}
                        onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                        className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Topic</label>
                      <input
                        type="text"
                        value={draft.topic}
                        onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
                        placeholder="Thermodynamics"
                        className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Type</label>
                      <SmoothSelect
                        value={draft.question_type}
                        onChange={(v) =>
                          setDraft({ ...draft, question_type: v as ExtendedQuestionType })
                        }
                        ariaLabel="Question Type"
                        size="sm"
                        className="w-full"
                        options={QUESTION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Difficulty</label>
                      <SmoothSelect
                        value={draft.difficulty}
                        onChange={(v) =>
                          setDraft({
                            ...draft,
                            difficulty: v as 'easy' | 'medium' | 'hard',
                          })
                        }
                        ariaLabel="Difficulty"
                        size="sm"
                        className="w-full"
                        options={[
                          { value: 'easy', label: 'Easy' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'hard', label: 'Hard' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Status</label>
                      <SmoothSelect
                        value={draft.status}
                        onChange={(v) => setDraft({ ...draft, status: v as QuestionStatus })}
                        ariaLabel="Status"
                        size="sm"
                        className="w-full"
                        options={[
                          { value: 'draft', label: 'Draft' },
                          { value: 'published', label: 'Published' },
                          { value: 'private', label: 'Private' },
                          { value: 'archived', label: 'Archived' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Visibility</label>
                      <SmoothSelect
                        value={draft.visibility}
                        onChange={(v) =>
                          setDraft({
                            ...draft,
                            visibility: v as 'public' | 'classroom' | 'private',
                          })
                        }
                        ariaLabel="Visibility"
                        size="sm"
                        align="right"
                        className="w-full"
                        options={[
                          { value: 'public', label: 'Public Bank' },
                          { value: 'classroom', label: 'Classroom' },
                          { value: 'private', label: 'Private Only' },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Question Statement (LaTeX: $E = mc^2$ or $$...$$)
                    </label>
                    <textarea
                      rows={4}
                      value={draft.question_text}
                      onChange={(e) => setDraft({ ...draft, question_text: e.target.value })}
                      placeholder="Write the problem statement using clear LaTeX math..."
                      className="w-full rounded-2xl bg-stone-100 dark:bg-[#162032] focus:bg-white dark:focus:bg-[#19263F] p-3.5 text-sm text-slate-900 dark:text-white outline-none focus:outline-none focus:shadow-[0_6px_20px_-4px_rgba(99,91,255,0.22)] transition-all"
                    />
                  </div>

                  {draft.question_type !== 'numerical' &&
                    draft.question_type !== 'integer' &&
                    draft.question_type !== 'short_answer' &&
                    draft.question_type !== 'long_answer' && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-medium text-slate-500">
                          Options (select correct answers)
                        </label>
                        {opts.map((opt, idx) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <input
                              type={draft.question_type === 'msq' ? 'checkbox' : 'radio'}
                              name="correctOpt"
                              checked={opt.is_correct}
                              onChange={() => {
                                const updated = opts.map((o, i) => {
                                  if (draft.question_type === 'msq') {
                                    return i === idx ? { ...o, is_correct: !o.is_correct } : o;
                                  }
                                  return { ...o, is_correct: i === idx };
                                });
                                const correctIds = updated.filter((o) => o.is_correct).map((o) => o.id);
                                setDraft({
                                  ...draft,
                                  options: updated,
                                  correct_answer:
                                    draft.question_type === 'msq' ? correctIds : correctIds[0] || '',
                                });
                              }}
                              className="accent-[#6D28D9] cursor-pointer"
                            />
                            <span className="w-6 text-xs font-semibold text-slate-500">
                              {opt.id.toUpperCase()}.
                            </span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const nextOpts = opts.map((o, i) =>
                                  i === idx ? { ...o, text: e.target.value } : o
                                );
                                setDraft({ ...draft, options: nextOpts });
                              }}
                              placeholder={`Option ${opt.id.toUpperCase()} ($...$ supported)`}
                              className="flex-1 rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  {(draft.question_type === 'numerical' || draft.question_type === 'integer') && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Expected Numerical Answer
                      </label>
                      <input
                        type="text"
                        value={
                          typeof draft.correct_answer === 'string' ? draft.correct_answer : ''
                        }
                        onChange={(e) => setDraft({ ...draft, correct_answer: e.target.value })}
                        placeholder="e.g. 9.81"
                        className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Marks</label>
                      <input
                        type="number"
                        value={draft.marks}
                        onChange={(e) => setDraft({ ...draft, marks: Number(e.target.value || 0) })}
                        className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Negative Marks
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={draft.negative_marks}
                        onChange={(e) =>
                          setDraft({ ...draft, negative_marks: Number(e.target.value || 0) })
                        }
                        className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Tags (comma-sep)
                      </label>
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="PYQ, Mechanics"
                        className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Step-by-step Solution / Model Answer (LaTeX supported)
                    </label>
                    <textarea
                      rows={3}
                      value={draft.solution_steps || draft.model_answer}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          solution_steps: e.target.value,
                          model_answer: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl bg-stone-100 dark:bg-[#162032] p-3 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live Student Exam-Scale Preview */}
                <div className="rounded-3xl bg-stone-50/90 dark:bg-[#162032] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28D9] dark:text-[#C4B5FD]">
                        <Eye className="w-3.5 h-3.5" />
                        Live Exam-Scale Preview
                      </span>
                      <span className="text-[11px] text-slate-500">
                        +{draft.marks} / -{draft.negative_marks} marks
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white dark:bg-[#111A2E] p-6 shadow-sm space-y-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EAE6F5] dark:bg-[#231B3E] text-[#6D28D9] dark:text-[#C4B5FD] font-semibold">
                          {draft.exam_code}
                        </span>
                        <span className="text-slate-500">{draft.subject}</span>
                        {draft.topic && <span className="text-slate-400">· {draft.topic}</span>}
                      </div>

                      <div className="text-[17px] leading-[1.68] text-slate-900 dark:text-slate-50 font-normal max-w-[75ch]">
                        {draft.question_text ? (
                          <MathText text={draft.question_text} />
                        ) : (
                          <span className="text-slate-400 italic">
                            Question preview renders here at crisp 17px exam scale...
                          </span>
                        )}
                      </div>

                      {opts.length > 0 &&
                        draft.question_type !== 'numerical' &&
                        draft.question_type !== 'integer' && (
                          <div className="space-y-2.5 pt-2">
                            {opts.map((opt) => (
                              <div
                                key={opt.id}
                                className={`flex items-start gap-3 p-3.5 rounded-2xl text-[15px] leading-[1.6] ${
                                  opt.is_correct
                                    ? 'bg-[#EAE6F5]/80 dark:bg-[#231B3E] text-slate-900 dark:text-white'
                                    : 'bg-stone-50 dark:bg-[#162032] text-slate-700 dark:text-slate-200'
                                }`}
                              >
                                <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#111A2E] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                  {opt.id.toUpperCase()}
                                </span>
                                <div className="flex-1 min-w-0">
                                  {opt.text ? (
                                    <MathText text={opt.text} />
                                  ) : (
                                    <span className="text-slate-400 italic">Empty option</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      {(draft.solution_steps || draft.model_answer) && (
                        <div className="rounded-2xl bg-stone-50 dark:bg-[#162032] p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            Solution Preview
                          </p>
                          <MathText text={draft.solution_steps || draft.model_answer} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditorOpen(false)}
                      className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#111A2E] text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={saveQuestion}
                      className="px-5 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-medium shadow-[0_6px_18px_-4px_rgba(109,40,217,0.45)] cursor-pointer"
                    >
                      {saving ? 'Saving...' : isEditingExisting ? 'Update Question' : 'Save Question'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {deleteConfirmIds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Delete {deleteConfirmIds.length} Question(s)?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This permanently removes the selected database question(s) and logs an audit entry. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmIds(null)}
                className="px-4 py-2 rounded-2xl bg-stone-100 dark:bg-[#162032] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-2xl bg-rose-600 text-white text-xs font-semibold cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
