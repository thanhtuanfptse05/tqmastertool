import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getAuthenticatedUser } from "@/lib/supabase-server";
import {
  generateCourseraLicenseKey,
  formatOrderNotesWithLicense,
} from "@/lib/coursera-keygen";

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
 * GET /api/orders?orderIds=id1,id2,...
 * Returns orders WITH order_items using service role (bypasses Supabase RLS join issue).
 * Security: Only returns orders owned by the authenticated user (or all for Admin).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderIdsParam = searchParams.get("orderIds");

    if (!orderIdsParam) {
      return NextResponse.json({ error: "Thiếu tham số orderIds" }, { status: 400 });
    }

    const orderIds = orderIdsParam.split(",").map((id) => id.trim()).filter(Boolean);
    if (orderIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Authenticate
    const { user, isAdmin } = await getAuthenticatedUser(req);
    if (!user && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized — Vui lòng đăng nhập để tiếp tục." }, { status: 401 });
    }

    // Fetch orders WITH items using admin client (bypasses RLS)
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, user_email, order_code, status, total_amount, order_items(*)")
      .in("id", orderIds);

    if (error) {
      console.error("[API GET /api/orders] DB error:", error);
      return NextResponse.json({ error: "Lỗi truy vấn cơ sở dữ liệu" }, { status: 500 });
    }

    // Filter: customer only sees their own orders
    const filtered = isAdmin
      ? orders
      : (orders || []).filter(
          (o: any) => o.user_id === user?.id || o.user_email === user?.email
        );

    return NextResponse.json({ data: filtered });
  } catch (err: any) {
    console.error("[API GET /api/orders] Exception:", err);
    return NextResponse.json({ error: err.message || "Lỗi server" }, { status: 500 });
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
      // a) Nộp ảnh biên lai: status = 'pending_approval' (nếu đơn chưa được SePay auto-approve)
      // b) Hủy đơn chưa thanh toán: status = 'cancelled'
      if (existingOrder.status === "completed") {
        // Order was already auto-approved by SePay webhook! Retain completed status.
        delete payload.status;
      } else if (payload.status === "cancelled") {
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

    // Handle customer_email from checkout submission
    if (body.customer_email) {
      const email = String(body.customer_email).trim().toLowerCase();
      if (email) {
        if (!payload.admin_notes || !payload.admin_notes.includes("[COURSERA_EMAIL:")) {
          payload.admin_notes = payload.admin_notes
            ? `${payload.admin_notes} [COURSERA_EMAIL: ${email}]`
            : `[COURSERA_EMAIL: ${email}]`;
        }
      }
      delete payload.customer_email;
    }

    // Handle auto license key generation when order status is completed (or was already completed by SePay)
    const isOrderCompleted = payload.status === "completed" || existingOrder.status === "completed";
    if (isOrderCompleted) {
      const currentNotes = payload.admin_notes || existingOrder.admin_notes || "";
      let targetEmail = "";
      const emailMatch = currentNotes.match(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):\s*([^\]\s]+@[^\]\s]+)\]/i);
      if (emailMatch && emailMatch[1]) {
        targetEmail = emailMatch[1].trim().toLowerCase();
      } else if (body.customer_email) {
        targetEmail = String(body.customer_email).trim().toLowerCase();
      } else if (existingOrder.user_id) {
        try {
          const { data: prof } = await supabaseAdmin
            .from("profiles")
            .select("email")
            .eq("id", existingOrder.user_id)
            .maybeSingle();
          if (prof?.email) targetEmail = prof.email.trim().toLowerCase();
        } catch {}
      }

      const { data: orderItems } = await supabaseAdmin
        .from("order_items")
        .select("product_title, product_category")
        .eq("order_id", orderId);

      const isCoursera =
        (orderItems && orderItems.some((i: any) => i.product_title?.toLowerCase().includes("coursera") || i.product_category === "tool")) ||
        existingOrder.total_amount === 40000 ||
        existingOrder.total_amount === 149000;

      if (isCoursera && targetEmail && !currentNotes.includes("[KEY:")) {
        try {
          const key = generateCourseraLicenseKey(targetEmail, 30);
          payload.admin_notes = formatOrderNotesWithLicense(payload.admin_notes || existingOrder.admin_notes, key, targetEmail);
          console.log(`[API /api/orders] 🔑 Auto-generated Coursera Key (30 days): ${key} for email: ${targetEmail}`);
        } catch (err) {
          console.warn("[API /api/orders] Keygen warning:", err);
        }
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
      isAutoApproved: (data?.status || existingOrder.status) === "completed",
      message: (data?.status || existingOrder.status) === "completed"
        ? "Đơn hàng đã thanh toán thành công qua SePay."
        : "Cập nhật đơn hàng thành công.",
    });
  } catch (err: any) {
    console.error("[API /api/orders] Patch exception:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server khi cập nhật đơn hàng" },
      { status: 500 }
    );
  }
}

