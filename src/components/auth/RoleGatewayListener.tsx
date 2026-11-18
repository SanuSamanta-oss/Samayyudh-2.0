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

    // Check if user has just completed a fresh login
    const urlParams = new URLSearchParams(window.location.search);
    const hasWelcomeParam = urlParams.get('welcome_hint') === 'true';
    const isPending =
      sessionStorage.getItem(POST_LOGIN_MODAL_PENDING_KEY) === 'true' || hasWelcomeParam;

    // STRICT GATING: Only display the role modal ONCE right upon fresh login.
    // If not pending, do NOT fetch or pop up anything during in-app navigation or reloads.
    if (!isPending) {
      return;
    }

    // Immediately consume the pending flag so it NEVER fires again during this or future navigations
    try {
      sessionStorage.removeItem(POST_LOGIN_MODAL_PENDING_KEY);
      if (hasWelcomeParam) {
        urlParams.delete('welcome_hint');
        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
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

    // Fast-path client check: If email matches public super admin list, trigger modal in 0ms
    const rawPublicSuper = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || '';
    const superEmails = rawPublicSuper
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const userEmail = (user.email || '').trim().toLowerCase();

    if (userEmail && superEmails.includes(userEmail)) {
      setShowSuperAdminModal(true);
      return;
    }

    async function checkRoleState() {
      try {
        const res = await fetch('/api/auth/role');
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        if (data.is_super_admin) {
          setShowSuperAdminModal(true);
        } else if (!data.role_selected) {
          setShowRoleModal(true);
        } else if (data.role === 'teacher') {
          setShowTeacherModal(true);
        } else {
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
