import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { CommandRole } from '@/types/admin';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/load-balancer';

export const COMMAND_SESSION_COOKIE = 'sy_cmd_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MINUTES = 15;

export interface CommandSessionPayload {
  sid: string;
  uid: string;
  role: CommandRole;
  iat: number;
  exp: number;
}

export interface CommandAuthContext {
  user: User;
  role: CommandRole;
  unlocked: boolean;
  sessionId: string | null;
  expiresAt: string | null;
  accountStatus: 'active' | 'suspended' | 'archived';
  passkeyConfigured: boolean;
  schemaReady: boolean;
  db: SupabaseClient;
  hasServiceRole: boolean;
}

const PRIVILEGED_ROLES: CommandRole[] = ['super_admin', 'admin', 'teacher'];

export function isPrivilegedRole(role: CommandRole): boolean {
  return PRIVILEGED_ROLES.includes(role);
}

export function isPasskeyConfigured(): boolean {
  return Boolean(
    (process.env.ADMIN_COMMAND_PASSKEY && process.env.ADMIN_COMMAND_PASSKEY.trim().length > 0) ||
      (process.env.ADMIN_COMMAND_PASSKEY_HASH && process.env.ADMIN_COMMAND_PASSKEY_HASH.trim().length > 0)
  );
}

function getSigningSecret(): string | null {
  if (
    process.env.ADMIN_COMMAND_SESSION_SECRET &&
    process.env.ADMIN_COMMAND_SESSION_SECRET.trim().length >= 16
  ) {
    return process.env.ADMIN_COMMAND_SESSION_SECRET.trim();
  }
  const passkeyMaterial = process.env.ADMIN_COMMAND_PASSKEY_HASH || process.env.ADMIN_COMMAND_PASSKEY;
  if (!passkeyMaterial) return null;

  return crypto
    .createHash('sha256')
    .update(`sy-cmd-session-key:${passkeyMaterial}:${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`)
    .digest('hex');
}

function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

export function hashToken(token: string): string {
  return sha256Hex(token);
}

export function verifyPasskeyConstantTime(candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  if (!trimmed) return false;

  const expectedHashEnv = process.env.ADMIN_COMMAND_PASSKEY_HASH?.trim();
  if (expectedHashEnv) {
    const cleanHex = expectedHashEnv.replace(/^sha256:/i, '').toLowerCase();
    const candidateHex = sha256Hex(trimmed);
    const a = Buffer.from(candidateHex, 'hex');
    const b = Buffer.from(cleanHex, 'hex');
    if (a.length !== b.length || a.length !== 32) return false;
    return crypto.timingSafeEqual(a, b);
  }

  const expectedPlain = process.env.ADMIN_COMMAND_PASSKEY?.trim();
  if (!expectedPlain) return false;

  const a = crypto.createHash('sha256').update(trimmed, 'utf8').digest();
  const b = crypto.createHash('sha256').update(expectedPlain, 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

export function signCommandSessionToken(payload: CommandSessionPayload): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyCommandSessionToken(token: string | undefined | null): CommandSessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const secret = getSigningSecret();
  if (!secret) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expectedSig, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as CommandSessionPayload;
    if (!parsed || !parsed.uid || !parsed.sid || typeof parsed.exp !== 'number') {
      return null;
    }
    if (Date.now() > parsed.exp * 1000) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function extractClientIp(req?: NextRequest | Request): string {
  if (!req) return 'unknown';
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

function getSuperAdminEmails(): string[] {
  const raw = process.env.SUPER_ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function resolveUserCommandRole(
  db: SupabaseClient,
  user: User
): Promise<{ role: CommandRole; accountStatus: 'active' | 'suspended' | 'archived'; schemaReady: boolean }> {
  const superEmails = getSuperAdminEmails();
  const userEmail = (user.email || '').toLowerCase();
  const isOwnerEmail = Boolean(userEmail && superEmails.includes(userEmail));

  const [{ data: roleRow, error: roleErr }, { data: profRow }] = await Promise.all([
    db.from('user_roles').select('role').eq('user_id', user.id).maybeSingle(),
    db.from('profiles').select('account_status').eq('id', user.id).maybeSingle(),
  ]);

  const accountStatus =
    (profRow?.account_status as 'active' | 'suspended' | 'archived') || 'active';

  if (roleErr) {
    return {
      role: isOwnerEmail ? 'super_admin' : 'student',
      accountStatus,
      schemaReady: !isMissingSchemaError(roleErr),
    };
  }

  if (roleRow) {
    const resolvedRole = (roleRow.role as CommandRole) || 'student';
    if (isOwnerEmail && resolvedRole !== 'super_admin') {
      await db
        .from('user_roles')
        .update({ role: 'super_admin', updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      return {
        role: 'super_admin',
        accountStatus,
        schemaReady: true,
      };
    }
    return {
      role: resolvedRole,
      accountStatus,
      schemaReady: true,
    };
  }

  const initialRole: CommandRole = isOwnerEmail ? 'super_admin' : 'student';
  if (isOwnerEmail) {
    await db.from('user_roles').upsert(
      { user_id: user.id, role: 'super_admin' },
      { onConflict: 'user_id' }
    );
  }

  return {
    role: initialRole,
    accountStatus,
    schemaReady: true,
  };
}

export async function getCommandAuthContext(req?: NextRequest): Promise<{
  authenticated: boolean;
  context: CommandAuthContext | null;
}> {
  const { db, rlsDb, hasServiceRole } = await getCommandDataClient();
  const {
    data: { user },
    error,
  } = await rlsDb.auth.getUser();

  if (error || !user) {
    return { authenticated: false, context: null };
  }

  const { role, accountStatus, schemaReady } = await resolveUserCommandRole(db, user);
  const passkeyConfigured = isPasskeyConfigured();

  const cookieStore = req ? req.cookies : await cookies();
  const rawToken = cookieStore.get(COMMAND_SESSION_COOKIE)?.value;
  const parsed = verifyCommandSessionToken(rawToken);

  let unlocked = false;
  let sessionId: string | null = null;
  let expiresAt: string | null = null;

  if (
    parsed &&
    parsed.uid === user.id &&
    isPrivilegedRole(role) &&
    accountStatus === 'active'
  ) {
    if (schemaReady) {
      const { data: sessionRow, error: sessErr } = await db
        .from('admin_command_sessions')
        .select('id, revoked_at, expires_at')
        .eq('id', parsed.sid)
        .eq('user_id', user.id)
        .maybeSingle();

      if (sessErr && isMissingSchemaError(sessErr)) {
        unlocked = true;
        sessionId = parsed.sid;
        expiresAt = new Date(parsed.exp * 1000).toISOString();
      } else if (
        sessionRow &&
        !sessionRow.revoked_at &&
        new Date(sessionRow.expires_at).getTime() > Date.now()
      ) {
        unlocked = true;
        sessionId = sessionRow.id;
        expiresAt = sessionRow.expires_at;
      }
    } else {
      unlocked = true;
      sessionId = parsed.sid;
      expiresAt = new Date(parsed.exp * 1000).toISOString();
    }
  }

  return {
    authenticated: true,
    context: {
      user,
      role,
      unlocked,
      sessionId,
      expiresAt,
      accountStatus,
      passkeyConfigured,
      schemaReady,
      db,
      hasServiceRole,
    },
  };
}

export async function requireCommandSession(
  req?: NextRequest,
  allowedRoles: CommandRole[] = PRIVILEGED_ROLES
): Promise<{ ok: true; ctx: CommandAuthContext } | { ok: false; response: NextResponse }> {
  const { authenticated, context } = await getCommandAuthContext(req);
  if (!authenticated || !context) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }
  if (context.accountStatus !== 'active') {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Account is suspended or archived' }, { status: 403 }),
    };
  }
  if (!isPrivilegedRole(context.role) || !allowedRoles.includes(context.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Insufficient role permissions for Command Center action' },
        { status: 403 }
      ),
    };
  }
  if (!context.unlocked) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Command passkey session required or expired' },
        { status: 401 }
      ),
    };
  }
  return { ok: true, ctx: context };
}

export async function checkPasskeyLockout(
  db: SupabaseClient,
  userId: string,
  ipAddress: string
): Promise<{
  allowed: boolean;
  failedCount: number;
  remainingAttempts: number;
  lockedUntil: string | null;
}> {
  const rl = await checkRateLimit(`admin-unlock:${userId}:${ipAddress}`, 'ai');
  if (!rl.success) {
    return {
      allowed: false,
      failedCount: MAX_FAILED_ATTEMPTS,
      remainingAttempts: 0,
      lockedUntil: new Date(Date.now() + 60_000).toISOString(),
    };
  }

  const attemptKey = `${userId}:${ipAddress}`;
  const { data: row, error } = await db
    .from('admin_passkey_attempts')
    .select('failed_count, locked_until')
    .eq('identifier', attemptKey)
    .maybeSingle();

  if (error || !row) {
    return {
      allowed: true,
      failedCount: 0,
      remainingAttempts: MAX_FAILED_ATTEMPTS,
      lockedUntil: null,
    };
  }

  if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) {
    return {
      allowed: false,
      failedCount: row.failed_count || MAX_FAILED_ATTEMPTS,
      remainingAttempts: 0,
      lockedUntil: row.locked_until,
    };
  }

  const fails = row.failed_count || 0;
  return {
    allowed: true,
    failedCount: fails,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - fails),
    lockedUntil: null,
  };
}

export async function recordPasskeyAttempt(
  db: SupabaseClient,
  params: { userId: string; ipAddress: string; userAgent?: string; success: boolean }
): Promise<void> {
  const attemptKey = `${params.userId}:${params.ipAddress}`;

  if (params.success) {
    await db
      .from('admin_passkey_attempts')
      .upsert(
        {
          identifier: attemptKey,
          failed_count: 0,
          locked_until: null,
          last_attempt_at: new Date().toISOString(),
        },
        { onConflict: 'identifier' }
      )
      .then(() => undefined);
    return;
  }

  const { data: existing } = await db
    .from('admin_passkey_attempts')
    .select('failed_count')
    .eq('identifier', attemptKey)
    .maybeSingle();

  const nextFails = (existing?.failed_count || 0) + 1;
  const lockedUntil =
    nextFails >= MAX_FAILED_ATTEMPTS
      ? new Date(Date.now() + LOCKOUT_WINDOW_MINUTES * 60_000).toISOString()
      : null;

  await db
    .from('admin_passkey_attempts')
    .upsert(
      {
        identifier: attemptKey,
        failed_count: nextFails,
        locked_until: lockedUntil,
        last_attempt_at: new Date().toISOString(),
      },
      { onConflict: 'identifier' }
    )
    .then(() => undefined);
}

export async function createCommandSessionCookie(
  db: SupabaseClient,
  params: { userId: string; role: CommandRole; ipAddress: string; userAgent: string }
): Promise<{ token: string; sessionId: string; expiresAt: string } | null> {
  const sessionId = crypto.randomUUID();
  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = nowSec + SESSION_TTL_SECONDS;
  const expiresAt = new Date(expSec * 1000).toISOString();

  const token = signCommandSessionToken({
    sid: sessionId,
    uid: params.userId,
    role: params.role,
    iat: nowSec,
    exp: expSec,
  });
  if (!token) return null;

  const { error } = await db.from('admin_command_sessions').insert({
    id: sessionId,
    user_id: params.userId,
    role: params.role,
    token_hash: hashToken(token),
    expires_at: expiresAt,
  });

  if (error && !isMissingSchemaError(error)) {
    console.warn('[AdminAuth] Session persistence warning:', error.message);
  }

  return { token, sessionId, expiresAt };
}

export function attachCommandSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set({
    name: COMMAND_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearCommandSessionCookie(res: NextResponse): void {
  res.cookies.set({
    name: COMMAND_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function writeAuditLog(
  db: SupabaseClient,
  entry: {
    actorId: string | null;
    actorRole?: string;
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
  }
): Promise<void> {
  const { error } = await db.from('audit_logs').insert({
    actor_id: entry.actorId,
    actor_role: entry.actorRole || 'command',
    action: entry.action,
    target_type: entry.targetType ?? null,
    target_id: entry.targetId ?? null,
    metadata: {
      ...(entry.metadata ?? {}),
      ...(entry.ipAddress ? { ip_address: entry.ipAddress } : {}),
    },
  });
  if (error && !isMissingSchemaError(error)) {
    console.warn('[AuditLog] Failed to write audit entry:', error.message);
  }
}
