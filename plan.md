# MASTER PLAN — CodeVault Studio (SDD & ADD Hybrid Roadmap)

# Project: CodeVault Studio (Tools, Projects & LAB211 Digital Goods Store)
# Framework: Spec-Driven Development (SDD) & Agent-Driven Development (ADD)
# Status: Sprint 0 Complete — Ready for Sprint 1 (Supabase Setup & Scaffolding)
# Last Updated: 2026-03-15

---

## 1. TỔNG QUAN DỰ ÁN & TIÊU CHÍ KỸ THUẬT
- **Sản phẩm kinh doanh:** 
  1. Sản phẩm Tool (tiện ích, script, automation)
  2. Sản phẩm Project môn học (fullstack, capstones, đồ án có báo cáo)
  3. Mã nguồn LAB211 (Java OOP labs)
- **Giao diện:** Dark Cyberpunk / Modern Dark UI, hiệu ứng 3D tương tác sử dụng Three.js (`@react-three/fiber`), animation mượt mà với `framer-motion`.
- **Demo đa phương tiện:** Hỗ trợ Admin cấu hình nhiều ảnh screenshots, link live demo, link video review, code preview snippet.
- **Thanh toán & Duyệt đơn:** VietQR Napas 247 -> Khách gửi bằng chứng chuyển khoản -> **Admin DUYỆT ĐƠN** -> Hệ thống mở khóa link tải mã nguồn và hướng dẫn.
- **Admin Panel:** Đầy đủ tính năng CRUD (Sản phẩm, Đơn hàng, Người dùng) + Dashboard thống kê doanh thu (ngày/tuần/tháng/tổng) và đơn chờ duyệt.
- **Cơ sở dữ liệu:** Supabase (PostgreSQL 16, Supabase Auth, Supabase Storage).

---

## 2. MA TRẬN TIẾN ĐỘ THEO MÔ HÌNH SDD (PLAN - ACT - CHECK)

| Phase | Mục Tiêu / Tính Năng | Tiếp Cận | Trạng Thái | File Sản Phẩm Chính |
|---|---|---|---|---|
| **Phase 0** | **Thiết lập nền móng SDD & Governance** | SDD Pure | ✅ DONE | `.sdd/*`, `.agents/*`, `plan.md` |
| **Phase 1** | **Supabase DB Schema, RLS & Storage Buckets** | SDD / Hybrid | ⏳ READY | `supabase/migrations/*`, Schema DDL |
| **Phase 2** | **Khởi tạo Next.js App, Theme 3D Three.js** | Hybrid | ⏳ QUEUED | `src/components/3d/*`, Theme CSS |
| **Phase 3** | **Product Catalog & Rich Demo Engine** | ADD / Guided | ⏳ QUEUED | `/products/*`, Demo Gallery, Player |
| **Phase 4** | **Đặt Hàng & Thanh Toán VietQR Tự Động** | SDD / Hybrid | ⏳ QUEUED | `/checkout`, `/orders`, VietQR Gen |
| **Phase 5** | **Admin Portal, Full CRUD & Duyệt Đơn** | Hybrid | ⏳ QUEUED | `/admin/*`, Dashboard, Approval Drawer |
| **Phase 6** | **Kho Bàn Giao (Customer Deliverable Vault)** | SDD Pure | ⏳ QUEUED | `/customer/orders/:id`, Signed URLs |
| **Phase 7** | **Tối Ưu 60 FPS Three.js, Testing & Audit** | Hybrid | ⏳ QUEUED | Lighthouse, Security Checklist, E2E |

---

## 3. CHI TIẾT TỪNG GIAI ĐOẠN TRIỂN KHAI

### [x] Giai Đoạn 0: Nền Tảng SDD (Sprint 0) — ĐÃ HOÀN THÀNH
- [x] Đọc và tiếp thu triệt để tài liệu `spec-driven-&-agent-driven-development (2).md`.
- [x] Tạo `.sdd/constitution.md` (3 Layer: Hard Rules, Arch Constraints, Engineering Standards).
- [x] Tạo `.sdd/shared_context.md` (Single source of truth cho data types, DDL schema, API contracts).
- [x] Tạo bộ 3 ràng buộc: `.sdd/constraints/global.md`, `business.md`, `safety.md`.
- [x] Tạo `.sdd/specs/template.md` (Executable Spec template với EARS notation).
- [x] Tạo `.sdd/rfcs/ADR-001-architecture-and-stack.md` (Kiến trúc Next.js + Supabase + Three.js + VietQR).
- [x] Tạo `.agents/AGENTS.md`, `CLAUDE.md`, `.agentignore`.

### [ ] Giai Đoạn 1: Supabase Database, RLS & Storage Buckets
- [ ] Soạn thảo file script SQL khởi tạo cơ sở dữ liệu (`profiles`, `products`, `product_demos`, `orders`, `order_items`, `audit_logs`).
- [ ] Thiết lập Row Level Security (RLS) bảo vệ dữ liệu sản phẩm số và đơn hàng.
- [ ] Cấu hình 2 bucket Supabase Storage:
  - `product-assets` (Public: ảnh thumbnails, demo screenshots)
  - `digital-deliverables` (Private: file zip code, chỉ tải qua signed URL)
- [ ] Tạo trigger cập nhật `updated_at` và tự động tạo profile khi user đăng ký qua Supabase Auth.

### [ ] Giai Đoạn 2: Khởi Tạo Next.js & Xây Dựng Visual 3D Three.js
- [ ] Setup Next.js 14+ với TypeScript, Tailwind CSS, Lucide icons, Framer Motion.
- [ ] Tích hợp Three.js, `@react-three/fiber`, `@react-three/drei`.
- [ ] Thiết kế Hero Section 3D với vật thể tương tác theo con trỏ chuột (Floating Cyber Tech Core / Hologram Mesh).
- [ ] Thiết kế Design System: Palette màu Cyber Dark (`#0a0b10`, `#121420`, `#1a1d30`), Neon Purple (`#8b5cf6`), Neon Cyan (`#06b6d4`), Glassmorphism cards.

### [ ] Giai Đoạn 3: Showcase Sản Phẩm & Rich Demo Engine (Tools, Projects, LAB211)
- [ ] Xây dựng bộ lọc 3 danh mục tab:
  - **Tab Tools:** Hiển thị danh sách tools, video demo, cấu hình yêu cầu, tags tính năng.
  - **Tab Projects:** Hiển thị đồ án môn học, live demo link, bộ ảnh gallery phóng to, tech stack.
  - **Tab LAB211:** Hiển thị mã bài lab (J1.S.P...), code snippet preview cú pháp OOP Java, console preview.
- [ ] Xây dựng trang chi tiết sản phẩm (`/products/[slug]`) với Rich Demo Media Viewer (Lightbox ảnh, nhúng video, copy code preview).

### [ ] Giai Đoạn 4: Đặt Hàng & Thanh Toán VietQR
- [ ] Xây dựng Modal / Trang Checkout nhanh.
- [ ] Thuật toán tạo mã VietQR chuẩn Napas với số tài khoản và nội dung tự động `CV{order_id}`.
- [ ] Form tải lên bằng chứng chuyển khoản (ảnh chụp bill hoặc điền mã giao dịch ngân hàng).
- [ ] Cập nhật trạng thái đơn hàng sang `pending_approval`.

### [ ] Giai Đoạn 5: Admin Portal, Full CRUD & Dashboard Thống Kê
- [ ] Xây dựng Admin Layout riêng biệt (`/admin`) với Sidebar, Header, Breadcrumbs.
- [ ] **Admin Dashboard:**
  - Card thống kê tổng doanh thu (VND), doanh thu hôm nay, số đơn thành công.
  - Badge cảnh báo nổi bật các đơn hàng đang chờ duyệt (`pending_approval`).
  - Biểu đồ phân bố doanh số theo 3 danh mục (Tools vs Projects vs LAB211).
- [ ] **Admin Orders Management & Approval Engine:**
  - Danh sách đơn hàng, bộ lọc trạng thái.
  - Drawer chi tiết đơn: Xem ảnh bill khách upload, đối chiếu mã giao dịch.
  - **2 Nút thao tác chính:** **[Duyệt Đơn]** (Approve -> status `completed`) và **[Từ Chối]** (Reject kèm ghi chú lý do).
- [ ] **Admin Products CRUD:**
  - Form tạo/sửa sản phẩm: Tải ảnh, nhập giá, chọn danh mục, điền link live demo, link video, upload file zip vào private storage.
  - Xóa mềm sản phẩm (`archived`).

### [ ] Giai Đoạn 6: Customer Deliverable Vault (Mở Khóa Tài Nguyên)
- [ ] Trang danh sách đơn mua của khách hàng (`/customer/orders`).
- [ ] Xử lý Server Action kiểm tra quyền: Chỉ khi đơn hàng có `status === 'completed'` (đã được Admin duyệt) mới sinh Signed URL tải file zip và hiển thị hướng dẫn cài đặt.
- [ ] Cơ chế hết hạn của link tải sau 60 phút để chống rò rỉ.

### [ ] Giai Đoạn 7: Kiểm Thử, Tối Ưu & Hoàn Thiện
- [ ] Kiểm tra tối ưu Three.js: đảm bảo 60 FPS, không leak bộ nhớ WebGL khi chuyển trang.
- [ ] Kiểm tra responsive trên điện thoại di động và máy tính bảng.
- [ ] Rà soát bảo mật RLS Supabase và phân quyền role Admin.
- [ ] Tạo Walkthrough tổng kết.
