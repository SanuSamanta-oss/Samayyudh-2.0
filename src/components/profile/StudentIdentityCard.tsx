'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import type { CommandRole } from '@/types/admin';

interface IdentityState {
  publicId: string;
  username: string | null;
  role: CommandRole;
  schemaReady: boolean;
}

interface JoinedClassroom {
  id: string;
  name: string;
  subject: string | null;
  exam: string | null;
}

export function StudentIdentityCard() {
  const [identity, setIdentity] = useState<IdentityState | null>(null);
  const [classrooms, setClassrooms] = useState<JoinedClassroom[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [connectIdent, setConnectIdent] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const [idRes, clsRes] = await Promise.all([
        fetch('/api/profile/identity'),
        fetch('/api/classrooms/join'),
      ]);
      if (!active) return;
      if (idRes.ok) {
        const d = (await idRes.json()) as { identity?: IdentityState };
        if (d.identity) setIdentity(d.identity);
      }
      if (clsRes.ok) {
        const c = (await clsRes.json()) as { classrooms?: JoinedClassroom[] };
        setClassrooms(c.classrooms || []);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (!identity) return null;

  const isPrivileged =
    identity.role === 'super_admin' ||
    identity.role === 'admin' ||
    identity.role === 'teacher';

  async function handleJoinClassroom() {
    if (!inviteCode.trim()) return;
    setStatusMsg(null);
    const res = await fetch('/api/classrooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode: inviteCode.trim() }),
    });
    const d = (await res.json().catch(() => ({}))) as {
      error?: string;
      classroom?: JoinedClassroom;
    };
    if (!res.ok) {
      setStatusMsg(d.error || 'Could not join classroom.');
      return;
    }
    if (d.classroom) {
      setClassrooms((prev) =>
        prev.some((x) => x.id === d.classroom!.id) ? prev : [...prev, d.classroom!]
      );
    }
    setInviteCode('');
    setStatusMsg(`Joined classroom: ${d.classroom?.name || 'Success'}`);
  }

  async function handleQuickConnect() {
    if (!connectIdent.trim()) return;
    setStatusMsg(null);
    const res = await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send', identifier: connectIdent.trim() }),
    });
    const d = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setStatusMsg(d.error || 'Unable to send connection request.');
      return;
    }
    setConnectIdent('');
    setStatusMsg('Connection invitation sent.');
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(88,28,135,0.05)] dark:shadow-[0_6px_28px_-4px_rgba(0,0,0,0.45)] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6D28D9] dark:text-[#A78BFA]">
            SamayYudh Directory ID
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Share your permanent Public ID with teachers or classmates without revealing personal email details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(identity.publicId);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#6D28D9] dark:text-[#DDD6FE] font-mono text-xs font-semibold cursor-pointer"
          >
            <span>{identity.publicId}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {isPrivileged && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#6D28D9] text-white text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Join Classroom via Invite Code */}
        <div className="rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
            <GraduationCap className="w-4 h-4 text-[#6D28D9] dark:text-[#C4B5FD]" />
            <span>Join Classroom via Invite Code</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="CLS-XXXXXX"
              className="flex-1 rounded-xl bg-white dark:bg-[#111A2E] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleJoinClassroom}
              className="px-3.5 py-2 rounded-xl bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
            >
              Join
            </button>
          </div>
          {classrooms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {classrooms.map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Connect via Username or SY-ID */}
        <div className="rounded-2xl bg-stone-50/90 dark:bg-[#162032] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
            <Users className="w-4 h-4 text-[#6D28D9] dark:text-[#C4B5FD]" />
            <span>Connect with Teacher or Peer</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={connectIdent}
              onChange={(e) => setConnectIdent(e.target.value)}
              placeholder="@username or SY-XXXXXXXX"
              className="flex-1 rounded-xl bg-white dark:bg-[#111A2E] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleQuickConnect}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#6D28D9] dark:text-[#DDD6FE] text-xs font-semibold cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>

      {statusMsg && (
        <p className="text-xs font-medium text-[#6D28D9] dark:text-[#C4B5FD]">{statusMsg}</p>
      )}
    </div>
  );
}

