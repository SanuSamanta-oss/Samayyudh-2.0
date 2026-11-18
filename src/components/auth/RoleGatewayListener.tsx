'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal';
import { SuperAdminWelcomeModal } from '@/components/auth/SuperAdminWelcomeModal';
import { TeacherWelcomeModal } from '@/components/auth/TeacherWelcomeModal';
import { StudentWelcomeModal } from '@/components/auth/StudentWelcomeModal';

export function RoleGatewayListener() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    if (loading || !isAuthenticated || !user) {
      return;
    }

    if (typeof window === 'undefined') return;

    // Per-session tracking: ensure the welcome/passkey pop-up shows once per login/session,
    // and never spams on every route click during normal browsing.
    const sessionSeenKey = `sy_role_modal_seen_${user.id}`;
    const hasSeenThisSession = sessionStorage.getItem(sessionSeenKey) === 'true';

    // Check for explicit login triggers
    const urlParams = new URLSearchParams(window.location.search);
    const hasWelcomeParam = urlParams.get('welcome_hint') === 'true';
    const justLoggedIn = sessionStorage.getItem('samayyudh_just_logged_in') === 'true';
    const postLoginPending = sessionStorage.getItem('sy_post_login_modal_pending') === 'true';

    const isExplicitLogin = hasWelcomeParam || justLoggedIn || postLoginPending;

    // Clean up url param if present
    if (hasWelcomeParam) {
      try {
        urlParams.delete('welcome_hint');
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

    // Determine if we should show the modal:
    // 1. If explicit login -> ALWAYS SHOW
    // 2. If Super Admin and passkey is not unlocked yet for this session -> SHOW
    // 3. If user has not seen their role welcome modal in this session yet -> SHOW
    // 4. Otherwise (user already saw it and is navigating between pages) -> DO NOT SHOW
    const shouldShow = isExplicitLogin || (isSuperAdminFast && !isPasskeyUnlocked) || !hasSeenThisSession;

    if (!shouldShow) {
      return;
    }

    let isMounted = true;

    // Mark as shown in this session so subsequent route navigations inside the app won't pop it up again
    sessionStorage.setItem(sessionSeenKey, 'true');
    try {
      sessionStorage.removeItem('sy_post_login_modal_pending');
      sessionStorage.removeItem('samayyudh_just_logged_in');
    } catch {}

    // Record login activity in background
    fetch('/api/admin/login-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_agent: navigator.userAgent }),
    }).catch(() => {});

    // FAST-PATH: Super Admin by configured email
    // Super admins enter the Command Passkey and NEVER see parent/guardian forms
    if (isSuperAdminFast) {
      setShowSuperAdminModal(true);
      return;
    }

    // Server role check for teachers, students, or database-configured super admins
    async function checkRoleState() {
      try {
        const res = await fetch('/api/auth/role');
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        if (data.is_super_admin) {
          setShowSuperAdminModal(true);
        } else if (!data.role_selected) {
          // Brand new user without selected role
          setShowRoleModal(true);
        } else if (data.role === 'teacher') {
          // Returning teacher
          setShowTeacherModal(true);
        } else {
          // Returning student
          setShowStudentModal(true);
        }
      } catch (err) {
        console.warn('Role gateway check notice:', err);
      }
    }

    checkRoleState();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, loading, user]);

  return (
    <>
      <RoleSelectionModal
        isOpen={showRoleModal}
        onRoleSelected={(role) => {
          setShowRoleModal(false);
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
