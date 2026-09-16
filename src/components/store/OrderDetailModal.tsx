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
                  {order.admin_notes ||
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
                    <span className="font-bold text-slate-900">BIDV (Ngân hàng Đầu tư &amp; PT Việt Nam)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">8816861222</span>
                      <button
                        onClick={() => copyToClipboard("8816861222", "stk")}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-[11px]"
                      >
                        {copiedField === "stk" ? "Đã chép" : "Sao chép"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Chủ tài khoản:</span>
                    <span className="font-bold text-slate-900">CAO THANH TUAN</span>
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
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-slate-200/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.product_thumbnail ? (
                        <img
                          src={item.product_thumbnail}
                          alt={item.product_title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          LAB
                        </div>
                      )}
                      <div className="min-w-0">
                        <h5 className="font-bold text-slate-900 truncate text-xs">
                          {item.product_title}
                        </h5>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">
                          {item.product_category}
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-800 shrink-0">
                      {formatVND(item.unit_price || order.total_amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Gói Mã Nguồn &amp; Tài Nguyên Số LAB211</span>
                  <span className="text-[11px] text-slate-500">Bản quyền 12 bài Lab Java MVC + Word docx</span>
                </div>
                <span className="font-black text-slate-900">{formatVND(order.total_amount)}</span>
              </div>
            )}
          </div>

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
            {order.admin_notes && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[10px]">Ghi chú hệ thống / Admin:</span>
                <span className="text-slate-700 italic">{order.admin_notes}</span>
              </div>
            )}
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
              <button
                onClick={handleContinuePayment}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
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
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all"
              >
                <Package className="w-3.5 h-3.5" />
                Xem Đề Bài Word &amp; Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
