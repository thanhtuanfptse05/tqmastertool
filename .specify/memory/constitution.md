# CodeVault Studio Constitution — Digital Store (Tools, Projects & LAB211)

> Liên kết chính thức: [.sdd/constitution.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/constitution.md)

## Core Principles

### I. Protected Digital Deliverables (NON-NEGOTIABLE)
THE system SHALL NOT cung cấp link tải (download link), source code zip, kho lưu trữ private git hoặc license key cho client TRƯỚC KHI đơn hàng được Admin DUYỆT (Status = `completed`).
- File tải về phải được lưu trong Supabase Storage Bucket ở chế độ PRIVATE (`digital-deliverables`), không được để public.
- Client chỉ nhận được Signed URL có thời hạn (max 60 phút) sau khi server xác thực quyền sở hữu đơn hàng đã thanh toán và được duyệt.

### II. Mandatory Admin Approval & Full CRUD
Mọi đơn hàng thanh toán qua VietQR sau khi khách gửi bill sẽ chuyển sang trạng thái `pending_approval`.
- Chỉ tài khoản có vai trò `admin` mới có quyền duyệt đơn (`approve` -> `completed`) hoặc từ chối (`reject`).
- Admin Portal phải có đầy đủ tính năng CRUD (Sản phẩm, Đơn hàng, Danh mục) và Dashboard thống kê doanh thu (ngày, tuần, tháng, tổng) cùng cảnh báo đơn chờ duyệt.

### III. Rich Multi-Media Demos (NO SINGLE-IMAGE PRODUCTS)
Mọi sản phẩm thuộc 3 danh mục (Tools, Projects, LAB211) KHÔNG ĐƯỢC chỉ có một ảnh duy nhất.
- Phải hỗ trợ: Multi-image gallery (screenshots), Live demo URL, Video demo preview (YouTube/MP4), Code preview snippet (đặc biệt quan trọng cho LAB211 và Project), Tech stack tags.

### IV. Visual Wow & Three.js 60 FPS Standard
Giao diện ứng dụng mang phong cách Modern Dark Cyberpunk, chuyển động mượt mà với Framer Motion và Three.js interactive 3D Canvas.
- Mọi Three.js scene phải tối ưu 60 FPS, giới hạn DPR `dpr={[1, 1.5]}` và luôn dispose geometry/material/texture khi unmount để chống rò rỉ RAM/WebGL context.

### V. Security & Secrets Isolation
- Supabase `SUPABASE_SERVICE_ROLE_KEY` chỉ được phép dùng tại Server-Side (Server Actions / Route Handlers). TUYỆT ĐỐI KHÔNG expose ra client (`NEXT_PUBLIC_*`).
- Tuyệt đối không sử dụng kiểu `any` trong TypeScript. Bật strict mode toàn bộ.

## Technology Stack
- **Frontend Framework**: Next.js 14+ (App Router) với React 18/19 & TypeScript (Strict)
- **Styling**: Tailwind CSS + Custom Cyberpunk Animations
- **3D Graphics & Motion**: Three.js, `@react-three/fiber`, `@react-three/drei`, `framer-motion`
- **Backend & Database**: Supabase (PostgreSQL 16, Supabase Auth, Supabase Storage, RLS)
- **Payment**: VietQR (EMVCo specification QR generator)

## Governance
Mọi thay đổi đối với tài liệu này phải được thảo luận và đồng thuận qua quy trình RFC / Architecture Review. Mọi spec và implementation tạo bởi Spec Kit đều phải tuân thủ nghiêm ngặt hiến pháp này.

**Version**: 1.0.0 | **Ratified**: 2026-03-15 | **Status**: LOCKED
