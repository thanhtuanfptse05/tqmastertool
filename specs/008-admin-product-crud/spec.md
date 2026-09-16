# Feature Specification: Admin Product CRUD — Quản Lý Sản Phẩm & Cấu Hình Demo (Spec 008)

**Feature Branch**: `008-admin-product-crud`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/app/admin/products/page.tsx`
- `src/app/api/admin/upload/asset/route.ts`
- `src/app/api/admin/upload/deliverable/route.ts`
- `src/lib/store.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Quản trị viên cần công cụ toàn diện để thêm mới, cập nhật thông tin sản phẩm số, cấu hình media demo phong phú (ảnh, video, link web demo, code snippet), tải file mã nguồn bàn giao lên Private Storage và lưu trữ an toàn.
- **Feature Goal**: Xây dựng trung tâm quản trị sản phẩm `/admin/products` với form tạo/chỉnh sửa modal đầy đủ các trường nghiệp vụ, 2 API upload chuyên dụng (ảnh public và file zip private) và cơ chế xóa mềm (`archived`).
- **Success Metrics**:
  - Hỗ trợ tạo và cập nhật sản phẩm đầy đủ thông tin trong < 2 phút.
  - Tải ảnh thumbnail/gallery lên Supabase Storage bucket `product-assets` tự động.
  - Tải file mã nguồn giao hàng lên private bucket `digital-deliverables` (tối đa 50MB) an toàn.
  - Xóa mềm sản phẩm bằng trạng thái `archived`, không làm đứt gãy lịch sử đơn hàng cũ.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Quản trị viên (Admin)** | Xem bảng danh sách sản phẩm, lọc theo danh mục, tìm kiếm, mở modal tạo mới/chỉnh sửa sản phẩm, upload ảnh & deliverable zip, chuyển trạng thái lưu trữ (`archived`). |
| **Khách hàng** | Không có quyền truy cập trang này. Sản phẩm `published` sẽ hiển thị trên Storefront của khách. |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Tạo Sản Phẩm Mới Đầy Đủ Thông Tin (Priority: P1)
- **GIVEN** Admin bấm nút "Thêm Sản Phẩm Mới" tại `/admin/products`
- **WHEN** modal form mở ra, Admin điền:
  - Danh mục: `lab211`, `project`, hoặc `tool`.
  - Tiêu đề sản phẩm, slug tự động sinh hoặc tùy chỉnh.
  - Giá bán (VNĐ) và Giá gốc (gợi ý giảm giá).
  - Tải ảnh thumbnail qua nút upload hoặc dán link ảnh.
  - Mô tả ngắn và Mô tả chi tiết.
  - Trạng thái: `published` hoặc `draft`.
- **THEN** hệ thống gọi `adminCreateProduct`, lưu vào state và Supabase `products` table, hiển thị sản phẩm mới ngay trong bảng.

### User Story 2 — Cấu Hình Rich Demo & Code Snippet (Priority: P1)
- **GIVEN** Admin đang tạo hoặc chỉnh sửa sản phẩm
- **WHEN** Admin cấu hình phần "Demo & Trình Diễn":
  - Dán URL website demo sống (`live_demo_url`).
  - Dán URL video review demo (`video_demo_url`).
  - Dán đoạn mã nguồn mẫu (`code_preview_snippet`) cho bài LAB211 hoặc đồ án.
  - Nhập danh sách tính năng (`features_list`) và danh sách thẻ công nghệ (`tech_stack_tags`).
  - Tải lên nhiều ảnh gallery qua API upload asset.
- **THEN** dữ liệu được lưu vào `product_demos`, hiển thị trên storefront khi khách hàng xem chi tiết.

### User Story 3 — Tải File Mã Nguồn Bàn Giao (Deliverable Package) (Priority: P1)
- **GIVEN** Admin cấu hình gói giao hàng cho sản phẩm
- **WHEN** chọn file ZIP mã nguồn từ máy tính
- **THEN** client gửi file qua `POST /api/admin/upload/deliverable`, server lưu vào private bucket `digital-deliverables` tại `packages/{timestamp}_{name}.zip`, điền tự động `storage_file_path` vào form.

### User Story 4 — Chỉnh Sửa & Xóa Mềm Sản Phẩm (Priority: P1)
- **GIVEN** Admin muốn cập nhật giá hoặc ẩn một sản phẩm
- **WHEN** bấm nút "Sửa" hoặc "Xóa"
- **THEN**:
  - Bấm "Sửa": form điền sẵn dữ liệu cũ, bấm lưu gọi `adminUpdateProduct`.
  - Bấm "Xóa": hệ thống thực hiện xóa mềm bằng cách gọi `adminArchiveProduct`, chuyển trạng thái thành `archived` và ẩn khỏi Storefront.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL validate that Title, Price, and Category are non-empty upon product save.
- **FR-002 (Event-Driven)**: WHEN an admin uploads thumbnail or gallery files via `POST /api/admin/upload/asset`, THE server SHALL validate MIME types (JPG, PNG, WEBP, GIF, SVG), verify size <= 10MB, and store in bucket `product-assets`.
- **FR-003 (Event-Driven)**: WHEN an admin uploads deliverable packages via `POST /api/admin/upload/deliverable`, THE server SHALL verify size <= 50MB and store in private bucket `digital-deliverables`.
- **FR-004 (Event-Driven)**: WHEN an admin archives a product, THE system SHALL update its status to `archived` to preserve historical order references.
- **FR-005 (State-Driven)**: WHILE editing a product, THE system SHALL support `deliverable_type` options: `download_file`, `git_access`, `license_key`, `instructions_only`.

---

## 5. API Endpoints Specification

### 1. `POST /api/admin/upload/asset`
- **Purpose**: Upload ảnh thumbnail và ảnh gallery vào bucket `product-assets`.
- **Limit**: Max 10MB; Chấp nhận JPG, PNG, WEBP, GIF, SVG.
- **Response**: `{ success: true, url: string, path: string, fileName: string, size: number }`.

### 2. `POST /api/admin/upload/deliverable`
- **Purpose**: Upload file mã nguồn .ZIP vào private bucket `digital-deliverables`.
- **Limit**: Max 50MB; MIME `application/zip` hoặc file nén.
- **Response**: `{ success: true, storagePath: string, fileName: string, size: number }`.

---

## 6. Verification & Test Plan

- **Automated**: `tsc --noEmit` đạt 0 lỗi.
- **Manual Verification**:
  1. Vào `/admin/products` -> Bấm "Thêm Sản Phẩm Mới".
  2. Upload thumbnail ảnh -> Kiểm tra ảnh hiển thị preview ngay.
  3. Upload file ZIP deliverable -> Kiểm tra trả về đường dẫn `packages/...`.
  4. Điền code snippet và lưu -> Vào trang chủ kiểm tra sản phẩm mới hiển thị đầy đủ thông tin.
  5. Bấm nút xóa sản phẩm -> Kiểm tra sản phẩm chuyển trạng thái và biến mất khỏi trang chủ.
