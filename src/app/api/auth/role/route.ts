import { NextResponse, type NextRequest } from 'next/server';
import { createServerRlsClient } from '@/lib/supabase/server';
import { getCommandDataClient, createServiceRoleClient, isMissingSchemaError } from '@/lib/supabase/admin';
import { getSuperAdminEmails } from '@/lib/security/admin-auth';

export async function GET() {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({
        authenticated: false,
        is_super_admin: false,
        role: 'student',
        role_selected: false,
        status: 'guest',
      });
    }

    const email = (user.email || '').trim().toLowerCase();
    const superAdminEmails = getSuperAdminEmails();
    const isSuperAdmin = Boolean(email && superAdminEmails.includes(email));

    const { db } = await getCommandDataClient();

    // Query user_roles table
    const { data: roleRow, error: roleErr } = await db
      .from('user_roles')
      .select('role, status, role_selected')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleErr && !isMissingSchemaError(roleErr)) {
      console.warn('Error fetching user_roles:', roleErr);
    }

    let role = roleRow?.role || (isSuperAdmin ? 'super_admin' : 'student');
    let status = roleRow?.status || (isSuperAdmin ? 'active' : 'active');
    const userMeta = user.user_metadata || {};

    // Determine if the user has explicitly selected their role:
    // 1. Super Admins bypass role selection
    // 2. User has role_selected or role_explicitly_selected in user_metadata
    // 3. User is already recorded as a teacher
    // 4. In all other cases (e.g. brand new user, or default student without explicit selection), roleSelected is false
    let roleSelected = false;
    if (isSuperAdmin) {
      roleSelected = true;
    } else if (userMeta.role_selected === true || userMeta.role_explicitly_selected === true) {
      roleSelected = true;
    } else if (role === 'teacher' || userMeta.role === 'teacher') {
      roleSelected = true;
    } else {
      roleSelected = Boolean(roleRow?.role_selected && userMeta.role_explicitly_selected);
    }

    // If email is in Super Admin allowlist, elevate or maintain super_admin
    if (isSuperAdmin) {
      role = 'super_admin';
      status = 'active';

      // Persist super_admin records asynchronously in background (non-blocking for ultra-fast API response)
      Promise.all([
        db.from('user_roles').upsert(
          {
            user_id: user.id,
            role: 'super_admin',
            status: 'active',
            role_selected: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        ),
        db.from('super_admins').upsert(
          {
            user_id: user.id,
            authorized_by: 'system_env',
            is_active: true,
          },
          { onConflict: 'user_id' }
        ),
      ]).catch((err) => {
        console.warn('[auth/role] Background super_admin upsert notice:', err);
      });
    }

    let teacherProfile = null;

    if (role === 'teacher' || (userMeta.role === 'teacher' && userMeta.teacher_verified === true)) {
      if (userMeta.role === 'teacher' && userMeta.teacher_verified === true) {
        role = 'teacher';
        status = 'verified';
      }

      const { data: tRow } = await db
        .from('teachers')
        .select('institutional_email, institution_name, department, designation, verification_status, verification_method, verified_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (tRow) {
        teacherProfile = tRow;
        if (tRow.verification_status === 'verified') {
          status = 'verified';
        }
      } else if (userMeta.teacher_verified === true) {
        teacherProfile = {
          institutional_email: userMeta.institutional_email || user.email,
          institution_name: userMeta.institution_name || 'Verified Academic Institution',
          verification_status: 'verified',
          verification_method: 'institutional_email',
        };
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || null,
      },
      is_super_admin: isSuperAdmin,
      role,
      role_selected: roleSelected,
      status,
      teacher_profile: teacherProfile,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rlsDb = await createServerRlsClient();
    const {
      data: { user },
      error: userErr,
    } = await rlsDb.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const chosenRole = body.role === 'teacher' ? 'teacher' : 'student';

    const email = (user.email || '').trim().toLowerCase();
    const superAdminEmails = getSuperAdminEmails();
    const isSuperAdmin = Boolean(email && superAdminEmails.includes(email));

    const finalRole = isSuperAdmin ? 'super_admin' : chosenRole;
    const finalStatus =
      finalRole === 'super_admin'
        ? 'active'
        : finalRole === 'teacher'
        ? 'pending_verification'
        : 'active';

    const { db } = await getCommandDataClient();

    // 1. Upsert into user_roles
    await db.from('user_roles').upsert(
      {
        user_id: user.id,
        role: finalRole,
        status: finalStatus,
        role_selected: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    // 2. Upsert into respective role specific table
    if (finalRole === 'teacher') {
      await db.from('teachers').upsert(
        {
          user_id: user.id,
          verification_status: 'pending',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } else if (finalRole === 'student') {
      await db.from('students').upsert(
        {
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    } else if (finalRole === 'super_admin') {
      await db.from('super_admins').upsert(
        {
          user_id: user.id,
          authorized_by: 'system_env',
          is_active: true,
        },
        { onConflict: 'user_id' }
      );
    }

    // Update auth user metadata so client-side and server-side stay immediately in sync
    try {
      const serviceClient = createServiceRoleClient();
      if (serviceClient) {
        await serviceClient.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            role: finalRole,
            role_selected: true,
            role_explicitly_selected: true,
          },
        });
      } else {
        await rlsDb.auth.updateUser({
          data: {
            role: finalRole,
            role_selected: true,
            role_explicitly_selected: true,
          },
        });
      }
    } catch (metaErr) {
      console.warn('[auth/role] Meta update notice:', metaErr);
    }

    // 3. Log audit event
    try {
      await db.from('admin_audit_logs').insert({
        actor_id: user.id,
        actor_role: finalRole,
        target_entity: 'user_roles',
        target_id: user.id,
        action: 'role_selected',
        details: { chosen_role: chosenRole, resolved_role: finalRole },
      });
    } catch {}

    const res = NextResponse.json({
      success: true,
      role: finalRole,
      status: finalStatus,
      is_super_admin: isSuperAdmin,
    });

    if (finalRole === 'student') {
      res.cookies.delete('sy_cmd_session');
    }

    return res;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

