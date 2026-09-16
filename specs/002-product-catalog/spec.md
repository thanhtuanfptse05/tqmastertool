# Feature Specification: Product Catalog — Duyệt & Tìm Kiếm Sản Phẩm (Spec 002)

**Feature Branch**: `002-product-catalog`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/app/page.tsx`
- `src/components/store/ProductCard.tsx`
- `src/lib/store.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Khách hàng (sinh viên IT, kỹ sư phần mềm) cần dễ dàng tìm kiếm, lọc và phân loại các sản phẩm số (bài tập LAB211 Java OOP, đồ án môn học tốt nghiệp, công cụ automation/bot) với giao diện hiện đại, trực quan, tải nhanh và trải nghiệm chuyên nghiệp.
- **Feature Goal**: Xây dựng storefront trang chủ (`/`) với phong cách Japanese Editorial Minimalism / Modern Clean Canvas (`#fafbfc`), tích hợp 3D Hero Render, quy trình 4 bước mua hàng và thanh công cụ tìm kiếm, lọc danh mục, sắp xếp giá tức thì.
- **Success Metrics**:
  - Thời gian lọc và tìm kiếm client-side phản hồi < 100ms.
  - 100% sản phẩm có trạng thái `archived` hoặc `draft` bị loại khỏi storefront (chỉ hiển thị `published`).
  - Giao diện đạt chuẩn Responsive và 60 FPS trên máy tính và thiết bị di động.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Khách vãng lai & Khách hàng** | Duyệt danh mục, tìm kiếm theo từ khóa/công nghệ, chọn sắp xếp giá, xem card sản phẩm, bấm "Xem Chi Tiết" hoặc "Mua Ngay". |
| **Quản trị viên (Admin)** | Xem storefront như khách hàng; quản lý danh sách sản phẩm hiển thị thông qua trang `/admin/products`. |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Duyệt Danh Sách Sản Phẩm Theo Danh Mục (Priority: P1)
- **GIVEN** người dùng truy cập trang chủ `/` tại section `#catalog`
- **WHEN** bấm vào một trong các category pills ("Tất Cả", "LAB211 OOP Java", "Project & Assignment", "Tiện Ích Tool")
- **THEN** danh sách sản phẩm lập tức lọc chỉ hiển thị các sản phẩm thuộc danh mục đã chọn (`category === selectedCategory`).

### User Story 2 — Tìm Kiếm Tức Thì Đa Tiêu Chí (Priority: P1)
- **GIVEN** người dùng nhập từ khóa vào ô tìm kiếm (ví dụ: "Java", "Spring", "J1.S.P0001", "Next.js")
- **WHEN** gõ ký tự
- **THEN** danh sách tự động lọc theo `title`, `short_description` và các thẻ công nghệ trong `demo.tech_stack_tags`.

### User Story 3 — Sắp Xếp Theo Giá & Thời Gian (Priority: P2)
- **GIVEN** danh sách sản phẩm đang hiển thị
- **WHEN** người dùng chọn tùy chọn sắp xếp từ dropdown:
  - "Nổi bật nhất" (`featured` - thứ tự mặc định)
  - "Mới cập nhật" (`newest` - theo timestamp `created_at` giảm dần)
  - "Giá: Thấp đến cao" (`price-asc`)
  - "Giá: Cao đến thấp" (`price-desc`)
- **THEN** danh sách được sắp xếp lại tức thì.

### User Story 4 — Trạng Thái Rỗng Thân Thiện & Đặt Lại Bộ Lọc (Priority: P2)
- **GIVEN** kết quả lọc không tìm thấy sản phẩm nào
- **WHEN** danh sách rỗng
- **THEN** hiển thị card nét đứt (dashed card) với thông báo "Không tìm thấy sản phẩm phù hợp" và nút "Đặt lại tất cả bộ lọc" (`resetFilters`).

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE storefront SHALL only display products with `status === "published"`.
- **FR-002 (Event-Driven)**: WHEN the user selects a category pill, THE system SHALL filter products by category (`tool` | `project` | `lab211` | `all`).
- **FR-003 (Event-Driven)**: WHEN the user inputs search text, THE system SHALL filter products matching title, short description, or tech stack tags case-insensitively.
- **FR-004 (Event-Driven)**: WHEN the user changes sort order, THE system SHALL sort the filtered list by the selected criteria without reloading the page.
- **FR-005 (State-Driven)**: WHILE products are rendered, each `ProductCard` SHALL display thumbnail, category badge, title, short description, tech stack tags, formatted VNĐ price, original price (with discount percentage if available), and CTA buttons ("Xem Chi Tiết", "Mua Ngay").

---

## 5. Data Model & Interfaces

```typescript
export type ProductCategory = "tool" | "project" | "lab211";
export type ProductStatus = "draft" | "published" | "archived";

export interface Product {
  id: UUID;
  category: ProductCategory;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  price: number;
  original_price?: number;
  thumbnail_url: string;
  status: ProductStatus;
  deliverable_type: "download_file" | "git_access" | "license_key" | "instructions_only";
  storage_file_path?: string;
  git_repo_url?: string;
  license_key_template?: string;
  access_instructions?: string;
  created_at: string;
  updated_at: string;
  demo?: ProductDemo;
}
```

---

## 6. Verification & Test Plan

- **Automated**: `npm run build` & `tsc --noEmit` hoàn tất thành công.
- **Manual Verification**:
  1. Kiểm tra filter tabs: chuyển giữa All, LAB211, Project, Tool và kiểm tra số lượng hiển thị.
  2. Gõ từ khóa tìm kiếm: kiểm tra khớp tên bài hoặc tag công nghệ.
  3. Kiểm tra dropdown sắp xếp: Thấp đến cao -> Cao đến thấp.
  4. Đặt bộ lọc không có kết quả -> Bấm "Đặt lại tất cả bộ lọc".
