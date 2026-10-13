'use client';

// ============================================================
// SamayYudh 2.0 — OAuth Callback Page
// Handles Google OAuth and magic link redirects.
// If the user has already logged in before, the Bored Hand animation
// is NEVER shown anywhere, and the user is redirected immediately.
// If it is the user's very first time, the hand animation is shown
// once as onboarding, then permanently marked so it never appears again.
// ============================================================

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { BoredHandLoader } from '@/components/BoredHandLoader';
import { hasUserLoggedInBefore, markUserLoggedIn } from '@/lib/auth-welcome';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [finished, setFinished] = useState(false);
  const [statusText, setStatusText] = useState('AUTHENTICATING...');
  const [showHandAnimation, setShowHandAnimation] = useState(() => {
    return typeof window !== 'undefined' ? !hasUserLoggedInBefore() : false;
  });
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    async function processAuth() {
      try {
        if (!isSupabaseConfigured) {
          router.replace('/auth');
          return;
        }

        const supabase = createClient();
        const code = searchParams.get('code');
        const next = searchParams.get('next') || '/dashboard';
        const targetUrl = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

        // 1. If an authorization code is present (PKCE flow)
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Exchange code error:', error);
            setStatusText('AUTHENTICATION ERROR');
            setTimeout(() => router.replace(`/auth?error=${encodeURIComponent(error.message)}`), 1200);
            return;
          }
        }

        // 2. Fetch confirmed session
        const { data: { session } } = await supabase.auth.getSession();
        
        // 3. Check if this user has already logged in before
        const alreadyLoggedIn = hasUserLoggedInBefore(session?.user);

        if (alreadyLoggedIn) {
          // Returning/existing user: NEVER SHOW THIS ANIMATION AGAIN
          markUserLoggedIn(session?.user);
          setShowHandAnimation(false);
          router.replace(targetUrl);
          return;
        }

        // 4. First-time login: show animation once, mark as logged in, then redirect
        setShowHandAnimation(true);
        setTimeout(() => {
          setFinished(true);
          setStatusText(session?.user?.user_metadata?.display_name ? 'WELCOME, WARRIOR' : 'AUTHENTICATED');
          markUserLoggedIn(session?.user);
          setTimeout(() => {
            router.replace(targetUrl);
          }, 500);
        }, 1500);
      } catch (err) {
        console.error('Auth callback failed:', err);
        setStatusText('AUTHENTICATION FAILED');
        setTimeout(() => router.replace('/auth?error=Failed+to+authenticate'), 1200);
      }
    }

    processAuth();
  }, [router, searchParams]);

  if (!showHandAnimation) {
    return (
      <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center select-none">
        <div className="w-48 sm:w-56 h-1 bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-800">
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-stone-400 via-white to-stone-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center select-none">
      <BoredHandLoader finished={finished} text={statusText} />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center select-none">
          <div className="w-48 sm:w-56 h-1 bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-800">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-stone-400 via-white to-stone-300 rounded-full animate-pulse" />
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
