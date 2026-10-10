'use client';

import { useEffect, useState } from 'react';
import { 
  ShieldAlert, Activity, BookOpen, Database, 
  Plus, Search, Trash2, Edit2, CheckCircle2
} from 'lucide-react';
import { questionBank as staticQuestionBank } from '@/lib/questions';
import * as localDB from '@/lib/store/local-db';
import type { Question } from '@/types';
import { generateId, now } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalAnswers: 0,
    totalEvals: 0,
    avgScorePercent: 0,
  });

  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New Question Form State
  const [newQ, setNewQ] = useState<Partial<Question>>({
    subject: 'Computer Science',
    topic: '',
    question_text: '',
    marks: 5,
    difficulty: 'medium',
    recommended_minutes: 5,
    expected_points: [''],
    keywords: [''],
    model_answer: '',
    evaluation_rubric: '',
  });

  async function loadData() {
    setLoading(true);
    try {
      const [sessions, answers, evals, customQs] = await Promise.all([
        localDB.getAllSessions(),
        localDB.getAllAnswers(),
        localDB.getAllEvaluations(),
        localDB.getAllCustomQuestions(),
      ]);

      const totalScore = evals.reduce((sum, e) => sum + e.score, 0);
      const totalMax = evals.reduce((sum, e) => sum + e.max_score, 0);
      const avgScorePercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

      setStats({
        totalSessions: sessions.length,
        totalAnswers: answers.filter(a => a.answer_text.trim()).length,
        totalEvals: evals.length,
        avgScorePercent,
      });

      setCustomQuestions(customQs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 0);
  }, []);

  const allQuestions = [...staticQuestionBank, ...customQuestions];

  const filteredQuestions = allQuestions.filter(q => 
    searchQuery === '' || 
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!newQ.question_text || !newQ.topic || !newQ.model_answer) return;

    const fullQuestion: Question = {
      id: `custom_${generateId()}`,
      question_number: allQuestions.length + 1,
      question_text: newQ.question_text,
      subject: newQ.subject || 'Computer Science',
      topic: newQ.topic,
      marks: newQ.marks || 5,
      difficulty: (newQ.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
      recommended_minutes: newQ.recommended_minutes || 5,
      expected_points: newQ.expected_points?.filter(p => p.trim()) || [],
      keywords: newQ.keywords?.filter(k => k.trim()) || [],
      model_answer: newQ.model_answer,
      evaluation_rubric: newQ.evaluation_rubric || 'Standard marking.',
      exam_category: 'UNIVERSITY',
      exam_code: 'CUSTOM',
      question_type: newQ.marks! <= 2 ? 'short_answer' : newQ.marks! <= 5 ? 'long_answer' : 'descriptive',
      created_at: now(),
      updated_at: now(),
    };

    await localDB.saveCustomQuestion(fullQuestion);
    setCustomQuestions([...customQuestions, fullQuestion]);
    setIsAdding(false);
    setNewQ({
      subject: 'Computer Science', topic: '', question_text: '', marks: 5, difficulty: 'medium',
      recommended_minutes: 5, expected_points: [''], keywords: [''], model_answer: '', evaluation_rubric: ''
    });
  }

  async function handleDeleteCustom(id: string) {
    if (confirm('Are you sure you want to delete this custom question?')) {
      await localDB.deleteCustomQuestion(id);
      setCustomQuestions(customQuestions.filter(q => q.id !== id));
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 md:py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-brand-600" />
          Admin Dashboard
        </h1>
        <p className="text-stone-500 mt-1">Manage question bank and view system statistics</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-2xl border border-border flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-3">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{loading ? '-' : stats.totalSessions}</div>
          <div className="text-sm text-stone-500 font-medium">Total Sessions</div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <Edit2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{loading ? '-' : stats.totalAnswers}</div>
          <div className="text-sm text-stone-500 font-medium">Answers Written</div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{loading ? '-' : stats.totalEvals}</div>
          <div className="text-sm text-stone-500 font-medium">AI Evaluations</div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{loading ? '-' : `${stats.avgScorePercent}%`}</div>
          <div className="text-sm text-stone-500 font-medium">Avg Score</div>
        </div>
      </div>

      {/* Question Bank Management */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-stone-400" />
            <h2 className="text-lg font-bold">Question Bank</h2>
            <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full font-medium">
              {allQuestions.length} Total ({customQuestions.length} Custom)
            </span>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add 
            </button>
          </div>
        </div>

        {/* Add Question Form */}
        {isAdding && (
          <form onSubmit={handleAddQuestion} className="p-5 border-b border-stone-200 bg-stone-50 space-y-4">
            <h3 className="font-bold text-stone-700">Add Custom Question</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-500">Subject</label>
                <input required type="text" value={newQ.subject} onChange={e => setNewQ({...newQ, subject: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-500">Topic</label>
                <input required type="text" value={newQ.topic} onChange={e => setNewQ({...newQ, topic: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-stone-500">Question Text</label>
                <textarea required rows={2} value={newQ.question_text} onChange={e => setNewQ({...newQ, question_text: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-2 md:col-span-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">Marks</label>
                  <input required type="number" min="1" value={newQ.marks} onChange={e => setNewQ({...newQ, marks: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">Difficulty</label>
                  <select value={newQ.difficulty} onChange={e => setNewQ({...newQ, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})} className="w-full p-2 border rounded-lg text-sm bg-card">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">Time (mins)</label>
                  <input required type="number" min="1" value={newQ.recommended_minutes} onChange={e => setNewQ({...newQ, recommended_minutes: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-stone-500">Model Answer</label>
                <textarea required rows={3} value={newQ.model_answer} onChange={e => setNewQ({...newQ, model_answer: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium border rounded-lg bg-card">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700">Save Question</button>
            </div>
          </form>
        )}

        {/* Questions List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-border text-stone-500">
              <tr>
                <th className="p-4 font-semibold w-16">ID</th>
                <th className="p-4 font-semibold">Question Text</th>
                <th className="p-4 font-semibold w-32">Topic</th>
                <th className="p-4 font-semibold w-24 text-center">Marks</th>
                <th className="p-4 font-semibold w-24 text-center">Type</th>
                <th className="p-4 font-semibold w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQuestions.map((q) => {
                const isCustom = q.id.startsWith('custom_');
                return (
                  <tr key={q.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 text-xs font-mono text-stone-400">{q.id}</td>
                    <td className="p-4 font-medium max-w-md truncate" title={q.question_text}>
                      {q.question_text}
                    </td>
                    <td className="p-4 text-stone-600 truncate">{q.topic}</td>
                    <td className="p-4 text-center font-semibold">{q.marks}</td>
                    <td className="p-4 text-center">
                      {isCustom ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Custom</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-stone-100 text-stone-600 rounded-full">Static</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {isCustom ? (
                        <button 
                          onClick={() => handleDeleteCustom(q.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded"
                          title="Delete custom question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-stone-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    No questions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
