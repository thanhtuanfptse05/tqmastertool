# Feature Specification: Order Checkout & VietQR Payment

**Feature Branch**: `004-order-checkout-vietqr`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Thêm Sản Phẩm Vào Giỏ & Đặt Hàng (Priority: P1)

Người dùng đã đăng nhập muốn mua một hoặc nhiều sản phẩm. Họ bấm "Mua ngay" hoặc "Thêm vào giỏ", xem lại đơn hàng và tiến hành thanh toán.

**Why this priority**: Đây là luồng kinh doanh cốt lõi — không có checkout thì không có doanh thu.

**Independent Test**: Đăng nhập, bấm "Mua ngay" trên một sản phẩm, xem trang xác nhận đơn hàng với tổng tiền chính xác và thông tin VietQR.

**Acceptance Scenarios**:

1. **Given** người dùng chưa đăng nhập bấm "Mua ngay", **When** hệ thống phát hiện, **Then** điều hướng đến trang đăng nhập với thông báo "Vui lòng đăng nhập để tiếp tục mua hàng" và lưu lại sản phẩm đang xem.
2. **Given** người dùng đã đăng nhập bấm "Mua ngay", **When** hệ thống xử lý, **Then** hiển thị trang xác nhận đơn hàng gồm: tên sản phẩm, giá, tổng tiền và hướng dẫn thanh toán VietQR.
3. **Given** người dùng đang ở trang xác nhận đơn hàng, **When** họ bấm "Xác nhận đặt hàng", **Then** hệ thống tạo đơn hàng mới với trạng thái `pending_payment` và chuyển đến trang thanh toán VietQR.
4. **Given** người dùng cố mua sản phẩm mà họ đã mua trước đó (đơn hàng completed), **When** hệ thống phát hiện, **Then** hiển thị cảnh báo "Bạn đã mua sản phẩm này" và cung cấp link truy cập tài nguyên đã mua.

---

### User Story 2 — Thanh Toán Qua VietQR (Priority: P1)

Người dùng được hướng dẫn thanh toán qua chuyển khoản ngân hàng bằng mã QR được sinh ra động. Thông tin tài khoản ngân hàng và số tiền cần chuyển được hiển thị rõ ràng.

**Why this priority**: VietQR là phương thức thanh toán duy nhất trong v1 — không có thanh toán thì không có doanh thu.

**Independent Test**: Tạo đơn hàng và xác nhận trang thanh toán hiển thị mã QR, số tài khoản, tên ngân hàng và số tiền chính xác; mã QR có thể được quét bằng ứng dụng ngân hàng thực.

**Acceptance Scenarios**:

1. **Given** người dùng vừa xác nhận đặt hàng, **When** trang thanh toán tải, **Then** hiển thị: mã QR VietQR chứa thông tin tài khoản ngân hàng và số tiền chính xác, số tài khoản và tên ngân hàng văn bản (để nhập thủ công nếu cần), nội dung chuyển khoản gợi ý (chứa mã đơn hàng).
2. **Given** trang thanh toán đang hiển thị mã QR, **When** người dùng bấm "Sao chép số tài khoản", **Then** số tài khoản được sao chép vào clipboard và hiển thị thông báo xác nhận.
3. **Given** người dùng đã hoàn thành chuyển khoản, **When** họ bấm "Tôi đã thanh toán — Tải ảnh bill lên", **Then** hệ thống điều hướng sang trang upload bill (tính năng `005-order-bill-submission`).
4. **Given** mã QR đang hiển thị trên mobile, **When** người dùng mở ứng dụng ngân hàng và quét, **Then** thông tin chuyển khoản được điền sẵn (số tài khoản, số tiền, nội dung).

---

### User Story 3 — Xem Lịch Sử Đơn Hàng (Priority: P2)

Người dùng muốn theo dõi trạng thái các đơn hàng đã đặt — từ chờ thanh toán, đang chờ duyệt đến đã hoàn thành.

**Why this priority**: Người dùng cần biết đơn hàng của họ đang ở trạng thái nào để biết khi nào có thể truy cập tài nguyên.

**Independent Test**: Đặt một đơn hàng test, vào trang "Đơn hàng của tôi" và xác nhận đơn hàng xuất hiện với trạng thái đúng.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập truy cập trang "Đơn hàng của tôi", **When** trang tải, **Then** hiển thị danh sách tất cả đơn hàng đã đặt sắp xếp theo thời gian mới nhất trước, với thông tin: tên sản phẩm, ngày đặt, tổng tiền và trạng thái hiện tại.
2. **Given** người dùng bấm vào một đơn hàng cụ thể, **When** trang chi tiết đơn hàng tải, **Then** hiển thị đầy đủ thông tin: sản phẩm, số tiền, trạng thái, thời gian từng bước (đặt hàng → thanh toán → duyệt → hoàn thành) và ảnh bill đã upload.
3. **Given** đơn hàng có trạng thái `pending_payment`, **When** người dùng xem, **Then** hệ thống hiển thị nút "Tiếp tục thanh toán" để quay lại trang VietQR.

---

### Edge Cases

- Điều gì xảy ra khi người dùng thoát trang thanh toán mà chưa upload bill — đơn hàng có bị hủy không?
- Làm thế nào khi người dùng quay lại trang thanh toán từ lịch sử đơn hàng sau 24 giờ — mã QR có còn hợp lệ không?
- Điều gì xảy ra khi người dùng mua nhiều sản phẩm trong cùng một đơn hàng (giỏ hàng)?
- Nếu Admin thay đổi giá sản phẩm sau khi người dùng đã mở trang thanh toán — giá nào được áp dụng?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI yêu cầu người dùng đăng nhập trước khi đặt hàng.
- **FR-002**: Hệ thống PHẢI tạo đơn hàng với trạng thái `pending_payment` ngay khi người dùng xác nhận đặt hàng.
- **FR-003**: Hệ thống PHẢI sinh mã QR VietQR với thông tin tài khoản ngân hàng và số tiền chuẩn xác theo chuẩn VietQR.
- **FR-004**: Hệ thống PHẢI hiển thị thông tin chuyển khoản văn bản (số tài khoản, tên ngân hàng, số tiền, nội dung chuyển khoản) bên cạnh mã QR.
- **FR-005**: Hệ thống PHẢI cung cấp chức năng sao chép số tài khoản một cú nhấp.
- **FR-006**: Hệ thống PHẢI hiển thị trang "Đơn hàng của tôi" với danh sách đầy đủ đơn hàng và trạng thái.
- **FR-007**: Hệ thống PHẢI cho phép xem chi tiết từng đơn hàng bao gồm ảnh bill đã upload.
- **FR-008**: Hệ thống PHẢI cảnh báo khi người dùng cố mua sản phẩm đã mua thành công trước đó.
- **FR-009**: Hệ thống PHẢI giữ nguyên đơn hàng ở trạng thái `pending_payment` cho đến khi người dùng upload bill — không tự động hủy.
- **FR-010**: Hệ thống PHẢI sử dụng giá tại thời điểm đặt hàng — không thay đổi khi Admin chỉnh giá sau đó.

### Key Entities

- **Đơn Hàng (Order)**: Mã đơn hàng (unique), người dùng đặt, sản phẩm, giá tại thời điểm đặt, trạng thái (pending_payment / pending_approval / completed / rejected), thời gian tạo, thời gian cập nhật.
- **Thông Tin Thanh Toán VietQR**: Số tài khoản ngân hàng, tên ngân hàng (BIN), số tiền, nội dung chuyển khoản gợi ý (chứa mã đơn hàng).
- **Lịch Sử Trạng Thái**: Danh sách các mốc thay đổi trạng thái đơn hàng kèm timestamp.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng có thể hoàn tất quá trình đặt hàng (từ bấm "Mua ngay" đến trang VietQR) trong vòng 3 phút.
- **SC-002**: Mã QR VietQR hiển thị đúng thông tin ngân hàng và số tiền — có thể quét bằng ứng dụng ngân hàng thực.
- **SC-003**: 100% đơn hàng được lưu với giá tại thời điểm đặt — không bị ảnh hưởng bởi thay đổi giá sau đó.
- **SC-004**: Trang "Đơn hàng của tôi" hiển thị đầy đủ và đúng trạng thái của mọi đơn hàng của người dùng đó.

---

## Assumptions

- Thông tin tài khoản ngân hàng nhận tiền (số tài khoản, ngân hàng) được cấu hình cố định bởi chủ dự án trong Admin settings — không thay đổi thường xuyên.
- Chuẩn VietQR được triển khai theo đặc tả chính thức tại vietqr.io.
- Không có cổng thanh toán tự động (Momo, ZaloPay, VNPAY) trong v1 — chỉ chuyển khoản thủ công qua VietQR.
- Một đơn hàng chỉ chứa một sản phẩm trong v1 (giỏ hàng đa sản phẩm là v2).
