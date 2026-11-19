'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal';
import { SuperAdminWelcomeModal } from '@/components/auth/SuperAdminWelcomeModal';
import { TeacherWelcomeModal } from '@/components/auth/TeacherWelcomeModal';
import { StudentWelcomeModal } from '@/components/auth/StudentWelcomeModal';

export function RoleGatewayListener() {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    // 1. If not authenticated or still loading, reset modal visibility
    if (loading || !isAuthenticated || !user) {
      setShowRoleModal(false);
      setShowSuperAdminModal(false);
      setShowTeacherModal(false);
      setShowStudentModal(false);
      return;
    }

    if (typeof window === 'undefined') return;

    // 2. Do NOT trigger pop-ups while user is in the middle of login on /auth or /auth/callback
    if (pathname?.startsWith('/auth')) {
      return;
    }

    // Per-session tracking: ensure the welcome pop-up shows once per login/session,
    // and never spams on every route click during normal browsing.
    const sessionSeenKey = `sy_role_modal_seen_${user.id}`;
    const hasSeenThisSession = sessionStorage.getItem(sessionSeenKey) === 'true';

    // Check for explicit login triggers or manual role selection requests
    const urlParams = new URLSearchParams(window.location.search);
    const hasWelcomeParam = urlParams.get('welcome_hint') === 'true';
    const hasSelectRoleParam = urlParams.get('select_role') === 'true';
    const justLoggedIn = sessionStorage.getItem('samayyudh_just_logged_in') === 'true';
    const postLoginPending = sessionStorage.getItem('sy_post_login_modal_pending') === 'true';

    const isExplicitLogin = hasWelcomeParam || justLoggedIn || postLoginPending || hasSelectRoleParam;

    // Clean up url params if present
    if (hasWelcomeParam || hasSelectRoleParam) {
      try {
        urlParams.delete('welcome_hint');
        urlParams.delete('select_role');
        const newSearch = urlParams.toString();
        const newUrl =
          window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      } catch {}
    }

    // Fast-path client check: If email matches super admin list
    const rawPublicSuper =
      process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS ||
      'changeislaw777@gmail.com,sahasarbajit2007@gmail.com,sambitasingharoy@gmail.com,sbasu5318@gmail.com';
    const superEmails = rawPublicSuper
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const userEmail = (user.email || '').trim().toLowerCase();
    const isSuperAdminFast = Boolean(userEmail && superEmails.includes(userEmail));

    const superUnlockedKey = 'sy_super_admin_passkey_unlocked';
    const isPasskeyUnlocked = sessionStorage.getItem(superUnlockedKey) === 'true';

    // 3. Super Admin Flow:
    // Super admins enter the Command Passkey and NEVER see teacher/student selection or parent forms
    if (isSuperAdminFast) {
      if (!isPasskeyUnlocked && (!hasSeenThisSession || isExplicitLogin)) {
        sessionStorage.setItem(sessionSeenKey, 'true');
        try {
          sessionStorage.removeItem('sy_post_login_modal_pending');
          sessionStorage.removeItem('samayyudh_just_logged_in');
        } catch {}
        setShowSuperAdminModal(true);
      }
      return;
    }

    let isMounted = true;

    // Record login activity in background
    fetch('/api/admin/login-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_agent: navigator.userAgent }),
    }).catch(() => {});

    // 4. Regular User Flow (Teacher / Student):
    // For non-superadmin users, we MUST check role state from /api/auth/role.
    async function checkRoleState() {
      try {
        const res = await fetch('/api/auth/role');
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        // Backend reports Super Admin
        if (data.is_super_admin) {
          if (!isPasskeyUnlocked && (!hasSeenThisSession || isExplicitLogin)) {
            sessionStorage.setItem(sessionSeenKey, 'true');
            setShowSuperAdminModal(true);
          }
          return;
        }

        // If the user has NOT selected their role yet (or requested role selection):
        // ALWAYS prompt them with the Teacher vs Student selection pop-up!
        if (!data.role_selected || hasSelectRoleParam) {
          setShowRoleModal(true);
          return;
        }

        // If the user has ALREADY selected their role:
        // Show their respective welcome modal on fresh login or once per session
        if (isExplicitLogin || !hasSeenThisSession) {
          sessionStorage.setItem(sessionSeenKey, 'true');
          try {
            sessionStorage.removeItem('sy_post_login_modal_pending');
            sessionStorage.removeItem('samayyudh_just_logged_in');
          } catch {}

          if (data.role === 'teacher') {
            setShowTeacherModal(true);
          } else {
            setShowStudentModal(true);
          }
        }
      } catch (err) {
        console.warn('Role gateway check notice:', err);
      }
    }

    checkRoleState();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, loading, user, pathname]);

  return (
    <>
      <RoleSelectionModal
        isOpen={showRoleModal}
        onRoleSelected={(role) => {
          setShowRoleModal(false);
          if (user) {
            sessionStorage.setItem(`sy_role_modal_seen_${user.id}`, 'true');
          }
          try {
            sessionStorage.removeItem('sy_post_login_modal_pending');
            sessionStorage.removeItem('samayyudh_just_logged_in');
          } catch {}

          if (role === 'teacher') {
            setShowTeacherModal(true);
          } else {
            setShowStudentModal(true);
          }
        }}
      />

      <SuperAdminWelcomeModal
        isOpen={showSuperAdminModal}
        onDismiss={() => {
          setShowSuperAdminModal(false);
        }}
      />

      <TeacherWelcomeModal
        isOpen={showTeacherModal}
        onDismiss={() => {
          setShowTeacherModal(false);
        }}
      />

      <StudentWelcomeModal
        isOpen={showStudentModal}
        onDismiss={() => {
          setShowStudentModal(false);
        }}
      />
    </>
  );
}
