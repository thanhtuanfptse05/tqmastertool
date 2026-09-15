"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { X, Mail, Lock, User, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
  } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Mật khẩu phải có tối thiểu 6 ký tự.");
      return;
    }

    if (authModalMode === "register") {
      const success = register(email, fullName);
      if (!success) {
        setError("Email này đã tồn tại trong hệ thống. Vui lòng đăng nhập.");
        return;
      }
    } else {
      login(email);
    }
  };

  const handleQuickDemoLogin = (role: "admin" | "customer") => {
    if (role === "admin") {
      login("admin@codevault.io", "admin");
    } else {
      login("tuan.se05@fpt.edu.vn", "customer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-card shadow-2xl border border-slate-200/80 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {authModalMode === "login" ? "Đăng Nhập Tài Khoản" : "Tạo Tài Khoản Mới"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {authModalMode === "login"
              ? "Truy cập kho mã nguồn và lịch sử đơn hàng của bạn"
              : "Kích hoạt ngay lập tức — Không cần xác nhận email phức tạp"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và Tên
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Địa Chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật Khẩu (tối thiểu 6 ký tự)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-[0.99] mt-2"
          >
            {authModalMode === "login" ? "Đăng Nhập Ngay" : "Kích Hoạt Tài Khoản"}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-4 text-center text-xs text-slate-500">
          {authModalMode === "login" ? (
            <span>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  openAuthModal("register");
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Đăng ký ngay
              </button>
            </span>
          ) : (
            <span>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  openAuthModal("login");
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Đăng nhập
              </button>
            </span>
          )}
        </div>

        {/* Quick Demo Login Bar for Testing (Spec 001 reviewer helper) */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider mb-2">
            Đăng nhập nhanh để trải nghiệm
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("admin")}
              className="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Role Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("customer")}
              className="px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Role Khách Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
