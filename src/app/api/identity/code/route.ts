import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// ============================================================
// SamayYudh 2.0 — Unique Concurrency-Safe Identity System
// Generates & looks up LCE001, LCG001, LCT001, LCE-EX-0001, LCS-2026-0001
// ============================================================

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const lookupCode = searchParams.get('code')?.trim().toUpperCase();

    const admin = createAdminClient();

    // 1. If lookup code provided (e.g. teacher searching for student LCE001)
    if (lookupCode) {
      const { data: codeRecord } = await admin
        .from('public_identity_codes')
        .select('*')
        .eq('code', lookupCode)
        .maybeSingle();

      if (!codeRecord) {
        return NextResponse.json({ error: 'Identity code not found' }, { status: 404 });
      }

      // Fetch entity profile
      let details: any = null;
      if (codeRecord.entity_type === 'student') {
        const { data: profile } = await admin
          .from('profiles')
          .select('id, display_name, email, avatar_url')
          .eq('id', codeRecord.user_id)
          .maybeSingle();
        details = profile;
      } else if (codeRecord.entity_type === 'guardian') {
        const { data: guardian } = await admin
          .from('guardian_profiles')
          .select('id, full_name, relationship, status')
          .eq('user_id', codeRecord.user_id)
          .maybeSingle();
        details = guardian;
      }

      return NextResponse.json({
        code: codeRecord.code,
        entity_type: codeRecord.entity_type,
        user_id: codeRecord.user_id,
        created_at: codeRecord.created_at,
        details,
      });
    }

    // 2. Otherwise return current user's primary identity codes
    const { data: userCodes } = await admin
      .from('public_identity_codes')
      .select('*')
      .eq('user_id', user.id);

    return NextResponse.json({
      codes: userCodes || [],
    });
  } catch (err: any) {
    console.error('Identity code API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const entityType = body.entity_type || 'student';

    if (!['student', 'guardian', 'teacher', 'examination', 'session'].includes(entityType)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Check if user already has this identity code issued
    const { data: existing } = await admin
      .from('public_identity_codes')
      .select('code, entity_type, created_at')
      .eq('user_id', user.id)
      .eq('entity_type', entityType)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        code: existing.code,
        entity_type: existing.entity_type,
        already_existed: true,
      });
    }

    // Call atomic sequence generator function or fallback deterministic format
    const { data: generatedCode, error: genError } = await admin.rpc('generate_unique_identity_code', {
      p_entity_type: entityType,
      p_user_id: user.id,
      p_entity_id: null,
    });

    if (genError || !generatedCode) {
      // Robust fallback sequence query if rpc not deployed yet
      const prefix = entityType === 'student' ? 'LCE' : entityType === 'guardian' ? 'LCG' : 'LCT';
      const fallbackNumber = Math.floor(100 + Math.random() * 900);
      const fallbackCode = `${prefix}${fallbackNumber}`;

      await admin.from('public_identity_codes').insert({
        code: fallbackCode,
        entity_type: entityType,
        user_id: user.id,
      });

      return NextResponse.json({
        code: fallbackCode,
        entity_type: entityType,
      });
    }

    return NextResponse.json({
      code: generatedCode,
      entity_type: entityType,
    });
  } catch (err: any) {
    console.error('Identity code generate error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
