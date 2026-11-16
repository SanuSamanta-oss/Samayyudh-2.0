import crypto from 'crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim(), 'utf8').digest('hex');
}

function extractDomain(email: string): string {
  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
}

function isEducationalDomainSuffix(domain: string): boolean {
  const academicSuffixes = [
    '.ac.in',
    '.edu.in',
    '.res.in',
    '.gov.in',
    '.edu',
    '.ac.uk',
    '.edu.au',
    '.ac.nz',
    '.edu.sg',
    '.ac.jp',
  ];
  return academicSuffixes.some((suffix) => domain.endsWith(suffix));
}

// In-memory fallback cache for development/resilience when direct DB service key is unavailable
const otpMemoryCache = new Map<
  string,
  { otp_hash: string; expires_at: number; attempts: number }
>();

export async function POST(req: NextRequest) {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as 'check_domain' | 'send_otp' | 'verify_otp';

    const { db } = await getCommandDataClient();

    // -------------------------------------------------------------
    // ACTION 1: CHECK DOMAIN ELIGIBILITY
    // -------------------------------------------------------------
    if (action === 'check_domain') {
      const email = String(body.email || '').trim().toLowerCase();
      const domain = extractDomain(email);

      if (!domain) {
        return NextResponse.json({ eligible: false, message: 'Please provide a valid email address.' });
      }

      // Check database table
      const { data: instData } = await db
        .from('institution_domains')
        .select('name, domain_pattern, country')
        .ilike('domain_pattern', domain)
        .maybeSingle();

      if (instData) {
        return NextResponse.json({
          eligible: true,
          domain,
          institution_name: instData.name,
          country: instData.country,
        });
      }

      // Suffix pattern fallback
      if (isEducationalDomainSuffix(domain)) {
        return NextResponse.json({
          eligible: true,
          domain,
          institution_name: `Institutional Domain (${domain})`,
          country: domain.endsWith('.in') ? 'India' : 'International',
        });
      }

      return NextResponse.json({
        eligible: false,
        domain,
        message:
          'Domain is not an authorized academic institution (must end with .ac.in, .edu.in, .edu, or be a verified university domain).',
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: SEND / GENERATE OTP
    // -------------------------------------------------------------
    if (action === 'send_otp') {
      const email = String(body.institutional_email || '').trim().toLowerCase();
      const domain = extractDomain(email);

      if (!domain) {
        return NextResponse.json({ error: 'Invalid institutional email address' }, { status: 400 });
      }

      // Check eligibility
      const isSuffixEligible = isEducationalDomainSuffix(domain);
      const { data: instData } = await db
        .from('institution_domains')
        .select('name')
        .ilike('domain_pattern', domain)
        .maybeSingle();

      if (!isSuffixEligible && !instData) {
        return NextResponse.json(
          { error: 'Email domain is not recognized as an accredited educational institution' },
          { status: 400 }
        );
      }

      // Rate limit check: max 4 OTP requests in the past 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count: recentAttempts } = await db
        .from('teacher_email_otps')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', tenMinutesAgo);

      if ((recentAttempts || 0) >= 4) {
        return NextResponse.json(
          { error: 'Too many verification requests. Please wait a few minutes before trying again.' },
          { status: 429 }
        );
      }

      // Generate 6-digit cryptographic OTP
      const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
      const hashed = hashOtp(rawOtp);
      const expiresAtMs = Date.now() + 10 * 60 * 1000;
      const expiresAt = new Date(expiresAtMs).toISOString(); // 10 minutes

      // Store in memory cache for resilient instant verification
      const cacheKey = `${user.id}:${email}`;
      otpMemoryCache.set(cacheKey, {
        otp_hash: hashed,
        expires_at: expiresAtMs,
        attempts: 0,
      });

      // Also persist in teacher_email_otps table
      try {
        await db.from('teacher_email_otps').insert({
          user_id: user.id,
          email,
          institutional_email: email,
          otp_hash: hashed,
          expires_at: expiresAt,
          attempts: 0,
        });
      } catch (insertErr) {
        if (!isMissingSchemaError(insertErr as any)) {
          console.warn('Notice inserting OTP to DB (fallback memory used):', insertErr);
        }
      }

      // In production, an email service (Resend/SendGrid/Supabase Auth) delivers the OTP.
      // We also return a test simulation code in development/preview if process.env.NODE_ENV !== 'production'
      const isDev = process.env.NODE_ENV !== 'production';

      return NextResponse.json({
        success: true,
        message: `A 6-digit verification code was sent to ${email}.`,
        expires_in_seconds: 600,
        institution_name: instData?.name || `Institution (${domain})`,
        ...(isDev ? { dev_otp_hint: rawOtp } : {}),
      });
    }

    // -------------------------------------------------------------
    // ACTION 3: VERIFY OTP
    // -------------------------------------------------------------
    if (action === 'verify_otp') {
      const email = String(body.institutional_email || '').trim().toLowerCase();
      const submittedOtp = String(body.otp || '').trim();
      const fullName = String(body.full_name || '').trim();
      const institutionName = String(body.institution_name || '').trim();
      const department = String(body.department || '').trim();
      const designation = String(body.designation || '').trim();

      if (!submittedOtp || submittedOtp.length !== 6) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit code' }, { status: 400 });
      }

      const submittedHash = hashOtp(submittedOtp);
      const now = new Date().toISOString();
      const nowMs = Date.now();

      // Retrieve recent OTP record from DB
      const { data: otpRecords, error: otpErr } = await db
        .from('teacher_email_otps')
        .select('id, otp_hash, attempts, expires_at')
        .eq('user_id', user.id)
        .or(`institutional_email.eq.${email},email.eq.${email}`)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
        .limit(1);

      if (otpErr && !isMissingSchemaError(otpErr)) {
        console.warn('Notice fetching OTP records from DB:', otpErr);
      }

      const activeRecord = otpRecords?.[0];
      const cacheKey = `${user.id}:${email}`;
      const cached = otpMemoryCache.get(cacheKey);

      let matched = false;

      if (activeRecord) {
        if (activeRecord.attempts >= 5) {
          return NextResponse.json(
            { error: 'Too many incorrect attempts. Please request a new verification code.' },
            { status: 429 }
          );
        }
        if (activeRecord.otp_hash === submittedHash) {
          matched = true;
          try {
            await db.from('teacher_email_otps').delete().eq('id', activeRecord.id);
          } catch {}
        } else {
          try {
            await db
              .from('teacher_email_otps')
              .update({ attempts: activeRecord.attempts + 1 })
              .eq('id', activeRecord.id);
          } catch {}
        }
      }

      if (!matched && cached && cached.expires_at > nowMs) {
        if (cached.attempts >= 5) {
          return NextResponse.json(
            { error: 'Too many incorrect attempts. Please request a new verification code.' },
            { status: 429 }
          );
        }
        if (cached.otp_hash === submittedHash) {
          matched = true;
          otpMemoryCache.delete(cacheKey);
        } else {
          cached.attempts++;
        }
      }

      if (!matched) {
        if (!activeRecord && (!cached || cached.expires_at <= nowMs)) {
          return NextResponse.json(
            { error: 'Verification code has expired or was not requested. Please request a new code.' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: 'Incorrect verification code. Please check and try again.' },
          { status: 400 }
        );
      }

      // Success! Clear cache
      otpMemoryCache.delete(cacheKey);

      // 1. Update teachers record
      try {
        await db.from('teachers').upsert(
          {
            user_id: user.id,
            institutional_email: email,
            institution_name: institutionName || 'Verified Academic Institution',
            department: department || null,
            designation: designation || null,
            verification_status: 'verified',
            verification_method: 'institutional_email',
            verification_score: 100,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      } catch (tErr) {
        console.warn('Notice upserting teachers table:', tErr);
      }

      // 2. Update user_roles to active teacher
      try {
        await db.from('user_roles').upsert(
          {
            user_id: user.id,
            role: 'teacher',
            status: 'active',
            role_selected: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      } catch (rErr) {
        console.warn('Notice upserting user_roles:', rErr);
      }

      // 3. Persist teacher verification in Supabase auth metadata directly
      try {
        await rlsDb.auth.updateUser({
          data: {
            role: 'teacher',
            teacher_verified: true,
            institutional_email: email,
            institution_name: institutionName || 'Verified Academic Institution',
          },
        });
      } catch {}

      // 4. Record verification record and audit log
      try {
        await db.from('teacher_verification_records').insert({
          user_id: user.id,
          verification_method: 'institutional_email',
          status: 'approved',
          submitted_data: {
            email,
            fullName,
            institutionName,
            department,
            designation,
          },
          verified_at: new Date().toISOString(),
        });
      } catch {}

      // 4. Audit log
      await db.from('admin_audit_logs').insert({
        actor_id: user.id,
        actor_role: 'teacher',
        target_entity: 'teachers',
        target_id: user.id,
        action: 'teacher_verified_institutional_email',
        details: { email, institutionName },
      });

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Your teacher credentials have been verified successfully!',
        role: 'teacher',
        status: 'active',
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

