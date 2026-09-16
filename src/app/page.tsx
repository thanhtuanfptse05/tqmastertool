"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Product, ProductCategory } from "@/types";
import ProductCard from "@/components/store/ProductCard";
import ProductDetailModal from "@/components/store/ProductDetailModal";
import {
  Sparkles,
  Search,
  ArrowRight,
  Code2,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Wrench,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  const { products } = useStore();

  // Selected product for Detail / Rich Demo modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.status === "published");

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.demo?.tech_stack_tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen">
      {/* 1. CINEMATIC LIGHT 3D HERO SECTION (JAPANESE EDITORIAL MINIMALISM) */}
      <section className="relative overflow-hidden bg-[#fafbfc] border-b border-slate-200/80 pt-10 sm:pt-14 pb-16 lg:pb-24">
        {/* Background 3D Cinematic Render (Wide 16:9 Japanese Editorial Workspace) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/images/hero-banner.jpg"
            alt="CodeVault Studio 3D Developer Workspace"
            className="w-full h-full object-cover object-center lg:object-right opacity-95 transition-transform duration-1000"
          />
          {/* Subtle soft architectural gradient masks for maximum text legibility & seamless edge blending */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafbfc] via-[#fafbfc]/90 to-transparent lg:w-[58%]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fafbfc] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content: Premium Editorial Typography */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left pt-2 lg:pt-6">
              {/* Highlight Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-blue-800 text-xs font-bold backdrop-blur-md shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span className="tracking-wide">Kho Mã Nguồn Số 1 Cho Sinh Viên IT &amp; Kỹ Sư</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12] text-slate-900">
                Code PROJECT, Tools &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">
                  Code LAB211
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Tối ưu 80% thời gian lập trình với các bộ đồ án tốt nghiệp chuẩn Clean Architecture, trọn gói tiện ích automation và trọn bộ mã nguồn Java OOP đạt điểm tuyệt đối.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#catalog"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                >
                  <span>Khám Phá Sản Phẩm</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/customer/vault"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/85 hover:bg-white text-slate-700 font-bold text-sm backdrop-blur-md border border-slate-200/90 shadow-sm transition-all hover:shadow"
                >
                  <span>Kho Tài Nguyên Của Tôi</span>
                </a>
              </div>

              {/* Trust Badges - Light Minimalist Design */}
              <div className="pt-6 grid grid-cols-3 gap-4 text-left border-t border-slate-200/70 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">74+ Bài</p>
                  <p className="text-xs text-slate-500 font-medium">LAB211 Chuẩn OOP</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-blue-600">Napas 24/7</p>
                  <p className="text-xs text-slate-500 font-medium">VietQR Tự Động</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600">100% Clean</p>
                  <p className="text-xs text-slate-500 font-medium">Admin Duyệt Uy Tín</p>
                </div>
              </div>
            </div>

            {/* Hero Right: Interactive Floating Glass Cards on 3D Environment */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[420px]">
              {/* Mobile/Tablet image showcase card */}
              <div className="block lg:hidden w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 mb-4 bg-white/70 backdrop-blur-md">
                <img
                  src="/images/hero-banner.jpg"
                  alt="3D Developer Space"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Glassmorphism Badge 1 (Top Right) */}
              <div className="lg:absolute lg:top-4 lg:right-0 bg-white/90 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-xl shadow-slate-900/5 flex items-center gap-3 w-full max-w-[280px] lg:max-w-xs transition-transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 shadow-inner">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Full Stack Java &amp; Next.js</p>
                  <p className="text-[11px] text-slate-500 font-medium">Clean MVC &amp; Microservices</p>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 2 (Bottom Left / Right) */}
              <div className="lg:absolute lg:bottom-4 lg:left-4 bg-white/90 backdrop-blur-xl border border-white/80 p-3.5 rounded-2xl shadow-xl shadow-slate-900/5 flex items-center gap-3 w-full max-w-[280px] lg:max-w-xs transition-transform hover:-translate-y-1 duration-300 mt-3 lg:mt-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Bảo Vệ Tài Nguyên Số</p>
                  <p className="text-[11px] text-slate-500 font-medium">Signed URL Tải Mã Nguồn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS WORKFLOW */}
      <section className="py-10 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                01
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Chọn Mã Nguồn</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Duyệt và xem demo trực tiếp, review video &amp; code mẫu</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-xs shrink-0">
                02
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Quét Mã VietQR</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Tự động điền số tiền và mã đơn hàng, không lo nhầm lẫn</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs shrink-0">
                03
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Admin Duyệt Đơn</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Upload ảnh bill, quản trị viên đối chiếu và duyệt trong 3-10 phút</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                04
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Mở Khóa Tải Về</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Vào Kho tài nguyên tải file ZIP, xem hướng dẫn và tài liệu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG (Spec 002) */}
      <section id="catalog" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
              <Code2 className="w-4 h-4" />
              <span>Danh Mục Sản Phẩm Số</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Khám Phá &amp; Đặt Mua Tài Nguyên
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tất cả sản phẩm đều đã được kiểm duyệt mã nguồn, không chứa mã độc, có tài liệu hướng dẫn đầy đủ.
            </p>
          </div>

          {/* Quick Count */}
          <div className="text-xs font-bold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start md:self-auto shadow-sm">
            Hiển thị <span className="text-blue-600 font-extrabold">{filteredProducts.length}</span> sản phẩm
          </div>
        </div>

        {/* Filters Bar (Pills & Search - Conforming to design.md) */}
        <div className="bg-white p-4 rounded-card border border-slate-200/80 shadow-card mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Tất Cả ({products.filter((p) => p.status === "published").length})
              </button>
              <button
                onClick={() => setSelectedCategory("lab211")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === "lab211"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                LAB211 OOP Java
              </button>
              <button
                onClick={() => setSelectedCategory("project")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === "project"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Project & Assignment
              </button>
              <button
                onClick={() => setSelectedCategory("tool")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === "tool"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                Tiện Ích Tool
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên bài, môn học, công nghệ (Java, Spring, Next.js)..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline font-semibold">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="featured">Nổi bật nhất</option>
                <option value="newest">Mới cập nhật</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. PRODUCTS GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectDetail={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-card p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {products.length === 0 ? "Chưa có sản phẩm nào trong cơ sở dữ liệu" : "Không tìm thấy sản phẩm phù hợp"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
              {products.length === 0
                ? "Hệ thống đã sẵn sàng kết nối Database. Bạn có thể thêm sản phẩm trực tiếp vào Supabase hoặc qua trang Admin."
                : "Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút đặt lại bộ lọc để xem toàn bộ danh mục sản phẩm."}
            </p>
            {products.length > 0 && (
              <button
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Đặt lại tất cả bộ lọc
              </button>
            )}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
