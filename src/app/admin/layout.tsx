"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, orders, login } = useStore();
  const [activePath, setActivePath] = useState("/admin");

  const pendingCount = orders.filter((o) => o.status === "pending_approval").length;

  // RBAC Guard: If not admin, provide 1-click switch or sign in
  const isAdmin = currentUser?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#f4f7fc]">
        <div className="max-w-md w-full bg-white rounded-card p-8 border border-slate-200 text-center shadow-card space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">
            Yêu Cầu Quyền Quản Trị Viên (Admin)
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bạn hiện đang ở quyền <b>{currentUser ? currentUser.role : "Khách vãng lai"}</b>. Khu vực này chỉ dành cho Admin quản lý đơn hàng và cấu hình sản phẩm.
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => login("admin@codevault.io", "admin")}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
            >
              Chuyển Sang Tài Khoản Admin (admin@codevault.io)
            </button>
            <a
              href="/"
              className="block w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Quay lại Trang Chủ
            </a>
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
      {/* Sidebar (following design.md) */}
      <aside className="w-64 bg-white border-r border-slate-200/90 hidden lg:flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Logo & Badge */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <a href="/" className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-base tracking-tight">
                CodeVault <span className="text-blue-600">Admin</span>
              </span>
            </a>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 border border-purple-200">
              PRO
            </span>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem Website Khách Hàng</span>
          </a>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile/Tablet Sub-Navigation Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between overflow-x-auto gap-2">
          <a href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
            Dashboard
          </a>
          <a href="/admin/orders" className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 relative">
            Đơn Hàng
            {pendingCount > 0 && (
              <span className="ml-1 px-1 rounded bg-amber-500 text-white text-[9px] font-black">
                {pendingCount}
              </span>
            )}
          </a>
          <a href="/admin/products" className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
            Sản Phẩm
          </a>
          <a href="/admin/users" className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
            Người Dùng
          </a>
        </div>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
