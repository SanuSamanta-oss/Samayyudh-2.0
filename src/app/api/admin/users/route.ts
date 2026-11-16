import { NextResponse, type NextRequest } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient, isMissingSchemaError } from '@/lib/supabase/admin';
import { getSuperAdminEmails, getCommandAuthContext } from '@/lib/security/admin-auth';

async function checkIsAuthorizedSuperAdmin(req: NextRequest): Promise<boolean> {
  const { authenticated, context } = await getCommandAuthContext(req);
  if (!authenticated || !context || !context.unlocked || context.role !== 'super_admin') {
    return false;
  }

  const email = (context.user.email || '').trim().toLowerCase();
  const superAdminEmails = getSuperAdminEmails();
  return Boolean(email && superAdminEmails.includes(email));
}

export async function GET(req: NextRequest) {
  try {
    const isSuperAdmin = await checkIsAuthorizedSuperAdmin(req);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Super Admin authorization required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'teachers'; // 'super_admins' | 'teachers' | 'students'
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const statusFilter = searchParams.get('status') || 'all';

    const { db } = await getCommandDataClient();

    // Compute Tab Counts
    const [superAdminCountRes, teacherCountRes, studentCountRes] = await Promise.all([
      db.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'super_admin'),
      db.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
      db.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    ]);

    const counts = {
      super_admins: superAdminCountRes.count || 0,
      teachers: teacherCountRes.count || 0,
      students: studentCountRes.count || 0,
    };

    if (tab === 'super_admins') {
      const { data: superRows, error } = await db
        .from('super_admins')
        .select(`
          user_id,
          authorized_by,
          is_active,
          created_at,
          user_roles!inner(role, status)
        `)
        .order('created_at', { ascending: false });

      if (error && !isMissingSchemaError(error)) {
        console.error('Error fetching super_admins:', error);
      }

      // Fetch profiles to get name and email
      const userIds = (superRows || []).map((r) => r.user_id);
      let profilesMap: Record<string, { full_name?: string; email?: string; username?: string }> = {};

      if (userIds.length > 0) {
        const { data: profs } = await db
          .from('profiles')
          .select('id, full_name, username, email')
          .in('id', userIds);
        profs?.forEach((p) => {
          profilesMap[p.id] = p;
        });
      }

      const superAdminsList = (superRows || []).map((row) => {
        const p = profilesMap[row.user_id] || {};
        return {
          id: row.user_id,
          email: p.email || null,
          fullName: p.full_name || p.username || 'Super Administrator',
          role: 'super_admin',
          status: row.is_active ? 'active' : 'suspended',
          authorizedBy: row.authorized_by,
          createdAt: row.created_at,
        };
      });

      return NextResponse.json({
        tab,
        counts,
        items: superAdminsList,
      });
    }

    if (tab === 'teachers') {
      let query = db
        .from('teachers')
        .select(`
          user_id,
          institutional_email,
          institution_name,
          department,
          designation,
          verification_status,
          verification_method,
          verification_score,
          verified_at,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('verification_status', statusFilter);
      }

      const { data: teacherRows, error } = await query;
      if (error && !isMissingSchemaError(error)) {
        console.error('Error querying teachers:', error);
      }

      const userIds = (teacherRows || []).map((t) => t.user_id);
      let profilesMap: Record<string, { full_name?: string; email?: string; username?: string }> = {};

      if (userIds.length > 0) {
        const { data: profs } = await db
          .from('profiles')
          .select('id, full_name, username, email')
          .in('id', userIds);
        profs?.forEach((p) => {
          profilesMap[p.id] = p;
        });
      }

      let items = (teacherRows || []).map((t) => {
        const p = profilesMap[t.user_id] || {};
        return {
          id: t.user_id,
          fullName: p.full_name || p.username || 'Educator',
          email: p.email || t.institutional_email || 'No email',
          institutionalEmail: t.institutional_email,
          institutionName: t.institution_name,
          department: t.department,
          designation: t.designation,
          verificationStatus: t.verification_status,
          verificationMethod: t.verification_method,
          verificationScore: t.verification_score,
          verifiedAt: t.verified_at,
          createdAt: t.created_at,
        };
      });

      if (search) {
        items = items.filter(
          (item) =>
            item.fullName.toLowerCase().includes(search) ||
            item.email.toLowerCase().includes(search) ||
            (item.institutionName && item.institutionName.toLowerCase().includes(search))
        );
      }

      return NextResponse.json({
        tab,
        counts,
        items,
      });
    }

    // Default: tab === 'students'
    let query = db
      .from('students')
      .select(`
        user_id,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: studentRows, error } = await query;
    if (error && !isMissingSchemaError(error)) {
      console.error('Error querying students:', error);
    }

    const userIds = (studentRows || []).map((s) => s.user_id);
    let profilesMap: Record<string, { full_name?: string; email?: string; username?: string }> = {};

    if (userIds.length > 0) {
      const { data: profs } = await db
        .from('profiles')
        .select('id, full_name, username, email')
        .in('id', userIds);
      profs?.forEach((p) => {
        profilesMap[p.id] = p;
      });
    }

    let items = (studentRows || []).map((s) => {
      const p = profilesMap[s.user_id] || {};
      return {
        id: s.user_id,
        fullName: p.full_name || p.username || 'Student Candidate',
        email: p.email || 'No email',
        role: 'student',
        status: 'active',
        createdAt: s.created_at,
      };
    });

    if (search) {
      items = items.filter(
        (item) =>
          item.fullName.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      tab,
      counts,
      items,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const isSuperAdmin = await checkIsAuthorizedSuperAdmin(req);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Super Admin authorization required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || '');
    const targetUserId = String(body.user_id || '').trim();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    const { db } = await getCommandDataClient();

    if (action === 'approve_teacher') {
      await Promise.all([
        db.from('teachers').update({
          verification_status: 'verified',
          verification_score: 100,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('user_id', targetUserId),
        db.from('user_roles').update({
          status: 'active',
          role: 'teacher',
          updated_at: new Date().toISOString(),
        }).eq('user_id', targetUserId),
      ]);

      await db.from('admin_audit_logs').insert({
        actor_role: 'super_admin',
        target_entity: 'teachers',
        target_id: targetUserId,
        action: 'super_admin_approved_teacher',
        details: { target_user_id: targetUserId },
      });

      return NextResponse.json({ success: true, message: 'Teacher approved successfully.' });
    }

    if (action === 'revoke_teacher') {
      await Promise.all([
        db.from('teachers').update({
          verification_status: 'rejected',
          updated_at: new Date().toISOString(),
        }).eq('user_id', targetUserId),
        db.from('user_roles').update({
          status: 'limited',
          updated_at: new Date().toISOString(),
        }).eq('user_id', targetUserId),
      ]);

      await db.from('admin_audit_logs').insert({
        actor_role: 'super_admin',
        target_entity: 'teachers',
        target_id: targetUserId,
        action: 'super_admin_revoked_teacher',
        details: { target_user_id: targetUserId },
      });

      return NextResponse.json({ success: true, message: 'Teacher status revoked.' });
    }

    if (action === 'suspend_user') {
      await db.from('user_roles').update({
        status: 'suspended',
        updated_at: new Date().toISOString(),
      }).eq('user_id', targetUserId);

      await db.from('admin_audit_logs').insert({
        actor_role: 'super_admin',
        target_entity: 'user_roles',
        target_id: targetUserId,
        action: 'super_admin_suspended_user',
        details: { target_user_id: targetUserId },
      });

      return NextResponse.json({ success: true, message: 'User suspended.' });
    }

    if (action === 'restore_user') {
      await db.from('user_roles').update({
        status: 'active',
        updated_at: new Date().toISOString(),
      }).eq('user_id', targetUserId);

      await db.from('admin_audit_logs').insert({
        actor_role: 'super_admin',
        target_entity: 'user_roles',
        target_id: targetUserId,
        action: 'super_admin_restored_user',
        details: { target_user_id: targetUserId },
      });

      return NextResponse.json({ success: true, message: 'User restored.' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

