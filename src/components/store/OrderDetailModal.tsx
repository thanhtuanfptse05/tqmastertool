"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { formatVND, formatDateVN, generateVietQRUrl, DEFAULT_VIETQR_CONFIG } from "@/lib/vietqr";
import { useStore } from "@/lib/store";
import {
  X,
  Copy,
  Check,
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Package,
  Trash2,
  ExternalLink,
  Sparkles,
  Play,
  FolderDown,
  BookOpen,
  Key,
  UploadCloud,
} from "lucide-react";
import { extractOrderLicenseInfo, parseLicenseKeyDuration } from "@/lib/coursera-keygen";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDeliverable?: (orderId: string, orderCode: string) => void;
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onOpenDeliverable,
}: OrderDetailModalProps) {
  const { cancelOrder, deleteOrder, setActiveOrderForPayment, openCheckoutForBillUpload, products } = useStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const isTool =
    order.items?.some((i) => i.product_category === "tool" || i.product_title?.toLowerCase().includes("coursera") || i.product_title?.toLowerCase().includes("tool")) ||
    products.find(
      (p) =>
        p.id === order.items?.[0]?.product_id ||
        p.slug === order.items?.[0]?.product_id
    )?.category === "tool";

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCancelOrder = async () => {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${order.order_code}?`)) return;
    setIsProcessing(true);
    try {
      await cancelOrder(order.id);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirm(`Xóa đơn hàng ${order.order_code} khỏi lịch sử của bạn?`)) return;
    setIsProcessing(true);
    try {
      await deleteOrder(order.id);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinuePayment = () => {
    onClose();
    setActiveOrderForPayment(order);
  };

  const handleOpenBillUpload = () => {
    onClose();
    openCheckoutForBillUpload(order);
  };

  const qrUrl = generateVietQRUrl({
    amount: order.total_amount,
    memo: order.vietqr_content,
  });

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return {
          label: "Đã hoàn thành / Đã duyệt",
          badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: CheckCircle2,
          iconColor: "text-emerald-600",
        };
      case "pending_approval":
        return {
          label: "Chờ Admin duyệt bill",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
          icon: Clock,
          iconColor: "text-amber-600",
        };
      case "pending_payment":
        return {
          label: "Chờ chuyển khoản (VietQR)",
          badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
          icon: QrCode,
          iconColor: "text-blue-600",
        };
      case "blocked":
        return {
          label: "🚨 Bị Chặn / Thu Hồi Quyền",
          badgeClass: "bg-rose-100 text-rose-800 border-rose-400 font-black",
          icon: ShieldAlert,
          iconColor: "text-rose-600",
        };
      case "rejected":
        return {
          label: "Bị từ chối thanh toán",
          badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
          icon: XCircle,
          iconColor: "text-rose-600",
        };
      case "cancelled":
      default:
        return {
          label: "Đã hủy",
          badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
          icon: XCircle,
          iconColor: "text-slate-500",
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-black text-blue-600 text-sm">
              {order.order_code}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusInfo.badgeClass}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusInfo.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {/* Status Alert Banners */}
          {order.status === "blocked" && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-950 font-bold block mb-0.5">
                  Tài Khoản / Đơn Hàng Đang Bị Chặn Quyền Truy Cập
                </strong>
                <p className="text-rose-700 leading-relaxed">
                  {(order.admin_notes || "")
                    .replace(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):[^\]]+\]/gi, "")
                    .replace(/\[KEY:[^\]]+\]/gi, "")
                    .replace(/\[BLOCKED\]/gi, "")
                    .trim() ||
                    "Quản trị viên đã khóa quyền truy cập đơn hàng này do vi phạm quy chế hoặc nghi vấn gian lận. Vui lòng liên hệ hỗ trợ để được giải đáp."}
                </p>
              </div>
            </div>
          )}

          {order.status === "pending_payment" && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-blue-950 text-sm flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    Thanh Toán Tự Động Qua VietQR &amp; SePay
                  </h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Hệ thống sẽ tự động duyệt đơn và mở khóa sau 1-3 giây khi nhận được tiền.
                  </p>
                </div>
                <span className="text-sm font-black text-blue-700">
                  {formatVND(order.total_amount)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-white p-4 rounded-xl border border-blue-100">
                <div className="flex flex-col items-center">
                  <img
                    src={qrUrl}
                    alt="VietQR Payment Code"
                    className="w-44 h-auto rounded-lg shadow-sm border border-slate-200"
                  />
                  <span className="text-[10px] text-slate-400 mt-1">Quét bằng mọi App Ngân Hàng</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ngân hàng nhận:</span>
                    <span className="font-bold text-slate-900">{DEFAULT_VIETQR_CONFIG.bankId} (Ngân hàng Đầu tư &amp; PT Việt Nam)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Số tài khoản định danh (VA SePay):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{DEFAULT_VIETQR_CONFIG.accountNo}</span>
                      <button
                        onClick={() => copyToClipboard(DEFAULT_VIETQR_CONFIG.accountNo, "stk")}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-[11px]"
                      >
                        {copiedField === "stk" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Chủ tài khoản:</span>
                    <span className="font-bold text-slate-900">{DEFAULT_VIETQR_CONFIG.accountName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Nội dung chuyển khoản (Bắt buộc):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                        {order.vietqr_content}
                      </span>
                      <button
                        onClick={() => copyToClipboard(order.vietqr_content, "memo")}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-[11px]"
                      >
                        {copiedField === "memo" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Items List */}
          <div>
            <h4 className="font-extrabold text-slate-900 mb-2.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-600" />
              Sản phẩm trong đơn hàng:
            </h4>

            {order.items && order.items.length > 0 ? (
              <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/60">
                {order.items.map((item, idx) => {
                  const matchedProd = products.find((p) => p.id === item.product_id || p.slug === item.product_id);
                  const title = item.product_title || matchedProd?.title || "Sản phẩm CodeVault";
                  const category = item.product_category || matchedProd?.category || "lab211";
                  const thumb = item.product_thumbnail || matchedProd?.thumbnail_url;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-slate-200/80"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={title}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            LAB
                          </div>
                        )}
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 truncate text-xs">
                            {title}
                          </h5>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            {category}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-800 shrink-0">
                        {formatVND(item.unit_price || order.total_amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              (() => {
                return (
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        Trọn Bộ Mã Nguồn &amp; Đề Bài LAB211 Chuẩn Giảng Viên FPT
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Bản quyền 14 bài Lab Java MVC + Word docx
                      </span>
                    </div>
                    <span className="font-black text-slate-900">{formatVND(order.total_amount)}</span>
                  </div>
                );
              })()
            )}
          </div>

          {/* Tool Deliverables Quick Access — Khi đơn hàng Tool đã hoàn tất */}
          {order.status === "completed" && isTool && (() => {
            const { licenseKey, courseraEmail, licenses, emails } = extractOrderLicenseInfo(order);
            const effectiveKey = licenseKey || order.license_key;
            const effectiveLicenses = licenses.length > 0
              ? licenses
              : (effectiveKey ? [{ email: courseraEmail || order.user_email, key: effectiveKey }] : []);
            const matchedItem = order.items?.find((i) => i.git_repo_url);
            const matchedProduct = products.find(
              (p) =>
                p.id === order.items?.[0]?.product_id || p.slug === order.items?.[0]?.product_id
            );

            const isCoursera = Boolean(
              order.items?.some((i) => i.product_title?.toLowerCase().includes("coursera")) ||
              matchedProduct?.title.toLowerCase().includes("coursera") ||
              matchedProduct?.slug?.includes("coursera")
            );

            // Ưu tiên đọc trực tiếp từ Database (Spec 015 - Anti-Hardcode)
            const driveUrl =
              matchedItem?.git_repo_url ||
              matchedProduct?.git_repo_url ||
              (isCoursera
                ? "https://drive.google.com/drive/folders/1NvEfBQGKhjjUD8-bbddFS_U9qJu_3N7M?usp=drive_link"
                : "https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing");

            const videoUrl =
              matchedProduct?.demo?.video_demo_url ||
              (isCoursera
                ? "https://youtu.be/qld1bT_U8AQ?si=NjOoWFUhGmwrwc9U"
                : "https://youtu.be/OxmUL2i8BX4?si=VKICEGOE39cqulVt");

            const handleCopyAllKeys = () => {
              const allText = effectiveLicenses
                .map((item, idx) => `Tài khoản ${idx + 1} (${item.email}): ${item.key}`)
                .join("\n");
              copyToClipboard(allText, "all_keys");
            };

            return (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-2 border-emerald-400/40 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Tài Nguyên Tool Đã Mở Khóa:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                    ĐÃ MỞ KHÓA
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Đơn hàng đã hoàn tất thành công! Bạn có thể truy cập ngay thư mục Google Drive tải tool, lấy mã License Key và xem video hướng dẫn của kênh Tuấn và Quân FPT.
                </p>

                {/* Multi-license Keys Rendering (CHỈ DÀNH CHO COURSERA) */}
                {isCoursera && effectiveLicenses.length > 1 ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                        <Key className="w-4 h-4 text-amber-500" />
                        <span>Danh Sách License Keys ({effectiveLicenses.length} tài khoản):</span>
                      </div>
                      <button
                        onClick={handleCopyAllKeys}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[11px] font-bold transition-colors"
                      >
                        {copiedField === "all_keys" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Đã sao chép tất cả</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép tất cả</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {effectiveLicenses.map((lic, idx) => {
                        const durationInfo = parseLicenseKeyDuration(lic.key);
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold text-amber-400 uppercase">
                                  TK #{idx + 1}:
                                </span>
                                <span className="text-xs font-semibold text-slate-200 truncate">
                                  {lic.email}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                  durationInfo.isExpired
                                    ? "bg-rose-600 text-white border-rose-400 shadow-sm animate-pulse"
                                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                }`}>
                                  {durationInfo.label}
                                </span>
                              </div>
                              <div className="font-mono text-xs font-bold text-cyan-300 tracking-wider break-all select-all">
                                {lic.key}
                              </div>
                              {durationInfo.isExpired && (
                                <p className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
                                  <span>🚨 Khóa bản quyền này đã hết hạn. Vui lòng mua mới để gia hạn Tool.</span>
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => copyToClipboard(lic.key, `key_${idx}`)}
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-all active:scale-95 shrink-0"
                            >
                              {copiedField === `key_${idx}` ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Đã chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Chép key</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : isCoursera && effectiveLicenses.length === 1 ? (() => {
                  const singleLic = effectiveLicenses[0];
                  const durationInfo = parseLicenseKeyDuration(singleLic.key);
                  return (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                              <Key className="w-3.5 h-3.5" />
                              License Key Bản Quyền
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              durationInfo.isExpired
                                ? "bg-rose-600 text-white border-rose-400 shadow-sm animate-pulse"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            }`}>
                              {durationInfo.label}
                            </span>
                          </div>
                          <div className="font-mono text-xs sm:text-sm font-bold text-cyan-300 tracking-wider break-all select-all">
                            {singleLic.key}
                          </div>
                          {durationInfo.isExpired && (
                            <p className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
                              <span>🚨 Khóa bản quyền này đã hết hạn. Vui lòng mua mới để gia hạn Tool.</span>
                            </p>
                          )}
                          {singleLic.email && (
                            <div className="text-[10px] text-slate-400">
                              Email kích hoạt: <span className="text-slate-200 font-semibold">{singleLic.email}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => copyToClipboard(singleLic.key, "license_key")}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-cyan-500/20 shrink-0"
                        >
                          {copiedField === "license_key" ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Sao chép Key</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })() : null}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <FolderDown className="w-3.5 h-3.5" />
                    Mở Google Drive Tải Tool
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Xem Video YouTube
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="/customer/vault"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Vào Kho Tài Nguyên
                  </a>
                </div>
              </div>
            );
          })()}

          {/* Payment Proof Image — hiện khi đã nộp bill */}
          {(order.status === "pending_approval" || order.status === "completed" || order.status === "rejected") && order.payment_proof_image && (
            <div>
              <h4 className="font-extrabold text-slate-900 mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Ảnh Biên Lai Chuyển Khoản:
              </h4>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                <a
                  href={order.payment_proof_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Xem ảnh biên lai đầy đủ"
                  className="block relative group"
                >
                  <img
                    src={order.payment_proof_image}
                    alt="Biên lai chuyển khoản"
                    className="w-full max-h-64 object-contain bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                  </div>
                </a>
                <div className="px-3 py-2 text-[10px] text-slate-500 border-t border-slate-200">
                  Nhấn vào ảnh để xem đầy đủ trong tab mới
                </div>
              </div>
            </div>
          )}

          {/* Payment & Audit Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Thời gian đặt hàng:</span>
              <span className="font-bold text-slate-800">{formatDateVN(order.created_at)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Phương thức thanh toán:</span>
              <span className="font-bold text-slate-800">VietQR Napas 24/7 (SePay Tự Động)</span>
            </div>
            {order.transaction_ref && (
              <div>
                <span className="text-slate-400 block text-[10px]">Mã giao dịch ngân hàng / SePay:</span>
                <span className="font-mono font-bold text-blue-600">{order.transaction_ref}</span>
              </div>
            )}
            {(() => {
              const displayNote = (order.admin_notes || "")
                .replace(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):[^\]]+\]/gi, "")
                .replace(/\[KEY:[^\]]+\]/gi, "")
                .replace(/\[BLOCKED\]/gi, "")
                .trim();
              if (!displayNote) return null;
              return (
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[10px]">Ghi chú hệ thống / Admin:</span>
                  <span className="text-slate-700 italic">{displayNote}</span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {order.status === "pending_payment" && (
              <button
                onClick={handleCancelOrder}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Hủy Đơn Hàng Này
              </button>
            )}

            {(order.status === "cancelled" || order.status === "rejected") && (
              <button
                onClick={handleDeleteOrder}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa Khỏi Lịch Sử
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              Đóng
            </button>

            {order.status === "pending_payment" && (
              <>
                <button
                  onClick={handleOpenBillUpload}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-300 text-slate-700 font-bold text-xs transition-all"
                  title="Tải ảnh biên lai dự phòng nếu bạn đã chuyển tiền ngoài ngân hàng"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                  Tải Ảnh Bill Dự Phòng
                </button>
                <button
                  onClick={handleContinuePayment}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Tiếp Tục Thanh Toán (QR)
                </button>
              </>
            )}

            {order.status === "completed" && (
              isTool ? (
                <a
                  href="/customer/vault"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Mở Kho Tool &amp; Hướng Dẫn
                </a>
              ) : onOpenDeliverable ? (() => {
                const isHcm = order.items?.some((i) => i.product_title?.toLowerCase().includes("campus hcm"));
                return (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDeliverable(order.id, order.order_code);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all"
                  >
                    <Package className="w-3.5 h-3.5" />
                    {isHcm ? "Xem Đề Bài PDF & Code" : "Xem Đề Bài Word & Code"}
                  </button>
                );
              })() : (
                <a
                  href="/customer/vault"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all"
                >
                  <Package className="w-3.5 h-3.5" />
                  Vào Kho Tài Nguyên
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
