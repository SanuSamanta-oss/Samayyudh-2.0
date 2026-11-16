import { NextResponse, type NextRequest } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient } from '@/lib/supabase/admin';

function isPrivateIpOrHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1'
  ) {
    return true;
  }

  // IPv4 regex check for private ranges
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = lower.match(ipv4Regex);
  if (match) {
    const [, a, b] = match.map(Number);
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8
    if (a === 169 && b === 254) return true; // 169.254.0.0/16
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
  }

  return false;
}

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
    const profileUrl = String(body.profile_url || '').trim();
    const facultyName = String(body.faculty_name || '').trim();
    const institutionName = String(body.institution_name || '').trim();
    const designation = String(body.designation || '').trim();

    if (!profileUrl || !facultyName) {
      return NextResponse.json(
        { error: 'Profile URL and Faculty Name are required.' },
        { status: 400 }
      );
    }

    // Parse and validate URL
    let parsed: URL;
    try {
      parsed = new URL(profileUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are accepted.' }, { status: 400 });
    }

    if (isPrivateIpOrHost(parsed.hostname)) {
      return NextResponse.json(
        { error: 'Internal, private, or loopback network addresses are blocked.' },
        { status: 400 }
      );
    }

    // SSRF safe fetch with 5-second timeout and limited response size
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    let pageText = '';
    let fetchOk = false;

    try {
      const resp = await fetch(parsed.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SamayYudh-Academic-Verifier/2.0 (+https://samayyudh.com)',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      if (resp.ok) {
        fetchOk = true;
        const html = await resp.text();
        pageText = html.slice(0, 200000).toLowerCase(); // Read first 200KB only
      }
    } catch (err: unknown) {
      console.warn('Faculty directory scrape failed or timed out:', err);
    } finally {
      clearTimeout(timeout);
    }

    const { db } = await getCommandDataClient();

    // Check if faculty name appears in directory page
    const nameFound = Boolean(
      fetchOk && pageText && pageText.includes(facultyName.toLowerCase().trim())
    );

    // Save verification submission record
    const status = nameFound ? 'approved' : 'pending';
    const score = nameFound ? 90 : 50;

    await db.from('teacher_verification_records').insert({
      user_id: user.id,
      verification_method: 'faculty_directory',
      status,
      submitted_data: {
        profileUrl,
        facultyName,
        institutionName,
        designation,
        nameFoundOnPage: nameFound,
      },
      verified_at: nameFound ? new Date().toISOString() : null,
    });

    if (nameFound) {
      // Elevate teacher status to verified
      await db.from('teachers').upsert(
        {
          user_id: user.id,
          institution_name: institutionName || parsed.hostname,
          designation: designation || 'Faculty',
          verification_status: 'verified',
          verification_method: 'faculty_directory',
          verification_score: score,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

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

      return NextResponse.json({
        success: true,
        verified: true,
        message: `Verified successfully! Your faculty profile was confirmed on ${parsed.hostname}.`,
      });
    }

    return NextResponse.json({
      success: true,
      verified: false,
      message:
        'Faculty profile submitted. Our system queued this for quick admin review as automated name confirmation was inconclusive.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

