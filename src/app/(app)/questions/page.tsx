'use client';
import { Library, Search } from 'lucide-react';
import { questionBank } from '@/lib/questions';
import * as localDB from '@/lib/store/local-db';
import type { Question } from '@/types';
import { useState, useEffect } from 'react';
import { cn, formatMathText } from '@/lib/utils';

export default function QuestionsPage() {
  const [search, setSearch] = useState('');
  const [filterMarks, setFilterMarks] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  useEffect(() => {
    localDB.getAllCustomQuestions().then(setCustomQuestions).catch(console.error);
  }, []);

  const allQuestions = [...questionBank, ...customQuestions];

  const filtered = allQuestions.filter((q) => {
    if (search && !q.question_text.toLowerCase().includes(search.toLowerCase()) && !q.topic.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterMarks && q.marks !== filterMarks) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Question Bank</h1>
        <p className="text-stone-500 mt-1">{allQuestions.length} questions available</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <div className="flex gap-2">
          {[2, 5, 10].map((m) => (
            <button key={m} onClick={() => setFilterMarks(filterMarks === m ? null : m)}
              className={cn('px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                filterMarks === m ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border bg-card text-stone-600 hover:bg-stone-50'
              )}>
              {m} marks
            </button>
          ))}
          {['easy', 'medium', 'hard'].map((d) => (
            <button key={d} onClick={() => setFilterDifficulty(filterDifficulty === d ? null : d)}
              className={cn('px-3 py-2 rounded-lg text-sm font-medium border transition-colors capitalize',
                filterDifficulty === d ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border bg-card text-stone-600 hover:bg-stone-50'
              )}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.slice(0, 30).map((q) => (
          <div key={q.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <span className="text-xs font-mono text-stone-400 mt-0.5 shrink-0">
                {q.id.startsWith('custom_') ? 'Custom' : `Q${q.question_number}`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{formatMathText(q.question_text)}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{q.marks} marks</span>
                  <span className="text-xs text-stone-500">{q.topic}</span>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                    q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  )}>{q.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length > 30 && (
          <p className="text-center text-sm text-stone-500 py-4">Showing 30 of {filtered.length} questions</p>
        )}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Library className="w-10 h-10 mx-auto text-stone-300 mb-3" />
            <p className="text-sm text-stone-500">No questions match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
