'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal';
import { SuperAdminWelcomeModal } from '@/components/auth/SuperAdminWelcomeModal';
import { TeacherWelcomeModal } from '@/components/auth/TeacherWelcomeModal';
import { StudentWelcomeModal } from '@/components/auth/StudentWelcomeModal';
import { POST_LOGIN_MODAL_PENDING_KEY } from '@/lib/auth-welcome';

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

    // Check if user has just completed login or has a pending welcome modal
    const urlParams = new URLSearchParams(window.location.search);
    const hasWelcomeParam = urlParams.get('welcome_hint') === 'true';
    const justLoggedIn = sessionStorage.getItem('samayyudh_just_logged_in') === 'true';
    const postLoginPending = sessionStorage.getItem(POST_LOGIN_MODAL_PENDING_KEY) === 'true';

    // Fast-path client check for Super Admin by email
    const rawPublicSuper = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || '';
    const superEmails = rawPublicSuper
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const userEmail = (user.email || '').trim().toLowerCase();
    const isSuperAdminFast = Boolean(userEmail && superEmails.includes(userEmail));

    const superSeenKey = `sy_super_admin_seen_${user.id}`;
    const hasSeenSuperModal = sessionStorage.getItem(superSeenKey) === 'true';

    // Check if modal should trigger:
    // 1. Fresh login event (postLoginPending || justLoggedIn || hasWelcomeParam)
    // 2. OR Super admin who has not entered their passkey in this session
    const isFreshLogin = postLoginPending || justLoggedIn || hasWelcomeParam;
    const shouldShowSuper = isSuperAdminFast && !hasSeenSuperModal;

    if (!isFreshLogin && !shouldShowSuper) {
      return;
    }

    // Immediately consume fresh login flags so regular in-app navigation doesn't re-trigger
    try {
      sessionStorage.removeItem(POST_LOGIN_MODAL_PENDING_KEY);
      sessionStorage.removeItem('samayyudh_just_logged_in');
      if (hasWelcomeParam) {
        urlParams.delete('welcome_hint');
        const newSearch = urlParams.toString();
        const newUrl =
          window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    } catch {}

    let isMounted = true;

    // Record login activity in background (non-blocking)
    fetch('/api/admin/login-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_agent: navigator.userAgent }),
    }).catch(() => {});

    // FAST-PATH: Super Admin by configured email
    // Super admins enter the Command Passkey and NEVER see parent/guardian forms
    if (isSuperAdminFast) {
      sessionStorage.setItem(superSeenKey, 'true');
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
          if (!sessionStorage.getItem(superSeenKey)) {
            sessionStorage.setItem(superSeenKey, 'true');
            setShowSuperAdminModal(true);
          }
        } else if (!data.role_selected) {
          // New user who hasn't selected their role yet
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
