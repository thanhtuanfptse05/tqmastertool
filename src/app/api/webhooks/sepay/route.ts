import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface SePayWebhookBody {
  id: number | string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code?: string | null;
  content: string;
  transferType: "in" | "out";
  transferAmount: number;
  accumulated?: number;
  subAccount?: string | null;
  referenceCode?: string;
  description?: string;
}

export async function POST(req: NextRequest) {
  try {
    // -----------------------------------------------------------
    // 1. SECURITY DEFENSE: API KEY AUTHENTICATION
    // -----------------------------------------------------------
    const expectedApiKey = process.env.SEPAY_API_KEY?.trim();
    const authHeader = req.headers.get("authorization") || req.headers.get("x-api-key") || "";

    // Header formats supported: "Apikey <TOKEN>", "Bearer <TOKEN>", or raw token
    let receivedToken = "";
    if (authHeader.startsWith("Apikey ")) {
      receivedToken = authHeader.replace("Apikey ", "").trim();
    } else if (authHeader.startsWith("Bearer ")) {
      receivedToken = authHeader.replace("Bearer ", "").trim();
    } else {
      receivedToken = authHeader.trim();
    }

    if (expectedApiKey && receivedToken !== expectedApiKey) {
      console.warn("[SePay Webhook] 🚨 BLOCKED: Invalid or missing API key!");
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid SePay API Key" },
        { status: 401 }
      );
    }

    // -----------------------------------------------------------
    // 2. PARSE BODY
    // -----------------------------------------------------------
    const body: SePayWebhookBody = await req.json();

    if (!body || !body.content) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: missing content" },
        { status: 400 }
      );
    }

    // Only process incoming money ("in")
    if (body.transferType !== "in") {
      return NextResponse.json({
        success: true,
        message: "Ignored transferType 'out' (only 'in' is processed)",
      });
    }

    const transferAmount = Number(body.transferAmount) || 0;
    if (transferAmount <= 0) {
      return NextResponse.json({
        success: false,
        message: "Invalid transferAmount <= 0",
      });
    }

    // -----------------------------------------------------------
    // 3. EXTRACT ORDER CODE FROM CONTENT
    // Match patterns: CV2026xxxx, CV-2026-xxxx, CV 2026 xxxx
    // -----------------------------------------------------------
    const content = body.content.trim();
    const cleanContent = content.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const codeMatch = cleanContent.match(/CV2026\d{4}/i);
    if (!codeMatch) {
      console.log(`[SePay Webhook] Content "${content}" does not contain a recognized CV2026 order code.`);
      return NextResponse.json({
        success: true,
        message: "Transaction received, but no matching CV2026 order code found in content.",
      });
    }

    const matchedMemo = codeMatch[0].toUpperCase(); // e.g. "CV20265198"
    const matchedOrderCode = `CV-2026-${matchedMemo.slice(6)}`; // e.g. "CV-2026-5198"

    // -----------------------------------------------------------
    // 4. DATABASE LOOKUP (SUPABASE)
    // -----------------------------------------------------------
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[SePay Webhook] Supabase credentials missing in server environment");
      return NextResponse.json(
        { success: false, error: "Server database configuration missing" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Find the order
    const { data: orders, error: findError } = await supabase
      .from("orders")
      .select("*")
      .or(`vietqr_content.ilike.%${matchedMemo}%,order_code.eq.${matchedOrderCode}`)
      .limit(1);

    if (findError) {
      console.error("[SePay Webhook] DB Query Error:", findError);
      return NextResponse.json(
        { success: false, error: "Failed to query database" },
        { status: 500 }
      );
    }

    const order = orders?.[0];
    if (!order) {
      console.warn(`[SePay Webhook] No order found for memo: ${matchedMemo} or code: ${matchedOrderCode}`);
      return NextResponse.json({
        success: true,
        message: `No order found for memo ${matchedMemo}. Ignored.`,
      });
    }

    // -----------------------------------------------------------
    // 5. SECURITY DEFENSE: REPLAY ATTACK & STATUS CHECK
    // -----------------------------------------------------------
    // If order was manually blocked by admin due to fraud, do NOT unblock!
    if (order.status === "blocked" || (order.admin_notes && order.admin_notes.includes("[BLOCKED]"))) {
      console.warn(`[SePay Webhook] 🚨 BLOCKED: Order ${order.order_code} is BLOCKED by Administrator!`);
      return NextResponse.json({
        success: false,
        message: "Order has been blocked by Administrator for security reasons.",
      });
    }

    // If order is already completed
    if (order.status === "completed") {
      return NextResponse.json({
        success: true,
        message: `Order ${order.order_code} is already completed. Duplicate webhook ignored.`,
      });
    }

    // -----------------------------------------------------------
    // 6. SECURITY DEFENSE: AMOUNT VERIFICATION (Chống hack chuyển 1k)
    // -----------------------------------------------------------
    const requiredAmount = Number(order.total_amount) || 0;
    const refCode = body.referenceCode || String(body.id);

    if (transferAmount < requiredAmount) {
      console.warn(
        `[SePay Webhook] ⚠️ UNDERPAID DETECTED! Order ${order.order_code}: Received ${transferAmount}đ < Required ${requiredAmount}đ`
      );

      // Flag for admin inspection, do NOT approve!
      await supabase
        .from("orders")
        .update({
          status: "pending_approval",
          transaction_ref: refCode,
          admin_notes: `⚠️ CẢNH BÁO CHUYỂN THIẾU TIỀN: Khách chuyển ${transferAmount.toLocaleString()}đ (Yêu cầu ${requiredAmount.toLocaleString()}đ). Mã GD SePay: ${refCode}. Ngân hàng: ${body.gateway}.`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      return NextResponse.json({
        success: false,
        message: `Underpaid detected: received ${transferAmount}đ < required ${requiredAmount}đ. Flagged for Admin review.`,
      });
    }

    // -----------------------------------------------------------
    // 7. AUTO-APPROVE: SATISFIED ALL SECURITY CHECKS
    // -----------------------------------------------------------
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "completed",
        transaction_ref: refCode,
        reviewed_at: new Date().toISOString(),
        admin_notes: `✅ Tự động duyệt thành công qua SePay Webhook (${body.gateway} - GD: ${refCode}). Nhận đủ: ${transferAmount.toLocaleString()}đ.`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("[SePay Webhook] DB Update Error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update order status" },
        { status: 500 }
      );
    }

    console.log(
      `[SePay Webhook] 🎉 SUCCESS: Order ${order.order_code} has been auto-approved! Amount: ${transferAmount.toLocaleString()}đ`
    );

    return NextResponse.json({
      success: true,
      message: `Order ${order.order_code} successfully approved via SePay webhook.`,
      orderCode: order.order_code,
      receivedAmount: transferAmount,
    });
  } catch (err: any) {
    console.error("[SePay Webhook] Unexpected Error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
