"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { LabExerciseItem } from "@/types";
import { getAllLabExercises, LAB211_RULE_MD } from "@/lib/lab-data";
import { getLabAnalysis, LabFaqItem } from "@/lib/lab-analysis";
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
  Brain,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Zap,
  Target,
  GraduationCap,
  Wrench,
} from "lucide-react";

interface LabDeliverableModalProps {
  orderId: string;
  orderCode?: string;
  isOpen: boolean;
  onClose: () => void;
  defaultLabCode?: string;
  productTitle?: string;
}

/** Render danh sách mindset steps với bold support */
function MindsetStep({ text }: { text: string }) {
  // bold **text** inside
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="text-indigo-300 font-bold">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    </div>
  );
}

/** FAQ accordion item */
function FaqAccordionItem({
  item,
  index,
}: {
  item: LabFaqItem;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const isTheory = item.type === "theory";

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        isTheory
          ? "border-violet-500/30 bg-violet-950/20"
          : "border-cyan-500/30 bg-cyan-950/20"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-white/5 transition-colors"
      >
        <div
          className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
            isTheory
              ? "bg-violet-500/25 text-violet-300 border border-violet-500/40"
              : "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40"
          }`}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider ${
                isTheory
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              }`}
            >
              {isTheory ? "Lý Thuyết" : "Thực Hành"}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-200 leading-snug">
            {item.question}
          </p>
        </div>
        <div className="shrink-0 text-slate-500 mt-0.5">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-white/5">
          <div className="pl-9">
            <p className="text-sm text-slate-300 leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LabDeliverableModal({
  orderId,
  orderCode = "CV-ORDER",
  isOpen,
  onClose,
  defaultLabCode,
  productTitle,
}: LabDeliverableModalProps) {
  const isCampusHcm = Boolean(
    productTitle?.toLowerCase().includes("campus hcm") ||
    defaultLabCode?.startsWith("J1.L.P0028") ||
    defaultLabCode?.startsWith("J1.L.P0038") ||
    defaultLabCode?.startsWith("J1.L.P0039")
  );

  const allLabs = getAllLabExercises(isCampusHcm ? "hcm" : "standard");
  const [selectedLabId, setSelectedLabId] = useState<string>(
    defaultLabCode || allLabs[0]?.id || (isCampusHcm ? "J1.L.P0028" : "J1.L.P0023")
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

  const analysis = getLabAnalysis(currentLab.code);

  const handleDownloadFullArchive = async () => {
    setIsDownloadingFull(true);
    try {
      let token = "";
      try {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || "";
      } catch {}

      const effectiveOrderParam = orderId || orderCode || "all";
      const downloadUrl = `/api/deliverables/lab/download?orderId=${encodeURIComponent(effectiveOrderParam)}&labId=all&type=zip${token ? `&token=${encodeURIComponent(token)}` : ""}`;
      
      const res = await fetch(downloadUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Lỗi tải file deliverable" }));
        alert(err.error || `Không thể tải file (Mã lỗi ${res.status}). Vui lòng kiểm tra lại trạng thái đơn hàng.`);
        return;
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = isCampusHcm ? "LAB211_campus_HCM.zip" : "LAB211.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err: any) {
      console.error("Full archive download error:", err);
      alert(err?.message || "Không thể tải file nén. Vui lòng thử lại.");
    } finally {
      setIsDownloadingFull(false);
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
                <span>{isCampusHcm ? "Kho Bàn Giao Mã Nguồn & Đề Bài LAB211 Campus HCM" : "Kho Bàn Giao Mã Nguồn & Đề Bài LAB211"}</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFullArchive}
              disabled={isDownloadingFull}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50"
              title={isCampusHcm ? "Tải toàn bộ mã nguồn bài lab Campus HCM nén trong 1 file ZIP" : `Tải toàn bộ ${allLabs.length} bài lab nén trong 1 file ZIP`}
            >
              <Download className="w-4 h-4" />
              <span>{isCampusHcm ? "Tải Trọn Gói Campus HCM (.zip)" : `Tải Trọn Gói ${allLabs.length} Bài (.zip)`}</span>
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

        {/* VIP Gift Banner */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-blue-500/15 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/30">
              🎁 Quà Tặng Kèm
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Web Full Lý Thuyết OOP &amp; Nền Tảng PRO192/LAB211 (Bảo vệ điểm 10):
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

        {/* Lab Exercise Selector Bar — hiện TẤT CẢ labs, không limit */}
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

          {/* Quick Tabs — KHÔNG slice, hiện TẤT CẢ filteredLabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {filteredLabs.map((lab) => {
              const isSelected = lab.id === currentLab.id;
              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  title={lab.title}
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

          {/* SECTION 1: ĐỀ BÀI – WORD DOCUMENT PREVIEW */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${isCampusHcm || currentLab.docxFileName?.toLowerCase().endsWith(".pdf") ? "text-rose-400" : "text-blue-400"}`}>
                <FileText className="w-4 h-4" />
                <span>{isCampusHcm || currentLab.docxFileName?.toLowerCase().endsWith(".pdf") ? "1. Đề Bài & Đặc Tả Yêu Cầu (File PDF Gốc)" : "1. Đề Bài & Đặc Tả Yêu Cầu (File Word Gốc)"}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                File tải về: <b className="text-slate-200">{currentLab.docxFileName}</b>
              </span>
            </div>
            <LabDocViewer lab={currentLab} orderId={orderId} />
          </div>

          {/* SECTION 2: PHÂN TÍCH ĐỀ & HƯỚNG DẪN TƯ DUY */}
          <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-violet-950/40 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-indigo-500/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 shrink-0">
                <Brain className="w-4.5 h-4.5 text-white" style={{width: '1.1rem', height: '1.1rem'}} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                  2. Phân Tích Đề &amp; Hướng Dẫn Tư Duy
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[10px] text-indigo-400 font-mono mt-0.5">
                  Đọc kỹ trước khi code — Bộ Tư Duy AI CodeVault
                </p>
              </div>
            </div>

            {analysis ? (
              <div className="p-5 space-y-5">
                {/* Tóm tắt bài */}
                <div className="rounded-xl bg-indigo-900/20 border border-indigo-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">Tóm Tắt Yêu Cầu</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Hướng dẫn từng bước */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Hướng Dẫn Từng Bước</span>
                  </div>
                  <div className="space-y-3">
                    {analysis.mindset.map((step, idx) => (
                      <MindsetStep key={idx} text={step} />
                    ))}
                  </div>
                </div>

                {/* OOP Concepts */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">Khái Niệm OOP Áp Dụng</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysis.oopConcepts.map((concept, idx) => {
                      const parts = concept.split(/\*\*(.*?)\*\*/g);
                      return (
                        <div
                          key={idx}
                          className="flex gap-2.5 items-start px-3.5 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-700/25"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {parts.map((part, i) =>
                              i % 2 === 1 ? (
                                <strong key={i} className="text-emerald-300 font-bold">{part}</strong>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-slate-500 text-sm">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Dữ liệu phân tích cho bài này đang được cập nhật...</p>
              </div>
            )}
          </div>

          {/* SECTION 3: MÃ NGUỒN JAVA */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>3. Mã Nguồn Java Chi Tiết (Chuẩn Mô Hình MVC &amp; OOP)</span>
              </div>
              <span className="text-[11px] text-slate-400">
                NetBeans Project: <b className="text-slate-200">{currentLab.zipFileName}</b>
              </span>
            </div>
            <LabCodeViewer lab={currentLab} orderId={orderId} />
          </div>

          {/* SECTION 4: CÂU HỎI THƯỜNG GẶP & ÔN TẬP */}
          <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/40 via-slate-900/80 to-cyan-950/30 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-violet-500/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-900/40 shrink-0">
                <GraduationCap className="w-4.5 h-4.5 text-white" style={{width: '1.1rem', height: '1.1rem'}} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                  4. Câu Hỏi Thường Gặp &amp; Ôn Tập
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">5 câu hỏi</span>
                </h3>
                <p className="text-[10px] text-violet-400 font-mono mt-0.5">
                  3 lý thuyết + 2 thực hành · Chuẩn bị tốt cho giảng viên hỏi
                </p>
              </div>
            </div>

            {analysis ? (
              <div className="p-5">
                {/* Legend */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
                    <span className="text-[11px] text-slate-400">Câu hỏi lý thuyết (Giảng viên hay hỏi)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                    <span className="text-[11px] text-slate-400">Câu hỏi sửa / thêm tính năng</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {analysis.faq.map((item, idx) => (
                    <FaqAccordionItem key={idx} item={item} index={idx} />
                  ))}
                </div>

                {/* Pro tip */}
                <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    <strong className="text-amber-300">Pro tip:</strong> Giảng viên thường hỏi các câu lý thuyết khi báo cáo. Hãy đọc và hiểu đáp án — không cần thuộc lòng từng chữ, chỉ cần nắm ý chính và trả lời bằng ngôn ngữ của mình.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-slate-500 text-sm">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Dữ liệu FAQ cho bài này đang được cập nhật...</p>
              </div>
            )}
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
