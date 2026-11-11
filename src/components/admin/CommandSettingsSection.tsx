'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Lock,
  Save,
} from 'lucide-react';
import type { AdminOverviewPayload, CommandRole } from '@/types/admin';

interface CommandSettingsSectionProps {
  role: CommandRole;
  publicId: string | null;
  username: string | null;
  discoverable: boolean;
  expiresAt: string | null;
  overview: AdminOverviewPayload | null;
  onLockSession: () => void;
  onRefreshAuth: () => Promise<void>;
}

export function CommandSettingsSection({
  role,
  publicId,
  username,
  discoverable,
  expiresAt,
  overview,
  onLockSession,
  onRefreshAuth,
}: CommandSettingsSectionProps) {
  const [editUsername, setEditUsername] = useState(username || '');
  const [editDiscoverable, setEditDiscoverable] = useState(discoverable);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedSqlPath, setCopiedSqlPath] = useState(false);

  async function saveIdentitySettings() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/profile/identity', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editUsername,
          discoverable: editDiscoverable,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMessage(data.error || 'Could not save identity settings.');
        return;
      }
      setMessage('Public directory handle & privacy settings saved.');
      await onRefreshAuth();
    } finally {
      setSaving(false);
    }
  }

  const healthItems = [
    {
      label: 'Supabase Schema Migration (admin_command_center.sql)',
      ok: Boolean(overview?.health.schema_ready),
      hint: 'Required for custom questions, classrooms, resources, and SY-IDs.',
    },
    {
      label: 'Server Passkey Configured (ADMIN_COMMAND_PASSKEY)',
      ok: Boolean(overview?.health.passkey_configured),
      hint: 'Verified exclusively server-side with constant-time compare.',
    },
    {
      label: 'Gemini AI Extractor Key (GEMINI_API_KEY)',
      ok: Boolean(overview?.health.gemini_configured),
      hint: 'Enables intelligent LaTeX extraction from uploaded PDFs.',
    },
    {
      label: 'Supabase Service Role Key (Optional Server Bypass)',
      ok: Boolean(overview?.health.has_service_role),
      hint: 'Allows super_admin cross-cohort management beyond personal RLS.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Public Identity & Privacy Settings */}
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Public Identifier &amp; Directory Privacy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your permanent public ID is <span className="font-mono font-semibold">{publicId}</span>. Configure your optional @username and discoverability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Public @username Handle
            </label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              placeholder="e.g. prof_sharma"
              className="w-full rounded-2xl bg-stone-100 dark:bg-[#162032] px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-100/90 dark:bg-[#162032] px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                Discoverable in Directory
              </p>
              <p className="text-[11px] text-slate-500">
                Allow connections via @username or {publicId}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={editDiscoverable}
              aria-label="Discoverable in Directory"
              onClick={() => setEditDiscoverable((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 outline-none focus:outline-none cursor-pointer ${
                editDiscoverable
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#635BFF] shadow-[0_4px_12px_-2px_rgba(99,91,255,0.45)]'
                  : 'bg-stone-300 dark:bg-[#233252]'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  editDiscoverable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-2xl bg-[#EAE6F5]/80 dark:bg-[#231B3E] px-4 py-2.5 text-xs font-medium text-[#6D28D9] dark:text-[#DDD6FE]">
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={saveIdentitySettings}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Identity Settings'}</span>
          </button>
        </div>
      </div>

      {/* Infrastructure Health Check */}
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#6D28D9]" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Environment &amp; Database Readiness
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText('supabase/admin_command_center.sql');
              setCopiedSqlPath(true);
              setTimeout(() => setCopiedSqlPath(false), 1600);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#162032] text-xs font-mono cursor-pointer"
          >
            {copiedSqlPath ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>supabase/admin_command_center.sql</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthItems.map((h) => (
            <div
              key={h.label}
              className="rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4 flex items-start gap-3"
            >
              {h.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{h.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{h.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Security Control */}
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-6 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
            Active Command Session ({role.replace('_', ' ')})
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {expiresAt
              ? `HTTP-only signed cookie expires ${new Date(expiresAt).toLocaleString()}`
              : 'Protected by server-signed session token'}
          </p>
        </div>

        <button
          type="button"
          onClick={onLockSession}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-semibold cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Revoke &amp; Lock Command Center</span>
        </button>
      </div>
    </div>
  );
}
