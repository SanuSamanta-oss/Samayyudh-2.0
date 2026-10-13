'use client';

// ============================================================
// SamayYudh 2.0 — Auth Context & useAuth Hook
// Provides user state across the entire app
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { BoredHandLoader } from '@/components/BoredHandLoader';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  revokeAllSessions: () => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAuthLoader, setShowAuthLoader] = useState(false);
  const [authLoaderFinished, setAuthLoaderFinished] = useState(false);
  const authTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<AuthState>(() => {
    // Initialize with loading=false if not configured
    if (!isSupabaseConfigured) {
      return {
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        isConfigured: false,
      };
    }
    return {
      user: null,
      session: null,
      loading: true,
      isAuthenticated: false,
      isConfigured: true,
    };
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    // Check if returning from OAuth redirect with code or access_token
    if (typeof window !== 'undefined') {
      const isOAuth =
        window.location.search.includes('code=') ||
        window.location.hash.includes('access_token=') ||
        window.location.pathname.startsWith('/auth/callback');

      if (isOAuth) {
        setShowAuthLoader(true);
      }
    }

    const supabase = createClient();

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session?.user,
          isConfigured: true,
        });

        // If OAuth was detected and session is now resolved
        if (session?.user && typeof window !== 'undefined') {
          const isOAuth =
            window.location.search.includes('code=') ||
            window.location.hash.includes('access_token=') ||
            window.location.pathname.startsWith('/auth/callback');

          if (isOAuth) {
            setShowAuthLoader(true);
            if (authTimerRef.current) clearTimeout(authTimerRef.current);
            authTimerRef.current = setTimeout(() => {
              setAuthLoaderFinished(true);
              setTimeout(() => {
                setShowAuthLoader(false);
              }, 500);
            }, 1800);
          }
        }
      } catch {
        setState((prev) => ({ ...prev, loading: false }));
        setShowAuthLoader(false);
      }
    };

    initAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session?.user,
          isConfigured: true,
        });

        if (event === 'SIGNED_IN') {
          setShowAuthLoader(true);
          if (authTimerRef.current) clearTimeout(authTimerRef.current);
          authTimerRef.current = setTimeout(() => {
            setAuthLoaderFinished(true);
            setTimeout(() => {
              setShowAuthLoader(false);
            }, 500);
          }, 1800);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
      if (authTimerRef.current) clearTimeout(authTimerRef.current);
    };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const supabase = createClient();
      // Revoke session globally on Supabase Auth server so stolen tokens immediately fail
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.error('Error during signOut:', e);
    } finally {
      // Clear local storage auth cache and redirect to landing
      window.location.href = window.location.origin + '/';
    }
  }, []);

  const revokeAllSessions = useCallback(async (): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    try {
      // Call dedicated server-side token revocation endpoint
      const res = await fetch('/api/auth/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'global' }),
      });

      const supabase = createClient();
      await supabase.auth.signOut({ scope: 'global' });

      setState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        isConfigured: true,
      });

      return res.ok;
    } catch (err) {
      console.error('Failed to revoke tokens globally:', err);
      return false;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.refreshSession();
    setState({
      user: session?.user ?? null,
      session,
      loading: false,
      isAuthenticated: !!session?.user,
      isConfigured: true,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signOut, revokeAllSessions, refreshSession }}>
      <AnimatePresence>
        {showAuthLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center select-none"
          >
            <BoredHandLoader finished={authLoaderFinished} text="AUTHENTICATING..." />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
