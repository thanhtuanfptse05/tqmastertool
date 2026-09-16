"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { formatVND, formatDateVN } from "@/lib/vietqr";
import { Order, OrderStatus } from "@/types";
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  Check,
  X,
  ExternalLink,
  ZoomIn,
  AlertCircle,
  FileText,
  User,
  CreditCard,
  Edit3,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Ban,
  Filter,
} from "lucide-react";
import AdminOrderEditModal from "@/components/store/AdminOrderEditModal";

export default function AdminOrdersPage() {
  const {
    orders,
    adminReviewOrder,
    adminBlockOrder,
    adminUpdateOrderStatus,
    deleteOrder,
    refreshOrders,
  } = useStore();

  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReviewOrder, setActiveReviewOrder] = useState<Order | null>(null);
  const [activeEditOrder, setActiveEditOrder] = useState<Order | null>(null);
  const [isZoomImageOpen, setIsZoomImageOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (selectedFilter !== "all" && order.status !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = order.order_code.toLowerCase().includes(q);
      const matchEmail = order.user_email?.toLowerCase().includes(q);
      const matchName = order.user_name?.toLowerCase().includes(q);
      return matchCode || matchEmail || matchName;
    }
    return true;
  });

  const handleApprove = (orderId: string) => {
    adminReviewOrder(orderId, "approve", "Đã nhận đúng số tiền chuyển khoản qua tài khoản ngân hàng.");
    setActiveReviewOrder(null);
  };

  const handleReject = (orderId: string) => {
    adminReviewOrder(orderId, "reject", rejectReason || "Số tiền hoặc nội dung chuyển khoản không khớp.");
    setIsRejectModalOpen(false);
    setActiveReviewOrder(null);
    setRejectReason("");
  };

  const pendingCount = orders.filter((o) => o.status === "pending_approval").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Phê Duyệt &amp; Quản Trị Đơn Hàng</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý &amp; Kiểm Soát Đơn Hàng (VietQR / SePay)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Toàn quyền Xem, Sửa, Duyệt, Từ chối, Chặn quyền tải và Xóa đơn hàng phòng chống hack.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={async () => {
              setIsRefreshing(true);
              await refreshOrders();
              setTimeout(() => setIsRefreshing(false), 600);
            }}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-sm transition-all"
            title="Đồng bộ lại dữ liệu từ Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Đang tải..." : "Làm mới"}</span>
          </button>

          {pendingCount > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Cần duyệt: <b>{pendingCount}</b></span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-card p-4 border border-slate-200/90 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "all"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả ({orders.length})
          </button>

          <button
            onClick={() => setSelectedFilter("pending_approval")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "pending_approval"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Chờ duyệt ({orders.filter((o) => o.status === "pending_approval").length})
          </button>

          <button
            onClick={() => setSelectedFilter("completed")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "completed"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã duyệt ({orders.filter((o) => o.status === "completed").length})
          </button>

          <button
            onClick={() => setSelectedFilter("blocked")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "blocked"
                ? "bg-rose-700 text-white shadow-md shadow-rose-700/25"
                : "text-rose-600 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            🚨 Bị chặn ({orders.filter((o) => o.status === "blocked").length})
          </button>

          <button
            onClick={() => setSelectedFilter("pending_payment")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "pending_payment"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Chờ chuyển khoản ({orders.filter((o) => o.status === "pending_payment").length})
          </button>

          <button
            onClick={() => setSelectedFilter("rejected")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "rejected"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Từ chối ({orders.filter((o) => o.status === "rejected").length})
          </button>

          <button
            onClick={() => setSelectedFilter("cancelled")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedFilter === "cancelled"
                ? "bg-slate-600 text-white shadow-md shadow-slate-500/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Đã hủy ({orders.filter((o) => o.status === "cancelled").length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn, email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-white rounded-card border border-slate-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Mã Đơn Hàng</th>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Sản Phẩm Đặt</th>
                  <th className="py-3.5 px-4">Số Tiền</th>
                  <th className="py-3.5 px-4">Ảnh Bill</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Thời Gian</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono font-black text-blue-600">
                      {order.order_code}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{order.user_name || "Khách Hàng"}</p>
                      <p className="text-[11px] text-slate-400">{order.user_email}</p>
                    </td>

                    <td className="py-4 px-4 max-w-[220px]">
                      <p className="truncate font-bold text-slate-800">
                        {order.items?.[0]?.product_title || "Sản phẩm số"}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {order.items?.[0]?.product_category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-extrabold text-slate-900">
                      {formatVND(order.total_amount)}
                    </td>

                    {/* Bill Thumbnail */}
                    <td className="py-4 px-4">
                      {order.payment_proof_image ? (
                        <div
                          onClick={() => {
                            setActiveReviewOrder(order);
                            setIsZoomImageOpen(true);
                          }}
                          className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity relative group"
                          title="Bấm để phóng to biên lai"
                        >
                          <img
                            src={order.payment_proof_image}
                            alt="Bill"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white">
                            <ZoomIn className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-300 italic">Chưa up bill</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          order.status === "completed"
                            ? "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]"
                            : order.status === "pending_approval"
                            ? "bg-[#fef3c7] text-[#b45309] border-[#fde68a] animate-pulse"
                            : order.status === "blocked"
                            ? "bg-rose-100 text-rose-800 border-rose-300 font-black"
                            : order.status === "rejected"
                            ? "bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]"
                            : order.status === "cancelled"
                            ? "bg-slate-100 text-slate-500 border-slate-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {order.status === "completed"
                          ? "Đã duyệt"
                          : order.status === "pending_approval"
                          ? "Chờ duyệt"
                          : order.status === "blocked"
                          ? "🚨 Bị Chặn"
                          : order.status === "rejected"
                          ? "Đã từ chối"
                          : order.status === "cancelled"
                          ? "Đã hủy"
                          : "Chờ chuyển khoản"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[11px] text-slate-400">
                      {formatDateVN(order.created_at)}
                    </td>

                    {/* Action buttons (Full Admin CRUD & Anti-Hack Block) */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveReviewOrder(order)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors inline-flex items-center gap-1"
                          title="Xem chi tiết & đối soát bill"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>

                        <button
                          onClick={() => setActiveEditOrder(order)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors inline-flex items-center gap-1"
                          title="Sửa đơn hàng (CRUD: trạng thái, số tiền, ghi chú, mã GD)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>

                        {order.status !== "completed" && order.status !== "blocked" && (
                          <button
                            onClick={() => handleApprove(order.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors inline-flex items-center gap-1"
                            title="Duyệt đơn & mở quyền tải"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Duyệt</span>
                          </button>
                        )}

                        {order.status !== "blocked" ? (
                          <button
                            onClick={() => {
                              if (confirm(`CHẶN QUYỀN TRUY CẬP: Bạn có chắc muốn chặn đơn ${order.order_code}? Khách sẽ ngay lập tức bị khóa tải file và xem nội dung!`)) {
                                adminBlockOrder(order.id, "Admin chủ động chặn quyền để chống hack / gian lận biên lai");
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors inline-flex items-center gap-1"
                            title="Chặn quyền xem và tải tài nguyên của đơn này"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Chặn</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (confirm(`Mở khóa cho đơn ${order.order_code}?`)) {
                                adminUpdateOrderStatus(order.id, "pending_approval", "Admin mở lại khóa chặn");
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs border border-amber-200 transition-colors inline-flex items-center gap-1"
                            title="Gỡ chặn đơn hàng"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Gỡ chặn</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`XÓA ĐƠN: Bạn có chắc muốn xóa vĩnh viễn đơn hàng ${order.order_code}? Thao tác này không thể hoàn tác!`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa vĩnh viễn đơn hàng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Dashed Empty State Card */
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-card p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Không có đơn hàng nào khớp bộ lọc
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Hiện tại không có đơn hàng nào ở trạng thái này hoặc từ khóa tìm kiếm không tồn tại.
          </p>
        </div>
      )}

      {/* ORDER REVIEW MODAL / DRAWER (Spec 006) */}
      {activeReviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-card shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Duyệt Đơn Hàng: {activeReviewOrder.order_code}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Đối chiếu biên lai VietQR Napas 247 và duyệt bàn giao
                </p>
              </div>
              <button
                onClick={() => setActiveReviewOrder(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Customer & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Khách hàng</span>
                  <p className="font-extrabold text-slate-900 text-sm">{activeReviewOrder.user_name || "Khách hàng"}</p>
                  <p className="text-slate-600">{activeReviewOrder.user_email}</p>
                  <p className="text-slate-400 text-[11px]">User ID: {activeReviewOrder.user_id}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Thông tin thanh toán</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số tiền:</span>
                    <span className="font-black text-blue-600 text-sm">{formatVND(activeReviewOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nội dung memo:</span>
                    <span className="font-mono font-bold text-rose-600">{activeReviewOrder.vietqr_content}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã GD khách gửi:</span>
                    <span className="font-mono text-slate-700">{activeReviewOrder.transaction_ref || "Chưa có"}</span>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div>
                <span className="text-slate-700 font-bold mb-2 block">Sản phẩm trong đơn:</span>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  {activeReviewOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{item.product_title}</span>
                      <span className="font-extrabold text-slate-900">{formatVND(item.unit_price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill proof view & Zoom Lightbox */}
              <div>
                <span className="text-slate-700 font-bold mb-2 block">
                  Ảnh biên lai chuyển khoản (Payment Proof):
                </span>
                {activeReviewOrder.payment_proof_image ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-64 flex items-center justify-center group">
                    <img
                      src={activeReviewOrder.payment_proof_image}
                      alt="Bill Proof"
                      className="max-h-64 w-auto object-contain cursor-pointer"
                      onClick={() => setIsZoomImageOpen(true)}
                    />
                    <button
                      onClick={() => setIsZoomImageOpen(true)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white font-bold text-xs backdrop-blur-sm flex items-center gap-1.5"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      Phóng to xem rõ
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-100 text-center text-slate-400 italic">
                    Khách hàng chưa tải ảnh biên lai chuyển tiền.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveReviewOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setActiveEditOrder(activeReviewOrder);
                    setActiveReviewOrder(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Đơn (CRUD)</span>
                </button>
                {activeReviewOrder.status !== "blocked" ? (
                  <button
                    onClick={() => {
                      if (confirm(`CHẶN QUYỀN: Bạn có chắc muốn chặn đơn ${activeReviewOrder.order_code}? Khách sẽ bị khóa tải mã nguồn ngay lập tức!`)) {
                        adminBlockOrder(activeReviewOrder.id, "Admin chặn quyền để chống hack và đối soát biên lai");
                        setActiveReviewOrder(null);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Chặn Quyền</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (confirm(`Mở khóa cho đơn ${activeReviewOrder.order_code}?`)) {
                        adminUpdateOrderStatus(activeReviewOrder.id, "pending_approval", "Admin mở lại khóa chặn");
                        setActiveReviewOrder(null);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Gỡ Chặn</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`XÓA ĐƠN: Bạn có chắc muốn xóa vĩnh viễn đơn hàng ${activeReviewOrder.order_code}?`)) {
                      deleteOrder(activeReviewOrder.id);
                      setActiveReviewOrder(null);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Xóa đơn hàng vĩnh viễn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeReviewOrder.status !== "completed" && activeReviewOrder.status !== "blocked" && (
                  <>
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Từ Chối Đơn
                    </button>
                    <button
                      onClick={() => handleApprove(activeReviewOrder.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Duyệt Đơn &amp; Mở Kho
                    </button>
                  </>
                )}
                {activeReviewOrder.status === "completed" && (
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Đơn hàng này đã hoàn thành
                  </span>
                )}
                {activeReviewOrder.status === "blocked" && (
                  <span className="text-rose-700 font-bold text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Đơn hàng này đang bị CHẶN QUYỀN
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE ZOOM LIGHTBOX */}
      {isZoomImageOpen && activeReviewOrder?.payment_proof_image && (
        <div
          onClick={() => setIsZoomImageOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={activeReviewOrder.payment_proof_image}
              alt="Zoomed Bill"
              className="max-h-[85vh] w-auto rounded-xl shadow-2xl object-contain"
            />
            <p className="text-center text-xs text-white/70 mt-3">
              Nhấp bất kỳ đâu để đóng cửa sổ phóng to
            </p>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {isRejectModalOpen && activeReviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-card p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-rose-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Lý Do Từ Chối Đơn Hàng
            </h3>
            <p className="text-xs text-slate-500">
              Vui lòng nhập lý do từ chối để thông báo đến khách hàng (chưa thấy biến động số dư, nội dung chuyển tiền sai, bill giả mạo...).
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do chi tiết..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleReject(activeReviewOrder.id)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ORDER EDIT MODAL (Full CRUD & Security Override) */}
      {activeEditOrder && (
        <AdminOrderEditModal
          order={activeEditOrder}
          isOpen={Boolean(activeEditOrder)}
          onClose={() => setActiveEditOrder(null)}
        />
      )}
    </div>
  );
}
