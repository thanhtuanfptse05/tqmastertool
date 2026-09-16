import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/orders?orderId=xxx
 * Permanently deletes an order and its order_items using Supabase Service Role
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Thiếu mã định danh đơn hàng (orderId)" },
        { status: 400 }
      );
    }

    console.log(`[API /api/orders] Deleting order ${orderId} via supabaseAdmin...`);

    // 1. Delete associated order items
    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (itemsErr) {
      console.error("[API /api/orders] Failed to delete order items:", itemsErr);
    }

    // 2. Delete the order record
    const { error: orderErr } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (orderErr) {
      console.error("[API /api/orders] Failed to delete order:", orderErr);
      return NextResponse.json(
        { error: `Lỗi xóa đơn hàng: ${orderErr.message}` },
        { status: 500 }
      );
    }

    console.log(`[API /api/orders] Order ${orderId} deleted successfully.`);
    return NextResponse.json({
      success: true,
      message: "Đơn hàng đã được xóa vĩnh viễn khỏi hệ thống.",
    });
  } catch (err: any) {
    console.error("[API /api/orders] Delete exception:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server khi xóa đơn hàng" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders
 * Body: { orderId, status, admin_notes, transaction_ref, total_amount, ... }
 * Updates order fields using Supabase Service Role
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, ...updateFields } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Thiếu mã định danh đơn hàng (orderId)" },
        { status: 400 }
      );
    }

    const payload: any = {
      ...updateFields,
      updated_at: new Date().toISOString(),
    };
    delete payload.items;

    // Handle blocked note tag
    if (payload.status === "blocked") {
      if (!payload.admin_notes?.includes("[BLOCKED]")) {
        payload.admin_notes = `[BLOCKED] ${payload.admin_notes || "Chặn quyền truy cập"}`;
      }
    }

    console.log(`[API /api/orders] Updating order ${orderId} via supabaseAdmin:`, payload);

    let { data, error } = await supabaseAdmin
      .from("orders")
      .update(payload)
      .eq("id", orderId)
      .select()
      .single();

    // Check constraint fallback for 'blocked' if DB constraint not yet migrated
    if (error && error.code === "23514" && payload.status === "blocked") {
      console.warn("[API /api/orders] DB constraint check active, storing status 'rejected' with [BLOCKED] tag");
      payload.status = "rejected";
      const fallback = await supabaseAdmin
        .from("orders")
        .update(payload)
        .eq("id", orderId)
        .select()
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error("[API /api/orders] Update error:", error);
      return NextResponse.json(
        { error: `Lỗi cập nhật đơn hàng: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Cập nhật đơn hàng thành công.",
    });
  } catch (err: any) {
    console.error("[API /api/orders] Patch exception:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server khi cập nhật đơn hàng" },
      { status: 500 }
    );
  }
}
