'use client';

// ============================================================
// SamayYudh 2.0 — Auth Context & useAuth Hook
// Provides user state across the entire app
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

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
      } catch {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    initAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session?.user,
          isConfigured: true,
        });
      },
    );

    return () => {
      subscription.unsubscribe();
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
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
