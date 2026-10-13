'use client';

// ============================================================
// SamayYudh 2.0 — OAuth Callback Page
// Handles Google OAuth and magic link redirects
// Displays the Bored Hand tapping loading animation on a black screen
// while establishing session and redirecting to the destination
// ============================================================

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { BoredHandLoader } from '@/components/BoredHandLoader';

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
            setTimeout(() => router.replace(`/auth?error=${encodeURIComponent(error.message)}`), 1500);
            return;
          }
        }

        // 2. Wait for session to be confirmed
        const { data: { session } } = await supabase.auth.getSession();
        
        // Give the user at least 1.6s to enjoy the smooth tapping animation
        setTimeout(() => {
          setFinished(true);
          setStatusText(session?.user?.user_metadata?.display_name ? 'WELCOME, WARRIOR' : 'AUTHENTICATED');
          setTimeout(() => {
            router.replace(targetUrl);
          }, 500);
        }, 1600);
      } catch (err) {
        console.error('Auth callback failed:', err);
        setStatusText('AUTHENTICATION FAILED');
        setTimeout(() => router.replace('/auth?error=Failed+to+authenticate'), 1500);
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
          <BoredHandLoader text="AUTHENTICATING..." />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
