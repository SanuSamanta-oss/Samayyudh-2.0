import { NextRequest, NextResponse } from 'next/server';
import { extractClientIp, requireCommandSession, writeAuditLog } from '@/lib/security/admin-auth';
import { isMissingSchemaError } from '@/lib/supabase/admin';
import type { ResourceCategory, ResourceVisibility } from '@/types/admin';

const BUCKET_NAME = 'educational-resources';
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'docx',
  'doc',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'csv',
  'xlsx',
  'xls',
]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

export async function GET(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const sp = req.nextUrl.searchParams;
  const search = (sp.get('search') || '').trim().toLowerCase();
  const category = sp.get('category') || '';
  const visibility = sp.get('visibility') || '';
  const subject = sp.get('subject') || '';

  const { data, error } = await guard.ctx.db
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    if (isMissingSchemaError(error)) {
      return NextResponse.json({ schemaReady: false, items: [], total: 0 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  let rows = data || [];
  if (search) {
    rows = rows.filter(
      (r) =>
        String(r.title || '').toLowerCase().includes(search) ||
        String(r.file_name || '').toLowerCase().includes(search) ||
        String(r.subject || '').toLowerCase().includes(search)
    );
  }
  if (category) rows = rows.filter((r) => r.category === category);
  if (visibility) rows = rows.filter((r) => r.visibility === visibility);
  if (subject) rows = rows.filter((r) => r.subject === subject);

  const items = await Promise.all(
    rows.map(async (row) => {
      let signedUrl: string | null = null;
      if (row.file_path) {
        const { data: signed } = await guard.ctx.db.storage
          .from(BUCKET_NAME)
          .createSignedUrl(row.file_path, 3600);
        signedUrl = signed?.signedUrl ?? null;
      }
      return {
        ...row,
        signed_url: signedUrl,
      };
    })
  );

  return NextResponse.json({
    schemaReady: true,
    total: items.length,
    items,
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const ipAddress = extractClientIp(req);

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Invalid multipart upload payload.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A valid file must be attached.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `Unsupported file type ".${ext}". Allowed: PDF, DOCX, Images, CSV, XLSX.` },
      { status: 400 }
    );
  }

  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: 'File size must be between 1 byte and 25 MB.' },
      { status: 400 }
    );
  }

  const title = String(formData.get('title') || file.name.replace(/\.[^.]+$/, '')).trim();
  const description = String(formData.get('description') || '').trim();
  const category = (String(formData.get('category') || 'reference_pdf') as ResourceCategory) || 'reference_pdf';
  const subject = String(formData.get('subject') || 'General').trim();
  const examCode = String(formData.get('exam_code') || 'GENERAL').trim();
  const chapter = String(formData.get('chapter') || '').trim();
  const topic = String(formData.get('topic') || '').trim();
  const visibility = (String(formData.get('visibility') || 'personal') as ResourceVisibility) || 'personal';
  const classroomId = String(formData.get('classroomId') || '').trim() || null;
  const groupId = String(formData.get('groupId') || '').trim() || null;

  const safeName = sanitizeFilename(file.name);
  const filePath = `${ctx.user.id}/${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (ctx.hasServiceRole) {
    await ctx.db.storage
      .createBucket(BUCKET_NAME, { public: false, fileSizeLimit: MAX_UPLOAD_BYTES })
      .catch(() => undefined);
  }

  const { error: uploadErr } = await ctx.db.storage
    .from(BUCKET_NAME)
    .upload(filePath, bytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadErr) {
    return NextResponse.json({ error: `Storage upload failed: ${uploadErr.message}` }, { status: 400 });
  }

  const { data: created, error: dbErr } = await ctx.db
    .from('resources')
    .insert({
      title,
      description,
      file_name: file.name,
      mime_type: file.type || 'application/octet-stream',
      file_size: file.size,
      bucket_id: BUCKET_NAME,
      file_path: filePath,
      category,
      subject,
      exam_code: examCode,
      chapter,
      topic,
      visibility,
      uploaded_by: ctx.user.id,
      classroom_id: classroomId,
      group_id: groupId,
    })
    .select('*')
    .single();

  if (dbErr) {
    await ctx.db.storage.from(BUCKET_NAME).remove([filePath]).catch(() => undefined);
    if (isMissingSchemaError(dbErr)) {
      return NextResponse.json({ error: 'Run admin_command_center.sql first.', schemaReady: false }, { status: 503 });
    }
    return NextResponse.json({ error: dbErr.message }, { status: 400 });
  }

  if (classroomId || groupId) {
    await ctx.db.from('resource_permissions').insert({
      resource_id: created.id,
      classroom_id: classroomId,
      group_id: groupId,
      can_download: true,
    });
  }

  const { data: signed } = await ctx.db.storage.from(BUCKET_NAME).createSignedUrl(filePath, 3600);

  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'resource.uploaded',
    targetType: 'resource',
    targetId: String(created.id),
    ipAddress,
    metadata: { fileName: file.name, visibility, category },
  });

  return NextResponse.json(
    {
      success: true,
      resource: {
        ...created,
        signed_url: signed?.signedUrl ?? null,
      },
    },
    { status: 201 }
  );
}

export async function PATCH(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    title?: string;
    visibility?: ResourceVisibility;
    classroom_id?: string | null;
    group_id?: string | null;
  };

  if (!body.id) {
    return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.title === 'string' && body.title.trim()) updates.title = body.title.trim();
  if (body.visibility) updates.visibility = body.visibility;
  if (body.classroom_id !== undefined) updates.classroom_id = body.classroom_id;
  if (body.group_id !== undefined) updates.group_id = body.group_id;

  let query = ctx.db.from('resources').update(updates).eq('id', body.id);
  if (ctx.role === 'teacher') query = query.eq('uploaded_by', ctx.user.id);
  const { data, error } = await query.select('*').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, resource: data });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireCommandSession(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  const ipAddress = extractClientIp(req);
  const body = (await req.json().catch(() => ({}))) as { id?: string };

  if (!body.id) {
    return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
  }

  let fetchQuery = ctx.db
    .from('resources')
    .select('id, file_path, uploaded_by')
    .eq('id', body.id);
  if (ctx.role === 'teacher') fetchQuery = fetchQuery.eq('uploaded_by', ctx.user.id);

  const { data: target, error: fetchErr } = await fetchQuery.maybeSingle();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 });
  if (!target) return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });

  if (target.file_path) {
    await ctx.db.storage.from(BUCKET_NAME).remove([target.file_path]).catch(() => undefined);
  }
  await ctx.db.from('resources').delete().eq('id', target.id);

  await writeAuditLog(ctx.db, {
    actorId: ctx.user.id,
    actorRole: ctx.role,
    action: 'resource.deleted',
    targetType: 'resource',
    targetId: target.id,
    ipAddress,
  });

  return NextResponse.json({ success: true });
}
