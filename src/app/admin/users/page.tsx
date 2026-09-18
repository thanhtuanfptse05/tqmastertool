"use client";

import React, { useState, useEffect } from "react";
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
  RotateCw,
  Trash2,
  Lock,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function AdminUsersPage() {
  const { users, adminResetPassword, adminUpdateRole, adminDeleteUser, refreshUsers, currentUser } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserForReset, setSelectedUserForReset] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-refresh users from Supabase on mount
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUsers();
      setSuccessMessage("Đã đồng bộ danh sách người dùng mới nhất từ Supabase!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setErrorMessage("Không thể làm mới danh sách người dùng.");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return u.email.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q);
  });

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset || newPassword.length < 6) return;

    setIsResettingPassword(true);
    setResetError(null);

    try {
      await adminResetPassword(selectedUserForReset.id, newPassword);
      setSuccessMessage(`Đã cấp mật khẩu mới thành công cho ${selectedUserForReset.email}!`);
      setSelectedUserForReset(null);
      setNewPassword("");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setResetError(err.message || "Lỗi khi đặt lại mật khẩu người dùng.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleGenerateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "CV@";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const handleToggleRole = async (user: UserProfile) => {
    const nextRole: UserRole = user.role === "admin" ? "customer" : "admin";
    if (user.id === currentUser?.id && nextRole === "customer") {
      alert("Bạn không thể tự hạ cấp tài khoản của chính mình.");
      return;
    }

    setUpdatingUserId(user.id);
    try {
      const ok = await adminUpdateRole(user.id, nextRole);
      if (ok) {
        setSuccessMessage(`Đã chuyển vai trò của ${user.email} thành ${nextRole === "admin" ? "Quản Trị Viên" : "Khách Hàng"}!`);
      } else {
        setErrorMessage(`Không thể đổi vai trò cho ${user.email}.`);
      }
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3500);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (user.id === currentUser?.id) {
      alert("Bạn không thể xóa tài khoản đang đăng nhập.");
      return;
    }

    const confirm = window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn người dùng ${user.email} khỏi hệ thống?`);
    if (!confirm) return;

    setDeletingUserId(user.id);
    try {
      const ok = await adminDeleteUser(user.id);
      if (ok) {
        setSuccessMessage(`Đã xóa tài khoản ${user.email} thành công.`);
      } else {
        setErrorMessage(`Không thể xóa tài khoản ${user.email}.`);
      }
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3500);
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Phân Quyền &amp; Tài Khoản Trực Tuyến</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Người Dùng &amp; Cấp Lại Mật Khẩu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đồng bộ trực tiếp với Supabase Auth &amp; Profiles. Hỗ trợ đặt lại mật khẩu và phân quyền quản trị (RBAC).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Đồng bộ danh sách mới nhất từ Database"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : "text-slate-500"}`} />
            <span>{isRefreshing ? "Đang đồng bộ..." : "Làm Mới"}</span>
          </button>

          <div className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
            Tổng số: <b className="text-blue-600">{users.length}</b> tài khoản
          </div>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
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
            placeholder="Tìm kiếm theo email, tên người dùng..."
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-xs">Không tìm thấy tài khoản người dùng nào</p>
                    <p className="text-[11px] text-slate-400 mt-1">Bấm nút "Làm Mới" phía trên để đồng bộ danh sách từ Supabase.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentUser = user.id === currentUser?.id;
                  const isUpdating = updatingUserId === user.id;
                  const isDeleting = deletingUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                          alt={user.full_name || "User"}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-slate-900">{user.full_name || "Chưa đặt tên"}</p>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800">
                                BẠN
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {user.id.substring(0, 16)}...</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {user.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border shadow-xs ${
                            user.role === "admin"
                              ? "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200 ring-1 ring-purple-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <>
                              <Shield className="w-3.5 h-3.5 text-purple-600" />
                              <span>Quản Trị Viên (Admin)</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                              <span>Khách Hàng</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-400">
                        {formatDateVN(user.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleRole(user)}
                            disabled={isUpdating || isCurrentUser}
                            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1 ${
                              user.role === "admin"
                                ? "border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-800"
                                : "border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-purple-700"
                            }`}
                            title={isCurrentUser ? "Không thể tự đổi vai trò của bạn" : "Đổi vai trò"}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : user.role === "admin" ? (
                              <span>Hạ role: Khách</span>
                            ) : (
                              <span>Nâng role: Admin</span>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUserForReset(user);
                              setNewPassword("");
                              setResetError(null);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors flex items-center gap-1"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Đặt lại MK</span>
                          </button>

                          {!isCurrentUser && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              disabled={isDeleting}
                              className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                              title="Xóa tài khoản"
                            >
                              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESET PASSWORD MODAL */}
      {selectedUserForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-card p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                Cấp Mật Khẩu Mới Cho Người Dùng
              </h3>
              <button
                onClick={() => setSelectedUserForReset(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-500 block text-[11px]">Tài khoản:</span>
              <p className="font-extrabold text-slate-800">{selectedUserForReset.full_name}</p>
              <p className="font-mono text-blue-600">{selectedUserForReset.email}</p>
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Mật Khẩu Mới (tối thiểu 6 ký tự)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Tạo ngẫu nhiên
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới hoặc bấm Tạo ngẫu nhiên..."
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUserForReset(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword || newPassword.length < 6}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu Mật Khẩu Mới</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
