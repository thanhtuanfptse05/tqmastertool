"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Code2,
  Package,
  ShieldAlert,
  User,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  KeyRound,
} from "lucide-react";

export default function TopNav() {
  const { currentUser, logout, openAuthModal, orders } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Count active/pending orders for current user
  const userPendingCount = currentUser
    ? orders.filter(
        (o) => o.user_id === currentUser.id && o.status === "pending_approval"
      ).length
    : 0;

  const userCompletedCount = currentUser
    ? orders.filter(
        (o) => o.user_id === currentUser.id && o.status === "completed"
      ).length
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
              CodeVault <span className="text-blue-600 font-black">Studio</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
              Tools • Projects • LAB211
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            Trang Chủ
          </a>
          <a
            href="/#catalog"
            className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            Kho Sản Phẩm
          </a>
          <a
            href="/customer/orders"
            className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors relative"
          >
            Đơn Hàng
            {userPendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {userPendingCount} chờ duyệt
              </span>
            )}
          </a>
          <a
            href="/customer/vault"
            className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors relative"
          >
            Tài Nguyên Số (Vault)
            {userCompletedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {userCompletedCount}
              </span>
            )}
          </a>
        </nav>

        {/* User / Actions */}
        <div className="flex items-center gap-2.5">
          {currentUser?.role === "admin" && (
            <a
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:brightness-110 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Portal
            </a>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all text-left"
              >
                <img
                  src={currentUser.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                  alt={currentUser.full_name || "User"}
                  className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.full_name}
                  </p>
                  <p className="text-[10px] font-semibold text-blue-600 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentUser.role === "admin"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}>
                      Vai trò: {currentUser.role === "admin" ? "Quản Trị Viên (Admin)" : "Khách Hàng (Customer)"}
                    </span>
                  </div>

                  <a
                    href="/customer/orders"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    Đơn hàng đã đặt
                  </a>
                  <a
                    href="/customer/vault"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    Kho tài nguyên đã mua
                  </a>

                  {currentUser.role === "admin" && (
                    <a
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Vào Admin Dashboard
                    </a>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Đăng Ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
