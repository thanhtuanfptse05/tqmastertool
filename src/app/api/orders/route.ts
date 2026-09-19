import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getAuthenticatedUser } from "@/lib/supabase-server";
import {
  generateCourseraLicenseKey,
  formatOrderNotesWithLicense,
  formatOrderNotesWithEmails,
  formatOrderNotesWithMultipleLicenses,
  extractOrderLicenseInfo,
  findActiveLicenseForEmail,
  parseLicenseKeyDuration,
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
      return NextResponse.json({
        success: true,
        message: "Đơn hàng cục bộ đã được xóa thành công.",
      });
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
      .select("id, user_id, order_code, status, total_amount, admin_notes, created_at, updated_at, order_items(*)")
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

    // Handle customer_email / customer_emails from checkout submission
    delete payload.customer_email;
    delete payload.customer_emails;
    const rawCustomerEmail = body.customer_email ? String(body.customer_email).trim().toLowerCase() : "";
    const rawCustomerEmails: string[] = Array.isArray(body.customer_emails)
      ? body.customer_emails.map((e: any) => String(e).trim().toLowerCase()).filter((e: string) => e.includes("@") && !e.startsWith("guest@") && e !== "guest@codevault.io")
      : (rawCustomerEmail && rawCustomerEmail.includes("@") && !rawCustomerEmail.startsWith("guest@") && rawCustomerEmail !== "guest@codevault.io" ? [rawCustomerEmail] : []);

    const { data: orderItems } = await supabaseAdmin
      .from("order_items")
      .select("product_title, product_category")
      .eq("order_id", orderId);

    const isCoursera = Boolean(
      orderItems && orderItems.some((i: any) => i.product_title?.toLowerCase().includes("coursera"))
    );

    if (isCoursera && rawCustomerEmails.length > 0) {
      payload.admin_notes = formatOrderNotesWithEmails(payload.admin_notes || existingOrder.admin_notes, rawCustomerEmails);
    }

    // Handle auto license key generation when order status is completed (or was already completed by SePay)
    const isOrderCompleted = payload.status === "completed" || existingOrder.status === "completed";
    if (isOrderCompleted && isCoursera) {
      const currentNotes = payload.admin_notes || existingOrder.admin_notes || "";
      const licenseInfo = extractOrderLicenseInfo({
        ...existingOrder,
        admin_notes: currentNotes,
        status: "completed",
      });

      let targetEmails = licenseInfo.emails;
      if (targetEmails.length === 0 && rawCustomerEmails.length > 0) {
        targetEmails = rawCustomerEmails;
      }
      if (targetEmails.length === 0 && existingOrder.user_id) {
        try {
          const { data: prof } = await supabaseAdmin
            .from("profiles")
            .select("email")
            .eq("id", existingOrder.user_id)
            .maybeSingle();
          if (prof?.email && prof.email.includes("@") && !prof.email.startsWith("guest@")) {
            targetEmails = [prof.email.trim().toLowerCase()];
          }
        } catch {}
      }

      if (targetEmails.length > 0) {
        try {
          // Lấy danh sách các đơn hàng completed khác để kiểm tra key còn hạn (Spec 019)
          const { data: pastCompletedOrders } = await supabaseAdmin
            .from("orders")
            .select("id, status, admin_notes, license_key, created_at")
            .eq("status", "completed")
            .neq("id", existingOrder.id)
            .order("created_at", { ascending: false })
            .limit(100);

          const reusedInfoList: string[] = [];
          const licensesToSave = targetEmails.map((email) => {
            // 1. Kiểm tra xem chính đơn này đã từng được gán key chưa
            const existingInThisOrder = licenseInfo.licenses.find((l) => l.email === email);
            if (existingInThisOrder?.key) {
              return { email, key: existingInThisOrder.key };
            }

            // 2. Tra cứu các đơn hàng completed trước đó của email này (Spec 019)
            const activeCheck = findActiveLicenseForEmail(email, pastCompletedOrders || []);
            if (activeCheck.hasActive && activeCheck.key) {
              // CÒN HẠN: Giữ nguyên key cũ, TUYỆT ĐỐI KHÔNG sinh key mới!
              reusedInfoList.push(`${email}: Còn ${activeCheck.daysRemaining} ngày (đến ${activeCheck.formattedExpDate})`);
              console.log(`[API /api/orders] ⚡ Email ${email} đang có key còn hạn (${activeCheck.daysRemaining} ngày). Giữ nguyên key: ${activeCheck.key}`);
              return { email, key: activeCheck.key };
            }

            // 3. ĐÃ HẾT HẠN HOẶC CHƯA MUA: Bắt buộc sinh key mới toanh (30 ngày từ hiện tại)!
            const newKey = generateCourseraLicenseKey(email, 30);
            console.log(`[API /api/orders] 🔑 Email ${email} chưa có key hoặc key cũ đã hết hạn. Sinh key mới 30 ngày: ${newKey}`);
            return { email, key: newKey };
          });

          let updatedNotes = formatOrderNotesWithMultipleLicenses(currentNotes, licensesToSave);
          if (reusedInfoList.length > 0) {
            updatedNotes += ` [GHI CHÚ HẠN DÙNG: Giữ nguyên key đang còn hạn cho ${reusedInfoList.join("; ")}]`;
          }
          payload.admin_notes = updatedNotes;
          console.log(`[API /api/orders] 🔑 Processed ${licensesToSave.length} Coursera Keys for emails:`, targetEmails);
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

    // Whitelist only valid PostgreSQL columns of 'orders' table to prevent schema cache errors
    const ALLOWED_ORDER_COLUMNS = new Set([
      "status",
      "payment_method",
      "vietqr_content",
      "payment_proof_image",
      "transaction_ref",
      "reviewed_by_admin_id",
      "reviewed_at",
      "admin_notes",
      "total_amount",
      "order_code",
      "user_id",
      "updated_at",
      "deleted_at",
    ]);

    const sanitizedPayload: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (ALLOWED_ORDER_COLUMNS.has(key)) {
        sanitizedPayload[key] = value;
      }
    }

    console.log(
      `[API /api/orders] Updating order ${orderId} (${existingOrder.order_code}) by ${isAdmin ? "ADMIN" : user?.id || "customer"}:`,
      sanitizedPayload
    );

    let { data, error } = await supabaseAdmin
      .from("orders")
      .update(sanitizedPayload)
      .eq("id", orderId)
      .select()
      .single();

    // Check constraint fallback for 'blocked' if DB constraint not yet migrated
    if (error && error.code === "23514" && sanitizedPayload.status === "blocked") {
      console.warn("[API /api/orders] DB constraint check active, storing status 'rejected' with [BLOCKED] tag");
      sanitizedPayload.status = "rejected";
      const fallback = await supabaseAdmin
        .from("orders")
        .update(sanitizedPayload)
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

/**
 * POST /api/orders
 * Secure Server-Side Order Creation (Anti-Price-Tampering Defense)
 * Spec: SPEC-015
 * 
 * Guarantees:
 * - Product price is strictly queried from public.products in PostgreSQL.
 * - Client cannot tamper with total_amount or unit_price (any client price is ignored).
 * - Generates unique order_code and vietqr_content.
 * - Creates order with initial status 'pending_payment'.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity = 1, customerEmail, customerEmails, customerName } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Thiếu thông tin sản phẩm (productId)" },
        { status: 400 }
      );
    }

    const parsedQty = Math.max(1, Math.min(20, Math.floor(Number(quantity) || 1)));

    // 1. Authenticate user if session exists
    const { user } = await getAuthenticatedUser(req);
    const userId = user?.id || null;

    // 2. Fetch product from database to get official immutable price
    // Support lookup by UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    let query = supabaseAdmin
      .from("products")
      .select("id, title, category, price, status, thumbnail_url, slug");

    if (isUuid) {
      query = query.eq("id", productId);
    } else {
      query = query.or(`id.eq.${productId},slug.eq.${productId}`);
    }

    const { data: product, error: prodErr } = await query.maybeSingle();

    if (prodErr || !product) {
      console.warn(`[API /api/orders POST] Product not found for ID/slug: ${productId}`, prodErr);
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm hoặc sản phẩm đã ngừng kinh doanh." },
        { status: 404 }
      );
    }

    if (product.status !== "published") {
      return NextResponse.json(
        { error: "Sản phẩm hiện không ở trạng thái mở bán." },
        { status: 400 }
      );
    }

    const officialPrice = Number(product.price);
    if (isNaN(officialPrice) || officialPrice < 0) {
      return NextResponse.json(
        { error: "Giá sản phẩm trong hệ thống không hợp lệ." },
        { status: 500 }
      );
    }

    // 3. Generate unique order numbers
    const isCourseraProduct =
      product.title?.toLowerCase().includes("coursera") ||
      Boolean(product.slug && String(product.slug).toLowerCase().includes("coursera"));

    const effectiveQty = isCourseraProduct ? parsedQty : 1;
    const totalAmount = officialPrice * effectiveQty;
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `TQ-2026-${orderNum}`;
    const cleanMemo = `TQ2026${orderNum}`;
    const orderId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const cleanEmail = (customerEmail || user?.email || "").trim().toLowerCase();
    const cleanName = (customerName || user?.user_metadata?.full_name || "Khách Hàng").trim();


    let adminNotes = "";
    // Collect customer emails for Coursera
    if (isCourseraProduct) {
      const emailList: string[] = Array.isArray(customerEmails)
        ? customerEmails
        : (customerEmail ? [customerEmail] : []);
      const cleanEmails = emailList
        .map((e) => String(e).trim().toLowerCase())
        .filter((e) => e.includes("@") && !e.startsWith("guest@") && e !== "guest@codevault.io");

      if (cleanEmails.length > 0) {
        adminNotes = formatOrderNotesWithEmails("", cleanEmails);
      }
    }

    // 4. Insert order via Supabase Service Role (Total amount strictly locked to DB price * quantity)
    const orderPayload: any = {
      id: orderId,
      order_code: orderCode,
      total_amount: totalAmount, // IMMUTABLE: Enforced directly from DB * quantity
      status: "pending_payment",
      payment_method: "vietqr",
      vietqr_content: cleanMemo,
      admin_notes: adminNotes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (userId) {
      orderPayload.user_id = userId;
    }

    const { data: newOrder, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderErr) {
      console.error("[API /api/orders POST] Database order insert error:", orderErr);
      return NextResponse.json(
        { error: `Lỗi khởi tạo đơn hàng: ${orderErr.message}` },
        { status: 500 }
      );
    }

    // 5. Insert order items (one row per unit quantity to maintain SePay reconciliation accuracy)
    const itemRows = Array.from({ length: effectiveQty }).map((_, index) => ({
      id: typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
      order_id: orderId,
      product_id: product.id,
      unit_price: officialPrice,
      product_title: product.title,
      product_category: product.category,
      created_at: new Date().toISOString(),
    }));

    const { error: itemErr } = await supabaseAdmin
      .from("order_items")
      .insert(itemRows);

    if (itemErr) {
      console.warn("[API /api/orders POST] Order items insert warning:", itemErr);
    }

    const items = itemRows.map((r) => ({
      id: r.id,
      order_id: orderId,
      product_id: product.id,
      unit_price: officialPrice,
      product_title: product.title,
      product_category: product.category,
      product_thumbnail: product.thumbnail_url || "",
      created_at: newOrder.created_at,
    }));

    console.log(
      `[API /api/orders POST] ✅ Order ${orderCode} created securely. Product: "${product.title}" - Qty: ${parsedQty} - Total: ${totalAmount.toLocaleString()}đ`
    );

    return NextResponse.json({
      success: true,
      order: {
        ...newOrder,
        user_email: cleanEmail,
        user_name: cleanName,
        items,
      },
    });
  } catch (err: any) {
    console.error("[API /api/orders POST] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi máy chủ khi khởi tạo đơn hàng" },
      { status: 500 }
    );
  }
}


