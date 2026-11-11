'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Sparkles,
  Eye,
  Trash2,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  X,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { MathText } from '@/components/pyq/MathText';
import { SmoothSelect } from '@/components/ui/SmoothSelect';
import type {
  ClassroomItem,
  ExtractedPdfQuestionDraft,
  ResourceCategory,
  ResourceItem,
  ResourceVisibility,
  StudentGroupItem,
} from '@/types/admin';

interface ResourceLibrarySectionProps {
  classrooms: ClassroomItem[];
  groups: StudentGroupItem[];
  externalOpenUpload?: boolean;
  onUploadOpened?: () => void;
}

const CATEGORIES: Array<{ value: ResourceCategory; label: string }> = [
  { value: 'reference_pdf', label: 'Reference PDF' },
  { value: 'pyq_paper', label: 'PYQ Paper' },
  { value: 'mcq_sheet', label: 'MCQ Question Sheet' },
  { value: 'assignment', label: 'Assignment Doc' },
  { value: 'cheat_sheet', label: 'Cheat Sheet' },
  { value: 'formula_sheet', label: 'Formula Sheet' },
  { value: 'study_notes', label: 'Study Notes' },
  { value: 'practice_worksheet', label: 'Practice Worksheet' },
  { value: 'solutions', label: 'Solutions Pack' },
  { value: 'other', label: 'CSV / XLSX / Other' },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ResourceLibrarySection({
  classrooms,
  groups,
  externalOpenUpload,
  onUploadOpened,
}: ResourceLibrarySectionProps) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('reference_pdf');
  const [subject, setSubject] = useState('Physics');
  const [examCode, setExamCode] = useState('JEE-MAIN');
  const [visibility, setVisibility] = useState<ResourceVisibility>('classroom');
  const [classroomId, setClassroomId] = useState('');
  const [groupId, setGroupId] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [viewingResource, setViewingResource] = useState<ResourceItem | null>(null);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [fullscreenViewer, setFullscreenViewer] = useState(false);

  const [extractingId, setExtractingId] = useState<string | null>(null);
  const [extractedDrafts, setExtractedDrafts] = useState<ExtractedPdfQuestionDraft[]>([]);
  const [extractMeta, setExtractMeta] = useState<{
    title: string;
    resourceId: string;
    usedAi: boolean;
    pageCount: number;
  } | null>(null);
  const [importingDrafts, setImportingDrafts] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search.trim()) qs.set('search', search.trim());
      if (categoryFilter) qs.set('category', categoryFilter);
      const res = await fetch(`/api/admin/resources?${qs.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as { items?: ResourceItem[] };
        setItems(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadResources();
    });
  }, [loadResources]);

  useEffect(() => {
    if (externalOpenUpload) {
      Promise.resolve().then(() => {
        setUploadModalOpen(true);
        onUploadOpened?.();
      });
    }
  }, [externalOpenUpload, onUploadOpened]);

  function handleFileChosen(file: File | undefined) {
    if (!file) return;
    setSelectedFile(file);
    setUploadError(null);
    if (!title) {
      setTitle(file.name.replace(/\.[^.]+$/, ''));
    }
  }

  function startUpload() {
    if (!selectedFile || uploading) return;
    setUploading(true);
    setUploadProgress(5);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title || selectedFile.name);
    formData.append('category', category);
    formData.append('subject', subject);
    formData.append('exam_code', examCode);
    formData.append('visibility', visibility);
    if (visibility === 'classroom' && classroomId) formData.append('classroomId', classroomId);
    if (visibility === 'group' && groupId) formData.append('groupId', groupId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/resources');

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setUploadProgress(Math.round((ev.loaded / ev.total) * 90));
      }
    };

    xhr.onload = async () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        setSelectedFile(null);
        setTitle('');
        setUploadModalOpen(false);
        setStatusMessage('Resource uploaded securely to private storage.');
        await loadResources();
      } else {
        try {
          const parsed = JSON.parse(xhr.responseText) as { error?: string };
          setUploadError(parsed.error || 'Upload failed.');
        } catch {
          setUploadError('Upload failed.');
        }
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setUploadError('Network interruption during upload. Click Upload to retry.');
    };

    xhr.send(formData);
  }

  async function deleteResource(id: string) {
    const res = await fetch('/api/admin/resources', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setStatusMessage('Resource removed from library and storage.');
      await loadResources();
    }
  }

  async function extractQuestionsFromResource(resource: ResourceItem) {
    setExtractingId(resource.id);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/extract-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          exam: resource.exam_code || 'JEE-MAIN',
          subject: resource.subject || 'Physics',
          useAi: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        drafts?: ExtractedPdfQuestionDraft[];
        usedAi?: boolean;
        pageCount?: number;
      };

      if (!res.ok || !data.drafts) {
        setStatusMessage(data.error || 'PDF extraction returned no questions.');
        return;
      }

      setExtractedDrafts(data.drafts);
      setExtractMeta({
        title: resource.title,
        resourceId: resource.id,
        usedAi: Boolean(data.usedAi),
        pageCount: data.pageCount || 0,
      });
    } finally {
      setExtractingId(null);
    }
  }

  async function importSelectedDrafts() {
    const chosen = extractedDrafts.filter((d) => d.selected && d.question_text.trim());
    if (chosen.length === 0) return;

    setImportingDrafts(true);
    let importedCount = 0;

    try {
      for (const draft of chosen) {
        const res = await fetch('/api/admin/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exam_code: draft.exam_code,
            subject: draft.subject,
            topic: draft.topic,
            question_type: draft.question_type,
            difficulty: draft.difficulty,
            marks: draft.marks,
            negative_marks: draft.negative_marks ?? 1,
            question_text: draft.question_text,
            options: draft.options,
            correct_answer: draft.correct_answer,
            model_answer: draft.model_answer,
            solution_steps: draft.model_answer,
            status: 'draft',
            visibility: 'private',
          }),
        });
        if (res.ok) importedCount += 1;
      }

      setExtractMeta(null);
      setExtractedDrafts([]);
      setStatusMessage(
        `Imported ${importedCount} question(s) to Question Bank as Drafts for review.`
      );
    } finally {
      setImportingDrafts(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter PDFs, MCQ sheets, notes, datasets..."
              className="w-full rounded-2xl bg-stone-100/90 dark:bg-[#162032] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <SmoothSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            ariaLabel="Filter resource type"
            className="min-w-[180px]"
            options={[
              { value: '', label: 'All Resource Types' },
              ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
            ]}
          />
        </div>

        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-medium shadow-[0_6px_18px_-4px_rgba(109,40,217,0.4)] cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </div>

      {statusMessage && (
        <div className="rounded-2xl bg-[#EAE6F5]/80 dark:bg-[#231B3E] px-4 py-3 text-xs font-medium text-[#6D28D9] dark:text-[#DDD6FE] flex items-center justify-between">
          <span>{statusMessage}</span>
          <button type="button" onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 h-44 animate-pulse shadow-[0_6px_24px_-6px_rgba(88,28,135,0.04)]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] py-14 px-6 text-center shadow-[0_8px_28px_-8px_rgba(88,28,135,0.06)] space-y-2.5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#635BFF] dark:text-[#C4B5FD] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Resource Library is Empty
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Upload PDF question papers, DOCX sheets, cheat sheets, or CSV datasets to share with classrooms or extract structured questions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((res, idx) => {
            const isPdf =
              res.mime_type?.includes('pdf') || res.file_name.toLowerCase().endsWith('.pdf');
            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.24), ease: 'easeOut' }}
                className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 flex flex-col justify-between gap-4 shadow-[0_6px_24px_-8px_rgba(88,28,135,0.06)] dark:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(99,91,255,0.14)] transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#564AE6] dark:text-[#C4B5FD] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-200 capitalize">
                      {res.visibility}
                    </span>
                  </div>

                  <h3 className="mt-3.5 text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {res.file_name} · {formatBytes(res.file_size || 0)}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {res.subject && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300">
                        {res.subject}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE6F5] dark:bg-[#231B3E] text-[#564AE6] dark:text-[#C4B5FD] capitalize">
                      {res.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {isPdf && res.signed_url && (
                    <button
                      type="button"
                      onClick={() => {
                        setViewingResource(res);
                        setZoomPercent(100);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-stone-100 dark:bg-[#162032] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#EAE6F5] hover:text-[#564AE6] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                  )}

                  {isPdf && (
                    <button
                      type="button"
                      disabled={extractingId === res.id}
                      onClick={() => extractQuestionsFromResource(res)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-xs font-semibold text-[#564AE6] dark:text-[#C4B5FD] cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {extractingId === res.id ? 'Extracting...' : 'Extract Questions'}
                      </span>
                    </button>
                  )}

                  {res.signed_url && (
                    <a
                      href={res.signed_url}
                      download={res.file_name}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-2xl bg-stone-100 dark:bg-[#162032] text-slate-600 dark:text-slate-300 hover:text-[#564AE6] transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteResource(res.id)}
                    className="p-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 ml-auto transition-colors cursor-pointer"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setUploadModalOpen(false)}
              className="fixed inset-0 bg-slate-950/55 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              className="relative z-10 w-full max-w-xl rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Upload Educational Resource
                </h3>
                <button
                  type="button"
                  onClick={() => !uploading && setUploadModalOpen(false)}
                  className="p-1.5 rounded-xl bg-stone-100 dark:bg-[#162032] text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFileChosen(e.dataTransfer.files?.[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-3xl p-7 text-center cursor-pointer transition-colors ${
                  dragging
                    ? 'bg-[#EAE6F5] dark:bg-[#231B3E]'
                    : 'bg-stone-100/80 dark:bg-[#162032] hover:bg-[#EAE6F5]/50 dark:hover:bg-[#1E2A45]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.csv,.xlsx,.xls"
                  onChange={(e) => handleFileChosen(e.target.files?.[0])}
                  className="hidden"
                />
                <UploadCloud className="w-9 h-9 mx-auto text-[#6D28D9] dark:text-[#C4B5FD] mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatBytes(selectedFile.size)} · Click to choose another file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Drag and drop PDF, DOCX, Images, CSV, or XLSX
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Max file size 25 MB · Stored encrypted in Supabase</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="JEE Main 2026 Electrostatics PYQ Sheet"
                    className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Category</label>
                  <SmoothSelect
                    value={category}
                    onChange={(v) => setCategory(v as ResourceCategory)}
                    ariaLabel="Category"
                    size="sm"
                    className="w-full"
                    options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Exam Code</label>
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    className="w-full rounded-xl bg-stone-100 dark:bg-[#162032] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Visibility</label>
                  <SmoothSelect
                    value={visibility}
                    onChange={(v) => setVisibility(v as ResourceVisibility)}
                    ariaLabel="Visibility"
                    size="sm"
                    align="right"
                    className="w-full"
                    options={[
                      { value: 'personal', label: 'Personal Library' },
                      { value: 'classroom', label: 'Specific Classroom' },
                      { value: 'group', label: 'Private Student Group' },
                      { value: 'public', label: 'Public Students' },
                    ]}
                  />
                </div>
              </div>

              {visibility === 'classroom' && classrooms.length > 0 && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Target Classroom</label>
                  <SmoothSelect
                    value={classroomId}
                    onChange={setClassroomId}
                    ariaLabel="Target Classroom"
                    size="sm"
                    className="w-full"
                    options={[
                      { value: '', label: 'Select classroom...' },
                      ...classrooms.map((c) => ({ value: c.id, label: c.name })),
                    ]}
                  />
                </div>
              )}

              {visibility === 'group' && groups.length > 0 && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Target Group</label>
                  <SmoothSelect
                    value={groupId}
                    onChange={setGroupId}
                    ariaLabel="Target Group"
                    size="sm"
                    className="w-full"
                    options={[
                      { value: '', label: 'Select student group...' },
                      ...groups.map((g) => ({ value: g.id, label: g.name })),
                    ]}
                  />
                </div>
              )}

              {uploading && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-[#162032] overflow-hidden">
                    <div
                      className="h-full bg-[#6D28D9] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-right">{uploadProgress}%</p>
                </div>
              )}

              {uploadError && (
                <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-stone-100 dark:bg-[#162032] text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFile || uploading}
                  onClick={startUpload}
                  className="px-5 py-2 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-45 text-white text-xs font-semibold cursor-pointer"
                >
                  {uploading ? 'Uploading...' : 'Upload Resource'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {viewingResource && viewingResource.signed_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
          <div
            className={`rounded-3xl bg-white dark:bg-[#111A2E] shadow-2xl flex flex-col overflow-hidden transition-all ${
              fullscreenViewer ? 'w-full h-full' : 'w-full max-w-5xl h-[88vh]'
            }`}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-stone-50 dark:bg-[#162032]">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {viewingResource.title}
                </h3>
                <p className="text-[11px] text-slate-500 truncate">{viewingResource.file_name}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomPercent((z) => Math.max(75, z - 25))}
                  aria-label="Zoom out"
                  className="p-2 rounded-xl bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                  {zoomPercent}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomPercent((z) => Math.min(200, z + 25))}
                  aria-label="Zoom in"
                  className="p-2 rounded-xl bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenViewer((f) => !f)}
                  aria-label="Toggle fullscreen"
                  className="p-2 rounded-xl bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {fullscreenViewer ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={viewingResource.signed_url}
                  download={viewingResource.file_name}
                  className="p-2 rounded-xl bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-300"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setViewingResource(null)}
                  className="p-2 rounded-xl bg-white dark:bg-[#111A2E] text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-stone-100 dark:bg-[#0B1120] overflow-auto flex justify-center p-4">
              <iframe
                src={`${viewingResource.signed_url}#zoom=${zoomPercent}`}
                title={viewingResource.title}
                className="w-full h-full rounded-2xl bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {extractMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/65 backdrop-blur-xs">
          <div className="w-full max-w-5xl max-h-[90vh] rounded-3xl bg-white dark:bg-[#111A2E] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-6 py-4 bg-stone-50 dark:bg-[#162032]">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6D28D9]" />
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    Review Extracted Drafts — {extractMeta.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Parsed {extractMeta.pageCount} page(s) via{' '}
                  {extractMeta.usedAi ? 'Gemini LaTeX Extractor' : 'Heuristic PDF Parser'}. Items import strictly as Drafts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExtractMeta(null)}
                className="p-2 rounded-xl bg-white dark:bg-[#111A2E] text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {extractedDrafts.map((d, idx) => (
                <div
                  key={d.temp_id}
                  className="rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExtractedDrafts((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, selected: !x.selected } : x))
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      {d.selected ? (
                        <CheckSquare className="w-4 h-4 text-[#6D28D9]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Draft #{idx + 1}</span>
                    </button>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                      Needs Faculty Review · {Math.round((d.confidence || 0.5) * 100)}% conf.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <textarea
                      rows={3}
                      value={d.question_text}
                      onChange={(e) =>
                        setExtractedDrafts((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, question_text: e.target.value } : x
                          )
                        )
                      }
                      className="w-full rounded-xl bg-white dark:bg-[#111A2E] p-3 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <div className="rounded-xl bg-white dark:bg-[#111A2E] p-3 text-sm text-slate-900 dark:text-slate-100">
                      <MathText text={d.question_text} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-stone-50 dark:bg-[#162032] flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {extractedDrafts.filter((d) => d.selected).length} of {extractedDrafts.length} selected for Draft import
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExtractMeta(null)}
                  className="px-4 py-2 rounded-2xl bg-white dark:bg-[#111A2E] text-xs font-medium cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={importingDrafts || extractedDrafts.filter((d) => d.selected).length === 0}
                  onClick={importSelectedDrafts}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{importingDrafts ? 'Importing...' : 'Import as Drafts'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
