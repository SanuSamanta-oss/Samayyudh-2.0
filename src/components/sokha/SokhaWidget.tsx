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
  ChevronDown, Mic, MicOff, Volume2, VolumeX,
  History, Plus, Clock, MessageSquare, ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { SokhaChakra } from './SokhaChakra';
import { SokhaBotCharacter } from './SokhaBotCharacter';
import { SokhaMarkdown } from './SokhaMarkdown';
import {
  SokhaMessage,
  SokhaThread,
  WARRIOR_MANTRAS,
} from '@/lib/sokha/types';
import {
  loadThreads,
  saveThreads,
  createNewThread,
  clearAllThreads,
  clearCurrentThread,
  deleteThreadById,
  getActiveThreadId,
  setActiveThreadId,
  saveCurrentThread,
  deleteMessageFromStorage,
} from '@/lib/sokha/storage';
import { cn } from '@/lib/utils';

export function SokhaWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Hide during active exams to maintain exam integrity, and on settings page where timeline action buttons reside
  const isExamSession = pathname?.startsWith('/exam/') && pathname !== '/exams';
  const isSettingsPage = pathname === '/settings' || pathname?.startsWith('/settings/');

  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'history'>('chat');
  const [threads, setThreads] = useState<SokhaThread[]>([]);
  const [activeThreadId, setActiveThreadIdState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getActiveThreadId() || `thread_${Date.now()}`;
    }
    return `thread_${Date.now()}`;
  });
  const [messages, setMessages] = useState<SokhaMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Custom Chat History Deletion State (Permanent Delete Confirmation) ──
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteScope, setDeleteScope] = useState<'all' | 'current' | 'single_thread'>('all');
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [deleteFeedback, setDeleteFeedback] = useState<string | null>(null);
  const [totalSavedThreads, setTotalSavedThreads] = useState<number>(0);

  // ── Voice Input & Output (Limit up to 3 voice answers) ──
  const [isListening, setIsListening] = useState(false);
  const [voiceAnswersCount, setVoiceAnswersCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sokha_voice_answers_count');
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // ── Daily Motivational Warrior Mantra State ──
  const [mantraIndex, setMantraIndex] = useState(0);
  const handleNextMantra = () => {
    setMantraIndex((prev) => (prev + 1) % WARRIOR_MANTRAS.length);
  };

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

  // Helper for human-readable time ago
  const formatTimeAgo = (timestamp?: number): string => {
    if (!timestamp) return 'Recently';
    const diff = Math.max(0, Date.now() - timestamp);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Initialize conversation thread from local storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loaded = loadThreads(user?.id);
    setThreads(loaded);
    setTotalSavedThreads(loaded.length);

    const savedActiveId = getActiveThreadId();
    const matchedThread = loaded.find((t) => t.id === savedActiveId) || loaded[0];

    if (matchedThread && matchedThread.messages?.length > 0) {
      setActiveThreadIdState(matchedThread.id);
      setActiveThreadId(matchedThread.id);
      setMessages(matchedThread.messages);
    } else {
      const newId = `thread_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setActiveThreadIdState(newId);
      setActiveThreadId(newId);
      setMessages([]);
    }
  }, [user?.id]);

  // Persist messages to active thread whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!activeThreadId) return;

    if (messages.length > 0) {
      const updated = saveCurrentThread(activeThreadId, messages, user?.id);
      setThreads((prev) => {
        const idx = prev.findIndex((t) => t.id === activeThreadId);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = updated;
          return clone;
        } else {
          return [updated, ...prev];
        }
      });
      setTotalSavedThreads((prev) => Math.max(1, prev));
    }
  }, [messages, activeThreadId, user?.id]);

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
    } else {
      // Stop speech and listening if widget is closed
      stopSpeaking();
      stopListening();
    }
  }, [isOpen]);

  // Clean up speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  // Pre-load speech synthesis voices on client
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.getVoices();
    const handleVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.onvoiceschanged = handleVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore abort errors
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Convert markdown/latex to clean plain text for natural spoken audio
  // Strips URLs, route links (e.g. prevents "dashboard slash dashboard"), markdown formatting, emojis
  const sanitizeTextForSpeech = (rawText: string) => {
    if (!rawText) return '';
    return rawText
      // 1. Convert markdown links: [Dashboard](/dashboard) -> Dashboard
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 2. Remove markdown link brackets: [Text] -> Text
      .replace(/\[([^\]]+)\]/g, '$1')
      // 3. Remove raw URLs (https://... or http://...)
      .replace(/https?:\/\/\S+/g, '')
      // 4. Remove path targets in parentheses like (/dashboard)
      .replace(/\(\/[a-zA-Z0-9_\-\/]+\)/g, '')
      // 5. Remove route paths like /dashboard or /exam/session
      .replace(/(?:^|\s)\/[a-zA-Z0-9_\-]+(?:\/[a-zA-Z0-9_\-]+)*/g, ' ')
      // 6. Clean repetitive words like "Dashboard dashboard" or "Dashboard slash dashboard"
      .replace(/\b([a-zA-Z]+)(?:\s+(?:slash\s+)?\1)+\b/gi, '$1')
      // 7. Math formulas & LaTeX
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
      .replace(/\\(?:times|cdot)/g, ' multiplied by ')
      .replace(/\\(?:pm)/g, ' plus or minus ')
      .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
      // 8. Remove emojis and Unicode pictographs so TTS doesn't read symbol names
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu, '')
      // 9. Remove markdown formatting characters
      .replace(/[*_#`~>|\$]/g, ' ')
      // 10. Clean slashes and leftover symbols
      .replace(/\//g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Select a pleasant, natural male companion voice for SOKHA (avoids robotic/female Samantha or Zira)
  const getSokhaVoice = (): SpeechSynthesisVoice | undefined => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return undefined;

    const femaleKeywords = [
      'zira', 'samantha', 'victoria', 'karen', 'susan', 'hazel',
      'jenny', 'aria', 'sonia', 'neerja', 'female', 'catherine',
      'linda', 'heather', 'ayumi', 'haruka'
    ];
    const preferredMaleKeywords = [
      'guy', 'david', 'mark', 'daniel', 'alex', 'christopher',
      'george', 'james', 'oliver', 'arthur', 'male', 'tom', 'steffan'
    ];

    // 1. Natural/Online male English voice (e.g. Microsoft Guy Natural, Christopher Natural)
    let chosen = voices.find((v) => {
      const name = v.name.toLowerCase();
      const isEn = v.lang.toLowerCase().startsWith('en');
      return (
        isEn &&
        (name.includes('natural') || name.includes('online')) &&
        preferredMaleKeywords.some((k) => name.includes(k))
      );
    });

    // 2. Any English voice with a male keyword
    if (!chosen) {
      chosen = voices.find((v) => {
        const name = v.name.toLowerCase();
        const isEn = v.lang.toLowerCase().startsWith('en');
        return isEn && preferredMaleKeywords.some((k) => name.includes(k));
      });
    }

    // 3. Any English voice that does not match female names
    if (!chosen) {
      chosen = voices.find((v) => {
        const name = v.name.toLowerCase();
        const isEn = v.lang.toLowerCase().startsWith('en');
        return isEn && !femaleKeywords.some((k) => name.includes(k));
      });
    }

    // 4. Fallback: Any English voice
    if (!chosen) {
      chosen = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    }

    return chosen;
  };

  // Speaks an assistant answer aloud (enforces the maximum 3 voice answers limit)
  const speakMessage = (msgId: string, text: string, isAutoPlay: boolean = false) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setErrorMessage('Voice playback is not supported on this browser.');
      return;
    }

    // Toggle off if currently speaking this same message
    if (speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    // If limit (3) is reached and trying to trigger, display notice
    if (voiceAnswersCount >= 3) {
      setErrorMessage('Voice answer limit reached (maximum 3 voice answers used).');
      return;
    }

    stopSpeaking();

    const plainText = sanitizeTextForSpeech(text);
    if (!plainText) return;

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    // Pitch 0.95 gives a warm, calm, natural male mentor tone instead of high-pitched / female
    utterance.pitch = 0.95;
    utterance.lang = 'en-US';

    const preferredVoice = getSokhaVoice();
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    // Increment count towards the 3 voice answers limit
    const nextCount = voiceAnswersCount + 1;
    setVoiceAnswersCount(nextCount);
    try {
      localStorage.setItem('sokha_voice_answers_count', nextCount.toString());
    } catch {
      // Ignore localStorage errors
    }

    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice search / speech-to-text
  const toggleVoiceRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    stopSpeaking();
    setErrorMessage(null);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');

        setInputText(transcript);

        // If recognition detected final sentence, automatically send query
        if (event.results[0] && event.results[0].isFinal && transcript.trim()) {
          stopListening();
          handleSendMessage(transcript.trim(), true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setErrorMessage(`Voice search error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setErrorMessage('Could not start microphone. Please check microphone permissions.');
      setIsListening(false);
    }
  };

  // Send message handler (supports triggerFromVoice for automatic voice answer playback)
  const handleSendMessage = async (textToSend?: string, triggerFromVoice: boolean = false) => {
    const query = (textToSend || inputText).trim();
    if (!query || isStreaming) return;

    // Smart detection: If student asks to delete/clear chat history
    const lowerQuery = query.toLowerCase().trim();
    if (
      lowerQuery === 'clear chat' ||
      lowerQuery === 'delete chat' ||
      lowerQuery === 'clear history' ||
      lowerQuery === 'delete history' ||
      lowerQuery === 'delete chat history' ||
      lowerQuery === 'clear chat history'
    ) {
      setInputText('');
      handleOpenDeleteAllModal();
      return;
    }

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

      // If search was triggered via voice, automatically play voice answer (up to limit of 3)
      if (triggerFromVoice && accumulatedText && voiceAnswersCount < 3) {
        speakMessage(botMsgId, accumulatedText, true);
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

  // ── Thread Switching & Creation Handlers ──
  const handleStartNewChat = () => {
    stopSpeaking();
    stopListening();
    const newId = `thread_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setActiveThreadIdState(newId);
    setActiveThreadId(newId);
    setMessages([]);
    setInputText('');
    setErrorMessage(null);
    setViewMode('chat');
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const handleSelectThread = (thread: SokhaThread) => {
    stopSpeaking();
    stopListening();
    setActiveThreadIdState(thread.id);
    setActiveThreadId(thread.id);
    setMessages(thread.messages || []);
    setInputText('');
    setErrorMessage(null);
    setViewMode('chat');
  };

  // ── Custom Deletion Handlers with Permanent Delete Confirmation ──
  const handleOpenDeleteAllModal = () => {
    setMessageToDelete(null);
    setThreadToDelete(null);
    setDeleteScope('all');
    setDeleteModalOpen(true);
  };

  const handleOpenDeleteThreadModal = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMessageToDelete(null);
    setThreadToDelete(threadId);
    setDeleteScope('single_thread');
    setDeleteModalOpen(true);
  };

  const handleOpenDeleteMessageModal = (msgId: string) => {
    setThreadToDelete(null);
    setMessageToDelete(msgId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      // Delete single message from active conversation & storage
      deleteMessageFromStorage(messageToDelete, user?.id, activeThreadId);
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete));
      setDeleteFeedback('Message permanently deleted.');
    } else if (deleteScope === 'single_thread' && threadToDelete) {
      // Delete specific thread from history
      const remaining = deleteThreadById(threadToDelete, user?.id);
      setThreads(remaining);
      setTotalSavedThreads(remaining.length);

      if (activeThreadId === threadToDelete) {
        if (remaining.length > 0) {
          setActiveThreadIdState(remaining[0].id);
          setActiveThreadId(remaining[0].id);
          setMessages(remaining[0].messages || []);
        } else {
          handleStartNewChat();
        }
      }
      setDeleteFeedback('Chat session deleted.');
    } else if (deleteScope === 'all') {
      // Permanently wipe all chatbot history
      clearAllThreads(user?.id);
      setThreads([]);
      setTotalSavedThreads(0);
      handleStartNewChat();
      setDeleteFeedback('All chatbot chat history permanently deleted.');
    } else {
      // Clear current conversation thread
      if (activeThreadId) {
        const remaining = deleteThreadById(activeThreadId, user?.id);
        setThreads(remaining);
        setTotalSavedThreads(remaining.length);
        if (remaining.length > 0) {
          setActiveThreadIdState(remaining[0].id);
          setActiveThreadId(remaining[0].id);
          setMessages(remaining[0].messages || []);
        } else {
          handleStartNewChat();
        }
      }
      setDeleteFeedback('Current chat session deleted.');
    }

    setDeleteModalOpen(false);
    setMessageToDelete(null);
    setThreadToDelete(null);

    // Auto-dismiss confirmation notice
    setTimeout(() => {
      setDeleteFeedback(null);
    }, 3500);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setMessageToDelete(null);
    setThreadToDelete(null);
  };


  // If in active exam or settings page, hide widget so it does not block settings action controls
  if (isExamSession || isSettingsPage) return null;

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ── Compact Floating Bot Character with Vibrant Blue Aura Backlight ──── */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center">
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
            {/* Ambient Cyan/Sky-Blue Aura Glow behind launcher */}
            <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-cyan-500/35 via-sky-400/45 to-blue-600/35 blur-xl pointer-events-none opacity-75" />
            <SokhaBotCharacter
              size="md"
              showGreeting={true}
              greetingText="🔥 Awaken Your Focus! Ask doubts"
            />
          </motion.div>
        )}
      </div>

      {/* ── Floating Assistant Tab Window (Adapts seamlessly to Site Theme, Zero Outlines) ────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn(
              'fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col overflow-hidden',
              'w-[calc(100vw-2rem)] sm:w-[420px] h-[610px] sm:h-[630px] max-h-[calc(100dvh-6.5rem)] sm:max-h-[88vh]',
              'rounded-[2.5rem] backdrop-blur-3xl transition-all duration-300',
              // Dynamic Theme: Pure White in Light mode, Deep Obsidian-Navy in Dark mode. ZERO OUTLINES.
              'bg-white/98 text-stone-900 shadow-[0_20px_70px_rgba(0,0,0,0.14),0_8px_25px_rgba(0,0,0,0.06)]',
              'dark:bg-[#0B1120]/96 dark:text-slate-100 dark:shadow-[0_25px_80px_rgba(0,0,0,0.7),0_8px_30px_rgba(0,0,0,0.5)]',
              'border-0 ring-0 outline-none'
            )}
          >
            {/* ── Soft Ambient Aurora Backlight (Matches site theme smoothly) ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-3xl" />
              <div className="absolute -bottom-20 right-0 w-72 h-72 rounded-full bg-accent-500/10 dark:bg-accent-500/15 blur-3xl" />
            </div>

            {/* Top Navigation & Controls with Dedicated New Chat & History Section */}
            <div className="relative flex items-center justify-between px-5 pt-3.5 pb-2 z-10 bg-transparent">
              {viewMode === 'history' ? (
                <button
                  type="button"
                  onClick={() => setViewMode('chat')}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-300 hover:text-brand-700 bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer border-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Chat</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    সময়যুদ্ধ Assistant
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                {/* "+ New Chat" Button */}
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/15 text-stone-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border-0"
                  title="Start a fresh chat"
                  aria-label="Start new chat"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[11px]">New</span>
                </button>

                {/* "Chat History" Section Toggle Button */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'history' ? 'chat' : 'history')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border-0',
                    viewMode === 'history'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-white/10'
                  )}
                  title="View Saved Chat History"
                  aria-label="View chat history"
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="text-[11px]">
                    {threads.length > 0 ? `Chats (${threads.length})` : 'Chats'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors cursor-pointer ml-0.5 border-0"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Daily Motivational Warrior Mantra Bar ── */}
            <div className="relative z-10 mx-4 my-1.5 px-3.5 py-2.5 rounded-2xl bg-brand-50/70 dark:bg-white/[0.04] border border-brand-100/50 dark:border-white/[0.06] flex items-start justify-between gap-2.5 backdrop-blur-sm">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <span className="text-amber-500 text-sm shrink-0 mt-0.5 select-none" aria-hidden="true">🕉️</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-stone-900 dark:text-slate-100 leading-snug">
                    &ldquo;{WARRIOR_MANTRAS[mantraIndex].sanskrit}&rdquo;
                  </p>
                  <p className="text-[11px] text-stone-600 dark:text-slate-300 font-normal leading-relaxed mt-0.5">
                    {WARRIOR_MANTRAS[mantraIndex].english}
                  </p>
                  {WARRIOR_MANTRAS[mantraIndex].author && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400/90 mt-0.5 block">
                      — {WARRIOR_MANTRAS[mantraIndex].author}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextMantra}
                className="px-2.5 py-1 rounded-full bg-brand-100 dark:bg-white/10 hover:bg-brand-200 dark:hover:bg-white/20 text-brand-700 dark:text-brand-300 text-[10px] font-bold transition-all shrink-0 cursor-pointer border-0 mt-0.5 flex items-center gap-1 active:scale-95"
                title="Get next motivational mantra"
              >
                <span>🔀</span>
                <span>New</span>
              </button>
            </div>

            {/* ── Feedback Notification when Chat History is Deleted ── */}
            <AnimatePresence>
              {deleteFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-5 my-1 px-3.5 py-2 rounded-2xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xs overflow-hidden z-20 border-0"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {deleteFeedback}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeleteFeedback(null)}
                    className="text-emerald-700 dark:text-emerald-300 hover:opacity-80 font-bold text-xs ml-2 cursor-pointer border-0"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Main Tab Content Area (History List or Chat View, Zero Scrollbars/Outlines) ───────────── */}
            {viewMode === 'history' ? (
              <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-10">
                <div className="flex items-center justify-between pb-3 mb-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span>Saved Chat History</span>
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                      Click to resume any study session or remove old transcripts
                    </p>
                  </div>
                  {threads.length > 0 && (
                    <button
                      type="button"
                      onClick={handleOpenDeleteAllModal}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-2.5 py-1 rounded-full transition-colors cursor-pointer border-0"
                      title="Clear all saved chats"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                {threads.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-white/5 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3 shadow-xs">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-extrabold text-stone-800 dark:text-slate-200">No Chat History Yet</h4>
                    <p className="text-xs text-stone-400 dark:text-slate-500 mt-1 max-w-[220px] leading-relaxed">
                      Your questions, study doubts, and AI explanations will be safely saved here.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartNewChat}
                      className="mt-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Start New Doubt Session</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 py-1">
                    {threads.map((t) => {
                      const isActive = t.id === activeThreadId;
                      const msgCount = t.messages?.length || 0;
                      const timeAgo = formatTimeAgo(t.updatedAt || t.createdAt);
                      const previewSnippet =
                        t.messages && t.messages.length > 0
                          ? t.messages[t.messages.length - 1]?.content || t.messages[0]?.content
                          : 'Empty session';

                      return (
                        <div
                          key={t.id}
                          onClick={() => handleSelectThread(t)}
                          className={cn(
                            'group relative flex items-start justify-between p-3.5 rounded-2xl transition-all cursor-pointer text-left border-0',
                            isActive
                              ? 'bg-brand-50/80 dark:bg-brand-950/40 shadow-xs'
                              : 'bg-stone-50 dark:bg-white/[0.04] hover:bg-stone-100 dark:hover:bg-white/[0.08]'
                          )}
                        >
                          <div className="min-w-0 flex-1 pr-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[10px] font-bold text-stone-400 dark:text-slate-500 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {timeAgo}
                              </span>
                              {isActive && (
                                <span className="px-1.5 py-0.2 rounded-full bg-brand-200 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 text-[9px] font-extrabold uppercase tracking-wider">
                                  Current
                                </span>
                              )}
                              <span className="text-[10px] text-stone-400 dark:text-slate-500">· {msgCount} msg{msgCount !== 1 ? 's' : ''}</span>
                            </div>
                            <h4 className="text-xs font-bold text-stone-900 dark:text-slate-100 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {t.title || 'Study Session'}
                            </h4>
                            <p className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                              {previewSnippet}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => handleOpenDeleteThreadModal(t.id, e)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer border-0"
                              title="Delete this chat session"
                              aria-label="Delete this chat session"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Conversation View (Greeting or Messages) */
              <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-10">
                {/* Hero Greeting State (Seamless, Zero Outlines, Smooth Animation) */}
                {!hasMessages ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center my-auto px-2 py-2">
                    {/* ── Sacred Rotating Chakra Animation (Exact Pinterest Video, Zero Outlines) ── */}
                    <div className="my-1 relative flex items-center justify-center">
                      <SokhaChakra size="md" isThinking={isStreaming} />
                    </div>

                    {/* Motivational Focus Badge (Borderless pill) */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/15 text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1.5 shadow-2xs border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                      <span>Focus Aura Active · Warrior Mode</span>
                    </div>

                    {/* Subtitle & Title */}
                    <p className="text-xs sm:text-sm font-medium text-stone-500 dark:text-slate-400 mb-0.5">
                      Hello {displayName}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-0.5">
                      Awaken Your Focus.
                    </h2>
                    <p className="text-[11px] text-stone-500 dark:text-slate-400 mb-2.5 max-w-[280px] leading-relaxed">
                      The clock is your arena. Step forward and conquer your study goals today.
                    </p>

                    {/* Quick Action Suggestions (Completely borderless, smooth cards) */}
                    <div className="w-full space-y-2 mt-1">
                      {/* Instant Voice Doubt Button */}
                      <button
                        type="button"
                        onClick={toggleVoiceRecognition}
                        className="w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-semibold transition-all group cursor-pointer bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 dark:from-sky-950/40 dark:via-blue-950/30 dark:to-indigo-950/40 dark:hover:from-sky-900/50 dark:hover:to-blue-900/50 text-sky-900 dark:text-sky-100 shadow-xs hover:shadow-sm border-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
                            <Mic className="w-4 h-4 animate-pulse" />
                          </span>
                          <div className="flex flex-col text-left">
                            <span className="font-bold">Speak Your Question</span>
                            <span className="text-[10px] text-sky-700/80 dark:text-sky-300/80 font-normal">
                              Instant voice doubt solving
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-sky-200/80 dark:bg-sky-500/25 text-sky-800 dark:text-sky-200 font-bold px-2.5 py-0.5 rounded-full border-0">
                          Voice Mode
                        </span>
                      </button>

                    </div>

                    {totalSavedThreads > 0 && (
                      <button
                        type="button"
                        onClick={() => setViewMode('history')}
                        className="mt-3.5 py-1 px-3 rounded-full text-[11px] font-medium text-stone-400 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5 cursor-pointer mx-auto border-0"
                        title="View all saved chat sessions"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>View Saved Chats ({totalSavedThreads})</span>
                      </button>
                    )}
                  </div>
                ) : (
                  /* Conversation View */
                  <div className="space-y-4 py-2">
                    {/* Mini Chakra Banner */}
                    <div className="flex items-center justify-center gap-2 py-1 text-xs text-stone-400 dark:text-slate-400">
                      <SokhaChakra size="sm" isThinking={isStreaming} />
                      <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                        SamayYudh Companion
                      </span>
                    </div>

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex gap-2 items-start group relative',
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {/* Individual Message Delete Button for User Message */}
                        {msg.role === 'user' && (
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteMessageModal(msg.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 mt-2 rounded-full text-stone-300 dark:text-slate-500 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-white/10 cursor-pointer shrink-0 border-0"
                            title="Delete message"
                            aria-label="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <div
                          className={cn(
                            'max-w-[85%] text-sm leading-relaxed transition-all relative group border-0',
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-[1.75rem] rounded-br-md px-5 py-3 shadow-[0_4px_16px_rgba(99,102,241,0.22)]'
                              : 'bg-[#F2F4F8] dark:bg-[#131D33]/90 text-stone-800 dark:text-slate-100 rounded-[1.75rem] rounded-tl-md px-5 py-3.5 shadow-xs'
                          )}
                        >
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : msg.content ? (
                            <div>
                              <SokhaMarkdown content={msg.content} sources={msg.sources} />
                              {/* Voice Speak Button & Delete on Assistant Response */}
                              <div className="mt-2 pt-1 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
                                <button
                                  type="button"
                                  onClick={() => speakMessage(msg.id, msg.content)}
                                  className={cn(
                                    'flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border-0',
                                    speakingMsgId === msg.id
                                      ? 'bg-brand-100 dark:bg-brand-500/25 text-brand-700 dark:text-brand-300 font-semibold'
                                      : 'hover:bg-stone-200/70 dark:hover:bg-white/10 text-stone-600 dark:text-slate-300'
                                  )}
                                  title={
                                    voiceAnswersCount >= 3
                                      ? 'Voice limit reached (3/3 used)'
                                      : speakingMsgId === msg.id
                                      ? 'Stop listening'
                                      : `Listen to answer (${3 - voiceAnswersCount} voice answers left)`
                                  }
                                >
                                  {speakingMsgId === msg.id ? (
                                    <>
                                      <VolumeX className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
                                      <span>Speaking…</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3.5 h-3.5" />
                                      <span>
                                        {voiceAnswersCount >= 3 ? 'Voice limit (3/3 used)' : `Listen (${3 - voiceAnswersCount} left)`}
                                      </span>
                                    </>
                                  )}
                                </button>

                                {/* Individual Message Delete Button for Assistant Response */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenDeleteMessageModal(msg.id)}
                                  className="p-1 rounded-full text-stone-400 hover:text-rose-600 hover:bg-stone-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer border-0"
                                  title="Delete this answer"
                                  aria-label="Delete answer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 py-1">
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
                  <div className="my-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs shadow-xs border-0">
                    {errorMessage}
                  </div>
                )}
              </div>
            )}

            {/* ── Voice status banner when microphone is active ── */}
            {viewMode === 'chat' && isListening && (
              <div className="px-6 py-2 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs flex items-center justify-between border-0 animate-pulse relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Listening to your voice... Speak now!
                </span>
                <button
                  type="button"
                  onClick={stopListening}
                  className="text-brand-900 dark:text-brand-100 font-semibold underline text-[11px] border-0"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* ── Bottom Section: Input Box in Chat view OR History Footer in History view ── */}
            {viewMode === 'history' ? (
              <div className="p-3.5 bg-stone-50/80 dark:bg-white/[0.03] flex items-center justify-between relative z-10 border-0">
                <span className="text-[11px] text-stone-400 dark:text-slate-500 font-medium">
                  {threads.length} saved session{threads.length !== 1 ? 's' : ''} on device
                </span>
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Doubt</span>
                </button>
              </div>
            ) : (
              <div className="p-4 pt-2 bg-transparent relative z-10">
                <div
                  className={cn(
                    'relative flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-200 border-0 ring-0',
                    'bg-[#EEF1F7] hover:bg-[#E8ECF4] focus-within:bg-[#EEF1F7]',
                    'dark:bg-[#131D33]/95 dark:hover:bg-[#18233D] dark:focus-within:bg-[#131D33]',
                    'shadow-xs focus-within:shadow-[0_4px_20px_rgba(99,102,241,0.18)]',
                    isListening && 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-950/40'
                  )}
                  style={{ outline: 'none', border: 'none' }}
                >
                  {/* Voice Search Button (Microphone inside the bot) */}
                  <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    className={cn(
                      'p-2 mr-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center justify-center border-0',
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-md'
                        : 'text-sky-600 hover:text-sky-700 bg-sky-100/80 hover:bg-sky-200/80 dark:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-500/30 shadow-2xs'
                    )}
                    title={isListening ? 'Stop listening' : 'Voice search (Tap to speak your doubt)'}
                    aria-label="Voice search"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>

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
                    placeholder={isListening ? 'Listening to your voice...' : 'Ask your study doubt or question...'}
                    className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 dark:text-slate-100 dark:placeholder:text-slate-400 border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 pr-2"
                    style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                  />

                  {isStreaming ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors shrink-0 cursor-pointer border-0"
                      title="Stop"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : inputText.trim() ? (
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      className="p-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 hover:scale-105 active:scale-95 text-white transition-all shadow-sm shrink-0 cursor-pointer border-0"
                      title="Send"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    /* Audio wave visual indicator matching site theme */
                    <div className="flex items-center gap-1 text-brand-400 dark:text-brand-400/80 shrink-0 px-1">
                      <span className="w-0.5 h-2 rounded-full bg-current animate-pulse" />
                      <span className="w-0.5 h-3.5 rounded-full bg-current animate-pulse delay-75" />
                      <span className="w-0.5 h-5 rounded-full bg-current animate-pulse delay-150" />
                      <span className="w-0.5 h-3 rounded-full bg-current animate-pulse delay-100" />
                      <span className="w-0.5 h-1.5 rounded-full bg-current animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Custom Deletion Confirmation Modal: Ask students for permanent delete Yes or No ── */}
            <AnimatePresence>
              {deleteModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5 border-0"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 12 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 340 }}
                    className="w-full max-w-[340px] bg-white dark:bg-[#0E1528] text-stone-900 dark:text-slate-100 rounded-[2rem] p-5 shadow-2xl flex flex-col items-center text-center relative overflow-hidden border-0"
                  >
                    {/* Glowing Danger Icon Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/20 flex items-center justify-center mb-3 text-rose-600 dark:text-rose-400 shadow-xs border-0">
                      <Trash2 className="w-6 h-6" />
                    </div>

                    {/* Modal Title */}
                    <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
                      Permanent Delete?
                    </h3>

                    {/* Question / Explanation */}
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {messageToDelete
                        ? 'Do you want to permanently delete this message? This action cannot be undone.'
                        : deleteScope === 'single_thread'
                        ? 'Do you want to permanently delete this chat session? It will be removed from your saved history.'
                        : 'Do you want to permanently delete your chatbot chat history? All doubt sessions will be wiped from this device.'}
                    </p>

                    {/* Custom Options Selector (when deleting full history) */}
                    {!messageToDelete && deleteScope !== 'single_thread' && (
                      <div className="w-full mt-3.5 space-y-1.5 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-400 px-1">
                          Deletion Scope
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 dark:bg-white/[0.05] rounded-2xl border-0">
                          <button
                            type="button"
                            onClick={() => setDeleteScope('all')}
                            className={cn(
                              'py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer border-0',
                              deleteScope === 'all'
                                ? 'bg-white dark:bg-white/20 text-rose-600 dark:text-rose-400 shadow-xs'
                                : 'text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                            )}
                          >
                            All History
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteScope('current')}
                            className={cn(
                              'py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer border-0',
                              deleteScope === 'current'
                                ? 'bg-white dark:bg-white/20 text-brand-700 dark:text-brand-300 shadow-xs'
                                : 'text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                            )}
                          >
                            Current Only
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-400 dark:text-slate-400 px-1">
                          {deleteScope === 'all'
                            ? 'Permanently deletes all saved study sessions and transcripts.'
                            : 'Clears only this active chat conversation.'}
                        </p>
                      </div>
                    )}

                    {/* Explicit YES / NO Buttons */}
                    <div className="w-full flex items-center gap-2.5 mt-5">
                      <button
                        type="button"
                        onClick={handleCancelDelete}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-0"
                      >
                        No, Keep It
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs hover:shadow-sm cursor-pointer flex items-center justify-center gap-1.5 border-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Yes, Delete</span>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
