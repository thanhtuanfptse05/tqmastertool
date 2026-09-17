import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find the user by email
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const targetUser = data.users.find((u) => u.email?.toLowerCase() === cleanEmail);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Không tìm thấy tài khoản người dùng." }, { status: 404 });
    }

    // Auto-confirm if not confirmed
    if (!targetUser.email_confirmed_at) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
        email_confirm: true,
      });
      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Đã kích hoạt xác thực email thành công." });
    }

    return NextResponse.json({ success: true, message: "Tài khoản đã được xác thực từ trước." });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Lỗi máy chủ khi xác thực email.";
    console.error("[API /api/auth/auto-confirm] Error:", err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
