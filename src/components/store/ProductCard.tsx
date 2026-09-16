"use client";

import React from "react";
import { Product } from "@/types";
import { formatVND } from "@/lib/vietqr";
import { useStore } from "@/lib/store";
import { ShoppingBag, Eye, Code, Layers, Wrench, CheckCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelectDetail: (product: Product) => void;
}

export default function ProductCard({ product, onSelectDetail }: ProductCardProps) {
  const { openCheckout, orders, currentUser } = useStore();

  // Check if current user already owns this product
  const isPurchased = orders.some(
    (o) =>
      o.user_id === currentUser?.id &&
      o.status === "completed" &&
      o.items?.some((item) => item.product_id === product.id)
  );

  const getCategoryBadge = () => {
    switch (product.category) {
      case "lab211":
        return {
          label: "LAB211 OOP",
          icon: Code,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "project":
        return {
          label: "Project & Assignment",
          icon: Layers,
          className: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "tool":
      default:
        return {
          label: "Tiện Ích Tool",
          icon: Wrench,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
  };

  const badge = getCategoryBadge();
  const IconComponent = badge.icon;

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-card border border-slate-200/90 hover:border-blue-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Section */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md bg-white/90 shadow-sm ${badge.className}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {badge.label}
          </span>
        </div>

        {/* Status / Discount Badge */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {isPurchased ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-md">
              <CheckCircle className="w-3.5 h-3.5" />
              Đã sở hữu
            </span>
          ) : discountPercent > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-sm">
              -{discountPercent}%
            </span>
          ) : null}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelectDetail(product)}
            className="text-base font-extrabold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {product.short_description}
          </p>

          {/* Tech stack tags */}
          {product.demo?.tech_stack_tags && product.demo.tech_stack_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.demo.tech_stack_tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                >
                  {tag}
                </span>
              ))}
              {product.demo.tech_stack_tags.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px]">
                  +{product.demo.tech_stack_tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer / Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-blue-600">
                {formatVND(product.price)}
              </span>
              {product.original_price && (
                <span className="text-[11px] text-slate-400 line-through">
                  {formatVND(product.original_price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Sở hữu vĩnh viễn
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectDetail(product)}
              className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
              title="Xem chi tiết & Demo"
            >
              <Eye className="w-4 h-4" />
            </button>

            {isPurchased ? (
              <a
                href="/customer/vault"
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
              >
                Vào kho tải
              </a>
            ) : (
              <button
                onClick={() => openCheckout(product)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Mua ngay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
