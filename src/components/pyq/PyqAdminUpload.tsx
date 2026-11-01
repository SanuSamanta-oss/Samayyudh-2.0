'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, CheckCircle2, AlertCircle,
  RefreshCw, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ImportStatus =
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'done'
  | 'error';

interface ImportResult {
  savedFiles: string[];
  summary: {
    totalPapers: number | null;
    newPapers: number | null;
    totalQuestions: number | null;
    newQuestions: number | null;
  };
  log: string;
}

export function PyqAdminUpload({ onComplete }: { onComplete?: () => void }) {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const statusLabels: Record<ImportStatus, string> = {
    idle: 'Ready to Upload',
    uploading: 'Uploading PDFs...',
    processing: 'Extracting Questions...',
    done: 'Successfully Imported',
    error: 'Import Failed',
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const pdfs = Array.from(files).filter((f) => f.name.toLowerCase().endsWith('.pdf'));
    setSelectedFiles(pdfs);
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    setStatus('uploading');
    setError(null);
    setResult(null);

    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append('files', f));

    try {
      setStatus('processing');
      const res = await fetch('/api/pyq/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data);
      setStatus('done');
      setSelectedFiles([]);
      onComplete?.();
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          dragOver
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
            : 'border-stone-300 dark:border-stone-700 hover:border-brand-400 hover:bg-stone-50 dark:hover:bg-stone-900/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-8 h-8 mx-auto text-stone-400 mb-2" />
        <p className="text-sm font-semibold text-foreground">
          Drop JEE Main PDF files here or click to browse
        </p>
        <p className="text-xs text-stone-500 mt-1">
          Supports multiple PDFs — automatically identifies date, shift and subject sections
        </p>
      </div>

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {selectedFiles.length} PDF{selectedFiles.length > 1 ? 's' : ''} selected
          </p>
          {selectedFiles.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-xs"
            >
              <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="flex-1 min-w-0 truncate text-foreground">{f.name}</span>
              <span className="text-stone-400 shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFiles((prev) => prev.filter((sf) => sf.name !== f.name));
                }}
                className="text-stone-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      {selectedFiles.length > 0 && status !== 'done' && (
        <button
          onClick={handleSubmit}
          disabled={status === 'uploading' || status === 'processing'}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {(status === 'uploading' || status === 'processing') ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              {statusLabels[status]}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Import {selectedFiles.length} PDF{selectedFiles.length > 1 ? 's' : ''}
            </>
          )}
        </button>
      )}

      {/* Result */}
      <AnimatePresence>
        {status === 'done' && result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 space-y-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Import Complete</p>
            </div>
            {result.summary.newPapers !== null && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 bg-white/50 dark:bg-black/20">
                  <p className="font-bold text-foreground text-sm">{result.summary.totalPapers}</p>
                  <p className="text-stone-500">Total Papers</p>
                </div>
                <div className="p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 bg-white/50 dark:bg-black/20">
                  <p className="font-bold text-foreground text-sm">{result.summary.totalQuestions}</p>
                  <p className="text-stone-500">Total Questions</p>
                </div>
                <div className="p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 bg-white/50 dark:bg-black/20">
                  <p className="font-bold text-emerald-600 text-sm">+{result.summary.newPapers}</p>
                  <p className="text-stone-500">New Papers</p>
                </div>
                <div className="p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 bg-white/50 dark:bg-black/20">
                  <p className="font-bold text-emerald-600 text-sm">+{result.summary.newQuestions}</p>
                  <p className="text-stone-500">New Questions</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowLog((s) => !s)}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 cursor-pointer"
            >
              {showLog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showLog ? 'Hide' : 'Show'} extraction log
            </button>
            {showLog && (
              <pre className="text-[10px] text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-40">
                {result.log}
              </pre>
            )}
          </motion.div>
        )}

        {status === 'error' && error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-400">Import Failed</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policy reminder */}
      <div className="px-3 py-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20">
        <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Strict Zero-Fake-PYQ Policy</p>
        <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
          Only actual examination questions and options are imported. Answers, solutions, publisher notes, watermarks and headers are never stored.
        </p>
      </div>
    </div>
  );
}

