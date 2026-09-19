# Feature Specification: Hiển Thị Tên Thật Khách Hàng Trong Quản Trị Đơn Hàng (Admin Orders)

**Feature Branch**: `022-admin-display-real-customer-name`

**Created**: 2026-09-19

**Status**: Implemented

**Input**: User description: "ê trong cái quản lý đơn hàng này t muốn là phải hiển thị tên khách hàng lên chứ để nguyên là Khách hàng thì sao mà t biết được"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hiển Thị Tên Thật Của Khách Hàng Trên Bảng Đơn Hàng (Priority: P1)

Khi Quản trị viên (Admin) truy cập trang Quản Lý & Kiểm Soát Đơn Hàng (`/admin/orders`), tại cột **Khách Hàng**, hệ thống phải hiển thị chính xác **Họ & Tên thật của khách hàng** (lấy từ hồ sơ tài khoản `profiles.full_name` hoặc metadata Auth `user_metadata.full_name`, ví dụ: `Ngo Anh Huy`, `Cao Thanh Tuấn`, `Bảo Và Thái`) thay vì nhãn mặc định `"Khách Hàng"`. Phía dưới tên hiển thị email tài khoản và email nhận key (nếu khác nhau).

**Why this priority**: Đây là thông tin nhận diện khách hàng quan trọng nhất đối với Quản trị viên. Nếu chỉ hiển thị chữ "Khách Hàng" chung chung, Admin không thể biết ai là người vừa đặt đơn để đối chiếu biên lai, kiểm tra lịch sử hoặc hỗ trợ khi cần thiết.

**Independent Test**: Mở trang `/admin/orders` có chứa các đơn hàng của người dùng đã đăng ký (ví dụ: `TQ-2026-1314` của `Ngo Anh Huy`), kiểm tra cột Khách Hàng hiển thị chính xác tên `Ngo Anh Huy` và email tài khoản tương ứng, không còn chữ "Khách Hàng".

**Acceptance Scenarios**:

1. **Given** một đơn hàng có `user_id` liên kết với tài khoản người dùng có hồ sơ (ví dụ: `full_name: 'Ngo Anh Huy'`), **When** bảng đơn hàng tải dữ liệu, **Then** cột Khách Hàng hiển thị tên đậm `Ngo Anh Huy` và email `huyn22559@gmail.com`.
2. **Given** đơn hàng Coursera có email nhận key (ví dụ: `ngialinh200511@gmail.com`) khác với email tài khoản mua (`huyn22559@gmail.com`), **When** Admin xem dòng đơn hàng, **Then** giao diện hiển thị rõ ràng: Tên khách hàng (`Ngo Anh Huy`), Email tài khoản (`huyn22559@gmail.com`) và tag nhận diện email nhận key (`Key: ngialinh200511@gmail.com`).
3. **Given** đơn hàng đặt bởi khách vãng lai (Guest - chưa đăng ký tài khoản), **When** bảng hiển thị, **Then** hệ thống ưu tiên hiển thị tên nhập lúc đặt hàng hoặc fallback định danh thông minh dựa trên email (ví dụ: `Khách: ngialinh200511`) thay vì chữ "Khách Hàng" vô nghĩa.

---

### User Story 2 - Hiển Thị Đầy Đủ Danh Tính Trong Modal Xem Chi Tiết & Sửa Đơn (Priority: P1)

Khi Admin bấm vào nút **Chi tiết** (Modal Review) hoặc nút **Sửa** (Modal Edit) của một đơn hàng, các modal này phải hiển thị tường minh:
1. Tên thật của khách hàng (`Ngo Anh Huy`).
2. Email đăng ký tài khoản (`huyn22559@gmail.com`).
3. Danh sách email nhận Key / Sản phẩm (nếu có, ví dụ: `ngialinh200511@gmail.com`).
4. Mã định danh `user_id`.

**Why this priority**: Khi duyệt hoặc điều chỉnh thông tin đơn hàng, Admin cần cái nhìn 360 độ về người mua để đảm bảo duyệt đúng người, cấp key đúng đối tượng và tránh nhầm lẫn giao dịch.

**Independent Test**: Bấm nút "Chi tiết" hoặc "Sửa" trên đơn `TQ-2026-1314`, kiểm tra khối thông tin khách hàng trong modal hiển thị đầy đủ tên thật `Ngo Anh Huy`.

**Acceptance Scenarios**:

1. **Given** Admin mở Modal Review đơn hàng (`activeReviewOrder`), **When** thông tin khách hàng được render, **Then** trường Tên khách hàng hiển thị tên thật (`Ngo Anh Huy`), không hiển thị fallback "Khách hàng".
2. **Given** Admin mở Modal Sửa đơn hàng (`AdminOrderEditModal`), **When** thanh tiêu đề và thông tin tóm tắt hiển thị, **Then** hiển thị rõ ràng tên khách và email thay vì chỉ hiển thị `user_id`.

---

### User Story 3 - Tìm Kiếm Đơn Hàng Theo Tên Khách Hàng (Priority: P2)

Admin có thể gõ trực tiếp tên khách hàng (ví dụ: `Huy`, `Ngo Anh Huy`, `Tuấn`) vào thanh tìm kiếm ở trang quản trị đơn hàng, bảng dữ liệu phải lọc và trả về đúng các đơn hàng thuộc về khách hàng đó.

**Why this priority**: Giúp Admin nhanh chóng tìm kiếm toàn bộ đơn hàng của một người mua cụ thể khi họ yêu cầu hỗ trợ hoặc khi cần tra soát ngân hàng.

**Independent Test**: Gõ `Huy` vào ô tìm kiếm ở trang `/admin/orders`, danh sách lọc ra đơn `TQ-2026-1314`.

**Acceptance Scenarios**:

1. **Given** danh sách nhiều đơn hàng của nhiều khách khác nhau, **When** Admin gõ tên khách hàng vào ô tìm kiếm, **Then** hệ thống lọc chính xác các đơn hàng có `user_name` khớp với từ khóa tìm kiếm (không phân biệt hoa thường).

---

### Edge Cases

- **Tài khoản mới đăng ký chưa có record trong bảng `profiles`**: Hệ thống tự động truy xuất từ `auth.users.user_metadata.full_name` hoặc trích xuất tên từ prefix của email trước ký tự `@`.
- **Đơn hàng cũ không lưu `user_name` trong DB**: Cơ chế `fetchOrdersFromDB` tự động join/lookup danh sách `user_id` với bảng `profiles` và danh sách `users` trong store để bổ sung tên thật theo thời gian thực mà không làm gián đoạn schema cũ.
- **Khách mua nhiều key với nhiều email khác nhau**: Hiển thị tên chủ tài khoản thanh toán là tên chính, kèm chú thích số lượng email nhận key bên dưới.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST truy vấn và ánh xạ tên thật (`full_name`) của người dùng từ bảng `profiles` (hoặc thông tin Auth) cho mọi đơn hàng có `user_id` khi tải dữ liệu đơn hàng trong `fetchOrdersFromDB`.
- **FR-002**: Trang Quản Lý Đơn Hàng (`/admin/orders`) MUST hiển thị `user_name` thật của khách hàng ở vị trí nổi bật tại cột Khách Hàng.
- **FR-003**: Cột Khách Hàng MUST hiển thị phân tách rõ ràng giữa Email tài khoản Auth và Email nhận Key/Sản phẩm (nếu có).
- **FR-004**: Modal duyệt đơn hàng (`Review Order Modal`) và Modal sửa đơn (`AdminOrderEditModal`) MUST hiển thị tên đầy đủ của khách hàng.
- **FR-005**: Thanh tìm kiếm trong `/admin/orders` MUST hỗ trợ tìm kiếm theo `order.user_name` không phân biệt hoa thường.
- **FR-006**: Khi khách hàng đăng nhập tạo đơn mới qua `createOrder` hoặc API `/api/orders`, thông tin `user_name` và `customerName` MUST được gán đầy đủ từ `currentUser.full_name`.

### Key Entities

- **Order**: Thực thể đơn hàng với các trường `user_id`, `user_name` (Tên thật của khách), `user_email` (Email tài khoản), kèm các thông tin mở rộng từ `admin_notes` (như danh sách email nhận key).
- **UserProfile / Profile**: Thực thể hồ sơ người dùng trong bảng `profiles` với các trường `id`, `full_name`, `email`, `role`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các đơn hàng của người dùng đã đăng ký hiển thị tên thật (`full_name`) trên giao diện Admin thay vì chữ `"Khách Hàng"`.
- **SC-002**: Admin có thể tìm kiếm đơn hàng theo tên khách hàng với thời gian phản hồi tức thì (< 100ms).
- **SC-003**: Không có bất kỳ lỗi biên dịch TypeScript nào (`npx tsc --noEmit` đạt 0 error).

---

## Assumptions

- Mọi người dùng đã đăng ký tài khoản qua Supabase Auth đều có `full_name` trong bảng `profiles` hoặc trong `user_metadata`.
- Bảng `profiles` trong Supabase có cột `id`, `full_name`, `email` và có thể truy vấn an toàn bởi Admin.
