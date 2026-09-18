"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import {
  Package,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Unlock,
  Download,
  FolderDown,
  Play,
  ExternalLink,
  X,
  CheckCircle2,
  Copy,
  Check,
  Wrench,
  Layers,
  Key,
} from "lucide-react";
import LabDeliverableModal from "@/components/store/LabDeliverableModal";
import { extractOrderLicenseInfo, parseLicenseKeyDuration } from "@/lib/coursera-keygen";

export default function DeliverableVaultPage() {
  const { currentUser, orders, products, refreshOrders } = useStore();

  React.useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);
  const [activeLabModal, setActiveLabModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderCode?: string;
    labCode?: string;
  } | null>(null);

  const [activeToolModal, setActiveToolModal] = useState<{
    isOpen: boolean;
    productTitle: string;
    orderCode?: string;
    instructions?: string;
    driveUrl: string;
    videoUrl?: string;
    licenseKey?: string;
    courseraEmail?: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return "https://www.youtube.com/embed/qld1bT_U8AQ";
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  // Authenticated download — sends Bearer token so API security gate passes
  const handleAuthDownload = async (
    orderId: string,
    labId: string,
    type: "docx" | "zip" | "java",
    fileName: string
  ) => {
    const key = `${orderId}-${labId}-${type}`;
    setDownloading(key);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const url = `/api/deliverables/lab/download?orderId=${encodeURIComponent(orderId)}&labId=${encodeURIComponent(labId)}&type=${type}`;
      const res = await fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Lỗi không xác định" }));
        alert(err.error || `Lỗi tải file (${res.status})`);
        return;
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (e: any) {
      alert(e?.message || "Không thể tải file. Vui lòng thử lại.");
    } finally {
      setDownloading(null);
    }
  };

  // Compute deliverables reactively — same logic as orders page filter
  const deliverables = React.useMemo(() => {
    if (!currentUser) return [];

    const completed = orders.filter(
      (o) =>
        o.status === "completed" &&
        (o.user_id === currentUser.id || o.user_email === currentUser.email)
    );

    const result: Array<{
      order_id: string;
      order_code?: string;
      product_id: string;
      product_title: string;
      product_category: string;
      product?: Product;
      git_repo_url?: string;
      access_instructions?: string;
      license_key?: string;
      coursera_email?: string;
    }> = [];

    completed.forEach((order) => {
      const { licenseKey, courseraEmail } = extractOrderLicenseInfo(order);
      const hasItems = order.items && order.items.length > 0;

      if (hasItems) {
        order.items!.forEach((item) => {
          const product = products.find(
            (p) =>
              p.id === item.product_id ||
              p.price === item.unit_price ||
              p.price === order.total_amount
          );
          result.push({
            order_id: order.id,
            order_code: order.order_code,
            product_id: item.product_id || product?.id || `order-${order.id}`,
            product_title: product?.title || item.product_title || "Sản phẩm CodeVault",
            product_category: product?.category || item.product_category || "lab211",
            product: product,
            git_repo_url: (item as any).git_repo_url || product?.git_repo_url,
            access_instructions: (item as any).access_instructions || product?.access_instructions,
            license_key: licenseKey || order.license_key,
            coursera_email: courseraEmail || order.user_email,
          });
        });
      } else {
        // Dynamic fallback when order_items join fails (Supabase RLS or legacy order)
        const matchedProduct = products.find((p) => p.price === order.total_amount);
        result.push({
          order_id: order.id,
          order_code: order.order_code,
          product_id: matchedProduct?.id || `order-${order.id}`,
          product_title: matchedProduct?.title || "Trọn Bộ Mã Nguồn & Đề Bài LAB211",
          product_category: matchedProduct?.category || "lab211",
          product: matchedProduct,
          git_repo_url: matchedProduct?.git_repo_url,
          access_instructions: matchedProduct?.access_instructions,
          license_key: licenseKey || order.license_key,
          coursera_email: courseraEmail || order.user_email,
        });
      }
    });

    return result;
  }, [currentUser, orders, products]);

  const isLab211 = (item: { product_category: string; product_title: string }) =>
    item.product_category === "lab211" || item.product_title.toLowerCase().includes("lab211");

  const getCategoryLabel = (cat: string) => {
    if (cat === "lab211") return "LAB211";
    if (cat === "project") return "Project";
    if (cat === "tool") return "Tool";
    return cat.toUpperCase();
  };

  const getCategoryColor = (cat: string) => {
    if (cat === "lab211") return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" };
    if (cat === "project") return { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" };
    return { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" };
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Khu Vực Bàn Giao Bản Quyền</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tài Nguyên Của Bạn
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Các gói đã mua và được Admin phê duyệt. Bấm <b>Xem Ngay</b> hoặc <b>Mở Google Drive</b> để nhận tài nguyên.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Đã mở khóa: <b>{deliverables.length}</b> gói
        </span>
      </div>

      {/* Deliverables */}
      {deliverables.length > 0 ? (
        <div className="space-y-4">
          {deliverables.map((item: any, idx) => {
            const lab = isLab211(item);
            const isTool = item.product_category === "tool";
            const catColor = getCategoryColor(item.product_category);

            const isCoursera = item.product_title.toLowerCase().includes("coursera");

            // Lấy link Google Drive & Video trực tiếp từ Database sản phẩm (Spec 015 - Anti-Hardcode)
            const toolDriveUrl =
              item.git_repo_url ||
              item.product?.git_repo_url ||
              (isCoursera
                ? "https://drive.google.com/drive/folders/1NvEfBQGKhjjUD8-bbddFS_U9qJu_3N7M?usp=drive_link"
                : "https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing");

            const toolVideoUrl =
              item.product?.demo?.video_demo_url ||
              (isCoursera
                ? "https://youtu.be/qld1bT_U8AQ?si=NjOoWFUhGmwrwc9U"
                : "https://youtu.be/OxmUL2i8BX4?si=VKICEGOE39cqulVt");

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${catColor.bg} border ${catColor.border}`}>
                    {isTool ? (
                      <Wrench className={`w-5 h-5 ${catColor.text}`} />
                    ) : (
                      <Unlock className={`w-5 h-5 ${catColor.text}`} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${catColor.bg} ${catColor.text} border ${catColor.border}`}>
                        {getCategoryLabel(item.product_category)}
                      </span>
                      {item.order_code && (
                        <span className="text-[11px] text-slate-400 font-mono">{item.order_code}</span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {item.product_title}
                    </h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Đã thanh toán &amp; được duyệt thành công
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="shrink-0 flex items-center gap-2 flex-wrap">
                    {isTool ? (
                      <>
                        <a
                          href={toolDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95 whitespace-nowrap"
                        >
                          <FolderDown className="w-4 h-4" />
                          <span>Mở Google Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <a
                          href={toolVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all active:scale-95 whitespace-nowrap"
                        >
                          <Play className="w-4 h-4" />
                          <span>Video HD</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() =>
                            setActiveToolModal({
                              isOpen: true,
                              productTitle: item.product_title,
                              orderCode: item.order_code,
                              instructions: item.access_instructions || item.product?.access_instructions,
                              driveUrl: toolDriveUrl,
                              videoUrl: toolVideoUrl,
                              licenseKey: item.license_key,
                              courseraEmail: item.coursera_email,
                            })
                          }
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
                        >
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span>Hướng Dẫn</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {lab && (
                          <button
                            onClick={() =>
                              setActiveLabModal({
                                isOpen: true,
                                orderId: item.order_id,
                                orderCode: item.order_code,
                                labCode: "J1.L.P0023",
                              })
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95 whitespace-nowrap"
                          >
                            <BookOpen className="w-4 h-4" />
                            Xem Ngay
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleAuthDownload(
                              item.order_id,
                              lab ? "all" : item.product_id,
                              "zip",
                              lab ? "LAB211.zip" : `${item.product_title.replace(/[^a-zA-Z0-9]/g, "_")}.zip`
                            )
                          }
                          disabled={downloading === `${item.order_id}-${lab ? "all" : item.product_id}-zip`}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95 whitespace-nowrap"
                        >
                          <Download className="w-4 h-4" />
                          {downloading === `${item.order_id}-${lab ? "all" : item.product_id}-zip`
                            ? "Đang tải..."
                            : "Tải .ZIP"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* License Key Box if applicable */}
                {item.license_key && (() => {
                  const durationInfo = parseLicenseKeyDuration(item.license_key);
                  return (
                    <div className="mx-5 mb-5 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                              <Key className="w-3.5 h-3.5" />
                              License Key Bản Quyền
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              durationInfo.isExpired
                                ? "bg-rose-500/20 text-rose-400"
                                : "bg-emerald-500/20 text-emerald-400"
                            }`}>
                              {durationInfo.label}
                            </span>
                          </div>
                          <div className="font-mono text-sm sm:text-base font-bold text-cyan-300 tracking-wider break-all select-all">
                            {item.license_key}
                          </div>
                          {item.coursera_email && (
                            <div className="text-[11px] text-slate-400">
                              Email kích hoạt Coursera: <span className="text-slate-200 font-semibold">{item.coursera_email}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopyKey(item.license_key!)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-cyan-500/20 shrink-0"
                        >
                          {copiedKey === item.license_key ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-slate-950" />
                              <span>Đã sao chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-950" />
                              <span>Sao chép Key</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Chưa có tài nguyên nào được mở khóa
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
            Quyền truy cập mã nguồn chỉ được mở sau khi Admin xác nhận tiền chuyển khoản thành công.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href="/#catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
            >
              Xem danh mục sản phẩm
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/customer/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Kiểm tra đơn hàng đã đặt
            </a>
          </div>
        </div>
      )}

      {/* Lab Deliverable Modal */}
      {activeLabModal?.isOpen && (
        <LabDeliverableModal
          isOpen={activeLabModal.isOpen}
          onClose={() => setActiveLabModal(null)}
          orderId={activeLabModal.orderId}
          orderCode={activeLabModal.orderCode}
          defaultLabCode={activeLabModal.labCode}
        />
      )}

      {/* Tool Deliverable & Instructions Modal */}
      {activeToolModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200">
                  TOOL DELIVERABLE
                </span>
                {activeToolModal.orderCode && (
                  <span className="text-xs font-mono text-slate-500">
                    Đơn #{activeToolModal.orderCode}
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveToolModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {/* Title */}
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {activeToolModal.productTitle}
                </h2>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Bản quyền chính chủ • Kênh Tuấn và Quân FPT UNIVERSITY
                </p>
              </div>

              {/* License Key in Modal if available */}
              {activeToolModal.licenseKey && (() => {
                const modalDurationInfo = parseLicenseKeyDuration(activeToolModal.licenseKey);
                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-cyan-500/30 text-white shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                            <Key className="w-3.5 h-3.5" />
                            License Key Kích Hoạt Của Bạn
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            modalDurationInfo.isExpired
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}>
                            {modalDurationInfo.label}
                          </span>
                        </div>
                        <div className="font-mono text-base sm:text-lg font-black text-cyan-300 tracking-wider break-all select-all">
                          {activeToolModal.licenseKey}
                        </div>
                        {activeToolModal.courseraEmail && (
                          <div className="text-xs text-slate-300">
                            Email Coursera kích hoạt: <span className="text-cyan-300 font-semibold">{activeToolModal.courseraEmail}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopyKey(activeToolModal.licenseKey!)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-cyan-500/25 shrink-0"
                      >
                        {copiedKey === activeToolModal.licenseKey ? (
                          <>
                            <Check className="w-4 h-4 text-slate-950" />
                            <span>Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-950" />
                            <span>Sao chép Key</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={activeToolModal.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                      <FolderDown className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black">Google Drive Folder</div>
                      <div className="text-[11px] text-emerald-700 font-normal">Tải extension và bộ cài tool</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {activeToolModal.videoUrl && (
                  <a
                    href={activeToolModal.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-950 font-bold transition-all shadow-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                        <Play className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">Video YouTube Hướng Dẫn</div>
                        <div className="text-[11px] text-rose-700 font-normal">Kênh Tuấn và Quân FPT</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>

              {/* YouTube Video Preview / Embed */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-rose-500" />
                    Video Hướng Dẫn Thao Tác Trực Quan:
                  </span>
                  <button
                    onClick={() => handleCopyLink(activeToolModal.videoUrl || "https://youtu.be/qld1bT_U8AQ")}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedLink ? "Đã sao chép link" : "Sao chép link"}
                  </button>
                </div>
                <div className="aspect-video w-full">
                  <iframe
                    src={getYouTubeEmbedUrl(activeToolModal.videoUrl)}
                    title={activeToolModal.productTitle}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Step by Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Hướng Dẫn Cài Đặt Chi Tiết Từng Bước:
                </h4>

                {activeToolModal.productTitle.toLowerCase().includes("coursera") ? (
                  /* Coursera Instructions */
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <div>
                        <strong className="text-slate-900">Tải bộ cài Tool từ Google Drive</strong>: Bấm nút <b>Google Drive Folder</b> ở trên và tải toàn bộ thư mục tiện ích về máy tính, sau đó giải nén (Unzip) ra một thư mục.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <div>
                        <strong className="text-slate-900">Mở trang tiện ích Chrome</strong>: Mở trình duyệt Chrome / Cốc Cốc / Edge, truy cập đường dẫn <code className="bg-slate-200 px-1.5 py-0.5 rounded text-blue-700 font-mono">chrome://extensions</code> trên thanh địa chỉ.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <div>
                        <strong className="text-slate-900">Bật Chế độ Nhà phát triển &amp; Load Unpacked</strong>: Bật công tắc <b>Developer mode (Chế độ dành cho nhà phát triển)</b> ở góc trên bên phải, bấm nút <b>Tải tiện ích đã giải nén (Load unpacked)</b> và chọn thư mục tool vừa giải nén ở Bước 1.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                      <div>
                        <strong className="text-slate-900">Đăng nhập tài khoản Coursera</strong>: Truy cập Coursera.org và đăng nhập đúng tài khoản có email {activeToolModal.courseraEmail ? <b className="text-blue-600 font-semibold">{activeToolModal.courseraEmail}</b> : "bạn đã nhập khi đặt mua"}.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">5</span>
                      <div>
                        <strong className="text-slate-900">Nhập License Key kích hoạt bản quyền</strong>: Mở popup extension hoặc vào bất kỳ bài học nào trên Coursera, dán mã <b>License Key</b> ở trên vào ô kích hoạt và bấm Xác nhận để tự động kích hoạt Auto Skip Video, Reading và AI Quiz Solver!
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard / edX Instructions */
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <div>
                        <strong className="text-slate-900">Tải bộ mã nguồn Tool</strong>: Nhấn nút <b>Google Drive</b> ở trên để tải toàn bộ thư mục tool về máy tính.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <div>
                        <strong className="text-slate-900">Xem kỹ video hướng dẫn</strong>: Mở video trên của kênh <b>Tuấn và Quân FPT UNIVERSITY</b> để hiểu cách import script vào trình duyệt.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <div>
                        <strong className="text-slate-900">Cài đặt tiện ích mở rộng</strong>: Cài extension <b>Tampermonkey</b> hoặc <b>Violentmonkey</b> trên Chrome / Edge / Cốc Cốc, sau đó nạp file script vào extension.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                      <div>
                        <strong className="text-slate-900">Khởi chạy trên trang học</strong>: Đăng nhập tài khoản, vào khóa học và bấm nút kích hoạt automation để tool tự động cày video và modules.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">5</span>
                      <div>
                        <strong className="text-slate-900">Kiểm tra kết quả</strong>: Kiểm tra thanh tiến độ (Progress) để xác nhận 100% hoàn thành khóa học.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Support Contact Note */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Hỗ Trợ Kỹ Thuật 1-1: </span>
                  Nếu bạn gặp khó khăn trong quá trình cài đặt tiện ích hoặc kích hoạt key, vui lòng liên hệ Admin qua kênh hỗ trợ Zalo/Telegram để được hướng dẫn trực tiếp qua Ultraviewer / Anydesk hoàn toàn miễn phí.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setActiveToolModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Đã Hiểu &amp; Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

