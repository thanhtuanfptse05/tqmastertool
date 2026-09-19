"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { formatVND, formatDateVN } from "@/lib/vietqr";
import { Order, OrderStatus } from "@/types";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowRight,
  Package,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  BookOpen,
  Eye,
  Trash2,
  ShieldAlert,
  RefreshCw,
  ImageIcon,
  CreditCard,
  CalendarDays,
  Hash,
  ChevronRight,
  Sparkles,
  Ban,
} from "lucide-react";
import LabDeliverableModal from "@/components/store/LabDeliverableModal";
import OrderDetailModal from "@/components/store/OrderDetailModal";

export default function CustomerOrdersPage() {
  const { currentUser, orders, openCheckout, products, cancelOrder, deleteOrder, refreshOrders } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [activeLabModal, setActiveLabModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderCode: string;
  } | null>(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const userOrders = currentUser
    ? orders.filter((o) => o.user_id === currentUser.id || o.user_email === currentUser.email)
    : orders;

  // Auto-refresh orders if there are pending orders
  React.useEffect(() => {
    const hasPending = userOrders.some(
      (o) => o.status === "pending_payment" || o.status === "pending_approval"
    );
    if (!hasPending) return;

    const interval = setInterval(() => {
      refreshOrders();
    }, 6000);

    return () => clearInterval(interval);
  }, [userOrders, refreshOrders]);

  const filteredOrders = selectedStatus === "all"
    ? userOrders
    : userOrders.filter((o) => o.status === selectedStatus);

  const tabCounts = {
    all: userOrders.length,
    pending_payment: userOrders.filter((o) => o.status === "pending_payment").length,
    pending_approval: userOrders.filter((o) => o.status === "pending_approval").length,
    completed: userOrders.filter((o) => o.status === "completed").length,
    rejected: userOrders.filter((o) => o.status === "rejected" || o.status === "cancelled" || o.status === "blocked").length,
  };

  // Status config — colors, icons, labels, progress step
  const STATUS_CONFIG: Record<OrderStatus, {
    label: string;
    shortLabel: string;
    step: number; // 1-4
    badgeCls: string;
    headerGrad: string;
    borderCls: string;
    icon: React.ElementType;
    dotCls: string;
  }> = {
    pending_payment: {
      label: "Chờ Chuyển Khoản",
      shortLabel: "Chờ CK",
      step: 1,
      badgeCls: "bg-blue-100 text-blue-800 border-blue-300",
      headerGrad: "from-blue-50 to-indigo-50 border-blue-100",
      borderCls: "border-blue-200",
      icon: QrCode,
      dotCls: "bg-blue-500",
    },
    pending_approval: {
      label: "Chờ Admin Duyệt",
      shortLabel: "Chờ duyệt",
      step: 2,
      badgeCls: "bg-amber-100 text-amber-800 border-amber-300",
      headerGrad: "from-amber-50 to-orange-50 border-amber-100",
      borderCls: "border-amber-200",
      icon: Clock,
      dotCls: "bg-amber-500",
    },
    completed: {
      label: "Đã Hoàn Thành",
      shortLabel: "Hoàn thành",
      step: 4,
      badgeCls: "bg-emerald-100 text-emerald-800 border-emerald-300",
      headerGrad: "from-emerald-50 to-teal-50 border-emerald-100",
      borderCls: "border-emerald-200",
      icon: CheckCircle2,
      dotCls: "bg-emerald-500",
    },
    rejected: {
      label: "Bị Từ Chối",
      shortLabel: "Từ chối",
      step: 0,
      badgeCls: "bg-rose-100 text-rose-800 border-rose-300",
      headerGrad: "from-rose-50 to-pink-50 border-rose-100",
      borderCls: "border-rose-200",
      icon: XCircle,
      dotCls: "bg-rose-500",
    },
    cancelled: {
      label: "Đã Hủy",
      shortLabel: "Đã hủy",
      step: 0,
      badgeCls: "bg-slate-100 text-slate-600 border-slate-300",
      headerGrad: "from-slate-50 to-gray-50 border-slate-100",
      borderCls: "border-slate-200",
      icon: Ban,
      dotCls: "bg-slate-400",
    },
    blocked: {
      label: "🚨 Bị Chặn Quyền",
      shortLabel: "Bị chặn",
      step: 0,
      badgeCls: "bg-rose-200 text-rose-900 border-rose-400 font-black",
      headerGrad: "from-rose-100 to-red-50 border-rose-200",
      borderCls: "border-rose-400",
      icon: ShieldAlert,
      dotCls: "bg-rose-700",
    },
  };

  const TABS = [
    { key: "all", label: "Tất cả", count: tabCounts.all },
    { key: "pending_payment", label: "Chờ CK", count: tabCounts.pending_payment },
    { key: "pending_approval", label: "Chờ duyệt", count: tabCounts.pending_approval },
    { key: "completed", label: "Hoàn thành", count: tabCounts.completed },
    { key: "rejected", label: "Đã từ chối / Hủy", count: tabCounts.rejected },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Lịch Sử Mua Hàng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Đơn Hàng Của Tôi
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md">
              Theo dõi trạng thái và truy cập tài nguyên số sau khi được Admin duyệt.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              title="Làm mới danh sách đơn hàng"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Làm mới
            </button>
            <a
              href="/customer/vault"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
            >
              <Package className="w-3.5 h-3.5" />
              Kho Tài Nguyên
            </a>
          </div>
        </div>

        {/* ─── Stats bar ─── */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-7">
          {[
            { label: "Tổng đơn", val: tabCounts.all, cls: "text-slate-900" },
            { label: "Chờ CK", val: tabCounts.pending_payment, cls: "text-blue-700" },
            { label: "Chờ duyệt", val: tabCounts.pending_approval, cls: "text-amber-700" },
            { label: "Hoàn thành", val: tabCounts.completed, cls: "text-emerald-700" },
            { label: "Từ chối/Hủy", val: tabCounts.rejected, cls: "text-rose-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200/90 px-3 py-2.5 text-center shadow-sm">
              <p className={`text-xl font-black ${s.cls}`}>{s.val}</p>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ─── Filter Tabs ─── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedStatus === tab.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25"
                  : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                  selectedStatus === tab.key ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Orders List ─── */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const StatusIcon = cfg.icon;
              const step = cfg.step;

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${cfg.borderCls}`}
                >
                  {/* ── Card Header ── */}
                  <div className={`bg-gradient-to-r ${cfg.headerGrad} border-b px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-inner ${
                        order.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "pending_approval" ? "bg-amber-100 text-amber-700" :
                        order.status === "pending_payment" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        <StatusIcon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-slate-900 text-sm tracking-wider">{order.order_code}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${cfg.badgeCls}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {formatDateVN(order.created_at)}
                          </span>
                          {order.transaction_ref && (
                            <span className="flex items-center gap-1 font-mono">
                              <Hash className="w-3 h-3" />
                              {order.transaction_ref}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-slate-500 block">Tổng thanh toán</span>
                      <span className="text-xl font-black text-slate-900">{formatVND(order.total_amount)}</span>
                    </div>
                  </div>

                  {/* ── Progress Steps (only for non-rejected) ── */}
                  {step > 0 && (
                    <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/40">
                      <div className="flex items-center gap-0">
                        {["Đặt hàng", "Nộp bill", "Admin duyệt", "Hoàn thành"].map((label, i) => {
                          const idx = i + 1;
                          const isDone = idx < step;
                          const isCurrent = idx === step;
                          return (
                            <React.Fragment key={label}>
                              <div className="flex flex-col items-center min-w-0">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all ${
                                  isDone ? "bg-emerald-500 border-emerald-500 text-white" :
                                  isCurrent ? `bg-white border-current ${
                                    step === 1 ? "text-blue-600 border-blue-600" :
                                    step === 2 ? "text-amber-600 border-amber-600" :
                                    "text-emerald-600 border-emerald-600"
                                  }` :
                                  "bg-white border-slate-200 text-slate-400"
                                }`}>
                                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : idx}
                                </div>
                                <span className={`text-[9px] font-bold mt-0.5 hidden sm:block text-center leading-tight ${
                                  isDone ? "text-emerald-600" : isCurrent ? "text-slate-900" : "text-slate-400"
                                }`}>{label}</span>
                              </div>
                              {i < 3 && (
                                <div className={`flex-1 h-0.5 mx-1 rounded-full ${
                                  idx < step ? "bg-emerald-400" : "bg-slate-200"
                                }`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Card Body ── */}
                  <div className="p-5 space-y-4">
                    {/* Items in order */}
                    <div className="space-y-2">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => {
                          const matchedProd = products.find((p) => p.id === item.product_id || p.slug === item.product_id);
                          const title = item.product_title || matchedProd?.title || "Sản phẩm CodeVault";
                          const category = item.product_category || matchedProd?.category || "lab211";
                          const thumb = item.product_thumbnail || matchedProd?.thumbnail_url;
                          return (
                            <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={title}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-[9px] flex items-center justify-center border border-blue-300 shrink-0 shadow-sm">
                                  LAB<br />211
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-extrabold text-slate-900 truncate">{title}</h4>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{category}</span>
                              </div>
                              <span className="text-sm font-extrabold text-slate-800 shrink-0">{formatVND(item.unit_price || order.total_amount)}</span>
                            </div>
                          );
                        })
                      ) : (
                        (() => {
                          return (
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-sm">
                                LAB<br />211
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-extrabold text-slate-900">
                                  Trọn Bộ Mã Nguồn &amp; Đề Bài LAB211 Chuẩn Giảng Viên FPT
                                </h4>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                                  Gói bản quyền môn học Java Core &amp; OOP
                                </span>
                              </div>
                              <span className="text-sm font-extrabold text-slate-800 shrink-0">{formatVND(order.total_amount)}</span>
                            </div>
                          );
                        })()
                      )}
                    </div>

                    {/* Info grid: payment proof + admin note */}
                    {(order.payment_proof_image || order.admin_notes) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Bill proof thumbnail */}
                        {order.payment_proof_image && (
                          <a
                            href={order.payment_proof_image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 transition-colors"
                          >
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-200 bg-white shrink-0 relative">
                              <img src={order.payment_proof_image} alt="Bill" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors flex items-center justify-center">
                                <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 drop-shadow transition-opacity" />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                                <ImageIcon className="w-3.5 h-3.5" />
                                Ảnh biên lai đã nộp
                              </p>
                              <p className="text-[10px] text-emerald-600 mt-0.5">Nhấn để xem đầy đủ ↗</p>
                            </div>
                          </a>
                        )}

                        {/* Admin note (clean internal metadata tags before presenting to customer) */}
                        {(() => {
                          const displayNote = (order.admin_notes || "")
                            .replace(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):[^\]]+\]/gi, "")
                            .replace(/\[KEY:[^\]]+\]/gi, "")
                            .replace(/\[BLOCKED\]/gi, "")
                            .trim();

                          if (!displayNote) return null;

                          return (
                            <div className={`flex items-start gap-2 p-3 rounded-2xl text-xs ${
                              order.status === "completed" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" :
                              order.status === "rejected" || order.status === "blocked" ? "bg-rose-50 border border-rose-200 text-rose-800" :
                              "bg-slate-50 border border-slate-200 text-slate-700"
                            }`}>
                              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-extrabold text-[10px] uppercase tracking-wide mb-0.5">Ghi chú Admin</p>
                                <p className="font-medium leading-relaxed">{displayNote}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* ── Card Footer ── */}
                  <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Status message */}
                    <div className="text-[11px] font-semibold">
                      {order.status === "completed" && (() => {
                        const isLab = order.items?.some((i) => i.product_category === "lab211" || i.product_title?.toLowerCase().includes("lab211")) ||
                          products.find((p) => p.id === order.items?.[0]?.product_id || p.price === order.total_amount)?.category === "lab211";
                        const isTool = order.items?.some((i) => i.product_category === "tool" || i.product_title?.toLowerCase().includes("coursera") || i.product_title?.toLowerCase().includes("tool")) ||
                          products.find((p) => p.id === order.items?.[0]?.product_id || p.price === order.total_amount)?.category === "tool";

                        return (
                          <span className="text-emerald-700 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            {isLab
                              ? "Đơn đã duyệt! Bạn có thể xem đề và tải mã nguồn LAB211 ngay bên dưới."
                              : isTool
                              ? "Đơn đã duyệt! Bản quyền Tool và License Key đã được mở khóa trong Kho Lưu Trữ (Vault)."
                              : "Đơn đã duyệt! Bạn có thể nhận tài nguyên trong Kho Lưu Trữ (Vault)."}
                          </span>
                        );
                      })()}
                      {order.status === "pending_approval" && (
                        <span className="text-amber-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          Admin đang đối chiếu biên lai. Dự kiến mở kho sau 3–10 phút.
                        </span>
                      )}
                      {order.status === "pending_payment" && (
                        <span className="text-blue-700 flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5" />
                          Quét mã VietQR và nộp ảnh biên lai để hoàn tất đặt hàng.
                        </span>
                      )}
                      {order.status === "blocked" && (
                        <span className="text-rose-800 flex items-center gap-1.5 font-bold">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Quyền truy cập bị khóa. Liên hệ hỗ trợ để được giải đáp.
                        </span>
                      )}
                      {order.status === "rejected" && (
                        <span className="text-rose-700 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Lý do: {(order.admin_notes || "")
                            .replace(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):[^\]]+\]/gi, "")
                            .replace(/\[KEY:[^\]]+\]/gi, "")
                            .replace(/\[BLOCKED\]/gi, "")
                            .trim() || "Không tìm thấy giao dịch phù hợp."}
                        </span>
                      )}
                      {order.status === "cancelled" && (
                        <span className="text-slate-500">Đơn hàng đã được hủy.</span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => setSelectedDetailOrder(order)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shadow-sm transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        Chi tiết & QR
                      </button>

                      {order.status === "completed" && (() => {
                        const isLab = order.items?.some((i) => i.product_category === "lab211" || i.product_title?.toLowerCase().includes("lab211")) ||
                          products.find((p) => p.id === order.items?.[0]?.product_id)?.category === "lab211" ||
                          (!order.items?.some((i) => i.product_category === "tool") && order.total_amount === 90000);
                        const isTool = order.items?.some((i) => i.product_category === "tool" || i.product_title?.toLowerCase().includes("coursera") || i.product_title?.toLowerCase().includes("tool")) ||
                          products.find((p) => p.id === order.items?.[0]?.product_id)?.category === "tool";

                        return (
                          <>
                            {isLab && (
                              <button
                                onClick={() =>
                                  setActiveLabModal({
                                    isOpen: true,
                                    orderId: order.id,
                                    orderCode: order.order_code,
                                  })
                                }
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                Xem Đề & Code LAB211
                              </button>
                            )}
                            <a
                              href="/customer/vault"
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                            >
                              <Package className="w-3.5 h-3.5" />
                              {isTool ? "Vào Kho Lấy Key & Tool" : "Vào Vault"}
                            </a>
                          </>
                        );
                      })()}

                      {order.status === "pending_payment" && (
                        <>
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Hủy đơn
                          </button>
                          <button
                            onClick={() => setSelectedDetailOrder(order)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            Tiếp tục thanh toán
                          </button>
                        </>
                      )}

                      {(order.status === "cancelled" || order.status === "rejected") && (
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs font-bold transition-all"
                          title="Xóa đơn khỏi lịch sử"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-14 text-center shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {selectedStatus === "all" ? "Bạn chưa có đơn hàng nào" : "Không có đơn nào ở trạng thái này"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
              Hãy khám phá các gói mã nguồn, đồ án hoặc bài tập LAB211 và đặt mua ngay hôm nay!
            </p>
            <a
              href="/#catalog"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Xem danh mục sản phẩm
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Customer Order Detail & Payment Modal */}
      {selectedDetailOrder && (
        <OrderDetailModal
          order={selectedDetailOrder}
          isOpen={Boolean(selectedDetailOrder)}
          onClose={() => setSelectedDetailOrder(null)}
          onOpenDeliverable={(orderId, orderCode) =>
            setActiveLabModal({ isOpen: true, orderId, orderCode })
          }
        />
      )}

      {/* Master Lab Deliverable Modal */}
      {activeLabModal && (
        <LabDeliverableModal
          orderId={activeLabModal.orderId}
          orderCode={activeLabModal.orderCode}
          isOpen={activeLabModal.isOpen}
          onClose={() => setActiveLabModal(null)}
        />
      )}
    </div>
  );
}
