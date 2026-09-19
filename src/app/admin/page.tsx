"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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
  Eye,
  CalendarDays,
  CalendarRange,
  Calendar,
  RefreshCw,
  Search,
  Sparkles,
  Award,
  Zap,
  Package,
  Layers,
  Clock,
  ChevronRight,
} from "lucide-react";

type ChartTimeframe = "day" | "month" | "year";

interface TimeframeDataPoint {
  label: string;
  value: number;
  count: number;
}

/** Group completed orders by a given timeframe bucket */
function groupOrdersByTimeframe(
  orders: Array<{ total_amount: number; created_at: string }>,
  timeframe: ChartTimeframe
): TimeframeDataPoint[] {
  const now = new Date();
  const map = new Map<string, { value: number; count: number }>();

  if (timeframe === "day") {
    // Last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      map.set(key, { value: 0, count: 0 });
    }
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diff >= 0 && diff <= 29) {
        const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        const curr = map.get(key) || { value: 0, count: 0 };
        map.set(key, { value: curr.value + o.total_amount, count: curr.count + 1 });
      }
    });
  } else if (timeframe === "month") {
    // Last 12 months
    const monthNames = ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`;
      map.set(key, { value: 0, count: 0 });
    }
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff <= 11) {
        const key = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`;
        const curr = map.get(key) || { value: 0, count: 0 };
        map.set(key, { value: curr.value + o.total_amount, count: curr.count + 1 });
      }
    });
  } else {
    // Last 5 years
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      map.set(String(year), { value: 0, count: 0 });
    }
    orders.forEach((o) => {
      const year = new Date(o.created_at).getFullYear();
      const diff = now.getFullYear() - year;
      if (diff >= 0 && diff <= 4) {
        const key = String(year);
        const curr = map.get(key) || { value: 0, count: 0 };
        map.set(key, { value: curr.value + o.total_amount, count: curr.count + 1 });
      }
    });
  }

  return Array.from(map.entries()).map(([label, data]) => ({
    label,
    value: data.value,
    count: data.count,
  }));
}

/** Thin out labels to avoid crowding (show every Nth label) */
function thinLabels(labels: string[], maxVisible: number): (string | null)[] {
  if (labels.length <= maxVisible) return labels;
  const step = Math.ceil(labels.length / maxVisible);
  return labels.map((l, i) => (i % step === 0 || i === labels.length - 1 ? l : null));
}

/** Generates smooth cubic Bezier curve string through points */
function getSmoothSvgPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Get avatar initials and background hue for customers */
function getCustomerAvatar(name: string) {
  const clean = name.trim();
  const parts = clean.split(/\s+/);
  const initials = parts.length === 1
    ? clean.slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

  const colors = [
    "from-blue-600 to-indigo-600",
    "from-purple-600 to-pink-600",
    "from-emerald-600 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-cyan-600 to-blue-600",
    "from-rose-600 to-pink-600",
  ];
  let sum = 0;
  for (let i = 0; i < clean.length; i++) sum += clean.charCodeAt(i);
  const colorClass = colors[sum % colors.length];

  return { initials, colorClass };
}

export default function AdminDashboardPage() {
  const { orders, products, users, refreshOrders, refreshProducts, refreshUsers } = useStore();
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>("day");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");

  // Đồng bộ dữ liệu khi vào trang
  useEffect(() => {
    refreshOrders();
    refreshProducts();
    refreshUsers();
    setLastSyncedTime(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
  }, [refreshOrders, refreshProducts, refreshUsers]);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshOrders(), refreshProducts(), refreshUsers()]);
      setLastSyncedTime(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // ── Metrics from real data ──────────────────────────────────────────────
  const completedOrders = useMemo(() => orders.filter((o) => o.status === "completed"), [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === "pending_approval"), [orders]);

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
  const completionRate = totalOrdersCount > 0 ? Math.round((completedOrders.length / totalOrdersCount) * 100) : 0;

  // Category breakdown from real orders
  const categorySales = useMemo(() => {
    const sales = { lab211: 0, project: 0, tool: 0 };
    completedOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const cat = item.product_category as keyof typeof sales;
        if (cat in sales) sales[cat] += item.unit_price;
      });
    });
    return sales;
  }, [completedOrders]);

  const totalCatSum = categorySales.lab211 + categorySales.project + categorySales.tool || 1;
  const catPercentages = useMemo(() => [
    {
      label: "Tiện Ích Tool",
      shortLabel: "Tool & Bot",
      pct: Math.round((categorySales.tool / totalCatSum) * 100),
      amount: categorySales.tool,
      color: "#10b981",
      bgColor: "bg-emerald-500",
      lightBg: "bg-emerald-50 border-emerald-200/60 text-emerald-700",
    },
    {
      label: "LAB211 OOP Java",
      shortLabel: "LAB211 OOP",
      pct: Math.round((categorySales.lab211 / totalCatSum) * 100),
      amount: categorySales.lab211,
      color: "#2563eb",
      bgColor: "bg-blue-600",
      lightBg: "bg-blue-50 border-blue-200/60 text-blue-700",
    },
    {
      label: "Project & Assignment",
      shortLabel: "Đồ Án Project",
      pct: Math.round((categorySales.project / totalCatSum) * 100),
      amount: categorySales.project,
      color: "#8b5cf6",
      bgColor: "bg-purple-500",
      lightBg: "bg-purple-50 border-purple-200/60 text-purple-700",
    },
  ], [categorySales, totalCatSum]);

  const topCategory = useMemo(() => {
    return [...catPercentages].sort((a, b) => b.amount - a.amount)[0];
  }, [catPercentages]);

  // Top selling products based on completed orders
  const topSellingProducts = useMemo(() => {
    const map = new Map<string, { id: string; title: string; count: number; revenue: number; category: string }>();
    completedOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const existing = map.get(item.product_id) || {
          id: item.product_id,
          title: item.product_title || "Sản phẩm số",
          count: 0,
          revenue: 0,
          category: item.product_category || "tool",
        };
        existing.count += 1;
        existing.revenue += item.unit_price;
        map.set(item.product_id, existing);
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);
  }, [completedOrders]);

  // ── Chart data from real orders ─────────────────────────────────────────
  const chartPoints = useMemo(
    () => groupOrdersByTimeframe(completedOrders, chartTimeframe),
    [completedOrders, chartTimeframe]
  );

  const maxVal = Math.max(...chartPoints.map((p) => p.value), 1);
  const SVG_W = 660;
  const SVG_H = 200;
  const PAD_L = 12;
  const PAD_R = 12;
  const PAD_T = 16;
  const PAD_B = 16;

  const plotW = SVG_W - PAD_L - PAD_R;
  const plotH = SVG_H - PAD_T - PAD_B;

  const coords = useMemo(() => {
    return chartPoints.map((p, i) => ({
      x: PAD_L + (i / Math.max(chartPoints.length - 1, 1)) * plotW,
      y: PAD_T + plotH - (p.value / maxVal) * plotH,
      label: p.label,
      value: p.value,
      count: p.count,
    }));
  }, [chartPoints, maxVal, plotW, plotH]);

  // Smooth Bezier Curve Path
  const smoothLinePath = useMemo(() => getSmoothSvgPath(coords), [coords]);
  const smoothAreaPath = useMemo(() => {
    if (coords.length === 0) return "";
    return `${smoothLinePath} L ${coords[coords.length - 1].x.toFixed(1)} ${PAD_T + plotH} L ${coords[0].x.toFixed(1)} ${PAD_T + plotH} Z`;
  }, [smoothLinePath, coords, plotH]);

  // X-axis: visible labels
  const visibleLabels = useMemo(() => {
    return thinLabels(
      coords.map((c) => c.label),
      chartTimeframe === "day" ? 7 : chartTimeframe === "month" ? 6 : 5
    );
  }, [coords, chartTimeframe]);

  // Donut chart stroke segments
  const CIRC = 2 * Math.PI * 40; // r = 40
  let donutOffset = 0;
  const donutSegments = catPercentages.map((cat) => {
    const dash = (cat.pct / 100) * CIRC;
    const gap = CIRC - dash;
    const seg = { ...cat, dash, gap, offset: -donutOffset };
    donutOffset += dash;
    return seg;
  });

  // Filtered orders for the Recent Orders table
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders.slice(0, 5);
    const q = searchQuery.toLowerCase().trim();
    return orders
      .filter((o) => {
        const uProfile = userMap.get(o.user_id);
        const name = (o.user_name || uProfile?.full_name || "").toLowerCase();
        const email = (o.user_email || uProfile?.email || "").toLowerCase();
        const code = o.order_code.toLowerCase();
        const title = (o.items?.[0]?.product_title || "").toLowerCase();
        return name.includes(q) || email.includes(q) || code.includes(q) || title.includes(q);
      })
      .slice(0, 5);
  }, [orders, searchQuery, userMap]);

  // Calculate highest revenue in timeframe
  const peakTimeframeRevenue = useMemo(() => {
    if (chartPoints.length === 0) return 0;
    return Math.max(...chartPoints.map((p) => p.value));
  }, [chartPoints]);

  return (
    <div className="space-y-7 pb-10">
      {/* ── TOP HEADER WITH LIVE BADGE & ACTIONS ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Dashboard Quản Trị & Doanh Thu
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Hôm nay: {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
            </span>
            {lastSyncedTime && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">Cập nhật lúc {lastSyncedTime}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Nút Làm mới dữ liệu */}
          <button
            onClick={handleManualSync}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all disabled:opacity-60 active:scale-95"
            title="Đồng bộ dữ liệu mới nhất từ Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : "text-slate-500"}`} />
            <span>{isRefreshing ? "Đang đồng bộ..." : "Làm mới"}</span>
          </button>

          {/* Quick link tới Quản lý sản phẩm */}
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>Kho Sản Phẩm</span>
          </Link>

          {/* Nút Xử lý đơn hàng nổi bật */}
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:shadow-blue-500/35 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Xử Lý Đơn Hàng</span>
            {pendingOrders.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black animate-pulse">
                {pendingOrders.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── PENDING APPROVAL WARNING BANNER ─────────────────────────────── */}
      {pendingOrders.length > 0 && (
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border border-amber-300/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Cần Phê Duyệt Khẩn Cấp
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-extrabold">
                  {pendingOrders.length} đơn chờ
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Khách hàng đã chuyển khoản VietQR và gửi bằng chứng biên lai. Vui lòng đối chiếu số dư để mở kho tài nguyên tự động.
              </p>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all hover:scale-102 active:scale-98 shrink-0"
          >
            <span>Duyệt Đơn Ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── 4 STAT CARDS (MODERN TECH SAAS DESIGN) ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Tổng Doanh Thu */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Tổng Doanh Thu
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {formatVND(totalRevenue)}
            </h3>
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {completedOrders.length} đơn hoàn thành
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({completionRate}% thành công)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Tổng Đơn Hàng */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Tổng Đơn Hàng
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {totalOrdersCount} <span className="text-sm font-bold text-slate-500">đơn</span>
            </h3>
            <div className="mt-2.5 flex items-center gap-2 text-[11px]">
              <span className="text-slate-600 font-medium">
                <strong className="text-purple-700 font-extrabold">{completedOrders.length}</strong> hoàn thành
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">
                <strong className={pendingOrders.length > 0 ? "text-amber-600 font-extrabold" : "text-slate-700"}>
                  {pendingOrders.length}
                </strong> chờ duyệt
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Giá Trị Đơn TB */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Giá Trị Đơn TB
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {formatVND(avgOrderValue)}
            </h3>
            <p className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Đo lường trên các đơn hợp lệ</span>
            </p>
          </div>
        </div>

        {/* Card 4: Sinh Viên & Khách Hàng */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Khách Hàng & Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {totalUsersCount} <span className="text-sm font-bold text-slate-500">tài khoản</span>
            </h3>
            <p className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>
                {Math.round((completedOrders.length / Math.max(totalUsersCount, 1)) * 100)}% tỷ lệ chuyển đổi
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── CHARTS SECTION (REVENUE TREND + CATEGORY DONUT) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (8 CỘT): Biểu Đồ Doanh Thu Đường Cong Mượt Mà */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Xu Hướng Doanh Thu
                  </h3>
                  {peakTimeframeRevenue > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60 hidden sm:inline-flex">
                      Đỉnh: {formatVND(peakTimeframeRevenue)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Doanh thu ghi nhận từ các giao dịch VietQR đã được xác thực hoàn tất
                </p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl self-start sm:self-auto border border-slate-200/50">
                <button
                  onClick={() => {
                    setChartTimeframe("day");
                    setHoveredPointIndex(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartTimeframe === "day"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Ngày</span>
                </button>
                <button
                  onClick={() => {
                    setChartTimeframe("month");
                    setHoveredPointIndex(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartTimeframe === "month"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  <span>Tháng</span>
                </button>
                <button
                  onClick={() => {
                    setChartTimeframe("year");
                    setHoveredPointIndex(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartTimeframe === "year"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Năm</span>
                </button>
              </div>
            </div>

            {/* SVG Chart Area */}
            <div
              className="relative w-full select-none"
              style={{ minHeight: "220px", height: "230px" }}
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              {completedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <TrendingUp className="w-10 h-10 mb-2 opacity-25" />
                  <p className="text-xs font-medium">Chưa có dữ liệu đơn hàng hoàn thành để vẽ biểu đồ</p>
                </div>
              ) : (
                <>
                  <svg
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const mouseX = ((e.clientX - rect.left) / rect.width) * SVG_W;
                      let nearest = 0;
                      let minD = Infinity;
                      coords.forEach((c, idx) => {
                        const d = Math.abs(c.x - mouseX);
                        if (d < minD) {
                          minD = d;
                          nearest = idx;
                        }
                      });
                      setHoveredPointIndex(nearest);
                    }}
                  >
                    <defs>
                      <linearGradient id="smoothRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
                        <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                      </linearGradient>
                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    {/* Horizontal Reference Grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((r) => (
                      <line
                        key={r}
                        x1={PAD_L}
                        y1={PAD_T + plotH * (1 - r)}
                        x2={SVG_W - PAD_R}
                        y2={PAD_T + plotH * (1 - r)}
                        stroke={r === 1 ? "#e2e8f0" : "#f1f5f9"}
                        strokeWidth="1"
                        strokeDasharray={r === 1 ? "0" : "4 4"}
                      />
                    ))}

                    {/* Gradient Area Fill */}
                    {smoothAreaPath && <path d={smoothAreaPath} fill="url(#smoothRevenueGradient)" />}

                    {/* Smooth Bezier Line Path with subtle glow */}
                    {smoothLinePath && (
                      <path
                        d={smoothLinePath}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glowEffect)"
                      />
                    )}

                    {/* Active hover vertical guide line */}
                    {hoveredPointIndex !== null && coords[hoveredPointIndex] && (
                      <>
                        <line
                          x1={coords[hoveredPointIndex].x}
                          y1={PAD_T}
                          x2={coords[hoveredPointIndex].x}
                          y2={PAD_T + plotH}
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        {/* Outer ping */}
                        <circle
                          cx={coords[hoveredPointIndex].x}
                          cy={coords[hoveredPointIndex].y}
                          r="7"
                          fill="#3b82f6"
                          opacity="0.3"
                        />
                        {/* Center solid point */}
                        <circle
                          cx={coords[hoveredPointIndex].x}
                          cy={coords[hoveredPointIndex].y}
                          r="4.5"
                          fill="#ffffff"
                          stroke="#2563eb"
                          strokeWidth="3"
                        />
                      </>
                    )}

                    {/* Key landmark data points */}
                    {coords
                      .filter(
                        (_, i) =>
                          i === coords.length - 1 ||
                          i % Math.max(1, Math.floor(coords.length / 7)) === 0
                      )
                      .map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r="3"
                          fill="#ffffff"
                          stroke="#2563eb"
                          strokeWidth="2"
                          className="transition-transform duration-200 hover:scale-150"
                        />
                      ))}
                  </svg>

                  {/* Interactive Floating Tooltip */}
                  {hoveredPointIndex !== null && coords[hoveredPointIndex] && (
                    <div
                      className="absolute pointer-events-none transition-all duration-150 z-20"
                      style={{
                        left: `${(coords[hoveredPointIndex].x / SVG_W) * 100}%`,
                        top: `${Math.max((coords[hoveredPointIndex].y / SVG_H) * 100 - 28, 4)}%`,
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700/60 text-center whitespace-nowrap min-w-[120px]">
                        <p className="text-[10px] font-semibold text-slate-300">
                          {chartTimeframe === "day"
                            ? `Ngày ${coords[hoveredPointIndex].label}`
                            : chartTimeframe === "month"
                            ? `Tháng ${coords[hoveredPointIndex].label}`
                            : `Năm ${coords[hoveredPointIndex].label}`}
                        </p>
                        <p className="text-xs font-black text-blue-400 mt-0.5">
                          {formatVND(coords[hoveredPointIndex].value)}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {coords[hoveredPointIndex].count} đơn hoàn tất
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Y-axis max label */}
                  <div className="absolute top-0.5 left-1 text-[10px] text-slate-400 font-mono bg-white/80 px-1 rounded">
                    Max: {formatVND(maxVal)}
                  </div>
                </>
              )}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono px-2 border-t border-slate-100 pt-2">
              {visibleLabels.map((label, i) => (
                <span key={i} className={label ? "font-semibold" : "opacity-0"}>
                  {label || "."}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (4 CỘT): Biểu Đồ Cơ Cấu Danh Mục (Donut Chart Đã Khắc Phục Lỗi Cắt Chữ) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Cơ Cấu Danh Mục
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tỷ trọng doanh số theo loại sản phẩm
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            {/* Donut Graphic */}
            <div className="py-5 flex items-center justify-center">
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                  />
                  {totalCatSum > 1 ? (
                    donutSegments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={`${seg.dash.toFixed(1)} ${(CIRC - seg.dash).toFixed(1)}`}
                        strokeDashoffset={seg.offset.toFixed(1)}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    ))
                  ) : (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="14"
                    />
                  )}
                </svg>

                {/* Center Content: Hiển thị trọn vẹn thông tin, không bao giờ bị cắt chữ cộc lốc */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  {totalCatSum > 1 && topCategory ? (
                    <>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Top Doanh Thu
                      </span>
                      <span className="text-xs font-black text-slate-900 mt-0.5 max-w-[100px] leading-tight truncate" title={topCategory.label}>
                        {topCategory.shortLabel}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600 mt-0.5">
                        {topCategory.pct}%
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Chưa có đơn</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            {catPercentages.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 font-bold">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-extrabold text-slate-900">{formatVND(item.amount)}</span>
                    <span className="text-[11px] text-slate-400 font-medium">({item.pct}%)</span>
                  </div>
                </div>
                {/* Mini bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOP PRODUCTS & RECENT ORDERS SPLIT SECTION ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WIDGET: TOP SẢN PHẨM BÁN CHẠY (4 CỘT) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Sản Phẩm Bán Chạy
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Top mặt hàng mang lại doanh thu cao nhất
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-3">
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate" title={p.title}>
                          {p.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Đã bán: <b className="text-slate-700 font-bold">{p.count}</b> lượt
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-blue-600 font-mono">
                        {formatVND(p.revenue)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Chưa có sản phẩm nào phát sinh doanh thu
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4">
            <Link
              href="/admin/products"
              className="w-full py-2 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50/80 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Xem Toàn Bộ Kho Hàng ({products.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* BẢNG: ĐƠN HÀNG GẦN ĐÂY (8 CỘT) ────────────────────────────── */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Đơn Hàng Gần Đây
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Các giao dịch phát sinh trên hệ thống CodeVault
              </p>
            </div>

            {/* Search Input & View All Button */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn, tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-36 sm:w-44"
                />
              </div>

              <Link
                href="/admin/orders"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shrink-0"
              >
                <span>Xem tất cả ({orders.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Modern Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Mã Đơn</th>
                  <th className="py-3 px-3">Khách Hàng</th>
                  <th className="py-3 px-3">Sản Phẩm</th>
                  <th className="py-3 px-3">Tổng Tiền</th>
                  <th className="py-3 px-3">Trạng Thái</th>
                  <th className="py-3 px-3">Thời Gian</th>
                  <th className="py-3 px-3 text-right">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((order) => {
                  const uProfile = userMap.get(order.user_id);
                  const customerName =
                    order.user_name ||
                    uProfile?.full_name ||
                    (order.user_email ? order.user_email.split("@")[0] : "Khách Hàng");
                  const customerEmail = uProfile?.email || order.user_email || "Chưa có email";
                  const { initials, colorClass } = getCustomerAvatar(customerName);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Mã Đơn */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/80 text-[11px]">
                          {order.order_code}
                        </span>
                      </td>

                      {/* Khách Hàng với Avatar Initials */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${colorClass} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate max-w-[130px]" title={customerName}>
                              {customerName}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[130px]" title={customerEmail}>
                              {customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tên Sản Phẩm */}
                      <td className="py-3 px-3 max-w-[180px]">
                        <p className="truncate text-slate-700 font-medium" title={order.items?.[0]?.product_title}>
                          {order.items?.[0]?.product_title || "Sản phẩm số"}
                        </p>
                        {order.items && order.items.length > 1 && (
                          <span className="text-[9px] text-slate-400">
                            +{order.items.length - 1} sản phẩm khác
                          </span>
                        )}
                      </td>

                      {/* Tổng Tiền */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {formatVND(order.total_amount)}
                      </td>

                      {/* Status Pill với Glowing Dot */}
                      <td className="py-3 px-3">
                        {order.status === "completed" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                            Đã duyệt
                          </span>
                        ) : order.status === "pending_approval" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" />
                            Chờ duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Chờ thanh toán
                          </span>
                        )}
                      </td>

                      {/* Thời Gian */}
                      <td className="py-3 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDateVN(order.created_at)}
                      </td>

                      {/* Thao Tác Chi Tiết */}
                      <td className="py-3 px-3 text-right">
                        <Link
                          href="/admin/orders"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 inline-flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors shadow-2xs"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      Không tìm thấy đơn hàng nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
