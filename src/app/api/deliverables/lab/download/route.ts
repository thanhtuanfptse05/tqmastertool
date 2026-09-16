import { NextRequest, NextResponse } from "next/server";
import { getLabAssetPhysicalPath, getLabExerciseById, getSafeContentDisposition, isPathSafe } from "@/lib/lab-parser";
import { getAuthenticatedUser, supabaseAdmin } from "@/lib/supabase-server";
import fs from "fs";

export const dynamic = "force-dynamic";

/**
 * Secure LAB211 Deliverable Download Endpoint
 * Query Params:
 * - orderId: UUID or string (Required)
 * - labId: string (Required, e.g., "J1.L.P0023" or "all")
 * - type: "docx" | "zip" | "java" (Required)
 * - filePath: string (Optional, required if type === "java")
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const labId = searchParams.get("labId");
    const type = searchParams.get("type") as "docx" | "zip" | "java" | null;
    const filePath = searchParams.get("filePath") || undefined;

    // 1. Validate required params
    if (!orderId || !labId || !type) {
      return NextResponse.json(
        { error: "Thiếu thông số bắt buộc: orderId, labId, hoặc type" },
        { status: 400 }
      );
    }

    if (!["docx", "zip", "java"].includes(type)) {
      return NextResponse.json(
        { error: "Loại file không hợp lệ. Chỉ chấp nhận 'docx', 'zip', hoặc 'java'" },
        { status: 400 }
      );
    }

    if (filePath && !isPathSafe(filePath)) {
      return NextResponse.json(
        { error: "Đường dẫn file không an toàn (phát hiện Path Traversal)" },
        { status: 400 }
      );
    }

    // 2. SECURITY GATE: Verify Order status === 'completed' & Ownership Check (Anti-IDOR)
    const { user, isAdmin } = await getAuthenticatedUser(req);
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      console.error("[Lab Download API] SUPABASE_SERVICE_ROLE_KEY is missing on server!");
      return NextResponse.json(
        { error: "Lỗi cấu hình xác thực máy chủ. Quyền tải bị từ chối." },
        { status: 500 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, status, user_id, order_code, admin_notes")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error("Supabase order check error:", error);
    }

    if (!order) {
      return NextResponse.json(
        { error: "Đơn hàng không tồn tại hoặc không hợp lệ. Quyền tải bị từ chối." },
        { status: 403 }
      );
    }

    // Anti-IDOR: verify ownership if not Admin
    if (!isAdmin) {
      if (order.user_id && (!user || order.user_id !== user.id)) {
        console.warn(`[SECURITY ALERT - IDOR DOWNLOAD] Requester (${user?.id || "unauthenticated"}) tried to download deliverables of order ${order.id} owned by ${order.user_id}`);
        return NextResponse.json(
          { error: "Quyền tải bị từ chối: Bạn không sở hữu đơn hàng này." },
          { status: 403 }
        );
      }
    }

    const isBlocked = order.status === "blocked" || (order.admin_notes && order.admin_notes.includes("[BLOCKED]"));
    if (isBlocked) {
      return NextResponse.json(
        {
          error: "🚨 Đơn hàng này đã bị Quản Trị Viên thu hồi và chặn quyền tải tài nguyên do vi phạm quy định hoặc gian lận thanh toán.",
          status: "blocked",
        },
        { status: 403 }
      );
    }

    if (order.status !== "completed") {
      let errorMsg = "Đơn hàng chưa thanh toán hoặc chưa được duyệt. Quyền truy cập bị từ chối.";
      if (order.status === "pending_approval") {
        errorMsg = "Đơn hàng đang chờ Admin đối chiếu thanh toán. Quyền tải sẽ tự động mở sau khi duyệt.";
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

    // 3. Special case: Download all labs full zip
    if (labId === "all" || labId.toLowerCase() === "full") {
      const fullZipPath = `${process.cwd()}/private_deliverables/lab211/zips/LAB211_Full.zip`;
      if (fs.existsSync(fullZipPath)) {
        const fileBuffer = fs.readFileSync(fullZipPath);
        const fileName = "LAB211_Tron_Bo_Java_OOP.zip";
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": getSafeContentDisposition(fileName),
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        });
      }
    }

    // 4. Resolve lab exercise
    const lab = getLabExerciseById(labId);
    if (!lab) {
      return NextResponse.json(
        { error: `Không tìm thấy bài lab với mã: ${labId}` },
        { status: 404 }
      );
    }

    // 5. Locate physical asset or source file
    const asset = getLabAssetPhysicalPath(lab.id, type, filePath);
    if (!asset) {
      return NextResponse.json(
        { error: "Không tìm thấy file deliverable được yêu cầu" },
        { status: 404 }
      );
    }

    // If memory Java file
    if (!asset.filePath) {
      const sf = lab.sourceFiles.find(
        (f) => f.fileName.toLowerCase() === asset.fileName.toLowerCase()
      );
      if (!sf) {
        return NextResponse.json({ error: "Không tìm thấy mã nguồn file" }, { status: 404 });
      }
      return new NextResponse(sf.content, {
        status: 200,
        headers: {
          "Content-Type": "text/x-java-source; charset=utf-8",
          "Content-Disposition": getSafeContentDisposition(sf.fileName),
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    }

    // Physical file streaming
    if (!fs.existsSync(asset.filePath)) {
      return NextResponse.json({ error: "File không tồn tại trên hệ thống lưu trữ" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(asset.filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": asset.contentType,
        "Content-Disposition": getSafeContentDisposition(asset.fileName),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("Lab deliverable download error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server khi tải deliverable" },
      { status: 500 }
    );
  }
}
