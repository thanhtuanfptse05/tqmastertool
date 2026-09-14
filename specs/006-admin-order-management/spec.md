# Feature Specification: Admin Order Management — Quản Lý & Duyệt Đơn Hàng

**Feature Branch**: `006-admin-order-management`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Xem Danh Sách Toàn Bộ Đơn Hàng (Priority: P1)

Admin cần tổng quan toàn bộ đơn hàng trong hệ thống — lọc theo trạng thái, tìm kiếm theo email khách hàng hoặc mã đơn hàng để nhanh chóng xử lý các đơn hàng đang chờ.

**Why this priority**: Không có danh sách đơn hàng thì Admin không thể duyệt — toàn bộ luồng kinh doanh bị tắc nghẽn.

**Independent Test**: Đăng nhập Admin, truy cập trang Quản lý đơn hàng, xác nhận danh sách hiển thị tất cả đơn hàng với trạng thái đúng và khả năng lọc theo `pending_approval`.

**Acceptance Scenarios**:

1. **Given** Admin đã đăng nhập và truy cập trang Quản lý đơn hàng, **When** trang tải, **Then** hiển thị bảng danh sách đơn hàng gồm: mã đơn, email khách hàng, tên sản phẩm, số tiền, trạng thái và thời gian đặt hàng — sắp xếp mặc định theo thứ tự mới nhất trước.
2. **Given** Admin muốn tập trung vào đơn chờ duyệt, **When** họ chọn bộ lọc "Trạng thái: Chờ duyệt", **Then** danh sách chỉ hiển thị các đơn hàng có trạng thái `pending_approval`.
3. **Given** Admin nhập mã đơn hàng hoặc email vào ô tìm kiếm, **When** kết quả được lọc, **Then** danh sách thu hẹp chỉ hiển thị đơn hàng khớp với từ khóa.
4. **Given** không có đơn hàng nào khớp với bộ lọc, **When** trang hiển thị, **Then** hệ thống hiển thị trạng thái rỗng rõ ràng thay vì bảng trống gây nhầm lẫn.

---

### User Story 2 — Xem Chi Tiết Đầy Đủ Một Đơn Hàng (Priority: P1)

Khi Admin cần duyệt đơn hàng, họ phải xem được TOÀN BỘ thông tin: thông tin khách hàng, sản phẩm đã mua, số tiền, ảnh bill thanh toán (đọc được rõ ràng) và lịch sử trạng thái đơn hàng.

**Why this priority**: Không có đủ thông tin thì Admin không thể ra quyết định duyệt hay từ chối một cách chính xác — đây là lõi của quy trình phê duyệt.

**Independent Test**: Bấm vào một đơn hàng `pending_approval`, xác nhận trang chi tiết hiển thị đầy đủ: thông tin khách, sản phẩm, số tiền, ảnh bill có thể xem kích thước đầy đủ, lịch sử trạng thái và nút duyệt/từ chối.

**Acceptance Scenarios**:

1. **Given** Admin bấm vào một đơn hàng trong danh sách, **When** trang chi tiết tải, **Then** hiển thị đầy đủ các section sau:
   - **Thông tin khách hàng**: Tên, email, ngày đăng ký tài khoản.
   - **Thông tin đơn hàng**: Mã đơn, ngày đặt, sản phẩm đã mua, giá tại thời điểm đặt, tổng tiền.
   - **Ảnh Bill Thanh Toán**: Ảnh xem được với kích thước đủ lớn, nút "Xem ảnh đầy đủ" mở lightbox.
   - **Lịch Sử Trạng Thái**: Timeline theo thứ tự thời gian gồm: đặt hàng → upload bill → thay đổi trạng thái (kèm timestamp từng bước).
   - **Hành Động**: Nút "Duyệt đơn hàng" (màu xanh) và nút "Từ chối" (màu đỏ) — nếu đơn ở trạng thái `pending_approval`.
2. **Given** Admin bấm "Xem ảnh đầy đủ" trên ảnh bill, **When** lightbox mở, **Then** ảnh hiển thị ở kích thước đầy đủ với khả năng zoom in để đọc thông tin chuyển khoản rõ ràng.
3. **Given** đơn hàng đã ở trạng thái `completed` hoặc `rejected`, **When** Admin xem chi tiết, **Then** các nút hành động không hiển thị — chỉ hiển thị thông tin lịch sử và trạng thái cuối.

---

### User Story 3 — Duyệt Đơn Hàng (Approve) (Priority: P1)

Admin xem xét ảnh bill và xác nhận thanh toán hợp lệ. Bấm "Duyệt" để chuyển đơn sang `completed` và tự động mở khóa tài nguyên số cho khách hàng.

**Why this priority**: Đây là điểm kích hoạt mở khóa tài nguyên — không có bước này thì khách hàng không bao giờ nhận được hàng dù đã trả tiền.

**Independent Test**: Admin duyệt một đơn `pending_approval`, xác nhận trạng thái chuyển `completed`, khách hàng nhận email và có thể truy cập tài nguyên ngay sau đó.

**Acceptance Scenarios**:

1. **Given** Admin đang xem chi tiết đơn hàng có trạng thái `pending_approval`, **When** họ bấm "Duyệt đơn hàng" và xác nhận trong hộp thoại, **Then** hệ thống cập nhật trạng thái đơn sang `completed`, ghi lại timestamp và ID Admin đã duyệt, đồng thời kích hoạt gửi email thông báo cho khách hàng.
2. **Given** Admin vừa duyệt đơn, **When** duyệt xong, **Then** trang chi tiết đơn hàng cập nhật trạng thái ngay lập tức (không cần F5) và hiển thị thông báo "Đã duyệt thành công".
3. **Given** Admin bấm nhầm "Duyệt", **When** hộp thoại xác nhận xuất hiện, **Then** Admin có thể bấm "Hủy" để quay về mà không thay đổi trạng thái đơn hàng.

---

### User Story 4 — Từ Chối Đơn Hàng (Reject) (Priority: P1)

Admin phát hiện bill không hợp lệ (sai số tiền, ảnh không rõ, thông tin chuyển khoản không khớp). Admin từ chối với lý do cụ thể để khách hàng biết cần làm gì.

**Why this priority**: Chống gian lận và bảo vệ doanh thu — đây là phần bắt buộc của quy trình phê duyệt.

**Independent Test**: Admin từ chối một đơn với lý do "Số tiền chuyển khoản không đúng", xác nhận trạng thái chuyển `rejected` và khách hàng nhận email với lý do từ chối.

**Acceptance Scenarios**:

1. **Given** Admin bấm "Từ chối" trên đơn hàng `pending_approval`, **When** hộp thoại xuất hiện, **Then** hiển thị ô nhập lý do từ chối với các gợi ý nhanh (ví dụ: "Bill không rõ", "Số tiền không khớp", "Ảnh giả mạo") và nút "Xác nhận từ chối".
2. **Given** Admin nhập lý do và bấm "Xác nhận từ chối", **When** hệ thống xử lý, **Then** trạng thái đơn hàng chuyển sang `rejected`, lý do từ chối được lưu lại, và email thông báo được gửi cho khách hàng kèm lý do cụ thể.
3. **Given** Admin cố từ chối mà không nhập lý do, **When** submit, **Then** hệ thống không cho phép và yêu cầu nhập lý do từ chối trước.

---

### User Story 5 — Nhận Thông Báo Đơn Hàng Mới (Priority: P2)

Admin cần biết ngay khi có đơn hàng mới cần duyệt mà không phải liên tục F5 trang quản lý.

**Why this priority**: Giảm thời gian phản hồi — khách hàng không phải chờ hàng giờ để nhận tài nguyên.

**Independent Test**: Khách hàng upload bill, xác nhận Admin nhận thông báo (badge số trên menu hoặc email) trong vòng 5 phút.

**Acceptance Scenarios**:

1. **Given** khách hàng vừa upload bill và đơn hàng chuyển sang `pending_approval`, **When** Admin xem menu quản lý đơn hàng, **Then** badge số trên menu cập nhật hiển thị số đơn hàng đang chờ duyệt.
2. **Given** có đơn hàng mới chờ duyệt, **When** Admin nhận email thông báo, **Then** email chứa: tên khách hàng, sản phẩm, số tiền và link trực tiếp đến trang chi tiết đơn hàng đó trong Admin.

---

### Edge Cases

- Điều gì xảy ra khi Admin duyệt đơn nhưng ảnh bill được Admin sau đó phát hiện là giả mạo — có thể rollback không?
- Làm thế nào khi hai Admin cùng mở chi tiết một đơn hàng và cùng bấm duyệt — chỉ được xử lý một lần.
- Điều gì xảy ra khi email thông báo không gửi được — đơn hàng vẫn phải được cập nhật trạng thái đúng.
- Khi đơn bị reject, khách hàng có thể upload bill mới và yêu cầu duyệt lại không?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI hiển thị danh sách tất cả đơn hàng cho Admin với các cột: mã đơn, email khách, sản phẩm, số tiền, trạng thái, thời gian đặt.
- **FR-002**: Hệ thống PHẢI hỗ trợ lọc đơn hàng theo trạng thái (pending_payment, pending_approval, completed, rejected) và tìm kiếm theo mã đơn hoặc email.
- **FR-003**: Trang chi tiết đơn hàng PHẢI hiển thị đầy đủ: thông tin khách hàng, sản phẩm, giá, ảnh bill (với lightbox zoom), lịch sử trạng thái theo timeline.
- **FR-004**: Hệ thống PHẢI hiển thị ảnh bill rõ ràng với khả năng zoom để Admin đọc được thông tin chuyển khoản.
- **FR-005**: Hệ thống PHẢI cho phép Admin duyệt đơn hàng với một bước xác nhận (hộp thoại confirm).
- **FR-006**: Hệ thống PHẢI yêu cầu Admin nhập lý do từ chối bắt buộc trước khi reject đơn hàng.
- **FR-007**: Hệ thống PHẢI ghi lại thông tin Admin (ID, timestamp) khi thực hiện duyệt hoặc từ chối.
- **FR-008**: Hệ thống PHẢI kích hoạt email thông báo cho khách hàng ngay khi trạng thái thay đổi (approved/rejected).
- **FR-009**: Hệ thống PHẢI hiển thị badge số đơn hàng chờ duyệt trên menu Admin, cập nhật real-time.
- **FR-010**: Hệ thống PHẢI ngăn chặn race condition — một đơn hàng chỉ được duyệt/từ chối một lần, dù có nhiều Admin cùng mở.
- **FR-011**: Hệ thống PHẢI lưu lý do từ chối và hiển thị cho khách hàng trong email và trang chi tiết đơn hàng.
- **FR-012**: Admin PHẢI có thể xem và tải về ảnh bill từ trang chi tiết đơn hàng (từ private storage, thông qua signed URL).

### Key Entities

- **Đơn Hàng (Order)**: Đầy đủ như đã định nghĩa trong `004-order-checkout-vietqr` + trường `reviewed_by` (Admin ID), `reviewed_at` (timestamp), `rejection_reason` (string).
- **Lịch Sử Trạng Thái (Order Status History)**: Mỗi bản ghi gồm: trạng thái mới, timestamp, người thực hiện (khách hàng hoặc Admin).
- **Thông Báo Admin**: Badge số đơn hàng chờ duyệt, email thông báo đơn mới.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin có thể xem toàn bộ thông tin và ảnh bill của một đơn hàng trong vòng 30 giây sau khi vào trang chi tiết.
- **SC-002**: Admin có thể duyệt hoặc từ chối đơn trong vòng 3 thao tác từ màn hình danh sách.
- **SC-003**: 100% thao tác duyệt/từ chối được ghi lại với đầy đủ timestamp và ID Admin thực hiện.
- **SC-004**: Khách hàng nhận email thông báo kết quả trong vòng 5 phút sau khi Admin thay đổi trạng thái.
- **SC-005**: Badge số đơn hàng chờ duyệt cập nhật chính xác — không sai lệch dù có nhiều đơn hàng mới cùng lúc.
- **SC-006**: Ảnh bill hiển thị rõ ràng với độ phân giải đủ để Admin đọc được thông tin giao dịch.

---

## Assumptions

- Ảnh bill được phục vụ qua Signed URL tạm thời (expire sau 30 phút) — không lưu URL tĩnh trong database.
- Admin chỉ có thể duyệt đơn hàng ở trạng thái `pending_approval` — không thể can thiệp đơn ở các trạng thái khác.
- Hệ thống không có chức năng rollback trạng thái sau khi đã completed — đây là quyết định không thể đảo ngược trong v1.
- Việc gửi email thông báo Admin khi có đơn mới là tùy chọn (có thể bật/tắt trong cài đặt Admin) — badge real-time là bắt buộc.
