"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { formatDateVN } from "@/lib/vietqr";
import { UserRole, UserProfile } from "@/types";
import {
  Users,
  Search,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Check,
  X,
  AlertCircle,
  Shield,
} from "lucide-react";

export default function AdminUsersPage() {
  const { users, adminResetPassword, adminUpdateRole, currentUser } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserForReset, setSelectedUserForReset] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return u.email.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q);
  });

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset || newPassword.length < 6) return;

    adminResetPassword(selectedUserForReset.id);
    setSuccessMessage(`Đã đặt lại mật khẩu mới cho ${selectedUserForReset.email} thành công!`);
    setSelectedUserForReset(null);
    setNewPassword("");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleToggleRole = (user: UserProfile) => {
    const nextRole: UserRole = user.role === "admin" ? "customer" : "admin";
    adminUpdateRole(user.id, nextRole);
    setSuccessMessage(`Đã cập nhật vai trò của ${user.email} thành ${nextRole}!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Phân Quyền &amp; Tài Khoản</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Người Dùng &amp; Cấp Lại Mật Khẩu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hỗ trợ sinh viên đặt lại mật khẩu và phân quyền quản trị viên (RBAC).
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
          Tổng số: <b className="text-blue-600">{users.length}</b> tài khoản
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-card p-4 border border-slate-200/90 shadow-card flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo email, tên sinh viên..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-card border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Tài Khoản</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Vai Trò (Role)</th>
                <th className="py-3.5 px-4">Ngày Đăng Ký</th>
                <th className="py-3.5 px-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                      alt={user.full_name || "User"}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <p className="font-extrabold text-slate-900">{user.full_name || "Chưa đặt tên"}</p>
                      <p className="text-[10px] text-slate-400">ID: {user.id}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {user.email}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {user.role === "admin" ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {user.role === "admin" ? "Quản Trị Viên (Admin)" : "Khách Hàng"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-slate-400">
                    {formatDateVN(user.created_at)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(user)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-[11px] transition-colors"
                        title="Đổi vai trò"
                      >
                        Đổi Role: {user.role === "admin" ? "Khách" : "Admin"}
                      </button>

                      <button
                        onClick={() => setSelectedUserForReset(user)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors flex items-center gap-1"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        Đặt lại MK
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESET PASSWORD MODAL (Spec 001 US5) */}
      {selectedUserForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-card p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                Cấp Mật Khẩu Mới Cho Người Dùng
              </h3>
              <button onClick={() => setSelectedUserForReset(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Admin đặt mật khẩu mới cho tài khoản <b>{selectedUserForReset.email}</b>. Sau khi lưu, mật khẩu cũ sẽ bị vô hiệu hóa hoàn toàn.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật Khẩu Mới (tối thiểu 6 ký tự)
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForReset(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={newPassword.length < 6}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 disabled:opacity-50"
                >
                  Cập Nhật Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
