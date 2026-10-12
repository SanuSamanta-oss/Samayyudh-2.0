'use client';

// ============================================================
// SamayYudh 2.0 — Interactive Assistant Floating Tab
// Inspired by Photo 1 reference (Apple Intelligence / Siri style)
// Features luminous fluid light orb, "Hello [User] / How can I help you today?",
// platform-focused guidance, light/dark theme support, and compact 3D floating bot.
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Trash2, Send, Square, Globe, Sparkles, ExternalLink,
  ChevronDown, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { SokhaOrb } from './SokhaOrb';
import { SokhaBotCharacter } from './SokhaBotCharacter';
import { SokhaMarkdown } from './SokhaMarkdown';
import {
  SokhaMessage,
  SokhaThread,
  SAMAYYUDH_QUICK_PROMPTS,
} from '@/lib/sokha/types';
import {
  loadThreads,
  saveThreads,
  createNewThread,
} from '@/lib/sokha/storage';
import { cn } from '@/lib/utils';

export function SokhaWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Hide during active exams to maintain exam integrity
  const isExamSession = pathname?.startsWith('/exam/') && pathname !== '/exams';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SokhaMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const rawName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0] : '') ||
    'Student';

  const displayName = rawName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || 'Student';

  // Initialize conversation thread from local storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const threads = loadThreads(user?.id);
    if (threads.length > 0 && threads[0].messages.length > 0) {
      setMessages(threads[0].messages);
    } else {
      setMessages([]);
    }
  }, [user?.id]);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length === 0) return;
    const currentThreads = loadThreads(user?.id);
    const activeThread: SokhaThread = currentThreads[0] || createNewThread();
    activeThread.messages = messages;
    activeThread.updatedAt = Date.now();
    saveThreads([activeThread, ...currentThreads.slice(1)], user?.id);
  }, [messages, user?.id]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isStreaming) return;

    setErrorMessage(null);
    setInputText('');

    const userMsgId = `user_${Date.now()}`;
    const botMsgId = `bot_${Date.now()}`;

    const newHistory: SokhaMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        content: query,
        timestamp: Date.now(),
      },
    ];

    const botMessage: SokhaMessage = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages([...newHistory, botMessage]);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const historyPayload = newHistory
        .slice(-8)
        .map((m) => ({
          role: (m.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
          content: m.content,
        }));

      const res = await fetch('/api/sokha/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userName: displayName,
          history: historyPayload.slice(0, -1),
          enableWebSearch,
        }),
        signal: abortController.signal,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const userNotice =
          errJson.message ||
          'I am SOKHA, your academic study companion for সময়যুদ্ধ 2.0. No NSFW or inappropriate conversations are entertained. Please keep all questions focused on your studies, exams, and syllabus preparation.';

        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, content: userNotice, isError: false } : m))
        );
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Streaming not supported.');

      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const event = JSON.parse(dataStr);
              if (event.type === 'chunk') {
                accumulatedText += event.text;
                setMessages((prev) =>
                  prev.map((m) => (m.id === botMsgId ? { ...m, content: accumulatedText } : m))
                );
              } else if (event.type === 'metadata') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsgId
                      ? {
                          ...m,
                          sources: event.sources,
                          redactedTypes: event.redactedTypes,
                        }
                      : m
                  )
                );
              } else if (event.type === 'error') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsgId
                      ? {
                          ...m,
                          content: event.message || m.content || 'Unable to complete response.',
                          isError: true,
                        }
                      : m
                  )
                );
              }
            } catch (pErr) {
              // Ignore single malformed SSE chunk
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const userErr = err?.message || 'I encountered an issue connecting to the assistant. Please try again.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                ...m,
                content:
                  m.content ||
                  userErr,
                isError: true,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setErrorMessage(null);
  };

  const handlePromptClick = (promptItem: typeof SAMAYYUDH_QUICK_PROMPTS[0]) => {
    if (promptItem.routeHref) {
      setIsOpen(false);
      router.push(promptItem.routeHref);
    } else {
      handleSendMessage(promptItem.prompt);
    }
  };

  // If in active exam, hide widget to preserve exam integrity
  if (isExamSession) return null;

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ── Compact Floating Bot (Lifted above mobile bottom navigation) ──── */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(true)}
            className="relative cursor-pointer flex items-center justify-center"
            aria-label="Open SamayYudh Assistant"
          >
            {/* Compact Floating Bot model */}
            <SokhaBotCharacter
              size="sm"
              showGreeting={true}
              greetingText="👋 Need help?"
            />
          </motion.div>
        )}
      </div>

      {/* ── Floating Tab Window (Exact Match to Reference Photo 1) ────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn(
              'fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col overflow-hidden',
              'w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100dvh-6.5rem)] sm:max-h-[85vh]',
              'rounded-[2.5rem] backdrop-blur-2xl transition-all duration-300',
              // Pristine white theme without dark-mode outline strokes
              'bg-white/98 text-stone-900 shadow-[0_25px_70px_rgba(0,0,0,0.16),0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04]'
            )}
          >
            {/* Top Navigation & Controls (No harsh borders) */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                  সময়যুদ্ধ Assistant
                </span>
              </div>

              <div className="flex items-center gap-1">
                {hasMessages && (
                  <button
                    type="button"
                    onClick={handleClearConversation}
                    className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    title="Clear conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Main Tab Content Area ────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col scrollbar-thin">
              {/* Reference Photo 1 Hero Greeting State (Visible when starting or scrollable) */}
              {!hasMessages ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center my-auto px-2">
                  {/* Swirling Luminous Moving Gaseous Circular Body */}
                  <div className="my-3">
                    <SokhaOrb size="md" isThinking={isStreaming} />
                  </div>

                  {/* Subtitle & Title matching Photo 1 */}
                  <p className="text-xs sm:text-sm font-medium text-stone-500 mb-1">
                    Hello {displayName}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mb-6">
                    How can I help<br />you today?
                  </h2>

                  {/* Quick Action Suggestions to use the app prominently (Smooth borderless cards) */}
                  <div className="w-full space-y-2 mt-1">
                    {SAMAYYUDH_QUICK_PROMPTS.slice(0, 4).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePromptClick(item)}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-medium transition-all group cursor-pointer',
                          'bg-[#F5F6FA] hover:bg-[#ECEEF6] text-stone-800 shadow-xs hover:shadow-sm'
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-sm p-1 rounded-lg bg-purple-100 text-purple-700">
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.routeHref ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-purple-600 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                        ) : (
                          <span className="text-[10px] text-stone-400 shrink-0">Ask</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Conversation View */
                <div className="space-y-4 py-2">
                  {/* Mini Orb Banner */}
                  <div className="flex items-center justify-center gap-2 py-1 text-xs text-stone-400">
                    <SokhaOrb size="sm" isThinking={isStreaming} />
                    <span className="text-[11px] font-semibold text-purple-600">
                      SamayYudh AI Companion
                    </span>
                  </div>

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-2.5',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] text-sm leading-relaxed transition-all',
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[1.75rem] rounded-br-md px-5 py-3 shadow-[0_4px_16px_rgba(124,58,237,0.22)]'
                            : 'bg-[#F2F4F8] text-stone-800 rounded-[1.75rem] rounded-tl-md px-5 py-3.5 shadow-xs'
                        )}
                      >
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : msg.content ? (
                          <SokhaMarkdown content={msg.content} sources={msg.sources} />
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-purple-600 py-1">
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                            <span>Finding answer…</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="my-2 p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs shadow-xs">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* ── Smooth Bubble Text Box (No black outline, smooth pill design) ── */}
            <div className="p-4 pt-2 bg-white/90 backdrop-blur-md">
              <div
                className="relative flex items-center justify-between rounded-full px-5 py-3 bg-[#EEF1F7] hover:bg-[#E8ECF4] focus-within:bg-[#EEF1F7] shadow-xs focus-within:shadow-[0_4px_20px_rgba(124,58,237,0.12)] transition-all duration-200"
                style={{ outline: 'none' }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 pr-3"
                  style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                />

                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors shrink-0"
                    title="Stop"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : inputText.trim() ? (
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 text-white transition-all shadow-sm shrink-0"
                    title="Send"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  /* Audio-wave visual indicator matching Photo 1 */
                  <div className="flex items-center gap-1 text-purple-400/80 shrink-0 px-1">
                    <span className="w-0.5 h-2 rounded-full bg-current animate-pulse" />
                    <span className="w-0.5 h-3.5 rounded-full bg-current animate-pulse delay-75" />
                    <span className="w-0.5 h-5 rounded-full bg-current animate-pulse delay-150" />
                    <span className="w-0.5 h-3 rounded-full bg-current animate-pulse delay-100" />
                    <span className="w-0.5 h-1.5 rounded-full bg-current animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
