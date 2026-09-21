import { LabExerciseItem, LabPackageManifest, LabSourceFile } from "@/types";
import { LAB211_MANIFEST, getLabExerciseById, getAllLabExercises, LAB211_RULE_MD } from "./lab-data";
import fs from "fs";
import path from "path";

/**
 * Checks whether a given path string attempts directory traversal (Zip Slip / Path Traversal)
 */
export function isPathSafe(filePath: string): boolean {
  if (!filePath) return false;
  if (filePath.includes("..")) return false;
  if (filePath.startsWith("/") || filePath.startsWith("\\")) return false;
  if (/^[a-zA-Z]:/.test(filePath)) return false; // Windows drive letter
  return true;
}

/**
 * Sanitizes download file names according to RFC 5987 / RFC 6266
 */
export function sanitizeFileName(name: string): string {
  return name.replace(/[\/\\?%*:|"<>]/g, "_").trim();
}

/**
 * Generates RFC 5987 Content-Disposition header value
 */
export function getSafeContentDisposition(fileName: string): string {
  const safeName = sanitizeFileName(fileName);
  const asciiFallback = safeName.replace(/[^\x20-\x7E]/g, "_");
  const utf8Encoded = encodeURIComponent(safeName);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${utf8Encoded}`;
}

/**
 * Retrieves the physical file path for a lab deliverable asset
 */
export function getLabAssetPhysicalPath(
  labId: string,
  type: "docx" | "zip" | "java",
  subPath?: string
): { filePath: string; fileName: string; contentType: string } | null {
  const lab = getLabExerciseById(labId);
  if (!lab) return null;

  const baseDir = path.resolve(process.cwd(), "private_deliverables", "lab211");

  if (type === "docx") {
    const docxPath = path.join(baseDir, "docx", lab.docxFileName);
    if (fs.existsSync(docxPath)) {
      return {
        filePath: docxPath,
        fileName: lab.docxFileName,
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }
  }

  if (type === "zip") {
    const zipPath = path.join(baseDir, "zips", lab.zipFileName);
    if (fs.existsSync(zipPath)) {
      return {
        filePath: zipPath,
        fileName: lab.zipFileName,
        contentType: "application/zip",
      };
    }
    // Fallback to Full zip if specific zip not found
    const isHcmLab = ["J1.L.P0028", "J1.L.P0038", "J1.L.P0039"].includes(lab.code);
    const fallbackZip = isHcmLab ? "LAB211_campus_HCM.zip" : "LAB211_Full.zip";
    const fullZipPath = path.join(baseDir, "zips", fallbackZip);
    if (fs.existsSync(fullZipPath)) {
      return {
        filePath: fullZipPath,
        fileName: fallbackZip,
        contentType: "application/zip",
      };
    }
  }

  if (type === "java" && subPath) {
    if (!isPathSafe(subPath)) return null;
    const fileName = path.basename(subPath);
    const javaPath = path.join(baseDir, "src", lab.code, fileName);
    if (fs.existsSync(javaPath)) {
      return {
        filePath: javaPath,
        fileName: fileName,
        contentType: "text/x-java-source; charset=utf-8",
      };
    }
    // Search in sourceFiles directly
    const sourceFile = lab.sourceFiles.find(
      (sf) => sf.fileName.toLowerCase() === fileName.toLowerCase() || sf.path.endsWith(subPath)
    );
    if (sourceFile) {
      return {
        filePath: "", // Memory content
        fileName: sourceFile.fileName,
        contentType: "text/x-java-source; charset=utf-8",
      };
    }
  }

  return null;
}

export { LAB211_MANIFEST, getLabExerciseById, getAllLabExercises, LAB211_RULE_MD };
