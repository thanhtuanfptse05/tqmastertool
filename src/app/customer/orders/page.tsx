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
  ShieldCheck,
  AlertCircle,
  BookOpen,
  Eye,
  Trash2,
  ShieldAlert,
  RefreshCw,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
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

  const filteredOrders = selectedStatus === "all"
    ? userOrders
    : userOrders.filter((o) => o.status === selectedStatus);

  const statusCounts = {
    all: userOrders.length,
    pending_payment: userOrders.filter((o) => o.status === "pending_payment").length,
    pending_approval: userOrders.filter((o) => o.status === "pending_approval").length,
    completed: userOrders.filter((o) => o.status === "completed").length,
    rejected: userOrders.filter((o) => o.status === "rejected" || o.status === "cancelled" || o.status === "blocked").length,
  };

  type StatusConfig = {
    label: string;
    shortLabel: string;
    gradient: string;
    glow: string;
    border: string;
    bg: string;
    text: string;
    icon: React.ElementType;
    pulse?: boolean;
    badgeBg: string;
    badgeText: string;
    timelineColor: string;
  };

  const getStatusConfig = (status: OrderStatus): StatusConfig => {
    switch (status) {
      case "completed":
        return {
          label: "Đã duyệt & Hoàn thành",
          shortLabel: "Hoàn thành",
          gradient: "from-emerald-500/10 to-teal-500/5",
          glow: "shadow-emerald-500/10",
          border: "border-emerald-200/60",
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: CheckCircle2,
          badgeBg: "bg-emerald-100",
          badgeText: "text-emerald-800",
          timelineColor: "bg-emerald-500",
        };
      case "pending_approval":
        return {
          label: "Chờ Admin xác nhận bill",
          shortLabel: "Chờ duyệt",
          gradient: "from-amber-500/10 to-orange-500/5",
          glow: "shadow-amber-500/10",
          border: "border-amber-200/60",
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: Clock,
          pulse: true,
          badgeBg: "bg-amber-100",
          badgeText: "text-amber-800",
          timelineColor: "bg-amber-500",
        };
      case "pending_payment":
        return {
          label: "Chờ chuyển khoản VietQR",
          shortLabel: "Chờ TT",
          gradient: "from-blue-500/10 to-indigo-500/5",
          glow: "shadow-blue-500/10",
          border: "border-blue-200/60",
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: QrCode,
          badgeBg: "bg-blue-100",
          badgeText: "text-blue-800",
          timelineColor: "bg-blue-500",
        };
      case "blocked":
        return {
          label: "Bị chặn quyền truy cập",
          shortLabel: "Bị chặn",
          gradient: "from-rose-500/10 to-red-500/5",
          glow: "shadow-rose-500/15",
          border: "border-rose-300/60",
          bg: "bg-rose-50",
          text: "text-rose-700",
          icon: ShieldAlert,
          badgeBg: "bg-rose-100",
          badgeText: "text-rose-900",
          timelineColor: "bg-rose-500",
        };
      case "rejected":
        return {
          label: "Bị từ chối thanh toán",
          shortLabel: "Từ chối",
          gradient: "from-rose-500/8 to-pink-500/5",
          glow: "shadow-rose-500/8",
          border: "border-rose-200/50",
          bg: "bg-rose-50",
          text: "text-rose-600",
          icon: XCircle,
          badgeBg: "bg-rose-100",
          badgeText: "text-rose-700",
          timelineColor: "bg-rose-400",
        };
      case "cancelled":
      default:
        return {
          label: "Đơn hàng đã hủy",
          shortLabel: "Đã hủy",
          gradient: "from-slate-500/5 to-slate-500/3",
          glow: "shadow-slate-500/5",
          border: "border-slate-200/60",
          bg: "bg-slate-50",
          text: "text-slate-500",
          icon: XCircle,
          badgeBg: "bg-slate-100",
          badgeText: "text-slate-600",
          timelineColor: "bg-slate-400",
        };
    }
  };

  const tabs: Array<{ key: OrderStatus | "all"; label: string; count: number }> = [
    { key: "all", label: "Tất cả", count: statusCounts.all },
    { key: "pending_payment", label: "Chờ TT", count: statusCounts.pending_payment },
    { key: "pending_approval", label: "Chờ duyệt", count: statusCounts.pending_approval },
    { key: "completed", label: "Hoàn thành", count: statusCounts.completed },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-72 h-72 bg-violet-600/6 rounded-full blur-3xl" />
          <div className="absolute -top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-4">
                <ShoppingBag className="w-3.5 h-3.5" />
                Lịch Sử Mua Hàng
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Đơn Hàng{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Của Tôi
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-lg">
                Theo dõi & quản lý tất cả đơn hàng VietQR. Tài nguyên số mở khoá tự động sau khi duyệt.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-xs font-bold transition-all disabled:opacity-50 backdrop-blur-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
              <a
                href="/customer/vault"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-95 border border-blue-500/30"
              >
                <Package className="w-3.5 h-3.5" />
                Kho Tài Nguyên
              </a>
            </div>
          </div>

          {/* Stats Row */}
          {userOrders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { label: "Tổng đơn", value: statusCounts.all, icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Chờ duyệt", value: statusCounts.pending_approval, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
                { label: "Hoàn thành", value: statusCounts.completed, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                {
                  label: "Tổng chi tiêu",
                  value: formatVND(userOrders.filter(o => o.status === "completed").reduce((s, o) => s + o.total_amount, 0)),
                  icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/40 backdrop-blur-sm"
                >
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{stat.label}</p>
                    <p className={`text-sm font-black ${stat.color} truncate`}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === tab.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 border border-slate-700/50 backdrop-blur-sm"
              }`}
            >
              {tab.label}
              <span
                className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center ${
                  selectedStatus === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const cfg = getStatusConfig(order.status);
              const StatusIcon = cfg.icon;

              return (
                <div
                  key={order.id}
                  className={`relative rounded-2xl border bg-gradient-to-br ${cfg.gradient} ${cfg.border} shadow-xl ${cfg.glow} overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-[1.005] hover:shadow-2xl`}
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.timelineColor}`} />

                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" />

                  <div className="relative p-5 sm:p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                      <div className="flex items-start gap-3">
                        {/* Status icon circle */}
                        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 border ${cfg.border}`}>
                          <StatusIcon className={`w-5 h-5 ${cfg.text} ${cfg.pulse ? "animate-spin" : ""}`} style={cfg.pulse ? {animationDuration: "3s"} : {}} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono font-black text-white text-base tracking-wide">
                              {order.order_code}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${cfg.border} ${cfg.badgeBg}/30 ${cfg.text}`}
                            >
                              <StatusIcon className="w-2.5 h-2.5" />
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Đặt lúc: {formatDateVN(order.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] text-slate-500 block uppercase tracking-wide font-semibold">Tổng thanh toán</span>
                        <span className="text-xl font-black text-white">
                          {formatVND(order.total_amount)}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-slate-700/80 via-slate-600/40 to-transparent mb-4" />

                    {/* Items */}
                    <div className="space-y-3 mb-5">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {item.product_thumbnail ? (
                              <img
                                src={item.product_thumbnail}
                                alt={item.product_title}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-[9px] flex items-center justify-center border border-blue-500/30 shrink-0 shadow-md shadow-blue-600/20">
                                LAB<br/>211
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-extrabold text-white truncate leading-tight">
                                {item.product_title}
                              </h4>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                {item.product_category}
                              </span>
                            </div>
                            <span className="text-sm font-extrabold text-slate-300 shrink-0">
                              {formatVND(item.unit_price || order.total_amount)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-600/10 border border-blue-500/20">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                            LAB<br/>211
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-extrabold text-white truncate">
                              Trọn Bộ Mã Nguồn & Đề Bài LAB211 Chuẩn Giảng Viên FPT
                            </h4>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">
                              Gói bản quyền môn học Java Core & OOP
                            </span>
                          </div>
                          <span className="text-sm font-extrabold text-slate-300 shrink-0">
                            {formatVND(order.total_amount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Notice + Actions Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-700/50">
                      {/* Status message */}
                      <div className="text-xs">
                        {order.status === "completed" && (
                          <div className="flex items-center gap-2 text-emerald-400">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-semibold">Đã duyệt! Tài nguyên số đã mở khóa cho bạn.</span>
                          </div>
                        )}
                        {order.status === "pending_approval" && (
                          <div className="flex items-center gap-2 text-amber-400">
                            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="font-semibold">Admin đang đối chiếu biên lai — dự kiến 3-10 phút.</span>
                          </div>
                        )}
                        {order.status === "pending_payment" && (
                          <div className="flex items-center gap-2 text-blue-400">
                            <span className="flex h-2 w-2 rounded-full bg-blue-400" />
                            <span className="font-semibold">Đang chờ bạn hoàn tất chuyển khoản VietQR.</span>
                          </div>
                        )}
                        {order.status === "blocked" && (
                          <div className="flex items-center gap-2 text-rose-400">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-semibold">🚨 Bị chặn: {order.admin_notes || "Liên hệ hỗ trợ."}</span>
                          </div>
                        )}
                        {order.status === "rejected" && (
                          <div className="flex items-center gap-2 text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-semibold">Từ chối: {order.admin_notes || "Chưa nhận được chuyển khoản."}</span>
                          </div>
                        )}
                        {order.status === "cancelled" && (
                          <span className="text-slate-500 font-medium">Đơn đã bị hủy.</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        <button
                          onClick={() => setSelectedDetailOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/60 text-slate-300 hover:text-white text-xs font-bold transition-all backdrop-blur-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Chi tiết & QR
                        </button>

                        {order.status === "completed" && (
                          <>
                            <button
                              onClick={() =>
                                setActiveLabModal({
                                  isOpen: true,
                                  orderId: order.id,
                                  orderCode: order.order_code,
                                })
                              }
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:text-violet-200 text-xs font-bold transition-all"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Xem Đề Bài & Code
                            </button>
                            <a
                              href="/customer/vault"
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all active:scale-95 border border-emerald-500/30"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Vào Kho
                            </a>
                          </>
                        )}

                        {order.status === "pending_payment" && (
                          <>
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 text-xs font-bold transition-all border border-transparent hover:border-rose-500/20"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Hủy đơn
                            </button>
                            <button
                              onClick={() => setSelectedDetailOrder(order)}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all active:scale-95 border border-blue-500/30"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              Tiếp tục TT
                            </button>
                          </>
                        )}

                        {(order.status === "cancelled" || order.status === "rejected") && (
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 text-xs font-bold transition-all border border-transparent hover:border-rose-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shadow-xl backdrop-blur-sm">
                <ShoppingBag className="w-9 h-9 text-slate-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white mb-2">
              {selectedStatus === "all" ? "Chưa có đơn hàng nào" : "Không có đơn ở trạng thái này"}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
              {selectedStatus === "all"
                ? "Khám phá các gói mã nguồn, đồ án và bài tập LAB211 chất lượng cao từ FPT."
                : "Thử chọn bộ lọc khác hoặc làm mới trang để cập nhật trạng thái mới nhất."}
            </p>
            {selectedStatus === "all" ? (
              <a
                href="/#catalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
              >
                <Star className="w-4 h-4" />
                Xem Danh Mục Sản Phẩm
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={() => setSelectedStatus("all")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition-all"
              >
                Xem tất cả đơn hàng
              </button>
            )}
          </div>
        )}
      </div>

      {/* Customer Order Detail Modal */}
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

      {/* Lab Deliverable Modal */}
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
