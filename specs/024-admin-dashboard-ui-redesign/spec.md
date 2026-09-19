# Feature Specification: Admin Dashboard Modern UI Redesign

**Feature Branch**: `024-admin-dashboard-ui-redesign`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "cải thiện lại cái giao diện dashboard giúp t cho đẹp hơn"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Thẻ Chỉ Số Thống Kê Hiện Đại & Cao Cấp (Priority: P1)

Là một Quản trị viên (Admin), tôi muốn các thẻ chỉ số (KPI Stat Cards) trên Dashboard hiển thị bắt mắt, chuyên nghiệp với hiệu ứng hiện đại (subtle gradient, icon nổi bật, micro-badges, hover lift) thay vì các khối màu pastel thô cứng, giúp nắm bắt tình hình tài chính và khách hàng ngay tức khắc.

**Why this priority**: Các thẻ thống kê doanh thu, đơn hàng, giá trị TB và người dùng là điểm nhìn đầu tiên (First Impression) khi Admin mở hệ thống. Nâng cấp thẩm mỹ và phân cấp thị giác tại đây tạo ấn tượng mạnh mẽ nhất.

**Independent Test**: Truy cập `/admin`, kiểm tra 4 thẻ chỉ số hiển thị bóng bẩy với đầy đủ số liệu thực từ database (`totalRevenue`, `totalOrdersCount`, `avgOrderValue`, `totalUsersCount`), icon nổi bật kèm hiệu ứng hover tương tác.

**Acceptance Scenarios**:

1. **Given** Quản trị viên đang ở trang `/admin`, **When** trang tải xong số liệu, **Then** 4 stat cards hiển thị với thiết kế hiện đại, typography đậm nét, icon gradient bo tròn sang trọng, và badge tiến độ/tỉ lệ hoàn thành rõ ràng.
2. **Given** Quản trị viên di chuột (hover) vào từng stat card, **When** con trỏ rê qua, **Then** thẻ có hiệu ứng nâng nhẹ (`-translate-y-1`), bóng đổ mịn màng và viền sáng tinh tế.

---

### User Story 2 - Biểu Đồ Doanh Thu Đường Cong Mượt & Tooltip Tương Tác (Priority: P1)

Là một Quản trị viên, tôi muốn biểu đồ "Xu Hướng Doanh Thu" được vẽ bằng đường cong mượt mà (smooth Bezier / spline curve), có dải gradient phát sáng dưới đáy, và hỗ trợ hover tooltip hiển thị ngày cùng số tiền chính xác, thay cho đường gấp khúc thô sơ hiện tại.

**Why this priority**: Biểu đồ là linh hồn của Dashboard. Đường cong mềm mại kết hợp hover tooltip cung cấp trải nghiệm phân tích số liệu chuẩn SaaS cao cấp (tương tự Stripe, Linear).

**Independent Test**: Thay đổi giữa các mốc Ngày / Tháng / Năm, rê chuột qua từng điểm trên đồ thị và kiểm tra tooltip nổi bật hiển thị đúng ngày và doanh thu VND tương ứng.

**Acceptance Scenarios**:

1. **Given** Có dữ liệu đơn hàng đã hoàn thành, **When** biểu đồ render, **Then** đường line hiển thị dạng cong mượt (smooth path) với gradient phát sáng tinh tế phía dưới.
2. **Given** Quản trị viên rê chuột dọc theo biểu đồ, **When** con trỏ ở gần các mốc thời gian, **Then** hiển thị đường chỉ báo dọc và hộp tooltip nổi bật chứa nhãn ngày/tháng và doanh thu bằng format VND.
3. **Given** Quản trị viên bấm chuyển đổi giữa "Ngày", "Tháng", "Năm", **When** tab thay đổi, **Then** dữ liệu trục X, trục Y và đường cong được tính toán lại ngay lập tức và mượt mà.

---

### User Story 3 - Biểu Đồ Donut Cơ Cấu Danh Mục Chuẩn Xác & Thẩm Mỹ (Priority: P2)

Là một Quản trị viên, tôi muốn biểu đồ tròn "Cơ Cấu Danh Mục" hiển thị đẹp mắt, chữ ở tâm hiển thị đầy đủ (không bị cắt chữ cộc lốc như "Tiện"), đồng thời có thanh phần trăm trực quan chi tiết cho từng danh mục.

**Why this priority**: Hiện tại chữ tâm biểu đồ bị cắt thành "Tiện" do `split(" ")[0]`, gây mất thẩm mỹ và tạo cảm giác giao diện lỗi. Cần khắc phục triệt để và hiển thị danh mục rõ ràng.

**Independent Test**: Kiểm tra tâm biểu đồ tròn hiển thị tiêu đề danh mục hoặc tỷ trọng tổng quan hoàn chỉnh, bên dưới có thanh tiến độ (progress bar) thể hiện tỉ trọng doanh số từng mảng sản phẩm.

**Acceptance Scenarios**:

1. **Given** Danh mục có tỉ trọng cao nhất là "Tiện Ích Tool", **When** donut chart render, **Then** tâm vòng tròn hiển thị đầy đủ ("Tiện Ích Tool" hoặc nhãn tỉ trọng hợp lý, không bị cắt cụt) kèm số liệu rõ ràng.
2. **Given** Danh sách các danh mục bên dưới, **When** hiển thị, **Then** mỗi mục có thanh mini progress bar với màu sắc nhận diện riêng, hiển thị cả số tiền thu được và tỷ lệ phần trăm.

---

### User Story 4 - Widget Sản Phẩm Bán Chạy & Bảng Đơn Hàng Hiện Đại (Priority: P2)

Là một Quản trị viên, tôi muốn xem nhanh Top các sản phẩm bán chạy nhất cùng với bảng Đơn Hàng Gần Đây được thiết kế theo phong cách hiện đại (avatar khách hàng, mã đơn định dạng badge, status pill phát sáng nhẹ, bộ lọc tìm kiếm nhanh).

**Why this priority**: Giúp Admin quản lý và theo dõi hiệu suất bán hàng của từng sản phẩm mà không cần mở nhiều trang riêng lẻ.

**Independent Test**: Bảng đơn hàng hiển thị 5 giao dịch mới nhất với avatar chữ cái đầu của khách, mã đơn `#ORD-...`, trạng thái có đèn trạng thái (glowing dot) và nút xem chi tiết nhanh.

**Acceptance Scenarios**:

1. **Given** Danh sách đơn hàng trong hệ thống, **When** hiển thị bảng gần đây, **Then** mỗi dòng có avatar chữ cái, mã đơn nổi bật, giá trị tiền VND in đậm và nhãn trạng thái trực quan ("Đã duyệt" xanh ngọc, "Chờ duyệt" vàng cam có hiệu ứng pulse).
2. **Given** Widget "Sản Phẩm Bán Chạy", **When** hiển thị, **Then** liệt kê top các sản phẩm có doanh số cao nhất cùng số lượng đã bán và doanh thu đóng góp.

---

### User Story 5 - Nút Đồng Bộ Dữ Liệu Thời Gian Thực & Badge Trạng Thái Live (Priority: P3)

Là một Quản trị viên, tôi muốn có nút "Làm mới dữ liệu" (Sync/Refresh) kèm chỉ báo thời gian cập nhật gần nhất ("Cập nhật lúc HH:mm") và badge thông báo đơn chờ duyệt nổi bật trên header.

**Why this priority**: Mang lại cảm giác hệ thống luôn sống động (live data), giúp admin chủ động tải lại dữ liệu mà không cần F5 toàn trang.

**Independent Test**: Bấm nút Refresh, icon xoay nhẹ và dữ liệu từ Supabase được cập nhật lại, cập nhật thời gian "Vừa xong".

**Acceptance Scenarios**:

1. **Given** Quản trị viên bấm nút làm mới, **When** thao tác kích hoạt, **Then** icon xoay mượt mà, gọi `refreshOrders`, `refreshProducts`, `refreshUsers` và hiển thị nhãn "Đã đồng bộ".

---

## Edge Cases

- Khi chưa có bất kỳ đơn hàng nào (`orders.length === 0`): Các stat card hiển thị `0 đ`, biểu đồ hiển thị empty state minh họa chuyên nghiệp kèm lời gợi ý thân thiện.
- Khi chỉ có 1 danh mục chiếm 100%: Donut chart bo tròn khép kín mượt mà, tâm hiển thị nhãn danh mục mà không bị vỡ layout.
- Khi tên khách hàng hoặc tên sản phẩm quá dài: Text được truncate thanh lịch với thuộc tính `title` để hover đọc trọn vẹn.
- Màn hình di động & tablet: Layout co giãn linh hoạt (grid responsive từ 1 -> 2 -> 4 cột cho stats, biểu đồ xếp dọc hợp lý).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI nâng cấp giao diện 4 thẻ thống kê (Tổng Doanh Thu, Tổng Đơn Hàng, Giá Trị TB, Người Dùng) với viền bo tròn hiện đại, icon gradient, typography sắc sảo và hiệu ứng hover tương tác.
- **FR-002**: Biểu đồ "Xu Hướng Doanh Thu" PHẢI sử dụng thuật toán làm mượt đường cong (smooth spline/cubic Bezier) thay thế polyline gấp khúc.
- **FR-003**: Biểu đồ doanh thu PHẢI có dải gradient trong suốt cao cấp và hỗ trợ hover tooltip hiển thị ngày giờ cùng giá trị doanh thu tương ứng.
- **FR-004**: Biểu đồ "Cơ Cấu Danh Mục" PHẢI khắc phục lỗi cắt chữ tâm biểu đồ (`Tiện` -> hiển thị trọn vẹn thông tin danh mục hoặc phần trăm) kèm thanh tiến độ phân bổ chi tiết.
- **FR-005**: Bảng "Đơn Hàng Gần Đây" PHẢI được trang trí lại theo phong cách hiện đại với avatar initials của khách hàng, status badge phát sáng, mã đơn nổi bật và hỗ trợ tìm kiếm nhanh đơn hàng.
- **FR-006**: Bổ sung khu vực thống kê "Top Sản Phẩm Doanh Thu Cao Nhất" để Quản trị viên nắm bắt nhanh mặt hàng chủ lực.
- **FR-007**: Bổ sung nút bấm Refresh chủ động với hiệu ứng xoay mượt và chỉ báo thời gian đồng bộ dữ liệu.

### Key Entities

- **Order**: Dữ liệu đơn hàng thực tế từ `useStore()`, chứa `id`, `order_code`, `total_amount`, `status`, `created_at`, `items`.
- **Product**: Danh mục và thông tin sản phẩm từ `products`.
- **UserProfile**: Thông tin khách hàng để ánh xạ tên và email trên bảng đơn hàng.
- **TimeframeDataPoint**: Dữ liệu nhóm theo Ngày/Tháng/Năm `{ label: string; value: number; count: number }`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Toàn bộ Dashboard có giao diện hiện đại, sạch đẹp, đạt chuẩn SaaS đẳng cấp và vượt trội so với phiên bản phẳng hiện tại.
- **SC-002**: Lỗi cắt chữ cụt "Tiện" tại biểu đồ Donut được giải quyết 100%.
- **SC-003**: Biểu đồ hiển thị mượt mà trên tất cả các độ phân giải màn hình từ mobile (375px) đến 4K mà không bị vỡ layout SVG.
- **SC-004**: TypeScript typecheck (`tsc --noEmit`) vượt qua không có bất kỳ lỗi nào.

## Assumptions

- Dữ liệu tiếp tục lấy từ `useStore()` kết nối Supabase, không thay đổi schema cơ sở dữ liệu.
- Toàn bộ cải tiến tập trung vào UI/UX và logic hiển thị tại `src/app/admin/page.tsx` và các component phụ trợ.
