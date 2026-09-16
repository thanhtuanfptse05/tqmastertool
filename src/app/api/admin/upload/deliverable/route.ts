import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file mã nguồn/tài liệu tải lên" }, { status: 400 });
    }

    // Max 50MB (Supabase free tier limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dung lượng file vượt quá giới hạn 50MB" },
        { status: 400 }
      );
    }

    // Sanitize file name
    const ext = file.name.split(".").pop()?.toLowerCase() || "zip";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);
    const fileName = `packages/${Date.now()}_${baseName}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = file.type || "application/zip";

    const { data, error } = await supabaseAdmin.storage
      .from("digital-deliverables")
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase deliverables upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      storagePath: fileName,
      fileName: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error("Deliverable upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi server khi tải lên file giao hàng" },
      { status: 500 }
    );
  }
}
