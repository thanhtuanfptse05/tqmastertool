"use client";

import React from "react";
import {
  BookOpen,
  Gift,
  ExternalLink,
  CheckCircle2,
  FileText,
  Code2,
  Terminal,
  GraduationCap,
  Layers,
  Sparkles,
  Play,
  FolderDown,
  Zap,
  ShieldCheck,
} from "lucide-react";

interface ProductDescriptionRendererProps {
  description: string;
  category?: string;
  className?: string;
}

export default function ProductDescriptionRenderer({
  description,
  category = "lab211",
  className = "",
}: ProductDescriptionRendererProps) {
  if (!description) return null;

  const isTool = category === "tool";
  const isLab = category === "lab211" || (!isTool && category !== "project");

  // Split by horizontal rules or major sections
  const rawSections = description.split(/\n---\n/).map((s) => s.trim()).filter(Boolean);

  // Helper to format inline markdown bold and inline code and URLs
  const renderInlineFormatted = (text: string) => {
    // Replace URL with styled links
    const parts = text.split(/(https?:\/\/[^\s)]+)/g);

    return parts.map((part, i) => {
      if (part.match(/^https?:\/\//)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 underline decoration-blue-400 decoration-2 underline-offset-2 break-all"
          >
            <span>{part}</span>
            <ExternalLink className="w-3.5 h-3.5 inline shrink-0" />
          </a>
        );
      }

      // Handle bold **text** and inline `code`
      const subParts = part.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return subParts.map((sub, j) => {
        if (sub.startsWith("**") && sub.endsWith("**")) {
          return (
            <strong key={j} className="font-bold text-slate-900">
              {sub.slice(2, -2)}
            </strong>
          );
        }
        if (sub.startsWith("`") && sub.endsWith("`")) {
          return (
            <code
              key={j}
              className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px] font-semibold"
            >
              {sub.slice(1, -1)}
            </code>
          );
        }
        return <span key={j}>{sub}</span>;
      });
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. VIP GIFT BANNER */}
      {isLab && (
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border-2 border-amber-400/40 shadow-sm">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] tracking-wider uppercase border border-amber-300">
                    🎁 Tặng Kèm Đặc Quyền
                  </span>
                  <span className="text-xs text-amber-700 font-bold">Trị giá 150.000đ • Miễn Phí</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                  Full Web Lý Thuyết OOP & Nền Tảng PRO192 / LAB211
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Chuẩn bị trọn bộ kiến thức 4 tính chất OOP, Class, Object, Abstract, Interface, Exception để tự tin bảo vệ vấn đáp đạt điểm 10 tuyệt đối.
                </p>
              </div>
            </div>
            <a
              href="https://thanhtuanfptse05.github.io/PRO192-21392-theory/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Mở Web Lý Thuyết OOP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {isTool && (
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-2 border-emerald-400/40 shadow-sm">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px] tracking-wider uppercase border border-emerald-300">
                    🎁 Kèm Video Hướng Dẫn &amp; Hỗ Trợ 1-1
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">Kênh Tuấn và Quân FPT • Miễn Phí</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                  Video Hướng Dẫn Kích Hoạt &amp; Ăn Trọn Điểm Bonus edX
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Đầy đủ hướng dẫn từ lúc tải mã nguồn trên Google Drive, cài đặt extension, import script cho tới lúc thanh Progress edX đạt 100% điểm thưởng.
                </p>
              </div>
            </div>
            <a
              href="https://youtu.be/OxmUL2i8BX4?si=VKICEGOE39cqulVt"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Play className="w-4 h-4" />
              <span>Xem Video YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 2. PRODUCT DELIVERABLE OUTPUTS MATRIX (ĐẦU RA SẢN PHẨM) */}
      {isLab && (
        <div className="rounded-2xl p-4 bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              4 Đầu Ra Hoàn Chỉnh Của Gói Sản Phẩm:
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
              DELIVERABLES MATRIX
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">1. File Đề Bài Word (.docx)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bản gốc từng bài: LOC, slot học, đặc tả chức năng & test cases.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">2. Mã Nguồn MVC Java (.java & .zip)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Chuẩn JDK 8 / NetBeans 17, chia MVC chặt chẽ, đóng gói private.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">3. Console Run Output Chuẩn</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bản ghi kết quả chạy mẫu, menu console & validation lỗi nhập liệu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">4. Web Lý Thuyết OOP</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Link web lý thuyết full OOP nền tảng thi PE & bảo vệ vấn đáp.
              </p>
            </div>
          </div>
        </div>
      )}

      {isTool && (
        <div className="rounded-2xl p-4 bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              4 Đầu Ra Hoàn Chỉnh Khi Mua Tool:
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
              DELIVERABLES MATRIX
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FolderDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">1. Thư Mục Google Drive Bảo Mật</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Chứa full bộ script automation mới nhất, file cấu hình và backup dự phòng.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Play className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">2. Video HD Chỉ Dẫn Chi Tiết</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Video YouTube kênh Tuấn và Quân FPT hướng dẫn thao tác trực quan từng bước.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">3. Kích Hoạt 1-Click Siêu Tốc</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tự động học bài, tua video an toàn và đồng bộ kết quả lên edX lập tức.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">4. Cam Kết Điểm Bonus &amp; Update</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bảo đảm nhận 100% điểm thưởng môn IOT102, cập nhật miễn phí khi edX update.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. PARSED SECTIONS */}
      {rawSections.map((sec, secIdx) => {
        const lines = sec.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        const firstLine = lines[0];

        // Section A: List of 12 Labs
        if (firstLine.includes("DANH SÁCH 12 BÀI LAB") || firstLine.startsWith("### 📚")) {
          const title = firstLine.replace(/^###\s*/, "").replace(/^[📚\s]+/, "");
          const labItems = lines.slice(1).map((line) => {
            // Match pattern like: 1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng...)
            const match = line.match(/^(\d+)\.\s*\*\*([^*]+)\*\*:\s*(.*)/);
            if (match) {
              return {
                num: match[1],
                code: match[2],
                details: match[3],
              };
            }
            return {
              num: "",
              code: "",
              details: line.replace(/^\d+\.\s*/, ""),
            };
          });

          return (
            <div
              key={secIdx}
              className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  📚
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {title}
                  </h4>
                  <p className="text-[11px] text-slate-500">12 Bài lab chuẩn mực kèm đề bài Word & source code</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {labItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/60 hover:border-blue-200 transition-all flex items-start gap-2.5"
                  >
                    <div className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5 shadow-sm">
                      {item.code || `#${idx + 1}`}
                    </div>
                    <div className="text-xs text-slate-700 leading-snug">
                      {renderInlineFormatted(item.details)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Section B: Characteristics / Grading Criteria (ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10)
        if (firstLine.includes("ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10") || firstLine.startsWith("### 🎯")) {
          const title = firstLine.replace(/^###\s*/, "").replace(/^[🎯\s]+/, "");
          const bulletLines = lines.slice(1).map((l) => l.replace(/^-\s*/, ""));

          return (
            <div
              key={secIdx}
              className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  🎯
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {title}
                  </h4>
                  <p className="text-[11px] text-slate-500">Bảo đảm đúng chuẩn barem chấm điểm của Giảng viên</p>
                </div>
              </div>

              <div className="space-y-2">
                {bulletLines.map((b, idx) => {
                  const isGift = b.toLowerCase().includes("tặng kèm");
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-2 rounded-xl text-xs ${
                        isGift
                          ? "bg-amber-50/70 border border-amber-200 text-amber-950 font-medium"
                          : "bg-slate-50/70 border border-slate-100 text-slate-700"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isGift ? "text-amber-600" : "text-emerald-600"
                        }`}
                      />
                      <div className="leading-relaxed">{renderInlineFormatted(b)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Section C: General Paragraph / Introduction
        return (
          <div
            key={secIdx}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed"
          >
            {lines.map((line, lIdx) => (
              <p key={lIdx} className="mb-1.5 last:mb-0">
                {renderInlineFormatted(line)}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
