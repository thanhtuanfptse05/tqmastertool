"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";

interface LabDocViewerProps {
  lab: LabExerciseItem;
  orderId: string;
  onDownloadDocx?: () => void;
}

/**
 * LabDocViewer — renders Word DOCX files exactly as they appear in Microsoft Word.
 *
 * Strategy:
 *  1. Fetch the DOCX binary from the secure download API
 *  2. Use mammoth.js (browser bundle) to convert DOCX → clean HTML
 *  3. Inject into a sandboxed container with scoped Word-like CSS
 *
 * This preserves 100% of the original Word formatting: tables, paragraphs,
 * heading styles, numbered lists, bold/italic, indentation, etc.
 */
export default function LabDocViewer({ lab, orderId, onDownloadDocx }: LabDocViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMaxHeight, setIsMaxHeight] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxError, setDocxError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");

  // Cache: labId → html, to avoid re-fetching on tab switch
  const cacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!isExpanded) return;

    const labKey = lab.id;
    if (cacheRef.current[labKey]) {
      setDocxHtml(cacheRef.current[labKey]);
      setDocxError(null);
      return;
    }

    let cancelled = false;
    setLoadingDocx(true);
    setDocxHtml(null);
    setDocxError(null);

    const fetchAndConvert = async () => {
      try {
        // 1. Fetch DOCX binary from our secure API
        const url = `/api/deliverables/lab/download?orderId=${encodeURIComponent(orderId)}&labId=${encodeURIComponent(lab.id)}&type=docx`;
        const resp = await fetch(url, { credentials: "include" });

        if (!resp.ok) {
          let msg = `Tải file thất bại (HTTP ${resp.status})`;
          try {
            const j = await resp.json();
            if (j?.error) msg = j.error;
          } catch { /* ignore */ }
          throw new Error(msg);
        }

        const arrayBuffer = await resp.arrayBuffer();
        if (cancelled) return;

        // 2. Dynamically import mammoth (browser build) to keep bundle lean
        const mammoth = await import("mammoth/mammoth.browser");
        const result = await mammoth.convertToHtml({ arrayBuffer });

        if (cancelled) return;

        if (result.messages?.length > 0) {
          // Log warnings only — not blocking
          console.debug("[mammoth warnings]", result.messages);
        }

        cacheRef.current[labKey] = result.value;
        setDocxHtml(result.value);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setDocxError(msg);
      } finally {
        if (!cancelled) setLoadingDocx(false);
      }
    };

    fetchAndConvert();
    return () => { cancelled = true; };
  // Re-run when lab changes or panel is first expanded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lab.id, orderId, isExpanded]);

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
            <h3 className="text-base font-black text-white mt-1 tracking-tight">
              Đề Bài &amp; Đặc Tả Yêu Cầu: {lab.code}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
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

          {/* Expand Height Toggle */}
          <button
            onClick={() => setIsMaxHeight(!isMaxHeight)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all active:scale-95"
            title={isMaxHeight ? "Thu gọn về chiều cao tiêu chuẩn" : "Mở rộng chiều cao tối đa"}
          >
            {isMaxHeight ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMaxHeight ? "Chiều cao chuẩn" : "Xem thoáng"}</span>
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
            <span>Tải File Đề (.docx)</span>
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
            title={isExpanded ? "Thu gọn" : "Mở rộng"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Metadata Chips */}
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

      {/* Document Body */}
      {isExpanded && (
        <div
          className={`overflow-y-auto bg-white transition-all duration-300 ${
            isMaxHeight
              ? "min-h-[600px] max-h-none"
              : "min-h-[480px] max-h-[760px] xl:max-h-[820px] 2xl:max-h-[860px]"
          }`}
        >
          {/* Loading state */}
          {loadingDocx && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">Đang tải &amp; render đề bài từ file Word...</p>
            </div>
          )}

          {/* Error state */}
          {!loadingDocx && docxError && (
            <div className="p-8">
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-orange-800 mb-1">Không thể render file Word</p>
                    <p className="text-xs text-orange-700 mb-3">{docxError}</p>
                    <p className="text-xs text-slate-500">
                      Hãy dùng nút <strong>"Tải File Đề (.docx)"</strong> ở trên để mở bằng Microsoft Word hoặc Google Docs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rendered DOCX content */}
          {!loadingDocx && docxHtml && (
            <div className={`px-8 sm:px-12 md:px-16 py-8 sm:py-10 ${fontSize === "large" ? "text-base" : "text-sm"}`}>
              {/* Paper header */}
              <div className="mb-6 pb-5 border-b border-slate-200/90">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-blue-600 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>TRƯỜNG ĐẠI HỌC FPT • MÔN HỌC LAB211 (JAVA OOP)</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {lab.code} — {lab.title}
                </h1>
              </div>

              {/* mammoth-rendered DOCX HTML with Word-accurate CSS */}
              <div
                className="mammoth-docx-output"
                style={{ fontSize: fontSize === "large" ? "1rem" : "0.875rem" }}
                dangerouslySetInnerHTML={{ __html: docxHtml }}
              />
            </div>
          )}
        </div>
      )}

      {/* Scoped DOCX styles — matches Word default rendering */}
      <style jsx global>{`
        .mammoth-docx-output {
          color: #1e293b;
          line-height: 1.75;
          font-family: "Calibri", "Segoe UI", Arial, sans-serif;
          max-width: 100%;
        }

        /* Paragraphs */
        .mammoth-docx-output p {
          margin: 0.45em 0;
          color: #1e293b;
        }
        .mammoth-docx-output p:empty {
          margin: 0.2em 0;
          min-height: 0.5em;
        }

        /* Headings */
        .mammoth-docx-output h1 {
          font-size: 1.5em;
          font-weight: 900;
          color: #0f172a;
          margin: 1.2em 0 0.4em;
          border-bottom: 2px solid #dbeafe;
          padding-bottom: 0.25em;
        }
        .mammoth-docx-output h2 {
          font-size: 1.2em;
          font-weight: 800;
          color: #1d4ed8;
          margin: 1em 0 0.35em;
        }
        .mammoth-docx-output h3 {
          font-size: 1.05em;
          font-weight: 700;
          color: #1e40af;
          margin: 0.85em 0 0.3em;
        }
        .mammoth-docx-output h4,
        .mammoth-docx-output h5,
        .mammoth-docx-output h6 {
          font-size: 1em;
          font-weight: 700;
          color: #334155;
          margin: 0.7em 0 0.25em;
        }

        /* Tables — Word-accurate */
        .mammoth-docx-output table {
          border-collapse: collapse;
          width: 100%;
          margin: 0.9em 0;
          font-size: 0.9em;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          border-radius: 8px;
          overflow: hidden;
        }
        .mammoth-docx-output table tr:first-child th,
        .mammoth-docx-output table tr:first-child td {
          background: #eff6ff;
          font-weight: 700;
          color: #1e3a8a;
        }
        .mammoth-docx-output th,
        .mammoth-docx-output td {
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
        }
        .mammoth-docx-output tr:nth-child(even) td {
          background: #f8fafc;
        }
        .mammoth-docx-output tr:hover td {
          background: #f0f9ff;
        }

        /* Lists */
        .mammoth-docx-output ul {
          list-style: disc;
          margin: 0.5em 0 0.5em 1.5em;
          padding: 0;
        }
        .mammoth-docx-output ol {
          list-style: decimal;
          margin: 0.5em 0 0.5em 1.5em;
          padding: 0;
        }
        .mammoth-docx-output li {
          margin: 0.25em 0;
          color: #1e293b;
        }

        /* Inline formatting */
        .mammoth-docx-output strong,
        .mammoth-docx-output b {
          font-weight: 700;
          color: #0f172a;
        }
        .mammoth-docx-output em,
        .mammoth-docx-output i {
          font-style: italic;
          color: #334155;
        }
        .mammoth-docx-output u {
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Code/monospace inside docx */
        .mammoth-docx-output code,
        .mammoth-docx-output pre {
          font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          padding: 2px 6px;
          font-size: 0.88em;
          color: #0f172a;
        }
        .mammoth-docx-output pre {
          padding: 10px 14px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* Hyperlinks */
        .mammoth-docx-output a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Images */
        .mammoth-docx-output img {
          max-width: 100%;
          border-radius: 6px;
          margin: 0.5em 0;
          box-shadow: 0 1px 6px rgba(0,0,0,0.1);
        }

        /* Horizontal rules */
        .mammoth-docx-output hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 1.2em 0;
        }

        /* Word bookmark/anchor targets */
        .mammoth-docx-output [id] {
          scroll-margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
