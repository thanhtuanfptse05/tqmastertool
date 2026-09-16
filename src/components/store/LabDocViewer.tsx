"use client";

import React, { useState, useMemo } from "react";
import { LabExerciseItem } from "@/types";
import {
  FileText,
  Download,
  Check,
  Clock,
  Code,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Sparkles,
  ExternalLink,
  Maximize2,
  Minimize2,
  Copy,
  BookOpen,
} from "lucide-react";

interface LabDocViewerProps {
  lab: LabExerciseItem;
  orderId: string;
  onDownloadDocx?: () => void;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Formats raw docx HTML:
 * 1. Eliminates duplicate paragraph tags that repeat table metadata.
 * 2. Transforms console/terminal output lines into styled terminal blocks.
 * 3. Preserves 100% of the actual problem statement, test cases, and guidelines.
 */
function cleanAndFormatDocxHtml(rawHtml: string, lab: LabExerciseItem): string {
  if (!rawHtml) return "";

  let cleaned = rawHtml;

  // 1. Remove duplicate metadata paragraphs that repeat table content
  const patternsToRemove = [
    /<p[^>]*>\s*LAB\s*211\s*Assignment\s*<\/p>/gi,
    /<p[^>]*>\s*(Short|Long)\s*Assignment\s*<\/p>/gi,
    new RegExp(`<p[^>]*>\\s*${lab.code.replace(/[\s.]/g, "[\\s.]*")}\\s*<\\/p>`, "gi"),
    lab.loc ? new RegExp(`<p[^>]*>\\s*${lab.loc}\\s*<\\/p>`, "gi") : null,
    lab.slots ? new RegExp(`<p[^>]*>\\s*${lab.slots}\\s*<\\/p>`, "gi") : null,
    new RegExp(`<p[^>]*>\\s*${escapeRegExp(lab.title)}\\s*<\\/p>`, "gi"),
  ].filter(Boolean) as RegExp[];

  for (const pattern of patternsToRemove) {
    cleaned = cleaned.replace(pattern, "");
  }

  // 2. Format console and sample simulation lines (light harmonious cards)
  cleaned = cleaned.replace(/<p[^>]*>(.*?)<\/p>/gi, (match, text) => {
    const trimmed = text.trim();
    const isHeaderLine =
      trimmed.startsWith("| ++") ||
      trimmed.startsWith("Product | Quantity") ||
      trimmed === "FRUIT SHOP SYSTEM" ||
      trimmed === "List of Fruit:";

    const isSampleLine =
      trimmed.startsWith("Customer:") ||
      trimmed.startsWith("Total:") ||
      trimmed.startsWith("Step ") ||
      /^\d+\s+(Coconut|Orange|Apple|Grape|Mango)/i.test(trimmed) ||
      trimmed.startsWith("You selected:") ||
      trimmed.startsWith("Please input quantity:");

    if (isHeaderLine) {
      return `<div class="word-doc-sample-header">${text}</div>`;
    }
    if (isSampleLine) {
      return `<div class="word-doc-sample-block">${text}</div>`;
    }
    return match;
  });

  return cleaned;
}

export default function LabDocViewer({ lab, orderId, onDownloadDocx }: LabDocViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMaxHeight, setIsMaxHeight] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");

  const formattedHtml = useMemo(() => {
    return cleanAndFormatDocxHtml(lab.docxContentHtml, lab);
  }, [lab.docxContentHtml, lab]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (onDownloadDocx) {
        onDownloadDocx();
      } else {
        const downloadUrl = `/api/deliverables/lab/download?orderId=${encodeURIComponent(orderId)}&labId=${encodeURIComponent(lab.id)}&type=docx`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = lab.docxFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Docx download error:", err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const handleCopyText = () => {
    const textToCopy = lab.docxTextPreview || "";
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-blue-200/90 shadow-xl overflow-hidden transition-all">
      {/* Word Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-5 py-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner border border-white/25 shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Word Assignment Document
              </span>
              <span className="text-xs text-blue-100 font-mono">
                {lab.docxFileName}
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-1 tracking-tight flex items-center gap-2">
              <span>Đề Bài & Đặc Tả Yêu Cầu: {lab.code}</span>
            </h3>
          </div>
        </div>

        {/* Action & Reader Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Font Size Toggle */}
          <div className="flex items-center bg-white/15 rounded-xl p-0.5 border border-white/20 text-white text-xs font-bold">
            <button
              onClick={() => setFontSize("normal")}
              className={`px-2 py-1 rounded-lg transition-colors ${
                fontSize === "normal" ? "bg-white text-blue-700 shadow-xs" : "hover:bg-white/15"
              }`}
              title="Cỡ chữ tiêu chuẩn"
            >
              A
            </button>
            <button
              onClick={() => setFontSize("large")}
              className={`px-2 py-1 rounded-lg transition-colors text-sm font-black ${
                fontSize === "large" ? "bg-white text-blue-700 shadow-xs" : "hover:bg-white/15"
              }`}
              title="Cỡ chữ lớn"
            >
              A+
            </button>
          </div>

          {/* Max Height / Airy View Toggle */}
          <button
            onClick={() => setIsMaxHeight(!isMaxHeight)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
            title={isMaxHeight ? "Thu gọn về chiều cao tiêu chuẩn" : "Mở rộng chiều cao tối đa để đọc thoáng"}
          >
            {isMaxHeight ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMaxHeight ? "Chiều cao chuẩn" : "Xem thoáng (Max Height)"}</span>
          </button>

          {/* Copy Text Button */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
            title="Sao chép nội dung tóm tắt đề bài"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCopied ? "Đã chép" : "Chép đề"}</span>
          </button>

          {/* Download docx Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs shadow-md shadow-black/10 transition-all active:scale-95 disabled:opacity-50"
            title={`Tải file ${lab.docxFileName}`}
          >
            {isDownloading ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Tải File Đề Bài (.docx)</span>
          </button>

          {/* Accordion Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
            title={isExpanded ? "Thu gọn nội dung" : "Mở rộng nội dung"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Metadata Chips Bar */}
      <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center gap-3.5 text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-bold text-blue-950">
          <Code className="w-4 h-4 text-blue-600" />
          <span>Mã Bài:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 font-mono font-black text-blue-800 border border-blue-200">
            {lab.code}
          </span>
        </div>

        {lab.loc && (
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>LOC Dự Kiến:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-200/80 font-mono font-bold text-slate-800 border border-slate-300">
              {lab.loc} dòng
            </span>
          </div>
        )}

        {lab.slots && (
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Thời lượng Slot:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-100/90 text-amber-950 font-mono font-bold border border-amber-200">
              {lab.slots} slots
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2.5 flex-wrap">
          <a
            href="https://thanhtuanfptse05.github.io/PRO192-21392-theory/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-[11px] border border-amber-300 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Web Lý Thuyết OOP</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <FileCheck2 className="w-4 h-4" />
            <span>Chuẩn đề thi FPT LAB211</span>
          </div>
        </div>
      </div>

      {/* Word Content Body (Document Paper) */}
      {isExpanded && (
        <div
          className={`p-6 sm:p-8 md:p-10 overflow-y-auto text-slate-800 font-sans transition-all duration-300 bg-white ${
            isMaxHeight
              ? "min-h-[750px] max-h-none"
              : "min-h-[560px] max-h-[760px] xl:max-h-[820px] 2xl:max-h-[860px]"
          }`}
        >
          {/* Assignment Title Paper Header */}
          <div className="mb-6 pb-5 border-b border-slate-200/90">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-blue-600 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>TRƯỜNG ĐẠI HỌC FPT • MÔN HỌC LAB211 (JAVA OOP)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {lab.code} — {lab.title}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Tài liệu đề thi & đặc tả chương trình chính thức trích xuất từ file gốc:{" "}
              <code className="text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                {lab.docxFileName}
              </code>
            </p>
          </div>

          {/* Formatted Docx Content */}
          {lab.docxContentHtml ? (
            <div
              className={`word-doc-body w-full ${
                fontSize === "large" ? "text-base" : "text-sm"
              }`}
              dangerouslySetInnerHTML={{ __html: formattedHtml }}
            />
          ) : (
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {lab.docxTextPreview}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

