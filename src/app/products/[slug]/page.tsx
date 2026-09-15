"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatVND } from "@/lib/vietqr";
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Check,
  FileCode,
  Play,
  ExternalLink,
  Copy,
  ShieldCheck,
  Code2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { getProductBySlug, openCheckout } = useStore();

  const product = getProductBySlug(slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
        <p className="text-xs text-slate-500 mt-2">Sản phẩm này có thể đã bị gỡ hoặc đổi đường dẫn.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Quay lại Trang Chủ
        </button>
      </div>
    );
  }

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.push("/#catalog")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh mục</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery & Demo (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image */}
          <div className="relative aspect-[16/10] w-full rounded-card overflow-hidden bg-slate-900 border border-slate-200/90 shadow-card">
            <img
              src={gallery[selectedImageIndex] || product.thumbnail_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? "border-blue-600 ring-2 ring-blue-500/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Code Preview Snippet */}
          {demo?.code_preview_snippet && (
            <div className="bg-white rounded-card border border-slate-200/90 p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  Trích Đoạn Mã Nguồn Thực Tế (Snippet):
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Đã copy" : "Copy code"}</span>
                </button>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800 shadow-inner max-h-72">
                <pre>{demo.code_preview_snippet}</pre>
              </div>
            </div>
          )}

          {/* Detailed Description */}
          <div className="bg-white rounded-card border border-slate-200/90 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-black text-slate-900">Mô Tả Chi Tiết</h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {product.detailed_description}
            </div>
          </div>
        </div>

        {/* Right: Buy Card & Meta (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-card border border-slate-200/90 p-6 shadow-card space-y-5">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                {product.category}
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
                {product.title}
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {product.short_description}
              </p>
            </div>

            {/* Price */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Giá trọn gói:</span>
                <span className="text-2xl font-black text-blue-600">
                  {formatVND(product.price)}
                </span>
              </div>
              {product.original_price && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through block">
                    {formatVND(product.original_price)}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">Tiết kiệm 40%</span>
                </div>
              )}
            </div>

            {/* Buy CTA */}
            <button
              onClick={() => openCheckout(product)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đặt Mua Ngay (VietQR)</span>
            </button>

            {/* Live Demo / Video Buttons if available */}
            {demo?.live_demo_url && (
              <a
                href={demo.live_demo_url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                <span>Xem Website Demo Thực Tế</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Features Checklist */}
            {demo?.features_list && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-slate-900 block">
                  Đặc quyền khi mua:
                </span>
                {demo.features_list.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Mở khóa mã nguồn ngay sau khi Admin duyệt</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Hỗ trợ hỏi đáp cài đặt qua Zalo / Discord</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
