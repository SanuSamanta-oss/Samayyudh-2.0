'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal';
import { SuperAdminWelcomeModal } from '@/components/auth/SuperAdminWelcomeModal';

export function RoleGatewayListener() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading || !isAuthenticated || !user) {
      return;
    }

    let isMounted = true;

    async function checkRoleState() {
      try {
        // Record login activity in background
        fetch('/api/admin/login-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_agent: navigator.userAgent }),
        }).catch(() => {});

        const res = await fetch('/api/auth/role');
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        // Check if Super Admin
        if (data.is_super_admin) {
          const seenKey = `sy_super_admin_seen_${user?.id}`;
          const hasSeen = sessionStorage.getItem(seenKey);
          if (!hasSeen) {
            setShowSuperAdminModal(true);
            sessionStorage.setItem(seenKey, 'true');
          }
        } else if (!data.role_selected) {
          setShowRoleModal(true);
        }
      } catch (err) {
        console.warn('Role gateway check notice:', err);
      } finally {
        if (isMounted) setChecked(true);
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
        onRoleSelected={(_role) => {
          setShowRoleModal(false);
        }}
      />
      <SuperAdminWelcomeModal
        isOpen={showSuperAdminModal}
        onDismiss={() => {
          setShowSuperAdminModal(false);
        }}
      />
    </>
  );
}

