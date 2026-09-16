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
} from "lucide-react";
import LabDeliverableModal from "@/components/store/LabDeliverableModal";

export default function CustomerOrdersPage() {
  const { currentUser, orders, openCheckout, products, openAuthModal } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [activeLabModal, setActiveLabModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderCode: string;
  } | null>(null);


  // Get orders for current user
  const userOrders = currentUser
    ? orders.filter((o) => o.user_id === currentUser.id || o.user_email === currentUser.email)
    : orders; // fallback to all for demo testing if not logged in

  const filteredOrders = selectedStatus === "all"
    ? userOrders
    : userOrders.filter((o) => o.status === selectedStatus);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return {
          label: "Đã duyệt / Hoàn thành",
          className: "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]",
          icon: CheckCircle2,
        };
      case "pending_approval":
        return {
          label: "Chờ Admin duyệt bill",
          className: "bg-[#fef3c7] text-[#b45309] border-[#fde68a] animate-pulse",
          icon: Clock,
        };
      case "pending_payment":
        return {
          label: "Chờ chuyển khoản",
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: QrCode,
        };
      case "rejected":
        return {
          label: "Bị từ chối",
          className: "bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]",
          icon: XCircle,
        };
      case "cancelled":
      default:
        return {
          label: "Đã hủy",
          className: "bg-slate-100 text-slate-600 border-slate-200",
          icon: XCircle,
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Lịch Sử Mua Hàng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi trạng thái duyệt đơn VietQR và truy cập tài nguyên số đã thanh toán.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/customer/vault"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
          >
            <Package className="w-3.5 h-3.5" />
            Vào Kho Tài Nguyên Số
          </a>
        </div>
      </div>

      {/* Filter Tabs (following design.md) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            selectedStatus === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Tất cả ({userOrders.length})
        </button>
        <button
          onClick={() => setSelectedStatus("pending_approval")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            selectedStatus === "pending_approval"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Chờ duyệt ({userOrders.filter((o) => o.status === "pending_approval").length})
        </button>
        <button
          onClick={() => setSelectedStatus("completed")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            selectedStatus === "completed"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Đã hoàn thành ({userOrders.filter((o) => o.status === "completed").length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-card border border-slate-200/90 p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-blue-600 text-sm">
                        {order.order_code}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.className}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Đặt lúc: {formatDateVN(order.created_at)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Tổng thanh toán:</span>
                    <span className="text-base font-black text-slate-900">
                      {formatVND(order.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3.5">
                      {item.product_thumbnail && (
                        <img
                          src={item.product_thumbnail}
                          alt={item.product_title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                          {item.product_title}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Danh mục: {item.product_category}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">
                        {formatVND(item.unit_price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status Notice & Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-card">
                  <div className="text-xs text-slate-500">
                    {order.status === "completed" && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Đơn đã được duyệt! Bạn có thể tải mã nguồn ngay.
                      </span>
                    )}
                    {order.status === "pending_approval" && (
                      <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                        Admin đang đối chiếu biên lai. Dự kiến mở kho sau 3-10 phút.
                      </span>
                    )}
                    {order.status === "rejected" && (
                      <span className="text-rose-700 font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Lý do từ chối: {order.admin_notes || "Chưa nhận được chuyển khoản."}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    {order.status === "completed" ? (
                      <>
                        {order.items?.some(
                          (i) =>
                            i.product_category === "lab211" ||
                            i.product_title.toLowerCase().includes("lab211")
                        ) && (
                          <button
                            onClick={() =>
                              setActiveLabModal({
                                isOpen: true,
                                orderId: order.id,
                                orderCode: order.order_code,
                              })
                            }
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Xem Đề Bài Word & Code</span>
                          </button>
                        )}
                        <a
                          href="/customer/vault"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          <Package className="w-3.5 h-3.5" />
                          Tải mã nguồn tại Vault
                        </a>
                      </>
                    ) : order.status === "pending_payment" ? (

                      <button
                        onClick={() => {
                          const prod = products.find((p) => p.id === order.items?.[0]?.product_id);
                          if (prod) openCheckout(prod);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Tiếp tục thanh toán
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dashed Empty State Card */
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-card p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Bạn chưa có đơn hàng nào
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Hãy khám phá các gói mã nguồn, đồ án hoặc bài tập LAB211 và đặt mua ngay hôm nay!
          </p>
          <a
            href="/#catalog"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
          >
            Xem danh mục sản phẩm
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
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

