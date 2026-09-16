import { NextRequest, NextResponse } from "next/server";
import { isPathSafe } from "@/lib/lab-parser";
import { getAllLabExercises } from "@/lib/lab-data";
import { getAuthenticatedUser } from "@/lib/supabase-server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

/**
 * Admin LAB Zip Package Upload Endpoint
 * Handles automated ingestion of LAB211.zip or individual lab zips
 */
export async function POST(req: NextRequest) {
  try {
    const { isAdmin } = await getAuthenticatedUser(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Truy cập bị từ chối: Yêu cầu quyền Quản Trị Viên để nhập gói bài tập Lab." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file ZIP tải lên" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".zip")) {
      return NextResponse.json(
        { error: "Chỉ hỗ trợ file nén định dạng .ZIP" },
        { status: 400 }
      );
    }

    // Max 100MB
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dung lượng file vượt quá giới hạn 100MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save temporary archive
    const uploadDir = path.resolve(process.cwd(), "private_deliverables", "lab211", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    const tempZipPath = path.join(uploadDir, `${Date.now()}_${safeName}`);
    fs.writeFileSync(tempZipPath, buffer);

    // If LAB211.zip or package, we can run the extractor
    // Also copy to root LAB211.zip if user uploaded LAB211.zip
    if (file.name.toLowerCase().includes("lab211")) {
      fs.writeFileSync(path.resolve(process.cwd(), "LAB211.zip"), buffer);
      // Run the python extractor script to refresh all labs
      const scriptPath = path.resolve(process.cwd(), "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\79f270f9-71ef-4927-85a8-9507bc82a5f7\\scratch\\extract_and_build.py");
      if (fs.existsSync(scriptPath)) {
        try {
          await execAsync(`python "${scriptPath}"`);
        } catch (scriptErr) {
          console.error("Extractor execution error:", scriptErr);
        }
      }
    }

    const currentLabs = getAllLabExercises();

    return NextResponse.json({
      success: true,
      message: `Đã tải lên và nhận diện thành công ${currentLabs.length} bài lab!`,
      fileName: file.name,
      fileSize: file.size,
      totalLabs: currentLabs.length,
      labs: currentLabs.map((l) => ({
        code: l.code,
        title: l.title,
        docxFileName: l.docxFileName,
        sourceFilesCount: l.sourceFiles.length,
      })),
    });
  } catch (err: any) {
    console.error("Admin lab package upload error:", err);
    return NextResponse.json(
      { error: err.message || "Lỗi khi xử lý gói ZIP bài lab" },
      { status: 500 }
    );
  }
}
