# PROJECT CONSTITUTION — Digital Store (Tools, Projects & LAB211)

Version: 1.0.0 | Status: LOCKED
Applies to: All AI Agents, Developers, Pull Requests
Architecture Standard: Spec-Driven Development (SDD) & Agent-Driven Development (ADD) Hybrid Model
Ratified: 2026-03-15

═══════════════════════════════════════════════════
  LAYER 1: HARD RULES — KHÔNG BAO GIỜ VI PHẠM
═══════════════════════════════════════════════════

## SEC-01: Bảo Vệ Dữ Liệu Nhạy Cảm & Credentials
THE system SHALL NOT lưu bất kỳ secret, API key, service_role key hoặc database credentials nào dưới dạng plaintext trong source code, git commits, public client bundles hoặc client-side logs.
- Supabase `SUPABASE_SERVICE_ROLE_KEY` chỉ được phép dùng tại Server-Side (Next.js Server Actions / Route Handlers), TUYỆT ĐỐI KHÔNG expose ra client (`NEXT_PUBLIC_*`).
- Client chỉ được phép sử dụng `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Vi phạm quy tắc này: CI build fail ngay lập tức, block PR.

## SEC-02: Nguyên Tắc Bảo Vệ Nội Dung Số (Protected Digital Deliverables)
THE system SHALL NOT cung cấp link tải (download link), source code zip, kho lưu trữ private git hoặc license key cho client TRƯỚC KHI đơn hàng được Admin DUYỆT (Status = `completed` / `approved`).
- File tải về phải được lưu trong Supabase Storage Bucket ở chế độ PRIVATE (`digital-deliverables`), không được để public.
- Client chỉ nhận được Signed URL có thời hạn (time-limited signed URL, max 1 giờ) sau khi server xác thực quyền sở hữu đơn hàng đã thanh toán và được duyệt.
- API / Server Actions trả về chi tiết sản phẩm cho khách vãng lai hoặc đơn hàng chưa duyệt TUYỆT ĐỐI KHÔNG chứa trường dữ liệu nhạy cảm (`source_download_url`, `git_repo_url`, `access_secret`).

## SEC-03: Xác Thực & Phân Quyền Bắt Buộc (Authentication & Authorization)
THE system SHALL yêu cầu xác thực JWT qua Supabase Auth cho:
- Mọi thao tác đặt hàng, xem lịch sử đơn hàng, xem link tải cá nhân.
- Mọi thao tác quản trị Admin (truy cập Dashboard, duyệt đơn, CRUD sản phẩm, xem báo cáo doanh thu).
- Phân quyền RBAC nghiêm ngặt: Vai trò `admin` được lưu trong bảng `profiles` hoặc custom claims và được verify bằng Middleware / Server Guard. Người dùng thông thường (role `customer`) không thể truy cập các route `/admin/*` hay các API mutation của admin.

## SEC-04: Input Validation & Sanitization
THE system SHALL validate và sanitize tất cả input từ người dùng tại Server Side bằng Zod schemas trước khi tương tác với database.
- Không sử dụng raw string concatenation trong SQL. Mọi thao tác database phải đi qua Supabase Client SDK có type-safety hoặc parameterized queries.

## DATA-01: Soft Delete & Bảo Vệ Lịch Sử Giao Dịch
THE system SHALL áp dụng Soft Delete (`deleted_at TIMESTAMP WITH TIME ZONE`) cho các thực thể quan trọng: Sản phẩm (`products`), Đơn hàng (`orders`), Người dùng (`users/profiles`).
- TUYỆT ĐỐI KHÔNG hard-delete các bản ghi đơn hàng đã phát sinh thanh toán.
- Hard delete chỉ cho phép đối với dữ liệu tạm (temp files, cache) hoặc trong môi trường test.

## AUDIT-01: Audit Trail Cho Mọi Quyết Định Quản Trị
THE system SHALL lưu vết (Audit Log) cho các hành động quan trọng của Admin:
- Duyệt đơn hàng (`order_approved`)
- Từ chối đơn hàng (`order_rejected`)
- Thay đổi giá / quyền sở hữu sản phẩm (`product_price_changed`, `product_archived`)
- Thông tin log bắt buộc gồm: `admin_id`, `action`, `target_entity`, `target_id`, `metadata`, `timestamp`.

═══════════════════════════════════════════════════
  LAYER 2: ARCHITECTURAL CONSTRAINTS
═══════════════════════════════════════════════════

## ARCH-01: Kiến Trúc Phân Tầng & Ranh Giới Module
THE system SHALL áp dụng kiến trúc Modular Monolith dựa trên Next.js App Router:
```
src/
├── app/               # Presentation & Routes (Customer Storefront + Admin Portal)
├── components/        # UI Components (3D Canvas, Common, Admin, Storefront)
├── core/
│   ├── domain/        # Entities, Enums, Types chuẩn
│   ├── usecases/      # Business logic (Orders, Products, Payments, Demos)
│   └── services/      # Supabase Client, Storage, VietQR Generator
└── lib/               # Utilities, Zod schemas, Formatters
```
- Client Components (`"use client"`) không được import trực tiếp các server services có chứa logic bảo mật hoặc service_role key.
- Giao tiếp dữ liệu giữa Client và Supabase qua Server Actions hoặc Typed API Route Handlers.

## ARCH-02: Three.js & Animation Performance Standards
THE system SHALL tối ưu hóa việc sử dụng Three.js (qua `@react-three/fiber` hoặc native Three.js canvas) để đảm bảo trải nghiệm mượt mà (60 FPS):
- Three.js Canvas chỉ render theo nhu cầu (`frameloop="demand"` hoặc chỉ loop khi có tương tác hover/scroll/camera).
- Sử dụng Lazy loading (`dynamic(..., { ssr: false })`) cho các 3D Canvas và hiệu ứng nặng để không làm chậm First Contentful Paint (FCP).
- Thư viện chuyển động: Hỗ trợ `framer-motion` cho micro-interactions và transitions mượt mà giữa các trang.

## ARCH-03: Supabase Row Level Security (RLS)
THE system SHALL kích hoạt Row Level Security (RLS) trên 100% các bảng trong PostgreSQL:
- Bảng `products`: Khách vãng lai và customer chỉ được đọc các sản phẩm có `status = 'published'`. Chỉ admin mới có quyền CRUD.
- Bảng `orders`: Khách chỉ đọc và tạo đơn hàng của chính mình (`auth.uid() = user_id`). Chỉ admin mới có quyền update `status` (duyệt/từ chối đơn).
- Bảng `order_items` & `purchased_deliverables`: Khách chỉ đọc được nội dung download khi đơn hàng cha có trạng thái `completed`.

## ARCH-04: Đa Phương Tiện Cho Demo (Rich Multi-Media Demos)
THE system SHALL thiết kế thực thể sản phẩm (Tools, Projects, LAB211) hỗ trợ cấu trúc Demo phong phú:
- Gallery: Tối thiểu hỗ trợ mảng nhiều hình ảnh (thumbnails + high-res screenshots).
- Live Demo Link: Hỗ trợ URL trỏ đến ứng dụng đang chạy thực tế.
- Video Demo: Hỗ trợ link video (YouTube embed, Loom hoặc MP4 direct).
- Documentation / Snippet: Hỗ trợ Markdown preview cho tài liệu hướng dẫn và mã nguồn mẫu.

═══════════════════════════════════════════════════
  LAYER 3: ENGINEERING STANDARDS
═══════════════════════════════════════════════════

## TECH STACK (Chuẩn hóa — Bất biến)
- Framework: Next.js 14+ (App Router) với React 18/19
- Ngôn ngữ: TypeScript (Strict mode enabled, tuyệt đối không dùng `any`)
- Styling: Tailwind CSS 3.x kết hợp CSS Custom Animations (Glassmorphism, Neon Dark UI)
- 3D Graphics: Three.js (`three`), `@react-three/fiber`, `@react-three/drei`
- Chuyển động: `framer-motion`
- Icons: `lucide-react`
- Backend & DB: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- State & Form: React Hook Form + Zod validation
- Payment Integration: VietQR chuẩn EMVCo format (Tạo mã QR kèm cú pháp chuyển khoản tự động)

## CODING STANDARDS
- TypeScript: Luôn định nghĩa Interface/Type rõ ràng trong `@/types` hoặc `.sdd/shared_context.md`.
- Naming Conventions:
  - Components: PascalCase (e.g. `ProductHero3D.tsx`, `OrderApprovalTable.tsx`)
  - Utilities / Hooks: camelCase (e.g. `useSupabaseAuth.ts`, `generateVietQr.ts`)
  - Database Tables: snake_case (e.g. `products`, `product_demos`, `orders`, `order_items`)
  - Route Handlers: kebab-case (e.g. `/api/orders/verify-payment`)

## DEFINITION OF DONE (DoD)
Một tính năng chỉ được xem là hoàn thành khi:
1. Đã tuân thủ đầy đủ spec hoặc RFC tương ứng trong `.sdd/`.
2. Không còn bất kỳ lỗi linting (`npm run lint`), không có TypeScript compile errors.
3. RLS policy trên Supabase đã được kiểm tra tính bảo mật.
4. Giao diện đáp ứng tốt trên cả Mobile, Tablet và Desktop.
5. Hiệu ứng Three.js và animation chạy mượt mà, không giật lag bộ nhớ (memory leak check).
