import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isStrictAdminEmail } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Mật khẩu phải có tối thiểu 6 ký tự." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (fullName || cleanEmail.split("@")[0]).trim();

    // SECURITY DEFENSE: Block public registration using Admin Whitelist email addresses
    if (isStrictAdminEmail(cleanEmail)) {
      console.warn(`[SECURITY ALERT] Blocked public registration attempt with admin email: ${cleanEmail}`);
      return NextResponse.json(
        {
          success: false,
          error: "Không thể tự đăng ký tài khoản Quản trị viên qua biểu mẫu này. Vui lòng liên hệ trực tiếp chủ sở hữu hệ thống.",
        },
        { status: 403 }
      );
    }

    // 1. Create user via Supabase Admin API with email_confirm: true (No email confirmation delay)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
      },
    });

    if (error) {
      // Check if user is already registered
      if (
        error.message.includes("already registered") ||
        error.message.includes("User already exists") ||
        error.message.includes("email address is already in use")
      ) {
        // If already registered but unconfirmed, auto-confirm them
        try {
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = usersData?.users?.find(
            (u) => u.email?.toLowerCase() === cleanEmail
          );
          if (existingUser && !existingUser.email_confirmed_at) {
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              email_confirm: true,
            });
          }
        } catch {
          // ignore lookup error
        }

        return NextResponse.json(
          {
            success: false,
            error: "Email này đã tồn tại trong hệ thống. Vui lòng chuyển sang Đăng Nhập.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // 2. Ensure profile record is inserted/updated in public.profiles
    if (data?.user) {
      const isAdmin = isStrictAdminEmail(cleanEmail);
      await supabaseAdmin.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: cleanName,
          role: isAdmin ? "admin" : "customer",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: cleanName,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Lỗi máy chủ khi đăng ký tài khoản.";
    console.error("[API /api/auth/register] Error:", err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
