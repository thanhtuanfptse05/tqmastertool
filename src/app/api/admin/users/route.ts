import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getAuthenticatedUser, isStrictAdminEmail } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Real-Time User Management: Returns all live accounts from Supabase Auth & Profiles
 * Security: Strict Admin authentication required
 */
export async function GET(req: NextRequest) {
  try {
    const { user: requestingAdmin, isAdmin } = await getAuthenticatedUser(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Truy cập bị từ chối: Yêu cầu quyền Quản Trị Viên." },
        { status: 403 }
      );
    }

    // 1. Fetch all profiles from PostgreSQL
    const { data: profiles, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profErr) {
      console.error("[API /api/admin/users GET] Profiles error:", profErr);
    }

    // 2. Fetch all registered auth users from Supabase Auth
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authErr) {
      console.error("[API /api/admin/users GET] Auth list error:", authErr);
    }

    const authUsers = authData?.users || [];
    const profilesList = profiles || [];
    const profileMap = new Map(profilesList.map((p) => [p.id, p]));

    // 3. Merge Auth users and Profile records to guarantee no user is missing
    const mergedUsers: Array<{
      id: string;
      email: string;
      full_name: string;
      role: "admin" | "customer";
      avatar_url: string;
      created_at: string;
      last_sign_in_at?: string;
    }> = [];

    const seenIds = new Set<string>();

    for (const authUser of authUsers) {
      if (!authUser.email) continue;
      seenIds.add(authUser.id);

      const profile = profileMap.get(authUser.id);
      // 100% Database Source of Truth: Role strictly comes from profile.role in DB!
      const effectiveRole: "admin" | "customer" = profile
        ? (profile.role === "admin" ? "admin" : "customer")
        : (isStrictAdminEmail(authUser.email) ? "admin" : "customer");

      // Insert profile if missing from PostgreSQL (first time registration)
      if (!profile) {
        supabaseAdmin.from("profiles").upsert({
          id: authUser.id,
          email: authUser.email.toLowerCase(),
          full_name: authUser.user_metadata?.full_name || authUser.email.split("@")[0].toUpperCase(),
          role: effectiveRole,
          updated_at: new Date().toISOString(),
        }).then(() => {});
      }

      mergedUsers.push({
        id: authUser.id,
        email: authUser.email.toLowerCase(),
        full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email.split("@")[0].toUpperCase(),
        role: effectiveRole,
        avatar_url: profile?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
        created_at: authUser.created_at || profile?.created_at || new Date().toISOString(),
        last_sign_in_at: authUser.last_sign_in_at,
      });
    }

    // Add any standalone profile not found in auth list
    for (const profile of profilesList) {
      if (!seenIds.has(profile.id) && profile.email) {
        seenIds.add(profile.id);
        mergedUsers.push({
          id: profile.id,
          email: profile.email.toLowerCase(),
          full_name: profile.full_name || profile.email.split("@")[0].toUpperCase(),
          role: profile.role === "admin" ? "admin" : "customer",
          avatar_url: profile.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
          created_at: profile.created_at || new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      users: mergedUsers,
      total: mergedUsers.length,
    });
  } catch (err: any) {
    console.error("[API /api/admin/users GET] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi máy chủ khi lấy danh sách người dùng" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Manage User Role, Password Reset, and Account Deletion
 * Security: Strict Admin authentication required
 */
export async function PATCH(req: NextRequest) {
  try {
    const { user: requestingAdmin, isAdmin } = await getAuthenticatedUser(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Truy cập bị từ chối: Yêu cầu quyền Quản Trị Viên." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, userId, role, newPassword } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Thiếu mã định danh người dùng (userId)" },
        { status: 400 }
      );
    }

    // 1. UPDATE USER ROLE
    if (action === "update_role") {
      if (role !== "admin" && role !== "customer") {
        return NextResponse.json(
          { error: "Vai trò không hợp lệ (chỉ chấp nhận 'admin' hoặc 'customer')" },
          { status: 400 }
        );
      }

      // Check if trying to demote the requesting admin themselves
      if (userId === requestingAdmin?.id && role === "customer") {
        return NextResponse.json(
          { error: "Không thể tự hạ cấp tài khoản của chính mình." },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update({
          role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("[API /api/admin/users PATCH role] DB Error:", error);
        return NextResponse.json(
          { error: `Lỗi cập nhật vai trò: ${error.message}` },
          { status: 500 }
        );
      }

      console.log(`[API /api/admin/users] Admin ${requestingAdmin?.email} updated role of user ${userId} to '${role}'`);
      return NextResponse.json({
        success: true,
        message: `Đã cập nhật vai trò thành ${role === "admin" ? "Quản Trị Viên" : "Khách Hàng"} thành công.`,
        user: data,
      });
    }

    // 2. RESET PASSWORD
    if (action === "reset_password") {
      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
        return NextResponse.json(
          { error: "Mật khẩu mới phải có tối thiểu 6 ký tự." },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (error) {
        console.error("[API /api/admin/users PATCH password] Error:", error);
        return NextResponse.json(
          { error: `Không thể đặt lại mật khẩu: ${error.message}` },
          { status: 500 }
        );
      }

      console.log(`[API /api/admin/users] Admin ${requestingAdmin?.email} reset password for user ${userId}`);
      return NextResponse.json({
        success: true,
        message: `Đã đặt lại mật khẩu mới cho người dùng thành công!`,
      });
    }

    // 3. DELETE USER
    if (action === "delete_user") {
      if (userId === requestingAdmin?.id) {
        return NextResponse.json(
          { error: "Không thể tự xóa tài khoản của chính mình." },
          { status: 400 }
        );
      }

      // Delete from Auth
      await supabaseAdmin.auth.admin.deleteUser(userId);
      // Delete profile
      await supabaseAdmin.from("profiles").delete().eq("id", userId);

      console.log(`[API /api/admin/users] Admin ${requestingAdmin?.email} deleted user ${userId}`);
      return NextResponse.json({
        success: true,
        message: "Đã xóa tài khoản người dùng khỏi hệ thống.",
      });
    }

    return NextResponse.json(
      { error: "Hành động (action) không hợp lệ." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("[API /api/admin/users PATCH] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi máy chủ khi cập nhật thông tin người dùng" },
      { status: 500 }
    );
  }
}
