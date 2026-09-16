import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { isAdmin } = await getAuthenticatedUser(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Truy cập bị từ chối: Yêu cầu quyền Quản Trị Viên để tải lên tệp tin hệ thống." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "thumbnails";

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file tải lên" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP, GIF, SVG." },
        { status: 400 }
      );
    }

    // Max 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dung lượng ảnh vượt quá giới hạn 10MB" },
        { status: 400 }
      );
    }

    // Sanitize file name
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const fileName = `${folder}/${Date.now()}_${baseName}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from("product-assets")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicData } = supabaseAdmin.storage
      .from("product-assets")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      path: fileName,
      fileName: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server khi tải lên file" },
      { status: 500 }
    );
  }
}
