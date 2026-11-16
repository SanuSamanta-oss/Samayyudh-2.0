import { NextResponse, type NextRequest } from 'next/server';
import { getCommandDataClient } from '@/lib/supabase/admin';
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

    // 1. Compute Tab Counts reliably from user_roles
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

    // 2. Fetch role assignments for the selected tab
    const targetRole = tab === 'super_admins' ? 'super_admin' : tab === 'teachers' ? 'teacher' : 'student';

    const { data: roleRows, error: roleError } = await db
      .from('user_roles')
      .select('user_id, role, created_at, updated_at')
      .eq('role', targetRole)
      .order('created_at', { ascending: false });

    if (roleError) {
      console.error('Error querying user_roles:', roleError);
    }

    const userIds = (roleRows || []).map((r) => r.user_id);

    // 3. Query profiles with correct column names (display_name, not full_name)
    const profilesMap: Record<string, {
      id: string;
      email?: string | null;
      display_name?: string | null;
      username?: string | null;
      institution?: string | null;
      account_status?: string | null;
      created_at?: string;
    }> = {};

    if (userIds.length > 0) {
      const { data: profs } = await db
        .from('profiles')
        .select('id, email, display_name, username, institution, account_status, created_at')
        .in('id', userIds);

      profs?.forEach((p) => {
        profilesMap[p.id] = p;
      });
    }

    // 4. Query auth.admin.listUsers to fetch Google display names & verified emails as fallbacks
    const authUsersMap: Record<string, {
      id: string;
      email?: string;
      user_metadata?: {
        full_name?: string;
        name?: string;
        display_name?: string;
        teacher_verified?: boolean;
        institutional_email?: string;
        institution_name?: string;
        department?: string;
        designation?: string;
      };
    }> = {};

    try {
      const { data: authData } = await db.auth.admin.listUsers({ perPage: 100 });
      authData?.users?.forEach((u) => {
        authUsersMap[u.id] = u;
      });
    } catch {}

    // 5. Build items list according to the active tab
    if (tab === 'super_admins') {
      let items = (roleRows || []).map((r) => {
        const p = profilesMap[r.user_id] || {};
        const au = authUsersMap[r.user_id] || {};
        const email = p.email || au.email || 'Super Administrator';
        const fullName =
          p.display_name ||
          au.user_metadata?.full_name ||
          au.user_metadata?.name ||
          p.username ||
          'Super Administrator';

        return {
          id: r.user_id,
          email,
          fullName,
          role: 'super_admin',
          status: 'active',
          authorizedBy: 'Server Environment (.env.local)',
          createdAt: r.created_at || p.created_at || new Date().toISOString(),
        };
      });

      if (search) {
        items = items.filter(
          (item) =>
            item.fullName.toLowerCase().includes(search) ||
            (item.email && item.email.toLowerCase().includes(search))
        );
      }

      return NextResponse.json({
        tab,
        counts,
        items,
      });
    }

    if (tab === 'teachers') {
      // Check teachers table if it exists
      const teacherDetailsMap: Record<string, {
        institutional_email?: string;
        institution_name?: string;
        department?: string;
        designation?: string;
        verification_status?: 'verified' | 'pending' | 'rejected' | 'suspended';
        verification_method?: string;
        verification_score?: number;
        verified_at?: string;
        created_at?: string;
      }> = {};

      if (userIds.length > 0) {
        try {
          const { data: teacherDetails } = await db
            .from('teachers')
            .select('*')
            .in('user_id', userIds);
          teacherDetails?.forEach((t) => {
            teacherDetailsMap[t.user_id] = t;
          });
        } catch {}
      }

      let items = (roleRows || []).map((r) => {
        const p = profilesMap[r.user_id] || {};
        const au = authUsersMap[r.user_id] || {};
        const td = teacherDetailsMap[r.user_id] || {};
        const email = p.email || au.email || td.institutional_email || 'No email';
        const fullName =
          p.display_name ||
          au.user_metadata?.full_name ||
          au.user_metadata?.name ||
          p.username ||
          'Educator';

        const verificationStatus = (td.verification_status ||
          (au.user_metadata?.teacher_verified ? 'verified' : 'pending')) as
          | 'verified'
          | 'pending'
          | 'rejected'
          | 'suspended';

        return {
          id: r.user_id,
          fullName,
          email,
          institutionalEmail: td.institutional_email || au.user_metadata?.institutional_email,
          institutionName:
            td.institution_name ||
            p.institution ||
            au.user_metadata?.institution_name ||
            'Institution Pending',
          department: td.department || au.user_metadata?.department,
          designation: td.designation || au.user_metadata?.designation,
          verificationStatus,
          verificationMethod: td.verification_method || 'institutional_email',
          verificationScore: td.verification_score || (au.user_metadata?.teacher_verified ? 100 : 0),
          verifiedAt: td.verified_at || (au.user_metadata?.teacher_verified ? r.updated_at : undefined),
          createdAt: r.created_at || td.created_at || p.created_at || new Date().toISOString(),
        };
      });

      if (statusFilter !== 'all') {
        items = items.filter((item) => item.verificationStatus === statusFilter);
      }

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
    let items = (roleRows || []).map((r) => {
      const p = profilesMap[r.user_id] || {};
      const au = authUsersMap[r.user_id] || {};
      const email = p.email || au.email || 'No email';
      const fullName =
        p.display_name ||
        au.user_metadata?.full_name ||
        au.user_metadata?.name ||
        p.username ||
        'Student Candidate';

      return {
        id: r.user_id,
        fullName,
        email,
        role: 'student',
        status: p.account_status || 'active',
        createdAt: r.created_at || p.created_at || new Date().toISOString(),
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
        db.from('user_roles').upsert({
          user_id: targetUserId,
          role: 'teacher',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' }),
        db.auth.admin.updateUserById(targetUserId, {
          user_metadata: { role: 'teacher', teacher_verified: true },
        }).catch(() => null),
      ]);

      try {
        await db.from('teachers').upsert({
          user_id: targetUserId,
          verification_status: 'verified',
          verification_score: 100,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      } catch {}

      try {
        await db.from('admin_audit_logs').insert({
          actor_role: 'super_admin',
          target_entity: 'teachers',
          target_id: targetUserId,
          action: 'super_admin_approved_teacher',
          details: { target_user_id: targetUserId },
        });
      } catch {}

      return NextResponse.json({ success: true, message: 'Teacher approved successfully.' });
    }

    if (action === 'revoke_teacher') {
      await Promise.all([
        db.from('user_roles').upsert({
          user_id: targetUserId,
          role: 'student',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' }),
        db.auth.admin.updateUserById(targetUserId, {
          user_metadata: { role: 'student', teacher_verified: false },
        }).catch(() => null),
      ]);

      try {
        await db.from('teachers').upsert({
          user_id: targetUserId,
          verification_status: 'rejected',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      } catch {}

      try {
        await db.from('admin_audit_logs').insert({
          actor_role: 'super_admin',
          target_entity: 'teachers',
          target_id: targetUserId,
          action: 'super_admin_revoked_teacher',
          details: { target_user_id: targetUserId },
        });
      } catch {}

      return NextResponse.json({ success: true, message: 'Teacher status revoked.' });
    }

    if (action === 'suspend_user') {
      await Promise.all([
        db.from('profiles').update({
          account_status: 'suspended',
          updated_at: new Date().toISOString(),
        }).eq('id', targetUserId),
        db.from('user_roles').update({
          updated_at: new Date().toISOString(),
        }).eq('user_id', targetUserId),
      ]);

      try {
        await db.from('admin_audit_logs').insert({
          actor_role: 'super_admin',
          target_entity: 'user_roles',
          target_id: targetUserId,
          action: 'super_admin_suspended_user',
          details: { target_user_id: targetUserId },
        });
      } catch {}

      return NextResponse.json({ success: true, message: 'User suspended.' });
    }

    if (action === 'restore_user') {
      await Promise.all([
        db.from('profiles').update({
          account_status: 'active',
          updated_at: new Date().toISOString(),
        }).eq('id', targetUserId),
        db.from('user_roles').update({
          updated_at: new Date().toISOString(),
        }).eq('user_id', targetUserId),
      ]);

      try {
        await db.from('admin_audit_logs').insert({
          actor_role: 'super_admin',
          target_entity: 'user_roles',
          target_id: targetUserId,
          action: 'super_admin_restored_user',
          details: { target_user_id: targetUserId },
        });
      } catch {}

      return NextResponse.json({ success: true, message: 'User restored.' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
