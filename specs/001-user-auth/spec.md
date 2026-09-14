# Feature Specification: User Authentication & Authorization

**Feature Branch**: `001-user-auth`

**Created**: 2026-03-15

**Updated**: 2026-03-15 — Đơn giản hóa luồng auth: bỏ xác nhận email, bỏ self-service reset MK; Admin cấp MK mới qua quản lý user.

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Đăng Ký Tài Khoản Khách Hàng (Priority: P1)

Một người dùng mới muốn tạo tài khoản để mua sản phẩm số trên nền tảng. Họ nhập địa chỉ email và mật khẩu — **tài khoản được kích hoạt ngay lập tức** mà không cần xác nhận qua email.

**Why this priority**: Không có tài khoản thì không thể đặt hàng, xem lịch sử đơn hàng, hay tải tài nguyên đã mua. Đây là cổng vào bắt buộc của toàn bộ luồng mua hàng.

**Independent Test**: Tạo tài khoản mới, xác nhận hệ thống cho phép đăng nhập ngay sau khi đăng ký thành công mà không cần bất kỳ bước xác nhận nào.

**Acceptance Scenarios**:

1. **Given** người dùng chưa có tài khoản truy cập trang đăng ký, **When** họ nhập email hợp lệ, mật khẩu tối thiểu 6 ký tự và bấm "Tạo tài khoản", **Then** hệ thống tạo tài khoản với vai trò `customer`, hiển thị thông báo "Tạo tài khoản thành công" và điều hướng ngay vào trang chủ ở trạng thái đăng nhập.
2. **Given** người dùng thử đăng ký với email đã tồn tại trong hệ thống, **When** họ submit form, **Then** hệ thống hiển thị thông báo lỗi rõ ràng "Email này đã được sử dụng".
3. **Given** người dùng nhập mật khẩu ít hơn 6 ký tự, **When** họ submit form, **Then** hệ thống hiển thị thông báo "Mật khẩu phải có ít nhất 6 ký tự" và không tạo tài khoản.
4. **Given** người dùng để trống email hoặc mật khẩu, **When** submit form, **Then** hệ thống báo lỗi ngay tại trường còn thiếu mà không gọi server.

---

### User Story 2 — Đăng Nhập & Bảo Vệ Phiên Làm Việc (Priority: P1)

Người dùng đã có tài khoản nhập email và mật khẩu để đăng nhập. Sau khi đăng nhập thành công, họ được điều hướng về trang họ muốn truy cập hoặc trang chủ.

**Why this priority**: Không thể mua hàng hay truy cập tài nguyên nếu không đăng nhập.

**Independent Test**: Đăng nhập với tài khoản hợp lệ, xác nhận điều hướng đúng và có thể truy cập các trang yêu cầu xác thực.

**Acceptance Scenarios**:

1. **Given** người dùng có tài khoản hợp lệ, **When** họ nhập đúng email và mật khẩu, **Then** hệ thống xác thực thành công, tạo phiên đăng nhập và điều hướng về trang người dùng muốn truy cập trước đó (hoặc trang chủ).
2. **Given** người dùng nhập sai email hoặc mật khẩu, **When** submit form đăng nhập, **Then** hệ thống hiển thị thông báo lỗi chung "Email hoặc mật khẩu không đúng".
3. **Given** người dùng không hoạt động trong 7 ngày, **When** hết thời gian, **Then** phiên đăng nhập tự động hết hạn và người dùng được yêu cầu đăng nhập lại.
4. **Given** người dùng chưa đăng nhập cố truy cập trang yêu cầu xác thực, **When** hệ thống phát hiện, **Then** tự động điều hướng về trang đăng nhập.

---

### User Story 3 — Đăng Xuất An Toàn (Priority: P2)

Người dùng muốn đăng xuất khỏi tài khoản. Phiên làm việc phải được hủy hoàn toàn.

**Why this priority**: Bảo mật cơ bản — cần thiết nhưng không block luồng mua hàng chính.

**Independent Test**: Bấm đăng xuất và kiểm tra rằng mọi trang yêu cầu xác thực đều không còn truy cập được.

**Acceptance Scenarios**:

1. **Given** người dùng đang đăng nhập, **When** họ bấm "Đăng xuất", **Then** phiên làm việc bị hủy hoàn toàn, điều hướng về trang chủ và không thể truy cập các trang cần xác thực.
2. **Given** người dùng vừa đăng xuất, **When** họ bấm nút "Back" của trình duyệt, **Then** hệ thống không cho phép truy cập lại trang cần xác thực — chuyển hướng về đăng nhập.

---

### User Story 4 — Phân Quyền Admin (Priority: P1)

Admin đăng nhập cùng form đăng nhập thông thường. Hệ thống tự nhận diện vai trò `admin` và cho phép truy cập khu vực quản trị `/admin` — hoàn toàn tách biệt khỏi giao diện khách hàng.

**Why this priority**: Admin không thể duyệt đơn hàng và mở khóa tài nguyên số nếu phân quyền không hoạt động đúng — block trực tiếp luồng kinh doanh cốt lõi.

**Independent Test**: Đăng nhập tài khoản admin, xác nhận có thể truy cập `/admin`. Đăng xuất và đăng nhập bằng tài khoản customer, xác nhận bị chặn khỏi `/admin`.

**Acceptance Scenarios**:

1. **Given** người dùng có vai trò `admin` đăng nhập thành công, **When** họ truy cập bất kỳ trang nào trong `/admin`, **Then** hệ thống cho phép truy cập đầy đủ và hiển thị giao diện quản trị.
2. **Given** người dùng có vai trò `customer` đang đăng nhập, **When** họ cố truy cập URL bất kỳ trong `/admin/*`, **Then** hệ thống từ chối với thông báo "Bạn không có quyền truy cập khu vực này".
3. **Given** người dùng chưa đăng nhập cố truy cập trang admin, **When** hệ thống phát hiện, **Then** điều hướng về trang đăng nhập.

---

### User Story 5 — Admin Quản Lý User & Cấp Lại Mật Khẩu (Priority: P2)

Khi người dùng quên mật khẩu, họ liên hệ Admin. Admin vào trang quản lý user, tìm tài khoản và đặt mật khẩu mới cho người dùng đó. Người dùng nhận mật khẩu mới qua kênh ngoài hệ thống (Zalo, Facebook, v.v.) và đăng nhập lại.

**Why this priority**: Thay thế hoàn toàn luồng "quên mật khẩu" tự động — đơn giản hơn, không cần cấu hình email service.

**Independent Test**: Admin tìm một tài khoản trong trang quản lý user, đặt mật khẩu mới, xác nhận người dùng đó đăng nhập được với mật khẩu mới và không thể đăng nhập bằng mật khẩu cũ.

**Acceptance Scenarios**:

1. **Given** Admin đăng nhập và truy cập trang "Quản lý người dùng", **When** trang tải, **Then** hiển thị danh sách tất cả tài khoản với: email, tên hiển thị, vai trò (customer/admin), ngày đăng ký và trạng thái.
2. **Given** Admin tìm kiếm một tài khoản theo email, **When** kết quả hiển thị, **Then** Admin thấy đúng tài khoản cần quản lý với nút "Đặt lại mật khẩu".
3. **Given** Admin bấm "Đặt lại mật khẩu" cho một tài khoản, **When** hộp thoại xác nhận xuất hiện, **Then** Admin nhập mật khẩu mới (tối thiểu 6 ký tự), xác nhận và hệ thống cập nhật mật khẩu ngay lập tức.
4. **Given** Admin vừa đặt mật khẩu mới cho người dùng, **When** người dùng thử đăng nhập bằng mật khẩu mới, **Then** đăng nhập thành công — mật khẩu cũ bị vô hiệu hóa hoàn toàn.
5. **Given** Admin muốn thay đổi vai trò của một tài khoản (customer → admin hoặc ngược lại), **When** thực hiện thay đổi, **Then** vai trò được cập nhật và có hiệu lực ở lần đăng nhập tiếp theo.

---

### Edge Cases

- Điều gì xảy ra khi người dùng đăng ký bằng email có ký tự đặc biệt hợp lệ (dấu + trong địa chỉ email)?
- Khi Admin thay đổi role của một người dùng đang đăng nhập — phiên hiện tại có bị ảnh hưởng ngay không?
- Nếu Admin đặt mật khẩu mới trong khi người dùng đang đăng nhập — phiên cũ có bị hủy không?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI cho phép người dùng đăng ký tài khoản bằng email và mật khẩu — **tài khoản kích hoạt ngay, không cần xác nhận email**.
- **FR-002**: Hệ thống PHẢI từ chối đăng ký với email đã tồn tại và hiển thị thông báo lỗi rõ ràng.
- **FR-003**: Hệ thống PHẢI yêu cầu mật khẩu tối thiểu 6 ký tự.
- **FR-004**: Hệ thống PHẢI xác thực người dùng qua email và mật khẩu khi đăng nhập.
- **FR-005**: Hệ thống PHẢI hiển thị thông báo lỗi chung khi đăng nhập thất bại — không phân biệt email sai hay mật khẩu sai.
- **FR-006**: Hệ thống PHẢI duy trì phiên đăng nhập trong tối đa 7 ngày.
- **FR-007**: Hệ thống PHẢI cho phép người dùng đăng xuất và hủy phiên làm việc hoàn toàn.
- **FR-008**: Hệ thống PHẢI kiểm soát quyền truy cập theo vai trò `customer` và `admin` — chặn mọi truy cập trái phép.
- **FR-009**: Hệ thống PHẢI điều hướng người dùng chưa xác thực về trang đăng nhập khi cố truy cập trang yêu cầu xác thực.
- **FR-010**: Hệ thống PHẢI hiển thị trạng thái đăng nhập (tên, avatar) rõ ràng trên mọi trang.
- **FR-011**: Admin PHẢI có thể xem danh sách toàn bộ tài khoản người dùng trong trang quản lý user.
- **FR-012**: Admin PHẢI có thể tìm kiếm tài khoản theo email.
- **FR-013**: Admin PHẢI có thể đặt mật khẩu mới cho bất kỳ tài khoản nào — mật khẩu cũ bị vô hiệu hóa ngay sau đó.
- **FR-014**: Admin PHẢI có thể thay đổi vai trò (customer ↔ admin) của bất kỳ tài khoản nào.
- **FR-015**: **KHÔNG CÓ** luồng "quên mật khẩu" tự gửi email — mọi reset mật khẩu đều qua Admin.

### Key Entities

- **Người Dùng (User)**: Email, mật khẩu (đã mã hóa), tên hiển thị, avatar, vai trò (customer/admin), thời điểm tạo.
- **Phiên Làm Việc (Session)**: Token định danh, thời hạn 7 ngày, liên kết với tài khoản.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng mới có thể hoàn tất đăng ký và đăng nhập ngay trong vòng 1 phút — không cần bất kỳ bước xác nhận nào.
- **SC-002**: Người dùng đã đăng ký có thể đăng nhập thành công trong vòng 30 giây.
- **SC-003**: 100% các trang yêu cầu xác thực đều từ chối quyền truy cập khi người dùng chưa đăng nhập.
- **SC-004**: 100% các trang trong khu vực Admin đều từ chối tài khoản Customer và người dùng chưa đăng nhập.
- **SC-005**: Admin có thể tìm và đặt lại mật khẩu cho một tài khoản trong vòng 3 thao tác.
- **SC-006**: Mật khẩu cũ bị vô hiệu hóa ngay sau khi Admin đặt mật khẩu mới — không thể đăng nhập bằng mật khẩu cũ.

---

## Assumptions

- Chỉ hỗ trợ đăng nhập bằng email và mật khẩu — không có OAuth/Social login trong v1.
- Tài khoản Admin đầu tiên được tạo thủ công trực tiếp qua database — không có giao diện đăng ký Admin công khai.
- Khi người dùng quên mật khẩu, họ liên hệ Admin qua kênh ngoài hệ thống (Zalo, Facebook, v.v.) để yêu cầu cấp lại MK.
- Mỗi người dùng chỉ có một vai trò tại một thời điểm (customer hoặc admin, không phải cả hai).
- Không cần cấu hình email service (SMTP) vì không có luồng gửi email xác nhận hay reset mật khẩu.
