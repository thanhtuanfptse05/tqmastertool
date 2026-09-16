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
| **Phase 1** | **Supabase DB Schema, RLS & Storage Buckets** | SDD / Hybrid | ✅ DONE | `supabase/migrations/*`, Schema DDL |
| **Phase 2** | **Khởi tạo Next.js App, Theme 3D Three.js** | Hybrid | ✅ DONE | `src/components/3d/*`, Theme CSS |
| **Phase 3** | **Product Catalog & Rich Demo Engine** | ADD / Guided | ✅ DONE | `/products/*`, Demo Gallery, Player |
| **Phase 4** | **Đặt Hàng & Thanh Toán VietQR Tự Động** | SDD / Hybrid | ✅ DONE | `/checkout`, `/orders`, VietQR Gen |
| **Phase 5** | **Admin Portal, Full CRUD & Duyệt Đơn** | Hybrid | ✅ DONE | `/admin/*`, Dashboard, Approval Drawer |
| **Phase 6** | **Kho Bàn Giao (Customer Deliverable Vault)** | SDD Pure | ✅ DONE | `/customer/orders/:id`, Signed URLs |
| **Phase 7** | **Tối Ưu 60 FPS Three.js, Testing & Audit** | Hybrid | ✅ DONE | Lighthouse, Security Checklist, E2E |
| **Phase 8** | **LAB211 Deliverable Viewer (Spec 010)** | SDD Pure | ✅ DONE | Word Preview, Java IDE, Exact Downloads |

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

### [x] Giai Đoạn 1: Supabase Database, RLS & Storage Buckets — ĐÃ HOÀN THÀNH
- [x] Soạn thảo file script SQL khởi tạo cơ sở dữ liệu (`profiles`, `products`, `product_demos`, `orders`, `order_items`, `audit_logs`).
- [x] Thiết lập Row Level Security (RLS) bảo vệ dữ liệu sản phẩm số và đơn hàng.
- [x] Cấu hình 2 bucket Supabase Storage:
  - `product-assets` (Public: ảnh thumbnails, demo screenshots)
  - `digital-deliverables` (Private: file zip code, chỉ tải qua signed URL)
- [x] Tạo trigger cập nhật `updated_at` và tự động tạo profile khi user đăng ký qua Supabase Auth.

### [x] Giai Đoạn 2: Khởi Tạo Next.js & Xây Dựng Visual 3D Three.js — ĐÃ HOÀN THÀNH
- [x] Setup Next.js 14+ với TypeScript, Tailwind CSS, Lucide icons, Framer Motion.
- [x] Tích hợp Three.js (`three`), `@react-three/fiber`, `@react-three/drei`.
- [x] Thiết kế Hero Section 3D với vật thể tương tác theo con trỏ chuột (Floating Cyber Tech Core / Hologram Mesh).
- [x] Thiết kế Design System: Palette màu Canvas `#f4f7fc`, Card surface `#ffffff`, Primary Blue `#2563eb`, 4 Pastel Stat Cards theo `design.md`.

### [x] Giai Đoạn 3: Showcase Sản Phẩm & Rich Demo Engine (Tools, Projects, LAB211) — ĐÃ HOÀN THÀNH
- [x] Xây dựng bộ lọc 3 danh mục tab:
  - **Tab Tools:** Hiển thị danh sách tools, video demo, cấu hình yêu cầu, tags tính năng.
  - **Tab Projects:** Hiển thị đồ án môn học, live demo link, bộ ảnh gallery phóng to, tech stack.
  - **Tab LAB211:** Hiển thị mã bài lab (J1.S.P...), code snippet preview cú pháp OOP Java, console preview.
- [x] Xây dựng trang chi tiết sản phẩm (`/products/[slug]`) với Rich Demo Media Viewer (Lightbox ảnh, nhúng video, copy code preview).

### [x] Giai Đoạn 4: Đặt Hàng & Thanh Toán VietQR — ĐÃ HOÀN THÀNH
- [x] Xây dựng Modal / Trang Checkout nhanh (`/checkout`).
- [x] Thuật toán tạo mã VietQR chuẩn Napas với số tài khoản và nội dung tự động `CV{order_id}`.
- [x] Form tải lên bằng chứng chuyển khoản (ảnh chụp bill hoặc điền mã giao dịch ngân hàng).
- [x] Cập nhật trạng thái đơn hàng sang `pending_approval`.

### [x] Giai Đoạn 5: Admin Portal, Full CRUD & Dashboard Thống Kê — ĐÃ HOÀN THÀNH
- [x] Xây dựng Admin Layout riêng biệt (`/admin`) với Sidebar, Header, Breadcrumbs và RBAC guard.
- [x] **Admin Dashboard:**
  - 4 Card thống kê pastel chuẩn `design.md`: Doanh thu, Đơn hàng, Giá trị TB, Khách hàng.
  - Badge cảnh báo nổi bật các đơn hàng đang chờ duyệt (`pending_approval`).
  - Biểu đồ Area Chart doanh thu gradient xanh `#3b82f6` và Donut Chart phân bố 3 danh mục.
- [x] **Admin Orders Management & Approval Engine:**
  - Danh sách đơn hàng, bộ lọc trạng thái.
  - Drawer chi tiết đơn: Xem ảnh bill khách upload, đối chiếu mã giao dịch, lightbox zoom.
  - **2 Nút thao tác chính:** **[Duyệt Đơn]** (Approve -> status `completed`) và **[Từ Chối]** (Reject kèm ghi chú lý do).
- [x] **Admin Products CRUD:**
  - Form tạo/sửa sản phẩm: Tải ảnh, nhập giá, chọn danh mục, điền link live demo, link video, upload file zip vào private storage.
  - Xóa mềm sản phẩm (`archived`).
- [x] **Admin Users & Password Reset:**
  - Quản lý người dùng, đổi quyền Customer ↔ Admin, cấp lại mật khẩu trực tiếp.

### [x] Giai Đoạn 6: Customer Deliverable Vault (Mở Khóa Tài Nguyên) — ĐÃ HOÀN THÀNH
- [x] Trang danh sách đơn mua của khách hàng (`/customer/orders`).
- [x] Xử lý kiểm tra quyền: Chỉ khi đơn hàng có `status === 'completed'` (đã được Admin duyệt) mới hiển thị tại `/customer/vault` và sinh quyền tải file zip, hiển thị tài liệu hướng dẫn.
- [x] Bảo vệ chống lộ link tải khi đơn chưa được duyệt.

### [x] Giai Đoạn 7: Kiểm Thử, Tối Ưu & Hoàn Thiện — ĐÃ HOÀN THÀNH
- [x] Kiểm tra tối ưu Three.js: đảm bảo 60 FPS, giải phóng bộ nhớ WebGL `dispose()` khi component unmount.
- [x] Biên dịch TypeScript Strict (`tsc --noEmit`) đạt 0 lỗi.
- [x] Production Build Next.js (`npm run build`) thành công 100%.
- [x] Tạo Walkthrough tổng kết.

### [x] Giai Đoạn 8: Bóc Tách Tự Động & Trình Xem Đề Bài Word / Code Java LAB211 (Spec 010) — ĐÃ HOÀN THÀNH
- [x] Tự động giải nén và trích xuất cấu trúc 12 bài lab từ `LAB211.zip` thành manifest chuẩn và file standalone project.
- [x] Tạo trình đọc Word `.docx` (`LabDocViewer`) định dạng chuẩn FPT kèm nút tải file Word đúng tên gốc `J1.L.P0023 - FRUIT.docx`.
- [x] Tạo trình xem code Java IDE Dark Theme (`LabCodeViewer`) phân theo package MVC, highlight cú pháp, line numbers, nút copy code, tải file `.java` và trọn gói `.zip`.
- [x] Master Modal (`LabDeliverableModal`) tích hợp thanh chọn 12 bài lab và quy chuẩn code `rule.md`.
- [x] Endpoint tải file bảo mật `/api/deliverables/lab/download` chặn đơn chưa duyệt, header RFC 5987 / RFC 6266 `Content-Disposition`.
- [x] Endpoint xem bài lab bảo mật `/api/deliverables/lab/view` kiểm soát trạng thái đơn `completed`.
- [x] Endpoint Admin Upload ZIP `/api/admin/upload/lab-package` tự động nhận diện bài lab và bóc tách dữ liệu.
- [x] Cập nhật giao diện Deliverable Vault (`/customer/vault`) và Đơn hàng (`/customer/orders`).

### [x] Giai Đoạn 9: Quản Lý Đơn Hàng Toàn Diện (Full CRUD User & Admin), Webhook SePay & Phòng Thủ Chống Hack (Spec 011) — ĐÃ HOÀN THÀNH
- [x] **Customer Orders CRUD (`/customer/orders`):**
  - Khắc phục lỗi card trống bằng smart fallback và sửa data mapping `unit_price`, `product_thumbnail`.
  - Popup chi tiết đơn hàng (`OrderDetailModal`): mã QR VietQR động kèm memo chuyển tiền, sao chép thông tin tài khoản, hủy đơn, xóa đơn.
- [x] **Admin Orders Full CRUD (`/admin/orders`):**
  - Đầy đủ 7 tab lọc trạng thái (Tất cả, Chờ duyệt, Chờ chuyển khoản, Đã duyệt, 🚨 Bị chặn quyền, Từ chối, Đã hủy).
  - Modal chỉnh sửa quản trị (`AdminOrderEditModal`): sửa trạng thái bất kỳ, cập nhật số tiền, mã giao dịch, ghi chú admin, xóa đơn.
  - Phê duyệt nhanh, Từ chối kèm lý do, và Chặn quyền truy cập (`blocked`) ngay trên danh sách hoặc drawer.
- [x] **Tích Hợp Webhook SePay Tự Động (`/api/webhooks/sepay`):**
  - Xác thực bảo mật `Authorization: Apikey <TOKEN>`.
  - Tự động đối soát số tiền và mã nội dung chuyển khoản `CV2026xxxx`.
  - Tự động kích hoạt trạng thái đơn `completed` và mở kho tải khi nhận đúng tiền.
- [x] **Ma Trận Bảo Mật Phòng Chống Hack:**
  - *Chống Webhook Fake*: Từ chối 401 Unauthorized nếu không có API key hoặc key không khớp.
  - *Chống Gian Lận Chuyển Thiếu Tiền (Underpayment)*: Nếu chuyển < số tiền đơn hàng (ví dụ chuyển 1.000đ cho đơn 80.000đ), hệ thống KHÔNG hoàn thành đơn, chuyển trạng thái `pending_approval` và gắn cờ cảnh báo đỏ cho Admin.
  - *Chống Bypass Khi Đã Bị Chặn (Admin Block Authority)*: Nếu Admin đã đặt đơn ở trạng thái `blocked`, Webhook SePay tuyệt đối không tự ý mở khóa đơn đó.
  - *Bảo Vệ API Tài Nguyên Số*: `/api/deliverables/lab/view` và `/download` lập tức trả về 403 Forbidden nếu đơn hàng bị `blocked`, chưa duyệt hoặc không tồn tại.


