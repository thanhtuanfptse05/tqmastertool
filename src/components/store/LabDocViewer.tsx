"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface LabDocViewerProps {
  lab: LabExerciseItem;
  orderId: string;
  onDownloadDocx?: () => void;
}

export default function LabDocViewer({ lab, orderId, onDownloadDocx }: LabDocViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (onDownloadDocx) {
        onDownloadDocx();
      } else {
        // Trigger direct authenticated download endpoint
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
    <div className="bg-white rounded-2xl border border-blue-200/80 shadow-md overflow-hidden transition-all">
      {/* Word Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-5 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner border border-white/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Word Document
              </span>
              <span className="text-xs text-blue-100 font-mono">
                {lab.docxFileName}
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-0.5 tracking-tight">
              Đề Bài & Đặc Tả Bài Lab: {lab.code}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs shadow-md shadow-black/10 transition-all active:scale-95 disabled:opacity-50"
            title={`Tải file ${lab.docxFileName}`}
          >
            {isDownloading ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Tải File Đề Bài (.docx)</span>
          </button>

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
      <div className="px-5 py-2.5 bg-blue-50/60 border-b border-blue-100 flex flex-wrap items-center gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-bold text-blue-900">
          <Code className="w-3.5 h-3.5 text-blue-600" />
          <span>Mã Đề:</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-100/80 font-mono text-blue-800">
            {lab.code}
          </span>
        </div>

        {lab.loc && (
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>LOC Dự Kiến:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-200/70 font-mono text-slate-800">
              {lab.loc} dòng
            </span>
          </div>
        )}

        {lab.slots && (
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Thời lượng Slot:</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 font-mono">
              {lab.slots} slots
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://thanhtuanfptse05.github.io/PRO192-21392-theory/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] border border-amber-300 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Web Lý Thuyết OOP</span>
            <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
          </a>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Chuẩn đề thi FPT LAB211</span>
          </div>
        </div>
      </div>

      {/* Word Content Body */}
      {isExpanded && (
        <div className="p-5 max-h-[600px] overflow-y-auto text-slate-800 font-sans leading-relaxed">
          {lab.docxContentHtml ? (
            <div
              className="word-doc-body w-full [&_h4]:text-sm [&_h4]:font-black [&_h4]:text-blue-900 [&_h4]:mt-4 [&_h4]:mb-1.5 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-slate-700 [&_p]:mb-1.5 [&_div]:text-sm"
              dangerouslySetInnerHTML={{ __html: lab.docxContentHtml }}
            />
          ) : (
            <p className="text-sm text-slate-600 whitespace-pre-line">
              {lab.docxTextPreview}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
