"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
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

// Lazy load Three.js Canvas to optimize FCP and prevent SSR WebGL mismatch
const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] md:h-[540px] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-600 animate-spin" />
    </div>
  ),
});

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
      {/* 1. HERO SECTION WITH THREE.JS 3D CANVAS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0b12] via-[#0f1222] to-[#f4f7fc] text-white pt-12 pb-20">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Highlight Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-bold backdrop-blur-md shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Kho Mã Nguồn Số 1 Cho Sinh Viên IT & Kỹ Sư</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Mã Nguồn Đồ Án, Tools &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                  Full 74 Bài LAB211
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Tối ưu 80% thời gian lập trình với các bộ đồ án tốt nghiệp chuẩn Clean Architecture, trọn gói tiện ích automation và trọn bộ mã nguồn Java OOP đạt điểm tuyệt đối.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#catalog"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/35 transition-all active:scale-95"
                >
                  <span>Khám Phá Sản Phẩm</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/customer/vault"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-colors"
                >
                  <span>Kho Tài Nguyên Của Tôi</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-3 text-left border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-lg sm:text-xl font-black text-blue-400">74+ Bài</p>
                  <p className="text-[11px] text-slate-400">LAB211 Chuẩn OOP</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-cyan-400">Napas 24/7</p>
                  <p className="text-[11px] text-slate-400">VietQR Tự Động</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-emerald-400">100% Clean</p>
                  <p className="text-[11px] text-slate-400">Admin Duyệt Uy Tín</p>
                </div>
              </div>
            </div>

            {/* Hero Right: 3D THREE.JS CANVAS */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <HeroCanvas />

              {/* Floating Cyber Badge 1 */}
              <div className="absolute top-10 right-4 sm:right-10 bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-3 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 animate-bounce duration-1000">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Full Stack Java &amp; Next.js</p>
                  <p className="text-[10px] text-slate-400">Clean MVC Pattern</p>
                </div>
              </div>

              {/* Floating Cyber Badge 2 */}
              <div className="absolute bottom-8 left-4 sm:left-8 bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 p-3 rounded-2xl shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Bảo Vệ Bản Quyền</p>
                  <p className="text-[10px] text-slate-400">Signed URL Tải Mã Nguồn</p>
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
                Đồ Án Project
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
          /* Dashed Empty State Card (matching design.md) */
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-card p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
              Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút đặt lại bộ lọc để xem toàn bộ danh mục sản phẩm.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại tất cả bộ lọc
            </button>
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
