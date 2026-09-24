import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getAuthenticatedUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const orderId = formData.get("orderId") ? String(formData.get("orderId")).trim() : null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy ảnh biên lai tải lên" }, { status: 400 });
    }

    // 1. Dual authentication & authorization verification:
    // Method A: Check authenticated session via Bearer token / cookies
    const { user, isAdmin } = await getAuthenticatedUser(req);

    let isAuthorized = Boolean(user || isAdmin);

    // Method B: If token was not attached or session is desynced, verify if a valid pending orderId was provided
    if (!isAuthorized && orderId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(orderId)) {
        const { data: pendingOrder } = await supabaseAdmin
          .from("orders")
          .select("id, status, user_id")
          .eq("id", orderId)
          .maybeSingle();

        if (
          pendingOrder &&
          (pendingOrder.status === "pending_payment" || pendingOrder.status === "pending_approval")
        ) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập hoặc cung cấp mã đơn hàng hợp lệ để tải lên ảnh biên lai thanh toán." },
        { status: 401 }
      );
    }
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Vui lòng chọn ảnh định dạng JPG, PNG hoặc WEBP." },
        { status: 400 }
      );
    }

    // Max 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dung lượng ảnh biên lai không được vượt quá 10MB" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `receipts/bill_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from("product-assets")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase receipt upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicData } = supabaseAdmin.storage
      .from("product-assets")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      path: fileName,
    });
  } catch (err: any) {
    console.error("Receipt upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi khi tải lên ảnh biên lai" },
      { status: 500 }
    );
  }
}
