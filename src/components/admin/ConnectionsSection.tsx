'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Search,
  UserPlus,
  Check,
  X,
  Users,
  ShieldBan,
  Copy,
} from 'lucide-react';
import type { DirectoryUser } from '@/types/admin';

interface ConnectionStateResponse {
  schemaReady: boolean;
  identity: {
    publicId: string;
    username: string | null;
    displayName: string;
  } | null;
  connections: Array<{
    id: string;
    created_at: string;
    peer: DirectoryUser | null;
  }>;
  incoming: Array<{
    id: string;
    message?: string;
    peer?: DirectoryUser;
  }>;
  outgoing: Array<{
    id: string;
    message?: string;
    peer?: DirectoryUser;
  }>;
  searchResults: DirectoryUser[];
}

interface ConnectionsSectionProps {
  onPendingCountChange?: (count: number) => void;
}

export function ConnectionsSection({ onPendingCountChange }: ConnectionsSectionProps) {
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');
  const [data, setData] = useState<ConnectionStateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiedMyId, setCopiedMyId] = useState(false);

  const loadData = useCallback(
    async (searchTerm = '') => {
      setLoading(true);
      try {
        const qs = searchTerm.trim() ? `?q=${encodeURIComponent(searchTerm.trim())}` : '';
        const res = await fetch(`/api/connections${qs}`);
        if (res.ok) {
          const payload = (await res.json()) as ConnectionStateResponse;
          setData(payload);
          onPendingCountChange?.(payload.incoming.length);
        }
      } finally {
        setLoading(false);
      }
    },
    [onPendingCountChange]
  );

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadData();
    });
  }, [loadData]);

  async function runAction(payload: Record<string, unknown>, msg: string) {
    const res = await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const resJson = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setFeedback(resJson.error || 'Action failed.');
      return;
    }
    setFeedback(msg);
    setNote('');
    await loadData(query);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6D28D9] dark:text-[#C4B5FD]">
            Permanent SamayYudh Identity
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Share your non-sequential Public ID or <span className="font-mono">@username</span> with students and faculty to connect securely without exposing email or internal UUIDs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!data?.identity?.publicId) return;
            navigator.clipboard?.writeText(data.identity.publicId);
            setCopiedMyId(true);
            setTimeout(() => setCopiedMyId(false), 1600);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EAE6F5] dark:bg-[#231B3E] text-[#6D28D9] dark:text-[#DDD6FE] font-mono text-sm font-semibold shrink-0 cursor-pointer"
        >
          <span>{data?.identity?.publicId || 'SY-PENDING'}</span>
          {copiedMyId ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Find Teachers &amp; Students Globally
        </h3>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exact @username, name, or SY-XXXXXXXX..."
              className="w-full rounded-2xl bg-stone-100 dark:bg-[#162032] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional invitation note..."
            className="sm:w-64 rounded-2xl bg-stone-100 dark:bg-[#162032] px-3.5 py-2.5 text-xs focus:outline-none"
          />
          <button
            type="button"
            onClick={() => loadData(query)}
            className="px-5 py-2.5 rounded-2xl bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
          >
            Search Directory
          </button>
        </div>

        {feedback && (
          <div className="rounded-2xl bg-[#EAE6F5]/80 dark:bg-[#231B3E] px-4 py-2.5 text-xs font-medium text-[#6D28D9] dark:text-[#DDD6FE]">
            {feedback}
          </div>
        )}

        {(data?.searchResults || []).length > 0 && (
          <div className="space-y-2.5 pt-1">
            {data?.searchResults.map((u) => (
              <div
                key={u.user_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50/90 dark:bg-[#162032] hover:bg-[#EAE6F5]/45 dark:hover:bg-[#1B2740] transition-colors"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {u.display_name}
                    </p>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white dark:bg-[#111A2E] text-slate-700 dark:text-slate-200">
                      {u.public_id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAE6F5] dark:bg-[#231B3E] text-[#564AE6] dark:text-[#C4B5FD] capitalize">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {u.username ? `@${u.username}` : 'No handle set'}
                    {u.preferred_exam ? ` · ${u.preferred_exam}` : ''}
                  </p>
                </div>

                <div>
                  {u.connection_status === 'connected' ? (
                    <span className="px-3 py-1.5 rounded-2xl bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs font-semibold">
                      Connected
                    </span>
                  ) : u.connection_status === 'pending_sent' ? (
                    <span className="px-3 py-1.5 rounded-2xl bg-amber-500/12 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-xs font-semibold">
                      Request Sent
                    </span>
                  ) : u.connection_status === 'blocked' ? (
                    <span className="px-3 py-1.5 rounded-2xl bg-rose-500/12 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 text-xs font-semibold">
                      Blocked
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          { action: 'send', targetUserId: u.user_id, message: note },
                          `Sent connection request to ${u.display_name}.`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#635BFF] hover:bg-[#564AE6] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Incoming &amp; Outgoing Requests
          </h3>

          {loading ? (
            <p className="text-xs text-slate-400">Loading requests...</p>
          ) : (data?.incoming.length || 0) === 0 && (data?.outgoing.length || 0) === 0 ? (
            <div className="py-8 text-center rounded-2xl bg-stone-50 dark:bg-[#162032] text-xs text-slate-500">
              No pending connection requests right now.
            </div>
          ) : (
            <div className="space-y-2">
              {data?.incoming.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EAE6F5]/45 dark:bg-[#231B3E]/55"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {r.peer?.display_name || 'SamayYudh Member'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {r.peer?.public_id} {r.message ? `· "${r.message}"` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          { action: 'accept', requestId: r.id },
                          'Connection accepted.'
                        )
                      }
                      className="p-2 rounded-xl bg-emerald-600 text-white cursor-pointer"
                      title="Accept"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          { action: 'reject', requestId: r.id },
                          'Request declined.'
                        )
                      }
                      className="p-2 rounded-xl bg-rose-100 text-rose-600 cursor-pointer"
                      title="Reject"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {data?.outgoing.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-[#162032]"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {r.peer?.display_name || 'Pending Recipient'}
                    </p>
                    <p className="text-xs text-slate-500">Outgoing · {r.peer?.public_id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      runAction({ action: 'cancel', requestId: r.id }, 'Invitation cancelled.')
                    }
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111A2E] text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#111A2E] p-5 shadow-[0_6px_24px_-6px_rgba(88,28,135,0.05)] space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Active Connections ({data?.connections.length ?? 0})
          </h3>

          {(data?.connections || []).length === 0 ? (
            <div className="py-8 text-center rounded-2xl bg-stone-50 dark:bg-[#162032] space-y-1.5">
              <Users className="w-7 h-7 mx-auto text-slate-400" />
              <p className="text-xs text-slate-500">
                No active connections yet. Search by @username or SY-ID above.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {data?.connections.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-[#162032]"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {c.peer?.display_name || 'Connected Member'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {c.peer?.public_id}
                      {c.peer?.username ? ` · @${c.peer.username}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          { action: 'remove', connectionId: c.id },
                          'Connection removed.'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#111A2E] text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      Remove
                    </button>
                    {c.peer && (
                      <button
                        type="button"
                        onClick={() =>
                          runAction(
                            { action: 'block', targetUserId: c.peer?.user_id },
                            'User blocked.'
                          )
                        }
                        className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 cursor-pointer"
                        title="Block user"
                      >
                        <ShieldBan className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
