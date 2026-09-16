import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getAuthenticatedUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/orders?orderId=xxx
 * Permanently deletes an order and its order_items using Supabase Service Role
 * Security: Only verified Admin, or Customer deleting their own cancelled/rejected order
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

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return NextResponse.json({ error: "Mã đơn hàng không hợp lệ (yêu cầu định dạng UUID)" }, { status: 400 });
    }

    // 1. Authenticate user
    const { user, isAdmin } = await getAuthenticatedUser(req);

    // 2. Fetch existing order to verify ownership
    const { data: targetOrder, error: fetchErr } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, order_code")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchErr) {
      console.error("[API /api/orders DELETE] Database error:", fetchErr);
      return NextResponse.json({ error: "Lỗi truy vấn cơ sở dữ liệu" }, { status: 500 });
    }

    if (!targetOrder) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng cần xóa" },
        { status: 404 }
      );
    }

    // 3. Authorization check
    if (!isAdmin) {
      if (!user || user.id !== targetOrder.user_id) {
        console.warn(`[SECURITY ALERT] Unauthorized order delete attempt on ${orderId} by user ${user?.id || "anonymous"}`);
        return NextResponse.json(
          { error: "Quyền truy cập bị từ chối: Bạn không có quyền xóa đơn hàng này." },
          { status: 403 }
        );
      }

      // Customer can only delete/clean inactive orders from their view
      const deletableStatuses = ["cancelled", "rejected", "pending_payment"];
      if (!deletableStatuses.includes(targetOrder.status)) {
        return NextResponse.json(
          { error: "Không thể xóa đơn hàng đang xử lý hoặc đã hoàn tất thanh toán." },
          { status: 403 }
        );
      }
    }

    console.log(`[API /api/orders] Deleting order ${orderId} (${targetOrder.order_code}) by ${isAdmin ? "ADMIN" : user?.id}...`);

    // 4. Delete associated order items
    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (itemsErr) {
      console.error("[API /api/orders] Failed to delete order items:", itemsErr);
    }

    // 5. Delete the order record
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
      message: "Đơn hàng đã được xóa khỏi hệ thống.",
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
 * Body: { orderId, status, admin_notes, transaction_ref, payment_proof_image, ... }
 * Security: RBAC enforcement — only Admin can approve/reject/block; Customers can only submit proof or cancel
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

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // 1. Authenticate user & check admin status
    const { user, isAdmin } = await getAuthenticatedUser(req);

    // CRITICAL PRE-FLIGHT RBAC: Block non-admins from transitioning to admin-only statuses
    if (!isAdmin) {
      const adminOnlyStatuses = ["completed", "rejected", "blocked"];
      if (updateFields.status && adminOnlyStatuses.includes(updateFields.status)) {
        console.warn(
          `[SECURITY VIOLATION BLOCKED] Unauthorized attempt by ${user?.id || "anonymous"} to set status '${updateFields.status}' on order ${orderId}`
        );
        return NextResponse.json(
          { error: "Quyền truy cập bị từ chối: Chỉ Quản trị viên mới có thẩm quyền duyệt hoặc thay đổi trạng thái này." },
          { status: 403 }
        );
      }
    }

    if (!uuidRegex.test(orderId)) {
      return NextResponse.json({ error: "Mã đơn hàng không hợp lệ (yêu cầu định dạng UUID)" }, { status: 400 });
    }

    // 2. Fetch current order from database
    const { data: existingOrder, error: fetchErr } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, total_amount, admin_notes, order_code")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchErr) {
      console.error("[API /api/orders PATCH] DB fetch error:", fetchErr);
      return NextResponse.json({ error: "Lỗi truy vấn cơ sở dữ liệu" }, { status: 500 });
    }

    if (!existingOrder) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    const payload: any = {
      ...updateFields,
      updated_at: new Date().toISOString(),
    };
    delete payload.items;

    // 3. ROLE-BASED ACCESS CONTROL (ANTI-HACK DEFENSE)
    if (!isAdmin) {
      // Check if user owns this order (if the order is tied to a user, caller must be that user)
      if (existingOrder.user_id && (!user || user.id !== existingOrder.user_id)) {
        console.warn(`[SECURITY ALERT] User ${user?.id || "anonymous"} tried to modify order ${orderId} owned by ${existingOrder.user_id}`);
        return NextResponse.json(
          { error: "Quyền truy cập bị từ chối: Bạn không phải chủ sở hữu đơn hàng này." },
          { status: 403 }
        );
      }

      // CRITICAL: Block customer from self-approving, rejecting, or blocking
      const adminOnlyStatuses = ["completed", "rejected", "blocked"];
      if (payload.status && adminOnlyStatuses.includes(payload.status)) {
        console.warn(
          `[SECURITY VIOLATION BLOCKED] Unauthorized attempt by ${user?.id || "anonymous"} to set status '${payload.status}' on order ${orderId}`
        );
        return NextResponse.json(
          { error: "Quyền truy cập bị từ chối: Chỉ Quản trị viên mới có thẩm quyền duyệt hoặc thay đổi trạng thái này." },
          { status: 403 }
        );
      }

      // Strip any administrative fields customer might tamper with
      delete payload.total_amount;
      delete payload.admin_notes;
      delete payload.reviewed_at;
      delete payload.reviewed_by_admin_id;
      delete payload.order_code;
      delete payload.user_id;

      // Customer is only allowed:
      // a) Nộp ảnh biên lai: status = 'pending_approval'
      // b) Hủy đơn chưa thanh toán: status = 'cancelled'
      if (payload.status === "cancelled") {
        if (existingOrder.status !== "pending_payment") {
          return NextResponse.json(
            { error: "Chỉ có thể hủy đơn hàng đang chờ thanh toán." },
            { status: 400 }
          );
        }
      } else if (payload.status === "pending_approval") {
        // Legitimate proof submission: keep payment_proof_image, transaction_ref
      } else if (payload.status) {
        return NextResponse.json(
          { error: "Trạng thái đơn hàng không hợp lệ đối với khách hàng." },
          { status: 403 }
        );
      }
    }

    // Handle blocked note tag for admin
    if (payload.status === "blocked") {
      if (!payload.admin_notes?.includes("[BLOCKED]")) {
        payload.admin_notes = `[BLOCKED] ${payload.admin_notes || "Chặn quyền truy cập do vi phạm"}`;
      }
    }

    console.log(`[API /api/orders] Updating order ${orderId} (${existingOrder.order_code}) by ${isAdmin ? "ADMIN" : user?.id || "customer"}:`, payload);

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

