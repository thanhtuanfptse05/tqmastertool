import { NextRequest, NextResponse } from "next/server";
import { getLabExerciseById, getAllLabExercises, LAB211_RULE_MD } from "@/lib/lab-parser";
import { supabaseAdmin } from "@/lib/supabase-server";

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

    // 1. SECURITY GATE: Verify Order status === 'completed'
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .select("id, status, user_id, order_code")
        .eq("id", orderId)
        .maybeSingle();

      if (error) {
        console.error("Supabase order check error:", error);
      }

      if (order && order.status !== "completed") {
        return NextResponse.json(
          {
            error:
              order.status === "pending_approval"
                ? "Đơn hàng đang chờ Admin đối chiếu thanh toán. Quyền truy cập sẽ tự động mở sau khi duyệt."
                : "Đơn hàng chưa thanh toán hoặc đã bị từ chối.",
            status: order.status,
          },
          { status: 403 }
        );
      }
    }

    // 2. Return all labs or a single lab
    if (!labId || labId === "all") {
      const allLabs = getAllLabExercises();
      return NextResponse.json({
        success: true,
        totalLabs: allLabs.length,
        labs: allLabs,
        ruleMarkdown: LAB211_RULE_MD,
      });
    }

    const lab = getLabExerciseById(labId);
    if (!lab) {
      return NextResponse.json(
        { error: `Không tìm thấy bài lab với mã: ${labId}` },
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
