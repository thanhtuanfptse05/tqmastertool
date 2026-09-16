# Feature Specification: Admin Dashboard — Thống Kê & Phân Tích Doanh Thu (Spec 009)

**Feature Branch**: `009-admin-dashboard`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/app/admin/page.tsx`
- `src/app/admin/layout.tsx`
- `src/lib/store.tsx`
- `src/lib/vietqr.ts`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Ban quản trị CodeVault Studio cần nắm bắt tức thì tình hình tài chính thực tế (chỉ tính các giao dịch VietQR đã được Admin phê duyệt thành công), theo dõi số lượng đơn hàng đang chờ duyệt để kịp thời đối chiếu ngân hàng và phân tích xu hướng bán chạy theo 3 danh mục (LAB211, Project, Tool).
- **Feature Goal**: Xây dựng Admin Dashboard hoàn chỉnh tại `/admin` tuân thủ tiêu chuẩn `design.md`: 4 thẻ KPI pastel, banner cảnh báo đơn chờ duyệt khẩn cấp, biểu đồ Area Chart xu hướng doanh thu và biểu đồ Donut Chart phân bố danh mục.
- **Success Metrics**:
  - Doanh thu chỉ tính trên các đơn hàng `completed`, không tính đơn nháp hay đơn chờ.
  - Thẻ cảnh báo đơn chờ duyệt hiển thị nổi bật kèm nút bấm điều hướng 1-click sang `/admin/orders`.
  - Biểu đồ Area Chart và Donut Chart render mượt mà bằng vector SVG thuần, hỗ trợ lọc theo mốc thời gian 7 ngày, 30 ngày và 3 tháng.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Quản trị viên (Admin)** | Xem toàn bộ các chỉ số KPI, lọc khoảng thời gian trên biểu đồ, bấm vào thông báo đơn chờ duyệt để chuyển sang màn hình phê duyệt, xem bảng 5 giao dịch gần nhất. |
| **Khách hàng** | Không có quyền truy cập trang này (bị chặn bởi RBAC guard tại `src/app/admin/layout.tsx`). |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Xem 4 Thẻ KPI Doanh Thu & Đơn Hàng (Priority: P1)
- **GIVEN** Admin đăng nhập và truy cập `/admin`
- **WHEN** trang tải
- **THEN** hiển thị 4 thẻ thống kê pastel:
  1. **Tổng Doanh Thu** (Nền `#edf5ff`, viền `#dbeafe`, chữ `#3b82f6`): Tổng tiền từ các đơn hàng `completed` (ví dụ: `formatVND(totalRevenue)`).
  2. **Tổng Đơn Hàng** (Nền `#f3eefd`, viền `#ede9fe`, chữ `#8b5cf6`): Tổng số đơn với phân tích số đơn hoàn thành và số đơn chờ duyệt.
  3. **Giá Trị Đơn TB** (Nền `#eafaf5`, viền `#d1fae5`, chữ `#059669`): Doanh thu trung bình trên mỗi đơn hoàn tất.
  4. **Sinh Viên & Khách Hàng** (Nền `#fff7ed`, viền `#ffedd5`, chữ `#d97706`): Tổng số tài khoản đăng ký trên hệ thống.

### User Story 2 — Banner Cảnh Báo Đơn Chờ Duyệt Khẩn Cấp (Priority: P1)
- **GIVEN** có ít nhất 1 đơn hàng ở trạng thái `pending_approval`
- **WHEN** Admin vào Dashboard
- **THEN** xuất hiện banner màu vàng cam nổi bật với icon chuông cảnh báo nhấp nháy, hiển thị số lượng đơn đang chờ duyệt và nút "Duyệt Đơn Ngay" dẫn thẳng đến `/admin/orders`.

### User Story 3 — Phân Tích Xu Hướng Doanh Thu Bằng Biểu Đồ Area Chart (Priority: P1)
- **GIVEN** Admin xem khối biểu đồ Area Chart
- **WHEN** bấm đổi các nút filter: "7 ngày", "30 ngày", "3 tháng"
- **THEN** biểu đồ cập nhật mốc thời gian, hiển thị đường cong doanh thu mượt mà với dải gradient màu xanh `#3b82f6` và các điểm mốc dữ liệu nổi bật.

### User Story 4 — Cơ Cấu Doanh Số Theo Danh Mục Bằng Donut Chart (Priority: P2)
- **GIVEN** Admin xem khối biểu đồ Donut Chart
- **WHEN** hệ thống phân tích doanh số các đơn `completed` theo từng danh mục
- **THEN** hiển thị hình vành khăn với 3 phân đoạn màu:
  - LAB211 OOP: Màu xanh dương `#2563eb`
  - Project & Assignment: Màu tím `#8b5cf6`
  - Tiện Ích Tool: Màu xanh ngọc `#10b981`
  kèm bảng chú giải phần trăm doanh thu tương ứng.

### User Story 5 — Bảng 5 Đơn Hàng Gần Nhất (Priority: P2)
- **GIVEN** Admin cuộn xuống cuối Dashboard
- **WHEN** xem section "Đơn Hàng Gần Đây"
- **THEN** bảng hiển thị tối đa 5 đơn hàng mới nhất với: Mã đơn, Khách hàng, Sản phẩm, Số tiền, Badge trạng thái màu và nút xem chi tiết.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL calculate `totalRevenue` and `avgOrderValue` using ONLY orders where `status === "completed"`.
- **FR-002 (State-Driven)**: WHILE there are orders with `status === "pending_approval"`, THE system SHALL render the urgent pending approval alert banner with count and direct CTA.
- **FR-003 (Event-Driven)**: WHEN the admin toggles chart timeframe between `7d`, `30d`, and `3m`, THE system SHALL update the active timeframe state and re-render the SVG Area Chart.
- **FR-004 (State-Driven)**: WHILE rendering the Donut Chart, THE system SHALL calculate percentage proportions across categories (`lab211`, `project`, `tool`) based on completed order items.
- **FR-005 (Ubiquitous)**: THE system SHALL format all currency values in Vietnamese Đồng (`formatVND()`).

---

## 5. UI Style System (Conforming to design.md)

| Component | Background | Border | Primary Text | Icon |
|---|---|---|---|---|
| Card Doanh Thu | `#edf5ff` | `#dbeafe` | `#3b82f6` | `TrendingUp` (Emerald) |
| Card Đơn Hàng | `#f3eefd` | `#ede9fe` | `#8b5cf6` | `ShoppingBag` (Purple) |
| Card Giá Trị TB | `#eafaf5` | `#d1fae5` | `#059669` | `CreditCard` (Emerald) |
| Card Khách Hàng | `#fff7ed` | `#ffedd5` | `#d97706` | `Users` (Amber) |

---

## 6. Verification & Test Plan

- **Automated**: `tsc --noEmit` đạt 0 lỗi.
- **Manual Verification**:
  1. Đăng nhập quyền Admin -> Mở `/admin`.
  2. Kiểm tra số liệu 4 thẻ pastel: Doanh thu hiển thị đúng tiền VNĐ.
  3. Tạo đơn hàng mới và up bill -> Vào lại Dashboard -> Kiểm tra banner màu cam cảnh báo đơn chờ duyệt xuất hiện.
  4. Bấm chuyển các mốc "7 ngày", "30 ngày", "3 tháng" trên biểu đồ Area Chart.
  5. Bấm nút "Xem tất cả" tại bảng đơn hàng -> Điều hướng đúng sang `/admin/orders`.
