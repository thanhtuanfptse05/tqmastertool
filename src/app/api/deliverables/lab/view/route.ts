import { NextRequest, NextResponse } from "next/server";
import { getLabExerciseById, getAllLabExercises, LAB211_RULE_MD } from "@/lib/lab-parser";
import { supabaseAdmin, getAuthenticatedUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * Secure LAB211 Deliverable View Endpoint
 * Checks order status === 'completed' before returning docx content and Java source code
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const labId = searchParams.get("labId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Thiếu thông số mã đơn hàng (orderId)" },
        { status: 400 }
      );
    }

    // 1. SECURITY GATE: Verify Order status === 'completed' & Ownership Check (Anti-IDOR)
    const { user, isAdmin } = await getAuthenticatedUser(req);
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      console.error("[Lab View API] SUPABASE_SERVICE_ROLE_KEY is missing on server!");
      return NextResponse.json(
        { error: "Lỗi cấu hình xác thực máy chủ. Truy cập bị từ chối." },
        { status: 500 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, status, user_id, order_code, admin_notes, total_amount")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error("Supabase order check error:", error);
    }

    if (!order) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại hoặc không hợp lệ. Quyền truy cập bị từ chối." },
        { status: 403 }
      );
    }

    // Anti-IDOR: verify strict ownership if not Admin
    if (!isAdmin) {
      if (!user) {
        return NextResponse.json(
          { error: "Vui lòng đăng nhập tài khoản để xem tài nguyên đơn hàng." },
          { status: 401 }
        );
      }
      const isOwner = order.user_id === user.id || Boolean(user.email && (order as any).user_email === user.email);
      if (!isOwner) {
        console.warn(`[SECURITY ALERT - IDOR VIEW BLOCKED] Requester (${user.id}) tried to access deliverables of order ${order.id} owned by ${order.user_id}`);
        return NextResponse.json(
          { error: "Quyền truy cập bị từ chối: Bạn không sở hữu đơn hàng này." },
          { status: 403 }
        );
      }
    }

    const isBlocked = order.status === "blocked" || (order.admin_notes && order.admin_notes.includes("[BLOCKED]"));
    if (isBlocked) {
      return NextResponse.json(
        {
          error: "🚨 Đơn hàng này đã bị Quản Trị Viên thu hồi và chặn quyền truy cập do vi phạm quy định hoặc gian lận thanh toán.",
          status: "blocked",
        },
        { status: 403 }
      );
    }

    if (order.status !== "completed") {
      let errorMsg = "Đơn hàng chưa thanh toán hoặc chưa được duyệt. Quyền truy cập bị từ chối.";
      if (order.status === "pending_approval") {
        errorMsg = "Đơn hàng đang chờ Admin đối chiếu thanh toán. Quyền truy cập sẽ tự động mở sau khi duyệt.";
      } else if (order.status === "rejected") {
        errorMsg = "Đơn hàng đã bị từ chối thanh toán.";
      }

      return NextResponse.json(
        {
          error: errorMsg,
          status: order.status,
        },
        { status: 403 }
      );
    }

    // 1.1 Category Authorization Gate (Spec 018): Verify order contains LAB211 product
    const { data: orderItems } = await supabaseAdmin
      .from("order_items")
      .select("product_id, product_title, product_category")
      .eq("order_id", order.id);

    const hasLab = orderItems?.some((item: any) =>
      item.product_category === "lab211" ||
      item.product_title?.toLowerCase().includes("lab211")
    ) || (order.total_amount === 80000 && !orderItems?.some((i: any) => i.product_category === "tool"));

    if (!hasLab && !isAdmin) {
      console.warn(`[SECURITY ALERT - WRONG CATEGORY VIEW] Requester tried to access LAB211 deliverables for non-LAB order ${order.order_code}`);
      return NextResponse.json(
        { error: "Đơn hàng này không bao gồm tài nguyên LAB211. Quyền truy cập bị từ chối." },
        { status: 403 }
      );
    }

    // 2. Return all labs or a single lab
    const isHcmOrder = orderItems?.some((item: any) =>
      item.product_title?.toLowerCase().includes("campus hcm") ||
      item.product_id === "687bc7ee-8de2-49ee-9fcf-971050553e40"
    );

    if (!labId || labId === "all") {
      const allLabs = getAllLabExercises(isHcmOrder ? "hcm" : "standard");
      return NextResponse.json({
        success: true,
        totalLabs: allLabs.length,
        labs: allLabs,
        ruleMarkdown: LAB211_RULE_MD,
      });
    }

    const lab = getLabExerciseById(labId, isHcmOrder ? "hcm" : "standard");
    if (!lab) {
      return NextResponse.json(
        {
          error: isHcmOrder
            ? `Bài lab "${labId}" không nằm trong gói SOURCE CODE LAB211 CAMPUS HCM (gói này chỉ gồm J1.L.P0028, J1.L.P0038, J1.L.P0039).`
            : `Không tìm thấy bài lab với mã: ${labId}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lab,
      ruleMarkdown: LAB211_RULE_MD,
    });
  } catch (err: any) {
    console.error("Lab deliverable view error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server khi lấy dữ liệu bài lab" },
      { status: 500 }
    );
  }
}
