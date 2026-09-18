import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { findActiveLicenseForEmail, parseLicenseKeyDuration } from "@/lib/coursera-keygen";

export const dynamic = "force-dynamic";

/**
 * API tra cứu trạng thái bản quyền Coursera của một email (Spec 019)
 * GET /api/licenses/status?email=...
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");

    if (!emailParam) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp tham số email." },
        { status: 400 }
      );
    }

    const cleanEmail = emailParam.trim().toLowerCase();
    if (!cleanEmail.includes("@") || cleanEmail.startsWith("guest@")) {
      return NextResponse.json(
        { error: "Email không hợp lệ." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Lỗi kết nối máy chủ xác thực." },
        { status: 500 }
      );
    }

    // Truy vấn các đơn hàng completed gần nhất có chứa email hoặc tool Coursera
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, status, admin_notes, license_key, created_at, user_email")
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[API licenses/status] Query error:", error);
      return NextResponse.json({ error: "Lỗi truy vấn đơn hàng." }, { status: 500 });
    }

    const checkResult = findActiveLicenseForEmail(cleanEmail, orders || []);

    if (checkResult.hasActive && checkResult.key) {
      return NextResponse.json({
        email: cleanEmail,
        hasActiveLicense: true,
        key: checkResult.key,
        daysRemaining: checkResult.daysRemaining || 0,
        expirationDate: checkResult.expirationDate,
        formattedExpDate: checkResult.formattedExpDate,
        isExpired: false,
        message: `Email ${cleanEmail} hiện vẫn còn ${checkResult.daysRemaining} ngày bản quyền (hết hạn ngày ${checkResult.formattedExpDate}).`,
      });
    }

    return NextResponse.json({
      email: cleanEmail,
      hasActiveLicense: false,
      isExpired: checkResult.isExpired || false,
      daysRemaining: 0,
      lastKey: checkResult.key,
      formattedExpDate: checkResult.formattedExpDate,
      message: checkResult.key
        ? `Khóa bản quyền trước đó đã hết hạn (${checkResult.formattedExpDate || "quá 30 ngày"}). Khi thanh toán hệ thống sẽ cấp License Key mới toanh.`
        : "Email này chưa từng kích hoạt bản quyền Tool.",
    });
  } catch (err: any) {
    console.error("[API licenses/status] Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi hệ thống khi kiểm tra bản quyền." },
      { status: 500 }
    );
  }
}
