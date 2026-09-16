"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { formatVND, formatDateVN } from "@/lib/vietqr";
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Eye,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { orders, products, users } = useStore();
  const [chartTimeframe, setChartTimeframe] = useState<"7d" | "30d" | "3m">("30d");

  // Metrics Calculation
  const completedOrders = orders.filter((o) => o.status === "completed");
  const pendingOrders = orders.filter((o) => o.status === "pending_approval");

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  const totalUsersCount = users.length;

  // Category sales distribution
  const categorySales = {
    lab211: 0,
    project: 0,
    tool: 0,
  };

  completedOrders.forEach((o) => {
    o.items?.forEach((item) => {
      if (categorySales[item.product_category] !== undefined) {
        categorySales[item.product_category] += item.unit_price;
      }
    });
  });

  const totalCatSum = categorySales.lab211 + categorySales.project + categorySales.tool || 1;
  const catPercentages = [
    { label: "LAB211 OOP", value: Math.round((categorySales.lab211 / totalCatSum) * 100) || 45, color: "#2563eb" },
    { label: "Project & Assignment", value: Math.round((categorySales.project / totalCatSum) * 100) || 35, color: "#8b5cf6" },
    { label: "Tiện Ích Tool", value: Math.round((categorySales.tool / totalCatSum) * 100) || 20, color: "#10b981" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Thống Kê Doanh Thu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng quan tài chính, số lượng giao dịch VietQR và danh sách đơn hàng cần phê duyệt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/admin/orders"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Xử Lý Đơn Hàng</span>
            {pendingOrders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-blue-600 text-[10px] font-black">
                {pendingOrders.length}
              </span>
            )}
          </a>
        </div>
      </div>

      {/* PENDING APPROVAL ALERT BANNER (High Priority Alert) */}
      {pendingOrders.length > 0 && (
        <div className="p-4 rounded-card bg-amber-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-900">
                Có {pendingOrders.length} đơn hàng đang chờ Admin kiểm tra bill và duyệt!
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Khách hàng đã chuyển khoản và gửi ảnh biên lai. Hãy đối chiếu số dư để mở kho tài nguyên.
              </p>
            </div>
          </div>

          <a
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto shrink-0"
          >
            <span>Duyệt Đơn Ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* 4 PASTEL STAT CARDS (Strictly conforming to design.md) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Doanh Thu (Blue) */}
        <div
          style={{ background: "#edf5ff", borderColor: "#dbeafe" }}
          className="rounded-card p-6 border shadow-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: "#3b82f6" }} className="text-xs font-bold tracking-wide uppercase">
              Tổng Doanh Thu
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-500 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatVND(totalRevenue)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +18.4%
              </span>{" "}
              so với tuần trước
            </p>
          </div>
        </div>

        {/* 2. Đơn Hàng (Purple) */}
        <div
          style={{ background: "#f3eefd", borderColor: "#ede9fe" }}
          className="rounded-card p-6 border shadow-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: "#8b5cf6" }} className="text-xs font-bold tracking-wide uppercase">
              Tổng Đơn Hàng
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {totalOrdersCount} đơn
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              <b className="text-purple-700">{completedOrders.length}</b> đơn hoàn thành • <b className="text-amber-600">{pendingOrders.length}</b> chờ duyệt
            </p>
          </div>
        </div>

        {/* 3. Giá Trị TB (Teal) */}
        <div
          style={{ background: "#eafaf5", borderColor: "#d1fae5" }}
          className="rounded-card p-6 border shadow-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: "#059669" }} className="text-xs font-bold tracking-wide uppercase">
              Giá Trị Đơn TB
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-500 flex items-center justify-center shadow-sm">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatVND(avgOrderValue)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Tính trên các đơn đã thanh toán
            </p>
          </div>
        </div>

        {/* 4. Khách Hàng (Amber) */}
        <div
          style={{ background: "#fff7ed", borderColor: "#ffedd5" }}
          className="rounded-card p-6 border shadow-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span style={{ color: "#d97706" }} className="text-xs font-bold tracking-wide uppercase">
              Sinh Viên &amp; Khách Hàng
            </span>
            <div className="w-8 h-8 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {totalUsersCount} users
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Tài khoản hoạt động trên hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION (Conforming to design.md Section 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart: Revenue Trend */}
        <div className="lg:col-span-8 bg-white rounded-card border border-slate-200/90 p-6 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Xu Hướng Doanh Thu (Area Chart)
              </h3>
              <p className="text-[11px] text-slate-400">Doanh thu thu về từ các đơn VietQR hoàn tất</p>
            </div>

            {/* Pill Filters */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setChartTimeframe("7d")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  chartTimeframe === "7d" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                7 ngày
              </button>
              <button
                onClick={() => setChartTimeframe("30d")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  chartTimeframe === "30d" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                30 ngày
              </button>
              <button
                onClick={() => setChartTimeframe("3m")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  chartTimeframe === "3m" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                3 tháng
              </button>
            </div>
          </div>

          {/* SVG Area Chart matching design.md rules */}
          <div className="relative w-full h-56 pt-4">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="600" y2="190" stroke="#e2e8f0" strokeWidth="1" />

              {/* Area Fill */}
              <path
                d="M 0 160 Q 100 140 200 90 T 400 60 T 600 30 L 600 190 L 0 190 Z"
                fill="url(#revenueGradient)"
              />

              {/* Line Stroke */}
              <path
                d="M 0 160 Q 100 140 200 90 T 400 60 T 600 30"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="200" cy="90" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="400" cy="60" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="600" cy="30" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
              <span>01 Th3</span>
              <span>08 Th3</span>
              <span>15 Th3</span>
              <span>22 Th3</span>
              <span>Hôm nay</span>
            </div>
          </div>
        </div>

        {/* Donut Chart: Category Breakdown (5 colors matching design.md) */}
        <div className="lg:col-span-4 bg-white rounded-card border border-slate-200/90 p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Cơ Cấu Danh Mục (Donut Chart)
            </h3>
            <p className="text-[11px] text-slate-400">Tỉ trọng doanh số theo loại sản phẩm</p>
          </div>

          <div className="py-4 flex items-center justify-center">
            {/* SVG Donut */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Segment 1: LAB211 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="16"
                  strokeDasharray="105 150"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Projects */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="16"
                  strokeDasharray="80 150"
                  strokeDashoffset="-105"
                />
                {/* Segment 3: Tools */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray="54 150"
                  strokeDashoffset="-185"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400">Top 1</span>
                <span className="text-sm font-black text-slate-900">LAB211</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
            {catPercentages.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.label}</span>
                </div>
                <span className="font-extrabold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-card border border-slate-200/90 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">Đơn Hàng Gần Đây</h3>
            <p className="text-[11px] text-slate-400">Các giao dịch phát sinh trên hệ thống</p>
          </div>
          <a
            href="/admin/orders"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Xem tất cả ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Mã Đơn</th>
                <th className="py-3 px-3">Khách Hàng</th>
                <th className="py-3 px-3">Sản Phẩm</th>
                <th className="py-3 px-3">Tổng Tiền</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3">Thời Gian</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-600">
                    {order.order_code}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-800">{order.user_name || "Khách Hàng"}</p>
                    <p className="text-[10px] text-slate-400">{order.user_email}</p>
                  </td>
                  <td className="py-3.5 px-3 max-w-[200px] truncate text-slate-700">
                    {order.items?.[0]?.product_title || "Sản phẩm số"}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    {formatVND(order.total_amount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        order.status === "completed"
                          ? "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]"
                          : order.status === "pending_approval"
                          ? "bg-[#fef3c7] text-[#b45309] border-[#fde68a] animate-pulse"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Đã duyệt"
                        : order.status === "pending_approval"
                        ? "Chờ duyệt"
                        : "Chờ thanh toán"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-slate-400">
                    {formatDateVN(order.created_at)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <a
                      href="/admin/orders"
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 inline-block text-slate-600"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
