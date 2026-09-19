"use client";

import React, { useState, useMemo } from "react";
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
  ArrowUpRight,
  Eye,
  CalendarDays,
  CalendarRange,
  Calendar,
} from "lucide-react";

type ChartTimeframe = "day" | "month" | "year";

/** Group completed orders by a given timeframe bucket */
function groupOrdersByTimeframe(
  orders: Array<{ total_amount: number; created_at: string }>,
  timeframe: ChartTimeframe
): Array<{ label: string; value: number }> {
  const now = new Date();
  const map = new Map<string, number>();

  if (timeframe === "day") {
    // Last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      map.set(key, 0);
    }
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diff >= 0 && diff <= 29) {
        const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        map.set(key, (map.get(key) || 0) + o.total_amount);
      }
    });
  } else if (timeframe === "month") {
    // Last 12 months
    const monthNames = ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`;
      map.set(key, 0);
    }
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff <= 11) {
        const key = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`;
        map.set(key, (map.get(key) || 0) + o.total_amount);
      }
    });
  } else {
    // Last 5 years
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      map.set(String(year), 0);
    }
    orders.forEach((o) => {
      const year = new Date(o.created_at).getFullYear();
      const diff = now.getFullYear() - year;
      if (diff >= 0 && diff <= 4) {
        const key = String(year);
        map.set(key, (map.get(key) || 0) + o.total_amount);
      }
    });
  }

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

/** Thin out labels to avoid crowding (show every Nth label) */
function thinLabels(labels: string[], maxVisible: number): (string | null)[] {
  if (labels.length <= maxVisible) return labels;
  const step = Math.ceil(labels.length / maxVisible);
  return labels.map((l, i) => (i % step === 0 || i === labels.length - 1 ? l : null));
}

export default function AdminDashboardPage() {
  const { orders, products, users, refreshOrders, refreshProducts, refreshUsers } = useStore();
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>("day");

  // Luôn đồng bộ 100% dữ liệu mới nhất từ Database khi Admin vào Dashboard (Spec 015)
  React.useEffect(() => {
    refreshOrders();
    refreshProducts();
    refreshUsers();
  }, [refreshOrders, refreshProducts, refreshUsers]);

  // ── Metrics from real data ──────────────────────────────────────────────
  const completedOrders = orders.filter((o) => o.status === "completed");
  const pendingOrders = orders.filter((o) => o.status === "pending_approval");

  const userMap = useMemo(() => {
    const map = new Map<string, { full_name?: string; email?: string }>();
    (users || []).forEach((u) => {
      if (u.id) map.set(u.id, { full_name: u.full_name, email: u.email });
    });
    return map;
  }, [users]);

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  const totalUsersCount = users.length;

  // Category breakdown from real orders
  const categorySales = { lab211: 0, project: 0, tool: 0 };
  completedOrders.forEach((o) => {
    o.items?.forEach((item) => {
      const cat = item.product_category as keyof typeof categorySales;
      if (cat in categorySales) categorySales[cat] += item.unit_price;
    });
  });

  const totalCatSum = categorySales.lab211 + categorySales.project + categorySales.tool || 1;
  const catPercentages = [
    { label: "LAB211 OOP", pct: Math.round((categorySales.lab211 / totalCatSum) * 100), color: "#2563eb" },
    { label: "Project & Assignment", pct: Math.round((categorySales.project / totalCatSum) * 100), color: "#8b5cf6" },
    { label: "Tiện Ích Tool", pct: Math.round((categorySales.tool / totalCatSum) * 100), color: "#10b981" },
  ];

  // ── Chart data from real orders ─────────────────────────────────────────
  const chartPoints = useMemo(
    () => groupOrdersByTimeframe(completedOrders, chartTimeframe),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orders, chartTimeframe]
  );

  const maxVal = Math.max(...chartPoints.map((p) => p.value), 1);
  const SVG_W = 600;
  const SVG_H = 180;
  const PAD_L = 4;
  const PAD_R = 4;
  const PAD_T = 10;
  const PAD_B = 10;

  const plotW = SVG_W - PAD_L - PAD_R;
  const plotH = SVG_H - PAD_T - PAD_B;

  const coords = chartPoints.map((p, i) => ({
    x: PAD_L + (i / Math.max(chartPoints.length - 1, 1)) * plotW,
    y: PAD_T + plotH - (p.value / maxVal) * plotH,
    label: p.label,
    value: p.value,
  }));

  // SVG polyline path
  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x} ${PAD_T + plotH} L ${coords[0].x} ${PAD_T + plotH} Z`
    : "";

  // X-axis: show only a few labels
  const visibleLabels = thinLabels(
    coords.map((c) => c.label),
    chartTimeframe === "day" ? 7 : chartTimeframe === "month" ? 6 : 5
  );

  // Donut chart — compute real strokeDasharray per segment
  const CIRC = 2 * Math.PI * 38; // circumference for r=38
  let donutOffset = 0;
  const donutSegments = catPercentages.map((cat) => {
    const dash = (cat.pct / 100) * CIRC;
    const gap = CIRC - dash;
    const seg = { ...cat, dash, gap, offset: -donutOffset };
    donutOffset += dash;
    return seg;
  });

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

      {/* PENDING APPROVAL ALERT */}
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

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Doanh Thu */}
        <div style={{ background: "#edf5ff", borderColor: "#dbeafe" }} className="rounded-card p-6 border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span style={{ color: "#3b82f6" }} className="text-xs font-bold tracking-wide uppercase">Tổng Doanh Thu</span>
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-500 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formatVND(totalRevenue)}</h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-0.5" /> {completedOrders.length} đơn hoàn thành
              </span>
            </p>
          </div>
        </div>

        {/* 2. Đơn Hàng */}
        <div style={{ background: "#f3eefd", borderColor: "#ede9fe" }} className="rounded-card p-6 border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span style={{ color: "#8b5cf6" }} className="text-xs font-bold tracking-wide uppercase">Tổng Đơn Hàng</span>
            <div className="w-8 h-8 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{totalOrdersCount} đơn</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              <b className="text-purple-700">{completedOrders.length}</b> hoàn thành •{" "}
              <b className="text-amber-600">{pendingOrders.length}</b> chờ duyệt
            </p>
          </div>
        </div>

        {/* 3. Giá Trị TB */}
        <div style={{ background: "#eafaf5", borderColor: "#d1fae5" }} className="rounded-card p-6 border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span style={{ color: "#059669" }} className="text-xs font-bold tracking-wide uppercase">Giá Trị Đơn TB</span>
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-500 flex items-center justify-center shadow-sm">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formatVND(avgOrderValue)}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Tính trên các đơn đã thanh toán</p>
          </div>
        </div>

        {/* 4. Khách Hàng */}
        <div style={{ background: "#fff7ed", borderColor: "#ffedd5" }} className="rounded-card p-6 border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span style={{ color: "#d97706" }} className="text-xs font-bold tracking-wide uppercase">Sinh Viên & Khách Hàng</span>
            <div className="w-8 h-8 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{totalUsersCount} users</h3>
            <p className="text-[11px] text-slate-500 mt-1">Tài khoản hoạt động trên hệ thống</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart: Revenue Trend — REAL DATA */}
        <div className="lg:col-span-8 bg-white rounded-card border border-slate-200/90 p-6 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Xu Hướng Doanh Thu</h3>
              <p className="text-[11px] text-slate-400">Doanh thu thu về từ các đơn VietQR hoàn tất</p>
            </div>

            {/* Day / Month / Year picker */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setChartTimeframe("day")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  chartTimeframe === "day" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <CalendarDays className="w-3 h-3" />
                <span>Ngày</span>
              </button>
              <button
                onClick={() => setChartTimeframe("month")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  chartTimeframe === "month" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <CalendarRange className="w-3 h-3" />
                <span>Tháng</span>
              </button>
              <button
                onClick={() => setChartTimeframe("year")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  chartTimeframe === "year" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Năm</span>
              </button>
            </div>
          </div>

          {/* SVG Area Chart — rendered from real data */}
          <div className="relative w-full flex-1" style={{ minHeight: "200px" }}>
            {completedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                <TrendingUp className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs">Chưa có đơn hàng hoàn thành nào để hiển thị</p>
              </div>
            ) : (
              <>
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75, 1].map((r) => (
                    <line
                      key={r}
                      x1={PAD_L} y1={PAD_T + plotH * (1 - r)}
                      x2={SVG_W - PAD_R} y2={PAD_T + plotH * (1 - r)}
                      stroke={r === 1 ? "#e2e8f0" : "#f1f5f9"}
                      strokeWidth="1"
                      strokeDasharray={r === 1 ? "0" : "4 4"}
                    />
                  ))}

                  {/* Area Fill */}
                  {areaPath && <path d={areaPath} fill="url(#revenueGradient)" />}

                  {/* Line */}
                  {linePath && (
                    <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  )}

                  {/* Data points — only show last few to avoid clutter */}
                  {coords
                    .filter((_, i) => i % Math.max(1, Math.floor(coords.length / 8)) === 0 || i === coords.length - 1)
                    .map((c, i) => (
                      <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                    ))}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium px-1">
                  {visibleLabels.map((label, i) => (
                    <span key={i} className={label ? "" : "opacity-0"}>
                      {label || "."}
                    </span>
                  ))}
                </div>

                {/* Y-axis max label */}
                <div className="absolute top-1 left-1 text-[10px] text-slate-400 font-mono">
                  {formatVND(maxVal)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Donut Chart: Category Breakdown — REAL DATA */}
        <div className="lg:col-span-4 bg-white rounded-card border border-slate-200/90 p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Cơ Cấu Danh Mục</h3>
            <p className="text-[11px] text-slate-400">Tỉ trọng doanh số theo loại sản phẩm</p>
          </div>

          <div className="py-4 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {totalCatSum > 1 ? (
                  donutSegments.map((seg, i) => (
                    <circle
                      key={i}
                      cx="50" cy="50" r="38"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={`${seg.dash.toFixed(1)} ${(CIRC - seg.dash).toFixed(1)}`}
                      strokeDashoffset={seg.offset.toFixed(1)}
                    />
                  ))
                ) : (
                  /* Empty state ring */
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="16" />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {totalCatSum > 1 ? (
                  <>
                    <span className="text-xs font-bold text-slate-400">Top 1</span>
                    <span className="text-sm font-black text-slate-900">
                      {catPercentages.sort((a, b) => b.pct - a.pct)[0]?.label.split(" ")[0]}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">Chưa có</span>
                )}
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
                <span className="font-extrabold text-slate-900">{item.pct}%</span>
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
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-600">{order.order_code}</td>
                  <td className="py-3.5 px-3">
                    {(() => {
                      const uProfile = userMap.get(order.user_id);
                      const customerName = order.user_name || uProfile?.full_name || (order.user_email ? order.user_email.split("@")[0] : "Khách Hàng");
                      const customerEmail = uProfile?.email || order.user_email;
                      return (
                        <>
                          <p className="font-bold text-slate-800 truncate max-w-[150px]" title={customerName}>{customerName}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]" title={customerEmail}>{customerEmail}</p>
                        </>
                      );
                    })()}
                  </td>
                  <td className="py-3.5 px-3 max-w-[200px] truncate text-slate-700">
                    {order.items?.[0]?.product_title || "Sản phẩm số"}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{formatVND(order.total_amount)}</td>
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
                  <td className="py-3.5 px-3 text-[11px] text-slate-400">{formatDateVN(order.created_at)}</td>
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                    Chưa có đơn hàng nào trong hệ thống
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
