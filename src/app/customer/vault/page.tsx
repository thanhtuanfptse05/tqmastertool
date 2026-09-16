"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Package,
  Download,
  Key,
  GitBranch,
  FileText,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Code2,
  FileCheck2,
  BookOpen,
} from "lucide-react";
import LabDeliverableModal from "@/components/store/LabDeliverableModal";
import { getAllLabExercises } from "@/lib/lab-data";

export default function DeliverableVaultPage() {
  const { currentUser, orders, products, getUnlockedDeliverables } = useStore();

  // Compute deliverables directly so this component re-renders reactively
  // when orders or currentUser changes (fixes stale closure issue)
  const deliverables = React.useMemo(() => {
    if (!currentUser) return [];
    // Exact same filter logic as orders page
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
      instructions: string;
      signed_download_url?: string;
      git_repo_url?: string;
      license_key?: string;
    }> = [];

    completed.forEach((order) => {
      const hasItems = order.items && order.items.length > 0;

      if (hasItems) {
        // Normal path: iterate over items
        order.items!.forEach((item) => {
          const product = products.find((p) => p.id === item.product_id);
          result.push({
            order_id: order.id,
            order_code: order.order_code,
            product_id: item.product_id,
            product_title: product?.title || item.product_title || "Sản phẩm CodeVault",
            product_category: product?.category || item.product_category || "lab211",
            instructions:
              product?.access_instructions ||
              "Bấm nút 'Xem Đề & Code' hoặc 'Vào Vault' bên dưới để truy cập mã nguồn.",
            signed_download_url: product?.storage_file_path
              ? `/api/deliverables/download?orderId=${order.id}&path=${product.storage_file_path}`
              : undefined,
            git_repo_url: product?.git_repo_url,
          });
        });
      } else {
        // Fallback: order_items join failed (Supabase RLS) — create virtual deliverable
        // from order metadata. This ensures completed orders always unlock the vault.
        result.push({
          order_id: order.id,
          order_code: order.order_code,
          product_id: `order-${order.id}`,
          product_title: "Trọn Bộ Mã Nguồn & Đề Bài LAB211",
          product_category: "lab211",
          instructions:
            "Bấm nút 'Vào Vault' để xem đề bài và mã nguồn đầy đủ của tất cả bài LAB211.",
        });
      }
    });

    return result;
  }, [currentUser, orders, products]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeLabModal, setActiveLabModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderCode?: string;
    labCode?: string;
  } | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (item: { order_id: string; product_title: string; product_category: string }) => {
    // If LAB211, trigger secure lab download endpoint with exact name
    if (item.product_category === "lab211" || item.product_title.toLowerCase().includes("lab211")) {
      const downloadUrl = `/api/deliverables/lab/download?orderId=${encodeURIComponent(item.order_id)}&labId=all&type=zip`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "LAB211_Tron_Bo_Java_OOP.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Standard deliverable download
    const element = document.createElement("a");
    const file = new Blob([`// CODEVAULT STUDIO DELIVERABLE VAULT\n// Package: ${item.product_title}\n// Authorized Customer: ${currentUser?.email || "customer"}\n// Generated at: ${new Date().toISOString()}\n\nconsole.log("Package loaded successfully!");`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${item.product_title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_source.zip`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadDocx = (orderId: string, labId: string = "J1.L.P0023", docxName: string = "J1.L.P0023 - FRUIT.docx") => {
    const downloadUrl = `/api/deliverables/lab/download?orderId=${encodeURIComponent(orderId)}&labId=${encodeURIComponent(labId)}&type=docx`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = docxName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
            Các gói mã nguồn, đồ án và bài tập đã được Admin phê duyệt thành công. Bạn có thể tải xuống không giới hạn.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Đã mở khóa: <b>{deliverables.length}</b> gói
          </span>
        </div>
      </div>

      {/* Deliverables List */}
      {/* ── DEBUG PANEL (remove after fix confirmed) ── */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-[11px] font-mono text-yellow-900 space-y-0.5">
          <p><b>DEBUG</b> — orders total: {orders.length} | completed matching: {orders.filter(o => o.status === "completed" && (o.user_id === currentUser?.id || o.user_email === currentUser?.email)).length}</p>
          <p>currentUser.id: <b>{currentUser?.id}</b></p>
          <p>currentUser.email: <b>{currentUser?.email}</b></p>
          {orders.filter(o => o.status === "completed").slice(0, 3).map((o, i) => (
            <p key={i}>order[{i}]: user_id=<b>{o.user_id || "null"}</b> | user_email=<b>{o.user_email}</b> | status=<b>{o.status}</b></p>
          ))}
        </div>
      )}
      {deliverables.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {deliverables.map((item, idx) => {
            const isLab211 =
              item.product_category === "lab211" ||
              item.product_title.toLowerCase().includes("lab211");

            return (
              <div
                key={idx}
                className="bg-white rounded-card border border-slate-200/90 p-6 shadow-card hover:shadow-card-hover transition-all space-y-5"
              >
                {/* Deliverable Top */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.product_category}
                      </span>
                      <span className="text-xs text-slate-400">Order ID: {item.order_id}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                      {item.product_title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isLab211 && (
                      <button
                        onClick={() =>
                          setActiveLabModal({
                            isOpen: true,
                            orderId: item.order_id,
                            orderCode: `CV-${item.order_id.slice(0, 8)}`,
                            labCode: "J1.L.P0023",
                          })
                        }
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-95"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Xem Đề Bài Word & Source Code</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(item)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all self-start sm:self-auto active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isLab211 ? "Tải Trọn Gói LAB (.ZIP)" : "Tải Mã Nguồn (.ZIP)"}</span>
                    </button>
                  </div>
                </div>

                {/* SPECIAL LAB211 INTEGRATED VIEWER PREVIEW */}
                {isLab211 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/70 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-black text-blue-900">
                        <Code2 className="w-4 h-4 text-blue-600" />
                        <span>BỘ MÃ NGUỒN LAB211 ĐÃ TỰ ĐỘNG BÓC TÁCH HOÀN TẤT</span>
                      </div>
                      <span className="text-[11px] text-blue-700 font-bold bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200">
                        12 Bài Lab Đầy Đủ (Word .docx + NetBeans Java Ant)
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Hệ thống đã nhận diện toàn bộ đề bài file Word và cây mã nguồn Java. Bạn có thể mở trình đọc trực quan để xem trực tiếp đề bài hoặc duyệt code có highlight cú pháp:
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() =>
                          setActiveLabModal({
                            isOpen: true,
                            orderId: item.order_id,
                            orderCode: `CV-${item.order_id.slice(0, 8)}`,
                            labCode: "J1.L.P0023",
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold shadow-sm transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Đề Bài Mẫu: J1.L.P0023 (Fruit Shop)</span>
                      </button>

                      <button
                        onClick={() =>
                          handleDownloadDocx(
                            item.order_id,
                            "J1.L.P0023",
                            "J1.L.P0023 - FRUIT.docx"
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold shadow-sm transition-all"
                        title="Tải file Word J1.L.P0023 - FRUIT.docx"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tải File Word: J1.L.P0023 - FRUIT.docx</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveLabModal({
                            isOpen: true,
                            orderId: item.order_id,
                            orderCode: `CV-${item.order_id.slice(0, 8)}`,
                            labCode: "J1.S.P0006",
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold shadow-sm transition-all"
                      >
                        <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xem Code J1.S.P0006 (BinarySearch)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Secure Credentials / Repo / License */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.git_repo_url && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Kho lưu trữ Git riêng tư</p>
                          <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                            {item.git_repo_url}
                          </p>
                        </div>
                      </div>
                      <a
                        href={item.git_repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                        title="Mở GitHub Repo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {item.license_key && (
                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-900">Khóa bản quyền (License Key)</p>
                          <p className="text-[11px] text-purple-700 font-mono font-bold">
                            {item.license_key}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(item.license_key!, `lic-${idx}`)}
                        className="p-2 rounded-xl bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Sao chép License Key"
                      >
                        {copiedKey === `lic-${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Hướng Dẫn Cài Đặt & Chạy Mã Nguồn:</span>
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pl-6">
                    {item.instructions}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dashed Empty State Card */
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-card p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Kho tài nguyên chưa có sản phẩm nào
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Quyền truy cập mã nguồn chỉ được mở sau khi bạn đặt mua và Admin đã xác nhận tiền chuyển khoản thành công.
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

      {/* MASTER LAB DELIVERABLE MODAL */}
      {activeLabModal && (
        <LabDeliverableModal
          orderId={activeLabModal.orderId}
          orderCode={activeLabModal.orderCode}
          isOpen={activeLabModal.isOpen}
          defaultLabCode={activeLabModal.labCode}
          onClose={() => setActiveLabModal(null)}
        />
      )}
    </div>
  );
}
