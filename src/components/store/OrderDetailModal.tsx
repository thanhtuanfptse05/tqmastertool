"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { formatVND, formatDateVN } from "@/lib/vietqr";
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
  CreditCard,
  Hash,
  CalendarDays,
  Image as ImageIcon,
} from "lucide-react";

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
  const { cancelOrder, deleteOrder, setActiveOrderForPayment } = useStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

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

  const qrUrl = `https://img.vietqr.io/image/BIDV-8816861222-compact2.png?amount=${order.total_amount}&addInfo=${encodeURIComponent(
    order.vietqr_content
  )}&accountName=CAO%20THANH%20TUAN`;

  type StatusInfo = {
    label: string;
    gradientFrom: string;
    gradientTo: string;
    borderColor: string;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    icon: React.ElementType;
    iconBg: string;
  };

  const getStatusInfo = (status: OrderStatus): StatusInfo => {
    switch (status) {
      case "completed":
        return {
          label: "Đã Hoàn Thành",
          gradientFrom: "from-emerald-950",
          gradientTo: "to-teal-950",
          borderColor: "border-emerald-500/30",
          accentColor: "bg-emerald-500",
          badgeBg: "bg-emerald-500/15",
          badgeText: "text-emerald-300",
          badgeBorder: "border-emerald-500/30",
          icon: CheckCircle2,
          iconBg: "bg-emerald-500/15",
        };
      case "pending_approval":
        return {
          label: "Chờ Admin Duyệt Bill",
          gradientFrom: "from-amber-950",
          gradientTo: "to-orange-950",
          borderColor: "border-amber-500/30",
          accentColor: "bg-amber-500",
          badgeBg: "bg-amber-500/15",
          badgeText: "text-amber-300",
          badgeBorder: "border-amber-500/30",
          icon: Clock,
          iconBg: "bg-amber-500/15",
        };
      case "pending_payment":
        return {
          label: "Chờ Chuyển Khoản",
          gradientFrom: "from-blue-950",
          gradientTo: "to-indigo-950",
          borderColor: "border-blue-500/30",
          accentColor: "bg-blue-500",
          badgeBg: "bg-blue-500/15",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          icon: QrCode,
          iconBg: "bg-blue-500/15",
        };
      case "blocked":
        return {
          label: "🚨 Bị Chặn Quyền",
          gradientFrom: "from-rose-950",
          gradientTo: "to-red-950",
          borderColor: "border-rose-500/40",
          accentColor: "bg-rose-500",
          badgeBg: "bg-rose-500/20",
          badgeText: "text-rose-300",
          badgeBorder: "border-rose-500/40",
          icon: ShieldAlert,
          iconBg: "bg-rose-500/15",
        };
      case "rejected":
        return {
          label: "Bị Từ Chối",
          gradientFrom: "from-rose-950",
          gradientTo: "to-pink-950",
          borderColor: "border-rose-400/25",
          accentColor: "bg-rose-400",
          badgeBg: "bg-rose-500/10",
          badgeText: "text-rose-400",
          badgeBorder: "border-rose-400/25",
          icon: XCircle,
          iconBg: "bg-rose-500/10",
        };
      case "cancelled":
      default:
        return {
          label: "Đã Hủy",
          gradientFrom: "from-slate-900",
          gradientTo: "to-slate-900",
          borderColor: "border-slate-700/60",
          accentColor: "bg-slate-500",
          badgeBg: "bg-slate-700/50",
          badgeText: "text-slate-400",
          badgeBorder: "border-slate-600/40",
          icon: XCircle,
          iconBg: "bg-slate-700/50",
        };
    }
  };

  const si = getStatusInfo(order.status);
  const StatusIcon = si.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border ${si.borderColor} overflow-hidden my-auto max-h-[92vh] flex flex-col bg-gradient-to-br ${si.gradientFrom} ${si.gradientTo}`}
      >
        {/* Accent top bar */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${si.accentColor} opacity-60`} />

        {/* Background blur orb */}
        <div className="absolute -top-20 right-10 w-64 h-64 bg-white/3 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 py-4 border-b border-white/8 flex items-center justify-between bg-white/3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${si.iconBg} flex items-center justify-center border ${si.badgeBorder}`}>
              <StatusIcon className={`w-4.5 h-4.5 ${si.badgeText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-white text-sm tracking-wider">
                  {order.order_code}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${si.badgeBg} ${si.badgeText} ${si.badgeBorder}`}>
                  <StatusIcon className="w-3 h-3" />
                  {si.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{formatDateVN(order.created_at)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="relative p-6 overflow-y-auto space-y-5 flex-1">

          {/* Blocked Alert */}
          {order.status === "blocked" && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300 font-bold block mb-0.5 text-sm">
                  Tài Khoản Bị Chặn Quyền Truy Cập
                </strong>
                <p className="text-rose-400/80 text-xs leading-relaxed">
                  {order.admin_notes || "Quản trị viên đã khóa quyền truy cập do vi phạm quy chế hoặc nghi vấn gian lận. Vui lòng liên hệ hỗ trợ."}
                </p>
              </div>
            </div>
          )}

          {/* QR Payment Section */}
          {order.status === "pending_payment" && (
            <div className="p-4 rounded-2xl bg-blue-500/8 border border-blue-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-blue-300 text-sm flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" />
                    Thanh Toán VietQR · SePay Tự Động
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hệ thống tự động duyệt đơn sau 1-3 giây khi nhận tiền.
                  </p>
                </div>
                <span className="text-lg font-black text-white">{formatVND(order.total_amount)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/8">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-white rounded-xl shadow-xl">
                    <img src={qrUrl} alt="VietQR" className="w-36 h-auto rounded-lg" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">Quét bằng mọi App ngân hàng</span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { label: "Ngân hàng", value: "BIDV (Đầu tư & Phát triển VN)" },
                    { label: "Số tài khoản", value: "8816861222", copyKey: "stk" },
                    { label: "Chủ tài khoản", value: "CAO THANH TUAN" },
                  ].map((item) => (
                    <div key={item.label}>
                      <span className="text-slate-500 text-[10px] block">{item.label}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.value}</span>
                        {item.copyKey && (
                          <button
                            onClick={() => copyToClipboard(item.value, item.copyKey!)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {copiedField === item.copyKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div>
                    <span className="text-slate-500 text-[10px] block">Nội dung chuyển khoản <span className="text-rose-400 font-bold">(Bắt buộc)</span>:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-black text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-lg text-xs">
                        {order.vietqr_content}
                      </span>
                      <button
                        onClick={() => copyToClipboard(order.vietqr_content, "memo")}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {copiedField === "memo" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div>
            <h4 className="font-extrabold text-slate-300 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-400" />
              Sản Phẩm Trong Đơn
            </h4>

            {order.items && order.items.length > 0 ? (
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white/4 rounded-2xl border border-white/8 hover:bg-white/6 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.product_thumbnail ? (
                        <img
                          src={item.product_thumbnail}
                          alt={item.product_title}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-[9px] flex items-center justify-center border border-blue-500/30 shrink-0">
                          LAB<br/>211
                        </div>
                      )}
                      <div className="min-w-0">
                        <h5 className="font-bold text-white truncate text-sm">{item.product_title}</h5>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{item.product_category}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-white shrink-0 text-sm">
                      {formatVND(item.unit_price || order.total_amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-blue-500/8 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-sm">Gói Mã Nguồn & Tài Nguyên Số LAB211</span>
                  <span className="text-[11px] text-slate-500">Bản quyền 12 bài Lab Java MVC + Word docx</span>
                </div>
                <span className="font-black text-white text-sm">{formatVND(order.total_amount)}</span>
              </div>
            )}
          </div>

          {/* Payment Proof Image */}
          {(order.status === "pending_approval" || order.status === "completed" || order.status === "rejected") && order.payment_proof_image && (
            <div>
              <h4 className="font-extrabold text-slate-300 mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                Ảnh Biên Lai Chuyển Khoản
              </h4>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-xl">
                <a
                  href={order.payment_proof_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <img
                    src={order.payment_proof_image}
                    alt="Biên lai chuyển khoản"
                    className="w-full max-h-64 object-contain bg-white/5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm text-white text-xs font-bold border border-white/20">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Xem đầy đủ
                    </div>
                  </div>
                </a>
                <div className="px-3 py-2 text-[10px] text-slate-600 border-t border-white/5 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Nhấn vào ảnh để mở trong tab mới
                </div>
              </div>
            </div>
          )}

          {/* Order Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {[
              { icon: CalendarDays, label: "Thời gian đặt", value: formatDateVN(order.created_at) },
              { icon: CreditCard, label: "Thanh toán", value: "VietQR · SePay 24/7" },
              ...(order.transaction_ref ? [{ icon: Hash, label: "Mã giao dịch", value: order.transaction_ref, mono: true, highlight: "text-blue-400" }] : []),
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-xl bg-white/4 border border-white/8 ${i === 2 ? 'col-span-2' : ''}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <item.icon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{item.label}</span>
                </div>
                <span className={`text-xs font-bold ${'highlight' in item ? item.highlight : 'text-slate-200'} ${'mono' in item && item.mono ? 'font-mono' : ''}`}>
                  {item.value}
                </span>
              </div>
            ))}

            {order.admin_notes && (
              <div className="col-span-2 p-3 rounded-xl bg-white/4 border border-white/8">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold block mb-1">Ghi chú Admin</span>
                <span className="text-xs text-slate-300 italic">{order.admin_notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative p-4 sm:px-6 border-t border-white/8 bg-black/20 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            {order.status === "pending_payment" && (
              <button
                onClick={handleCancelOrder}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-bold text-xs transition-colors border border-transparent hover:border-rose-500/20"
              >
                <XCircle className="w-3.5 h-3.5" />
                Hủy Đơn
              </button>
            )}

            {(order.status === "cancelled" || order.status === "rejected") && (
              <button
                onClick={handleDeleteOrder}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 font-bold text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa Khỏi Lịch Sử
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/8 text-slate-400 hover:text-white font-bold text-xs transition-all"
            >
              Đóng
            </button>

            {order.status === "pending_payment" && (
              <button
                onClick={handleContinuePayment}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 border border-blue-500/30"
              >
                <QrCode className="w-3.5 h-3.5" />
                Tiếp Tục Thanh Toán
              </button>
            )}

            {order.status === "completed" && onOpenDeliverable && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDeliverable(order.id, order.order_code);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all active:scale-95 border border-emerald-500/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Xem Đề Bài & Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
