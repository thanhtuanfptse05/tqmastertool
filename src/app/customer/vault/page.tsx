"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import {
  Package,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Unlock,
  Download,
} from "lucide-react";
import LabDeliverableModal from "@/components/store/LabDeliverableModal";

export default function DeliverableVaultPage() {
  const { currentUser, orders, products } = useStore();
  const [activeLabModal, setActiveLabModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderCode?: string;
    labCode?: string;
  } | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

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
    }> = [];

    completed.forEach((order) => {
      const hasItems = order.items && order.items.length > 0;

      if (hasItems) {
        order.items!.forEach((item) => {
          const product = products.find((p) => p.id === item.product_id);
          result.push({
            order_id: order.id,
            order_code: order.order_code,
            product_id: item.product_id,
            product_title: product?.title || item.product_title || "Sản phẩm CodeVault",
            product_category: product?.category || item.product_category || "lab211",
          });
        });
      } else {
        // Fallback when order_items join fails (Supabase RLS)
        result.push({
          order_id: order.id,
          order_code: order.order_code,
          product_id: `order-${order.id}`,
          product_title: "Trọn Bộ Mã Nguồn & Đề Bài LAB211",
          product_category: "lab211",
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
            Các gói đã mua và được Admin phê duyệt. Bấm <b>Xem Ngay</b> để mở nội dung.
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
          {deliverables.map((item, idx) => {
            const lab = isLab211(item);
            const catColor = getCategoryColor(item.product_category);

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${catColor.bg} border ${catColor.border}`}>
                    <Unlock className={`w-5 h-5 ${catColor.text}`} />
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
                      Đã thanh toán & được duyệt thành công
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="shrink-0 flex items-center gap-2 flex-wrap">
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
                          `${item.product_title.replace(/[^a-zA-Z0-9]/g, "_")}.zip`
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
                  </div>

                </div>
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
    </div>
  );
}
