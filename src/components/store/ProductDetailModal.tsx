"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { formatVND } from "@/lib/vietqr";
import { useStore } from "@/lib/store";
import {
  X,
  ExternalLink,
  Play,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  Sparkles,
  Layers,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { openCheckout } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "code" | "demo">("overview");

  if (!product) return null;

  const demo = product.demo;
  const gallery = demo?.gallery_images && demo.gallery_images.length > 0
    ? demo.gallery_images
    : [product.thumbnail_url];

  const handleCopyCode = () => {
    if (!demo?.code_preview_snippet) return;
    navigator.clipboard.writeText(demo.code_preview_snippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-card shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700 border border-blue-200">
              {product.category}
            </span>
            <span className="text-xs text-slate-400">ID: {product.slug}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Section: Title & Price */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {product.short_description}
              </p>
            </div>

            <div className="shrink-0 text-left md:text-right">
              <div className="text-2xl font-black text-blue-600">
                {formatVND(product.price)}
              </div>
              {product.original_price && (
                <div className="text-xs text-slate-400 line-through">
                  Giá niêm yết: {formatVND(product.original_price)}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tổng Quan & Gallery
            </button>
            {demo?.code_preview_snippet && (
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "code"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                Mã Nguồn Mẫu (Snippet)
              </button>
            )}
            {(demo?.live_demo_url || demo?.video_demo_url) && (
              <button
                onClick={() => setActiveTab("demo")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "demo"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Live Demo & Video
              </button>
            )}
          </div>

          {/* TAB 1: OVERVIEW & GALLERY */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Image Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img
                    src={gallery[selectedImageIndex] || product.thumbnail_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {gallery.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImageIndex === idx
                            ? "border-blue-600 ring-2 ring-blue-500/20"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Features & Deliverables Checklist */}
              {demo?.features_list && demo.features_list.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Gói tài nguyên bao gồm
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {demo.features_list.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Description */}
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <p className="whitespace-pre-line text-xs">{product.detailed_description}</p>
              </div>

              {/* Tech Stack Tags */}
              {demo?.tech_stack_tags && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Công nghệ sử dụng:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {demo.tech_stack_tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CODE PREVIEW */}
          {activeTab === "code" && demo?.code_preview_snippet && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Trích đoạn mã nguồn thực tế:</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800 shadow-inner max-h-[380px]">
                <pre>{demo.code_preview_snippet}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: DEMO & VIDEO */}
          {activeTab === "demo" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {demo?.live_demo_url && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Website Demo Thực Tế</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{demo.live_demo_url}</p>
                    {demo.demo_credentials && (
                      <p className="text-[11px] text-blue-600 font-semibold mt-1">
                        {demo.demo_credentials}
                      </p>
                    )}
                  </div>
                  <a
                    href={demo.live_demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Mở Demo
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {demo?.video_demo_url && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-rose-500" />
                    Video Hướng Dẫn & Review:
                  </h4>
                  <div className="aspect-[16/9] w-full rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 text-xs">
                    <a
                      href={demo.video_demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 text-rose-500" />
                      Xem Video Review trên YouTube
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Modal Footer CTA */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Thanh toán VietQR Napas • Mở kho sau khi duyệt</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                openCheckout(product);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/30 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              Đặt Mua Ngay ({formatVND(product.price)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
