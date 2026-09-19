"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { formatVND, formatDateVN } from "@/lib/vietqr";
import { useStore } from "@/lib/store";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  QrCode,
  XCircle,
  Key,
} from "lucide-react";
import {
  generateCourseraLicenseKey,
  generateMultipleCourseraKeys,
  extractOrderLicenseInfo,
  formatOrderNotesWithLicense,
  formatOrderNotesWithMultipleLicenses,
} from "@/lib/coursera-keygen";

interface AdminOrderEditModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminOrderEditModal({
  order,
  isOpen,
  onClose,
}: AdminOrderEditModalProps) {
  const { adminUpdateOrder, adminBlockOrder, deleteOrder, users } = useStore();

  const customerProfile = (users || []).find((u) => u.id === order?.user_id);
  const customerName = order?.user_name || customerProfile?.full_name || (order?.user_email ? order.user_email.split("@")[0] : "Khách Hàng");
  const accountEmail = customerProfile?.email || order?.user_email || "";

  const [status, setStatus] = useState<OrderStatus>(order?.status || "pending_approval");
  const [adminNotes, setAdminNotes] = useState(order?.admin_notes || "");
  const [transactionRef, setTransactionRef] = useState(order?.transaction_ref || "");
  const [totalAmount, setTotalAmount] = useState<number>(order?.total_amount || 80000);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when order changes
  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setAdminNotes(order.admin_notes || "");
      setTransactionRef(order.transaction_ref || "");
      setTotalAmount(order.total_amount || 80000);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalAdminNotes = adminNotes;
      if (status === "completed") {
        const { courseraEmail, emails } = extractOrderLicenseInfo({ ...order, admin_notes: adminNotes });
        const targetEmails: string[] = emails.length > 0 ? emails : [courseraEmail || order.user_email || "customer@codevault.local"];
        const isCoursera = Boolean(
          order.items?.some((i) => i.product_title?.toLowerCase().includes("coursera"))
        );

        if (isCoursera && !finalAdminNotes.includes("[KEY:") && !finalAdminNotes.includes("[LICENSES:")) {
          const licenses = generateMultipleCourseraKeys(targetEmails, 30);
          finalAdminNotes = formatOrderNotesWithMultipleLicenses(finalAdminNotes, licenses);
        }
      }

      await adminUpdateOrder(order.id, {
        status,
        admin_notes: finalAdminNotes,
        transaction_ref: transactionRef,
        total_amount: totalAmount,
        reviewed_at: new Date().toISOString(),
      });
      onClose();
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickBlock = async () => {
    if (!confirm(`🚨 BẠN CHẮC CHẮN MUỐN CHẶN ĐƠN ${order.order_code}? Khách hàng sẽ ngay lập tức bị tước quyền truy cập kho tài liệu và file tải về.`)) {
      return;
    }
    setIsSaving(true);
    try {
      await adminBlockOrder(order.id, adminNotes || "🚨 Đơn hàng đã bị Quản Trị Viên thu hồi và chặn quyền truy cập do vi phạm quy chế hoặc gian lận thanh toán.");
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`⚠️ XÓA VĨNH VIỄN ĐƠN HÀNG ${order.order_code}? Hành động này không thể hoàn tác.`)) {
      return;
    }
    setIsSaving(true);
    try {
      await deleteOrder(order.id);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-black text-sm text-white">
                Admin Master Control: Sửa Đơn Hàng
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {order.order_code} • Khách: <span className="text-white font-bold">{customerName}</span> ({accountEmail || order.user_id})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-700">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              Trạng Thái Đơn Hàng (Status Override):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { val: "completed", label: "Đã Duyệt (Completed)", color: "border-emerald-500 text-emerald-700 bg-emerald-50" },
                { val: "pending_approval", label: "Chờ Duyệt Bill", color: "border-amber-500 text-amber-700 bg-amber-50" },
                { val: "pending_payment", label: "Chờ Chuyển Khoản", color: "border-blue-500 text-blue-700 bg-blue-50" },
                { val: "rejected", label: "Từ Chối (Rejected)", color: "border-rose-500 text-rose-700 bg-rose-50" },
                { val: "blocked", label: "🚨 Chặn Quyền (Blocked)", color: "border-rose-700 text-rose-900 bg-rose-100 font-black" },
                { val: "cancelled", label: "Đã Hủy (Cancelled)", color: "border-slate-400 text-slate-600 bg-slate-50" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setStatus(opt.val as OrderStatus)}
                  className={`p-2.5 rounded-xl border-2 text-left font-bold transition-all ${
                    status === opt.val
                      ? `${opt.color} ring-2 ring-blue-500/20 shadow-sm`
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="text-[11px]">{opt.label}</div>
                </button>
              ))}
            </div>

            {status === "blocked" && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>CẢNH BÁO BẢO MẬT:</strong> Chuyển sang <strong>BLOCKED</strong> sẽ ngay lập tức khóa quyền xem và chặn API tải file của khách hàng!
                </span>
              </div>
            )}
          </div>

          {/* Amount & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Tổng tiền (VNĐ):</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Mã GD SePay / Ngân hàng:</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="VD: MB12345678, VCB998..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Ghi chú Admin / Lý do từ chối hoặc chặn:
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Ghi chú nội bộ hoặc lý do khách hàng sẽ nhìn thấy..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs"
            />
          </div>

          {/* Order Info Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-[11px] text-slate-600">
            <div><strong>Nội dung VietQR:</strong> <span className="font-mono text-blue-600 font-bold">{order.vietqr_content}</span></div>
            <div><strong>Ngày đặt hàng:</strong> {formatDateVN(order.created_at)}</div>
            <div><strong>Sản phẩm:</strong> {order.items?.map(i => i.product_title).join(", ") || "Gói LAB211"}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-100 font-bold text-xs transition-colors"
              title="Xóa vĩnh viễn đơn hàng"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa Đơn</span>
            </button>

            {order.status !== "blocked" && (
              <button
                type="button"
                onClick={handleQuickBlock}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs transition-colors"
                title="Khóa ngay quyền truy cập đơn hàng này"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Chặn Quyền (Block)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
