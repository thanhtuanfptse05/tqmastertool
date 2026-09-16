# Feature Specification: Product Detail & Rich Demo Engine (Spec 003)

**Feature Branch**: `003-product-detail-demo`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/components/store/ProductDetailModal.tsx`
- `src/app/products/[slug]/page.tsx`
- `src/components/3d/HeroCanvas.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Các sản phẩm số (mã nguồn, bot tự động, đồ án tốt nghiệp, bài lab Java) đòi hỏi khách hàng phải thấy được bằng chứng chất lượng cụ thể trước khi quyết định chuyển khoản: xem ảnh chụp màn hình, xem trích đoạn code thực tế, trải nghiệm website demo trực tiếp và danh sách tính năng cam kết.
- **Feature Goal**: Cung cấp cơ chế trình diễn đa phương tiện (Rich Demo Engine) với 2 chế độ xem (Modal xem nhanh trên Storefront + Trang chi tiết riêng biệt `/products/[slug]`) và canvas 3D tối ưu WebGL không rò rỉ bộ nhớ.
- **Success Metrics**:
  - Hỗ trợ xem gallery ảnh với thanh chuyển thumbnail mượt mà.
  - Sao chép code mẫu thực tế 1-click với phản hồi trực quan "Đã copy".
  - Nút mở link demo trực tiếp sang tab mới an toàn (`rel="noreferrer"`).
  - Three.js canvas đạt 60 FPS và giải phóng tài nguyên WebGL (`dispose()`) khi unmount.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Khách vãng lai & Khách hàng** | Xem modal chi tiết hoặc truy cập `/products/[slug]`, bấm xem ảnh gallery, copy code snippet, mở link demo ngoài, bấm "Đặt Mua Ngay (VietQR)". |
| **Quản trị viên (Admin)** | Cấu hình media demo cho sản phẩm (gallery, live demo URL, video URL, code snippet, features list, tech stack tags) qua `/admin/products`. |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Xem Nhanh Qua Modal Chi Tiết Trên Trang Chủ (Priority: P1)
- **GIVEN** người dùng đang ở trang chủ
- **WHEN** bấm nút "Xem Chi Tiết" trên một card sản phẩm
- **THEN** `ProductDetailModal` mở ra ngay lập tức mà không làm mất vị trí cuộn trang, hiển thị đầy đủ gallery, mô tả chi tiết, code snippet và nút "Đặt Mua Ngay (VietQR)".

### User Story 2 — Trang Chi Tiết Riêng Biệt `/products/[slug]` (Priority: P1)
- **GIVEN** người dùng truy cập trực tiếp URL sản phẩm theo slug (ví dụ: `/products/lab211-j1-s-p0001-bubble-sort`)
- **WHEN** trang tải
- **THEN** hệ thống render trang chi tiết với layout 2 cột:
  - Cột trái: Gallery ảnh lớn, thanh thumbnail, khối Code Preview Snippet có nút copy code, nội dung mô tả chi tiết Markdown/HTML.
  - Cột phải (Sticky): Thông tin danh mục, giá bán, giá gốc, nút mua hàng VietQR, nút xem demo web thực tế, danh sách đặc quyền kèm trust badges.

### User Story 3 — Trải Nghiệm Code Preview Snippet (Priority: P1)
- **GIVEN** sản phẩm có cấu hình `demo.code_preview_snippet` (đặc biệt là các bài LAB211 Java OOP)
- **WHEN** người dùng xem phần trích đoạn code và bấm nút "Copy code"
- **THEN** nội dung snippet được sao chép vào clipboard, nút chuyển sang icon Check và chữ "Đã copy" trong 2 giây.

### User Story 4 — Hiệu Ứng 3D Tương Tác & Tối Ưu Bộ Nhớ (Priority: P2)
- **GIVEN** Hero section hoặc showcase 3D tải `HeroCanvas`
- **WHEN** người dùng di chuyển chuột hoặc cuộn trang
- **THEN** vật thể 3D (Cyber Tech Core) phản hồi chuyển động mượt mà ở 60 FPS; khi component unmount, toàn bộ geometry và material được giải phóng (`dispose()`) để chống tràn RAM.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL support viewing product details either via popup modal or direct `/products/[slug]` route.
- **FR-002 (State-Driven)**: WHILE rendering the demo gallery, THE system SHALL display the selected image in the main viewport and allow switching by clicking thumbnail items.
- **FR-003 (Optional Feature)**: WHERE `product.demo.code_preview_snippet` is provided, THE system SHALL render the code block inside a syntax container with a one-click clipboard copy button.
- **FR-004 (Optional Feature)**: WHERE `product.demo.live_demo_url` is provided, THE system SHALL render an external link button with `target="_blank"` and `rel="noreferrer"`.
- **FR-005 (Event-Driven)**: WHEN the user clicks "Đặt Mua Ngay (VietQR)", THE system SHALL trigger `openCheckout(product)` to open the VietQR payment modal.

---

## 5. Data Model & Interfaces

```typescript
export interface ProductDemo {
  id: UUID;
  product_id: UUID;
  gallery_images: string[];
  live_demo_url?: string;
  video_demo_url?: string;
  demo_credentials?: string;
  code_preview_snippet?: string;
  features_list: string[];
  tech_stack_tags: string[];
  updated_at?: string;
}
```

---

## 6. Verification & Test Plan

- **Automated**: `tsc --noEmit` đạt 0 lỗi.
- **Manual Verification**:
  1. Trên trang chủ: Bấm "Xem Chi Tiết" sản phẩm -> Kiểm tra modal hiển thị đúng ảnh và nội dung.
  2. Truy cập trực tiếp đường dẫn `/products/[slug]` -> Kiểm tra giao diện 2 cột và nút "Quay lại danh mục".
  3. Bấm "Copy code" trên bài có code snippet -> Paste ra editor kiểm tra đúng mã nguồn.
  4. Bấm "Xem Website Demo Thực Tế" -> Mở tab mới đúng URL.
