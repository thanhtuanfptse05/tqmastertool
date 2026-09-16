"use client";

import React, { useState } from "react";
import { LabExerciseItem } from "@/types";
import { getAllLabExercises, LAB211_RULE_MD } from "@/lib/lab-data";
import LabDocViewer from "./LabDocViewer";
import LabCodeViewer from "./LabCodeViewer";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import {
  Sparkles,
  ShieldCheck,
  Download,
  BookOpen,
  Code2,
  FileCheck2,
  X,
  FileText,
  Search,
  ExternalLink,
} from "lucide-react";

interface LabDeliverableModalProps {
  orderId: string;
  orderCode?: string;
  isOpen: boolean;
  onClose: () => void;
  defaultLabCode?: string;
}

export default function LabDeliverableModal({
  orderId,
  orderCode = "CV-ORDER",
  isOpen,
  onClose,
  defaultLabCode,
}: LabDeliverableModalProps) {
  const allLabs = getAllLabExercises();
  const [selectedLabId, setSelectedLabId] = useState<string>(
    defaultLabCode || allLabs[0]?.id || "J1.L.P0023"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [isDownloadingFull, setIsDownloadingFull] = useState(false);

  if (!isOpen) return null;

  const currentLab: LabExerciseItem =
    allLabs.find((l) => l.id === selectedLabId || l.code === selectedLabId) ||
    allLabs[0];

  const filteredLabs = allLabs.filter(
    (l) =>
      l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.folderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadFullArchive = () => {
    setIsDownloadingFull(true);
    try {
      const downloadUrl = `/api/deliverables/lab/download?orderId=${encodeURIComponent(orderId)}&labId=all&type=zip`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "LAB211_Tron_Bo_Java_OOP.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Full archive download error:", err);
    } finally {
      setTimeout(() => setIsDownloadingFull(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-1 pb-1 sm:pt-2 sm:pb-2 px-1 sm:px-2 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[99.5vw] md:max-w-[99vw] 2xl:max-w-[99.2vw] bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col" style={{minHeight: '97vh', maxHeight: '97vh'}}>
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#161b22] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-900/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  ĐÃ MỞ KHÓA BẢN QUYỀN
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Mã đơn: {orderCode}
                </span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>Kho Bàn Giao Mã Nguồn & Đề Bài LAB211</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFullArchive}
              disabled={isDownloadingFull}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50"
              title="Tải toàn bộ 12 bài lab nén trong 1 file ZIP"
            >
              <Download className="w-4 h-4" />
              <span>Tải Trọn Gói 12 Bài (.zip)</span>
            </button>

            <button
              onClick={() => setShowRuleModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              <span>Quy Chuẩn Code</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIP Gift Banner: OOP Theory Web & Deliverables Outputs */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-blue-500/15 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/30">
              🎁 Quà Tặng Kèm
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Web Full Lý Thuyết OOP & Nền Tảng PRO192/LAB211 (Bảo vệ điểm 10):
            </span>
          </div>
          <a
            href="https://thanhtuanfptse05.github.io/PRO192-21392-theory/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mở Web Lý Thuyết OOP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Lab Exercise Selector Bar */}
        <div className="px-6 py-3 bg-[#0d1117] border-b border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
              Chọn bài lab:
            </span>
            <div className="relative w-full md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đề (VD: P0023)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Quick Tabs Slider */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
            {filteredLabs.slice(0, 8).map((lab) => {
              const isSelected = lab.id === currentLab.id;
              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                      : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {lab.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-5 lg:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950">
          {/* SECTION 1: WORD DOCUMENT PREVIEW */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>1. Đề Bài & Đặc Tả Yêu Cầu (File Word Gốc)</span>
              </div>
              <span className="text-[11px] text-slate-400">
                File tải về: <b className="text-slate-200">{currentLab.docxFileName}</b>
              </span>
            </div>
            <LabDocViewer lab={currentLab} orderId={orderId} />
          </div>

          {/* SECTION 2: INTERACTIVE SOURCE CODE VIEWER */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>2. Mã Nguồn Java Chi Tiết (Chuẩn Mô Hình MVC & OOP)</span>
              </div>
              <span className="text-[11px] text-slate-400">
                NetBeans Project: <b className="text-slate-200">{currentLab.zipFileName}</b>
              </span>
            </div>
            <LabCodeViewer lab={currentLab} orderId={orderId} />
          </div>
        </div>

        {/* Rule Modal — Markdown Rendered */}
        {showRuleModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-4xl bg-[#0d1117] border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col" style={{maxHeight: '90vh'}}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-tight">Tập Quy Tắc Viết Code</h3>
                    <p className="text-[10px] text-slate-500 font-mono">LAB211 / rule.md — FPT University Standard</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Markdown Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <MarkdownRenderer content={LAB211_RULE_MD} />
              </div>

              <div className="flex justify-end px-6 py-4 border-t border-slate-800 shrink-0">
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-900/30"
                >
                  ✓ Đã Hiểu Quy Chuẩn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
