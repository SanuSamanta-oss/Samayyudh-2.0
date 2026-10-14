'use client';

// ============================================================
// SamayYudh 2.0 — OAuth Callback Page
// Handles Google OAuth and magic link redirects.
// Always plays the full hand gesture animation upon authentication completion.
// ============================================================

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { BoredHandLoader } from '@/components/BoredHandLoader';
import { markUserLoggedIn } from '@/lib/auth-welcome';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [finished, setFinished] = useState(false);
  const [statusText, setStatusText] = useState('AUTHENTICATING...');
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

        markUserLoggedIn(session?.user);

        // 3. Play the full hand gesture animation before smoothly redirecting
        const userName =
          session?.user?.user_metadata?.display_name ||
          session?.user?.user_metadata?.full_name ||
          session?.user?.user_metadata?.name;

        setTimeout(() => {
          setFinished(true);
          setStatusText(userName ? `WELCOME, ${userName.toUpperCase()}` : 'WELCOME, WARRIOR');
          setTimeout(() => {
            router.replace(targetUrl);
          }, 700);
        }, 2200);
      } catch (err) {
        console.error('Auth callback failed:', err);
        setStatusText('AUTHENTICATION FAILED');
        setTimeout(() => router.replace('/auth?error=Failed+to+authenticate'), 1200);
      }
    }

    processAuth();
  }, [router, searchParams]);

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
          <BoredHandLoader text="CONNECTING..." />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
