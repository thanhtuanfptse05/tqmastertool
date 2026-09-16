"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ShieldAlert,
  ArrowLeft,
  Bell,
  Search,
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAuthLoading, orders, openAuthModal, login } = useStore();
  const pathname = usePathname();

  const pendingCount = orders.filter((o) => o.status === "pending_approval").length;

  // 1. Loading State during Hydration & Supabase Session Check
  if (isAuthLoading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 bg-[#f4f7fc]">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-card shadow-card border border-slate-200/80 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">Đang Xác Thực Quyền Quản Trị</h3>
            <p className="text-xs text-slate-500">Đang kiểm tra thông tin phiên làm việc từ Supabase...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. RBAC Guard: If not admin, provide 1-click login or manual login
  const isAdmin = currentUser?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#f4f7fc]">
        <div className="max-w-md w-full bg-white rounded-card p-8 border border-slate-200 text-center shadow-card space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">
            Yêu Cầu Quyền Quản Trị Viên (Admin)
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bạn hiện đang ở quyền <b>{currentUser ? currentUser.role : "Khách vãng lai"}</b>. Khu vực này chỉ dành cho Admin quản lý đơn hàng và cấu hình sản phẩm.
          </p>
          <div className="pt-2 space-y-2.5">
            {/* Quick 1-click admin login */}
            <button
              onClick={() => login("admin@gmail.com", "tuan0112")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Đăng Nhập Nhanh Admin (admin@gmail.com)</span>
            </button>

            <button
              onClick={() => openAuthModal("login")}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
            >
              Đăng Nhập Bằng Tài Khoản Khác
            </button>

            <Link
              href="/"
              className="block w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Quay lại Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Dashboard Thống Kê",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Quản Lý Đơn Hàng",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: pendingCount > 0 ? `${pendingCount} chờ duyệt` : null,
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    },
    {
      label: "Quản Lý Sản Phẩm",
      href: "/admin/products",
      icon: Package,
      badge: null,
    },
    {
      label: "Quản Lý Người Dùng",
      href: "/admin/users",
      icon: Users,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/90 hidden lg:flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Logo & Badge */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-black text-slate-900 text-base tracking-tight group-hover:text-blue-600 transition-colors">
                CodeVault <span className="text-blue-600">Admin</span>
              </span>
            </Link>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 border border-purple-200">
              PRO
            </span>
          </div>

          {/* Navigation Links with Active State Highlighting */}
          <div className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isActive
                            ? "bg-white/20 text-white border-white/30"
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem Website Khách Hàng</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile/Tablet Sub-Navigation Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between overflow-x-auto gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label.replace("Quản Lý ", "").replace(" Thống Kê", "")}
                {item.href === "/admin/orders" && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
