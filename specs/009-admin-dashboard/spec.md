# Feature Specification: Admin Dashboard — Thống Kê & Phân Tích Doanh Thu

**Feature Branch**: `009-admin-dashboard`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Tổng Quan Dashboard Doanh Thu (Priority: P1)

Admin muốn có cái nhìn tổng quan ngay khi vào trang quản trị: tổng doanh thu, số đơn hàng hôm nay, số đơn chờ duyệt và tăng trưởng so với kỳ trước.

**Why this priority**: Dashboard là điểm vào đầu tiên của Admin — cung cấp thông tin then chốt để ra quyết định nhanh (đặc biệt là số đơn chờ duyệt cần xử lý ngay).

**Independent Test**: Đăng nhập Admin, xác nhận các thẻ KPI hiển thị đúng số liệu: tổng doanh thu (chỉ tính đơn `completed`), số đơn hôm nay và số đơn đang chờ duyệt — khớp với dữ liệu thực trong database.

**Acceptance Scenarios**:

1. **Given** Admin đăng nhập và truy cập Dashboard, **When** trang tải, **Then** hiển thị 4 thẻ KPI chính:
   - **Tổng doanh thu**: Tổng tiền từ các đơn hàng `completed` (tất cả thời gian).
   - **Doanh thu tháng này**: Doanh thu từ đầu tháng đến nay.
   - **Đơn chờ duyệt**: Số đơn hàng có trạng thái `pending_approval` — có badge đỏ nếu > 0.
   - **Tổng đơn hàng**: Tổng số đơn hàng tất cả trạng thái.
2. **Given** Dashboard đang hiển thị, **When** có đơn hàng mới được tạo hoặc duyệt, **Then** thẻ KPI tương ứng cập nhật mà không cần F5 trang (real-time hoặc polling mỗi 60 giây).
3. **Given** Admin bấm vào thẻ "Đơn chờ duyệt", **When** điều hướng, **Then** chuyển thẳng đến trang Quản lý đơn hàng với bộ lọc `pending_approval` đã được áp dụng.

---

### User Story 2 — Biểu Đồ Doanh Thu Theo Thời Gian (Priority: P1)

Admin muốn thấy xu hướng doanh thu qua biểu đồ đường/cột theo ngày, tuần hoặc tháng để phân tích và lập kế hoạch kinh doanh.

**Why this priority**: Biểu đồ xu hướng là công cụ quyết định cơ bản cho bất kỳ dashboard thương mại điện tử nào.

**Independent Test**: Xem biểu đồ doanh thu 30 ngày qua, chọn bộ lọc "7 ngày" và xác nhận biểu đồ cập nhật đúng với dữ liệu trong khoảng thời gian đó.

**Acceptance Scenarios**:

1. **Given** Admin đang xem Dashboard, **When** nhìn vào section biểu đồ doanh thu, **Then** biểu đồ hiển thị mặc định doanh thu 30 ngày qua theo từng ngày với trục X là ngày và trục Y là số tiền VNĐ.
2. **Given** Admin chọn bộ lọc thời gian (7 ngày / 30 ngày / 3 tháng / 12 tháng), **When** áp dụng, **Then** biểu đồ cập nhật ngay với khoảng thời gian mới và các điểm dữ liệu tương ứng.
3. **Given** Admin hover chuột vào một điểm dữ liệu trên biểu đồ, **When** tooltip hiển thị, **Then** thấy ngày, tổng doanh thu và số đơn hàng completed trong ngày đó.
4. **Given** không có đơn hàng completed trong khoảng thời gian được chọn, **When** biểu đồ hiển thị, **Then** hiển thị đường ngang tại 0 với thông báo "Chưa có doanh thu trong khoảng thời gian này" thay vì biểu đồ trống gây nhầm lẫn.

---

### User Story 3 — Thống Kê Theo Danh Mục Sản Phẩm (Priority: P2)

Admin muốn biết danh mục nào (Tools, Projects, LAB211) bán chạy nhất để tập trung phát triển sản phẩm.

**Why this priority**: Insight theo danh mục giúp tối ưu hóa danh mục sản phẩm và chiến lược bán hàng.

**Independent Test**: Xem biểu đồ tròn danh mục, xác nhận tổng tỉ lệ bằng 100% và khớp với số đơn hàng thực tế của từng danh mục.

**Acceptance Scenarios**:

1. **Given** Admin đang xem Dashboard, **When** nhìn vào section thống kê danh mục, **Then** biểu đồ tròn (pie chart) hiển thị tỉ lệ doanh thu theo từng danh mục (Tools, Projects, LAB211) cho tháng hiện tại.
2. **Given** Admin hover vào một phần của biểu đồ tròn, **When** tooltip hiển thị, **Then** thấy tên danh mục, doanh thu, số đơn hàng và tỉ lệ phần trăm.

---

### User Story 4 — Top Sản Phẩm Bán Chạy (Priority: P2)

Admin muốn biết sản phẩm nào được mua nhiều nhất để hiểu sở thích khách hàng và tối ưu hóa featured products.

**Why this priority**: Top sản phẩm là insight thực tế nhất để điều chỉnh chiến lược marketing và inventory.

**Independent Test**: Xem bảng top sản phẩm, xác nhận thứ tự khớp với số đơn hàng `completed` thực tế của từng sản phẩm.

**Acceptance Scenarios**:

1. **Given** Admin đang xem Dashboard, **When** nhìn vào section "Top sản phẩm", **Then** hiển thị bảng top 5 sản phẩm bán chạy nhất (theo số đơn `completed`) với: tên sản phẩm, danh mục, số đơn hàng và doanh thu tương ứng.
2. **Given** Admin bấm vào tên sản phẩm trong bảng top, **When** điều hướng, **Then** chuyển đến trang chỉnh sửa sản phẩm đó trong Admin.

---

### User Story 5 — Thống Kê Người Dùng (Priority: P3)

Admin muốn biết số khách hàng mới đăng ký và tổng số tài khoản trong hệ thống.

**Why this priority**: Metric tăng trưởng người dùng là chỉ số sức khỏe của nền tảng — quan trọng nhưng không cấp bách.

**Independent Test**: Xem thẻ KPI "Người dùng mới tháng này", xác nhận số khớp với tài khoản đăng ký trong tháng hiện tại.

**Acceptance Scenarios**:

1. **Given** Admin đang xem Dashboard, **When** nhìn vào section thống kê người dùng, **Then** thấy: tổng số tài khoản, số tài khoản mới trong 30 ngày qua và số khách hàng đã mua ít nhất một sản phẩm.

---

### Edge Cases

- Điều gì xảy ra khi doanh thu = 0 cho tất cả các kỳ — biểu đồ có hiển thị đúng không?
- Làm thế nào khi đơn hàng bị reject sau khi đã counted trong doanh thu tháng — số liệu có được cập nhật ngược lại không?
- Điều gì xảy ra khi có hàng nghìn đơn hàng — dashboard có bị chậm không?
- Doanh thu theo VNĐ — có cần format số thân thiện (1.500.000 thay vì 1500000)?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Dashboard PHẢI hiển thị 4 thẻ KPI: tổng doanh thu (tất cả thời gian), doanh thu tháng này, số đơn chờ duyệt và tổng số đơn hàng.
- **FR-002**: KPI chỉ tính đơn hàng có trạng thái `completed` trong tính toán doanh thu — không tính `pending` hay `rejected`.
- **FR-003**: Dashboard PHẢI hiển thị biểu đồ doanh thu theo thời gian với các tùy chọn: 7 ngày, 30 ngày, 3 tháng, 12 tháng.
- **FR-004**: Dashboard PHẢI hiển thị biểu đồ tỉ lệ doanh thu theo danh mục sản phẩm.
- **FR-005**: Dashboard PHẢI hiển thị bảng top 5 sản phẩm bán chạy nhất.
- **FR-006**: Số đơn chờ duyệt PHẢI được cập nhật tự động (polling hoặc real-time) — không cần F5 trang.
- **FR-007**: Tất cả số tiền PHẢI được định dạng theo đơn vị VNĐ với dấu phân cách nghìn (ví dụ: 1.500.000 đ).
- **FR-008**: Admin PHẢI có thể bấm vào thẻ KPI "Đơn chờ duyệt" để điều hướng nhanh đến danh sách đơn hàng đó.
- **FR-009**: Dashboard PHẢI hiển thị thống kê người dùng: tổng tài khoản, tài khoản mới trong 30 ngày.
- **FR-010**: Biểu đồ PHẢI hiển thị trạng thái rỗng/không có dữ liệu một cách rõ ràng thay vì vẽ biểu đồ trống.

### Key Entities

- **Dữ Liệu Doanh Thu Tổng Hợp (Revenue Aggregate)**: Tổng hợp từ các đơn hàng `completed`, nhóm theo ngày/tuần/tháng và theo danh mục.
- **KPI Snapshot**: Tổng doanh thu all-time, doanh thu tháng hiện tại, số đơn chờ, tổng đơn hàng, tổng người dùng.
- **Top Sản Phẩm**: Danh sách sản phẩm được sắp xếp theo số đơn hàng `completed` giảm dần.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dashboard tải và hiển thị đầy đủ trong vòng 3 giây.
- **SC-002**: Số liệu KPI chính xác 100% — không sai lệch so với truy vấn trực tiếp database.
- **SC-003**: Số đơn chờ duyệt cập nhật tự động — Admin không phải F5 để thấy đơn mới.
- **SC-004**: Biểu đồ doanh thu cập nhật đúng khi Admin thay đổi khoảng thời gian — phản hồi trong vòng 1 giây.
- **SC-005**: Tất cả số tiền hiển thị đúng định dạng VNĐ với dấu phân cách nghìn.

---

## Assumptions

- Tất cả doanh thu tính bằng VNĐ — không cần hỗ trợ đa tiền tệ.
- Dashboard chỉ dành cho Admin — không có phiên bản khách hàng.
- Dữ liệu thống kê được tính toán trực tiếp từ bảng `orders` — chưa cần data warehouse hay materialized views trong v1.
- Auto-refresh KPI theo polling mỗi 60 giây là đủ — không cần WebSocket real-time trong v1.
- Số liệu tháng hiện tại được tính từ ngày 1 của tháng đến thời điểm hiện tại.
