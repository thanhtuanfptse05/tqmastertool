import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, getAuthenticatedUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/products?productId=xxx
 * Permanently deletes a product and its associated product_demos from Supabase.
 * Detaches any historical order_items so orders remain intact without breaking FK constraints.
 * Security: Authorized Admin only.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Thiếu mã sản phẩm cần xóa (productId)." },
        { status: 400 }
      );
    }

    // 1. Authenticate user and verify Admin status
    const { user, isAdmin } = await getAuthenticatedUser(req);
    if (!isAdmin) {
      console.warn(
        `[SECURITY ALERT] Unauthorized attempt to delete product ${productId} by user ${user?.email || "anonymous"}`
      );
      return NextResponse.json(
        { error: "Quyền truy cập bị từ chối: Chỉ Quản trị viên mới có quyền xóa sản phẩm." },
        { status: 403 }
      );
    }

    console.log(
      `[API /api/admin/products DELETE] Admin ${user?.email} is permanently deleting product ${productId}...`
    );

    // 2. Fetch target product to confirm existence
    const { data: targetProduct, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select("id, title, slug")
      .eq("id", productId)
      .maybeSingle();

    if (fetchErr) {
      console.error("[API /api/admin/products DELETE] Database fetch error:", fetchErr);
      return NextResponse.json(
        { error: `Lỗi truy vấn cơ sở dữ liệu: ${fetchErr.message}` },
        { status: 500 }
      );
    }

    if (!targetProduct) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm trong cơ sở dữ liệu." },
        { status: 404 }
      );
    }

    // 3. Detach order_items if foreign key exists to preserve order history
    try {
      await supabaseAdmin
        .from("order_items")
        .update({ product_id: null })
        .eq("product_id", productId);
    } catch (orderItemsErr) {
      console.warn(
        "[API /api/admin/products DELETE] Note on order_items detach:",
        orderItemsErr
      );
    }

    // 4. Delete associated product_demos
    try {
      await supabaseAdmin
        .from("product_demos")
        .delete()
        .eq("product_id", productId);
    } catch (demoErr) {
      console.warn(
        "[API /api/admin/products DELETE] Error removing product_demos:",
        demoErr
      );
    }

    // 5. Permanently delete product from products table
    const { error: deleteErr } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteErr) {
      console.error("[API /api/admin/products DELETE] Failed to delete product:", deleteErr);
      return NextResponse.json(
        { error: `Không thể xóa sản phẩm: ${deleteErr.message}` },
        { status: 500 }
      );
    }

    console.log(
      `[API /api/admin/products DELETE] Successfully deleted product ${productId} (${targetProduct.title})`
    );

    return NextResponse.json({
      success: true,
      message: `Đã xóa vĩnh viễn sản phẩm "${targetProduct.title}" thành công.`,
    });
  } catch (err: any) {
    console.error("[API /api/admin/products DELETE] Server exception:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi máy chủ khi xóa sản phẩm." },
      { status: 500 }
    );
  }
}
