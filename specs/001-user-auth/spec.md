# Feature Specification: User Authentication & Authorization

**Feature Branch**: `001-user-auth`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Đăng Ký Tài Khoản Khách Hàng (Priority: P1)

Một người dùng mới muốn tạo tài khoản để mua sản phẩm số trên nền tảng. Họ nhập địa chỉ email và mật khẩu, nhận email xác nhận và sau đó có thể đăng nhập để đặt hàng.

**Why this priority**: Không có tài khoản thì không thể đặt hàng, xem lịch sử đơn hàng, hay tải tài nguyên đã mua. Đây là cổng vào bắt buộc của toàn bộ luồng mua hàng.

**Independent Test**: Có thể kiểm tra đơn lập bằng cách tạo một tài khoản mới và xác nhận rằng người dùng nhận được email kích hoạt và có thể đăng nhập thành công sau đó.

**Acceptance Scenarios**:

1. **Given** người dùng chưa có tài khoản truy cập trang đăng ký, **When** họ nhập email hợp lệ, mật khẩu đủ mạnh (tối thiểu 8 ký tự) và bấm "Tạo tài khoản", **Then** hệ thống tạo tài khoản với vai trò `customer`, gửi email xác nhận và hiển thị thông báo "Kiểm tra hộp thư để xác nhận tài khoản".
2. **Given** người dùng đã nhận email xác nhận, **When** họ bấm vào link xác nhận trong email, **Then** tài khoản được kích hoạt và người dùng được điều hướng đến trang đăng nhập với thông báo thành công.
3. **Given** người dùng thử đăng ký với email đã tồn tại trong hệ thống, **When** họ submit form, **Then** hệ thống hiển thị thông báo lỗi rõ ràng "Email này đã được sử dụng" mà không để lộ thông tin tài khoản.
4. **Given** người dùng nhập mật khẩu không đủ mạnh (ít hơn 8 ký tự), **When** họ submit form, **Then** hệ thống hiển thị hướng dẫn cụ thể về yêu cầu mật khẩu trước khi cho phép submit.

---

### User Story 2 — Đăng Nhập & Bảo Vệ Phiên Làm Việc (Priority: P1)

Người dùng đã có tài khoản muốn đăng nhập để truy cập lịch sử đơn hàng và tải tài nguyên đã mua. Họ nhập email/mật khẩu và được điều hướng về trang trước đó hoặc trang chủ.

**Why this priority**: Cùng mức ưu tiên với đăng ký — không thể mua hàng hay truy cập tài nguyên nếu không đăng nhập.

**Independent Test**: Có thể kiểm tra đơn lập bằng cách đăng nhập với tài khoản hợp lệ và xác nhận rằng người dùng được điều hướng đúng và có thể truy cập các trang yêu cầu xác thực.

**Acceptance Scenarios**:

1. **Given** người dùng có tài khoản đã xác nhận, **When** họ nhập đúng email và mật khẩu, **Then** hệ thống xác thực thành công, tạo phiên đăng nhập, và điều hướng về trang người dùng muốn truy cập trước đó (hoặc trang chủ nếu không có).
2. **Given** người dùng nhập sai mật khẩu, **When** họ submit form đăng nhập, **Then** hệ thống hiển thị thông báo lỗi chung "Email hoặc mật khẩu không đúng" (không tiết lộ email có tồn tại hay không).
3. **Given** người dùng đang đăng nhập, **When** họ không hoạt động trong 7 ngày, **Then** phiên đăng nhập tự động hết hạn và người dùng được yêu cầu đăng nhập lại.
4. **Given** người dùng đang trên trang yêu cầu đăng nhập mà chưa đăng nhập, **When** hệ thống phát hiện, **Then** tự động điều hướng về trang đăng nhập với thông báo yêu cầu đăng nhập để tiếp tục.

---

### User Story 3 — Đăng Xuất An Toàn (Priority: P2)

Người dùng muốn đăng xuất khỏi tài khoản, đặc biệt khi dùng thiết bị chung. Phiên làm việc phải được hủy hoàn toàn.

**Why this priority**: Bảo mật cơ bản — cần thiết nhưng không block được luồng mua hàng chính.

**Independent Test**: Bấm đăng xuất và kiểm tra rằng mọi trang yêu cầu xác thực đều không còn truy cập được từ tab hiện tại.

**Acceptance Scenarios**:

1. **Given** người dùng đang đăng nhập, **When** họ bấm "Đăng xuất", **Then** phiên làm việc bị hủy hoàn toàn, người dùng được điều hướng về trang chủ và không thể truy cập các trang cần xác thực.
2. **Given** người dùng vừa đăng xuất, **When** họ bấm nút "Back" của trình duyệt, **Then** hệ thống không cho phép truy cập lại trang cần xác thực — chuyển hướng về đăng nhập.

---

### User Story 4 — Đặt Lại Mật Khẩu (Priority: P2)

Người dùng quên mật khẩu và cần khôi phục quyền truy cập tài khoản thông qua email đã đăng ký.

**Why this priority**: Ngăn mất tài khoản — không khẩn cấp nhưng ảnh hưởng trực tiếp đến khả năng truy cập tài nguyên đã mua.

**Independent Test**: Yêu cầu đặt lại mật khẩu, nhận email, bấm link và đặt mật khẩu mới, sau đó kiểm tra đăng nhập bằng mật khẩu mới thành công.

**Acceptance Scenarios**:

1. **Given** người dùng quên mật khẩu và nhập email đã đăng ký vào form "Quên mật khẩu", **When** họ submit, **Then** hệ thống gửi email với link đặt lại mật khẩu có hiệu lực trong 60 phút — và hiển thị thông báo chung (không tiết lộ email có tồn tại không).
2. **Given** người dùng nhận link đặt lại mật khẩu hợp lệ, **When** họ truy cập link và nhập mật khẩu mới đủ mạnh, **Then** mật khẩu được cập nhật và người dùng được điều hướng đến trang đăng nhập.
3. **Given** link đặt lại mật khẩu đã quá 60 phút hoặc đã được sử dụng, **When** người dùng truy cập, **Then** hệ thống hiển thị thông báo "Link đã hết hạn" và hướng dẫn yêu cầu link mới.

---

### User Story 5 — Phân Quyền Admin (Priority: P1)

Admin cần đăng nhập vào hệ thống với quyền quản trị đặc biệt để quản lý sản phẩm, duyệt đơn hàng và xem thống kê doanh thu. Khu vực Admin hoàn toàn tách biệt khỏi giao diện khách hàng.

**Why this priority**: Admin không thể duyệt đơn hàng và mở khóa tài nguyên số nếu hệ thống phân quyền không hoạt động đúng — điều này trực tiếp block luồng kinh doanh cốt lõi.

**Independent Test**: Đăng nhập bằng tài khoản admin, xác nhận có thể truy cập trang `/admin` và các trang quản trị — sau đó đăng xuất và xác nhận tài khoản customer không thể truy cập các trang này.

**Acceptance Scenarios**:

1. **Given** người dùng có vai trò `admin` đăng nhập thành công, **When** họ truy cập bất kỳ trang nào trong khu vực `/admin`, **Then** hệ thống cho phép truy cập đầy đủ và hiển thị giao diện quản trị.
2. **Given** người dùng có vai trò `customer` đang đăng nhập, **When** họ cố truy cập URL bất kỳ trong `/admin/*`, **Then** hệ thống từ chối và hiển thị thông báo "Bạn không có quyền truy cập khu vực này".
3. **Given** người dùng chưa đăng nhập, **When** họ cố truy cập bất kỳ trang admin, **Then** hệ thống điều hướng về trang đăng nhập với thông báo yêu cầu xác thực.
4. **Given** admin đang xem danh sách đơn hàng, **When** token phiên hết hạn, **Then** hệ thống thông báo và yêu cầu đăng nhập lại mà không mất dữ liệu đang xem.

---

### Edge Cases

- Điều gì xảy ra khi người dùng đăng ký bằng email có ký tự đặc biệt hợp lệ (dấu + trong email)?
- Làm thế nào khi email xác nhận bị gửi vào spam — hệ thống có cho phép gửi lại không?
- Điều gì xảy ra nếu người dùng mở link đặt lại mật khẩu trên nhiều tab cùng lúc?
- Khi admin thay đổi role của một người dùng đang đăng nhập, phiên hiện tại của người dùng đó phải được làm mới.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI cho phép người dùng đăng ký tài khoản bằng email và mật khẩu.
- **FR-002**: Hệ thống PHẢI xác nhận địa chỉ email qua link gửi đến hộp thư trước khi kích hoạt tài khoản.
- **FR-003**: Hệ thống PHẢI từ chối email trùng lặp với thông báo lỗi không tiết lộ thông tin tài khoản hiện có.
- **FR-004**: Hệ thống PHẢI yêu cầu mật khẩu tối thiểu 8 ký tự và cung cấp phản hồi rõ ràng về độ mạnh.
- **FR-005**: Hệ thống PHẢI xác thực người dùng qua email và mật khẩu khi đăng nhập.
- **FR-006**: Hệ thống PHẢI hiển thị thông báo lỗi chung (không phân biệt email sai hay mật khẩu sai) khi đăng nhập thất bại để tránh rò rỉ thông tin.
- **FR-007**: Hệ thống PHẢI duy trì phiên đăng nhập trong tối đa 7 ngày (có thể gia hạn khi hoạt động).
- **FR-008**: Hệ thống PHẢI cho phép người dùng đăng xuất và vô hiệu hóa phiên làm việc hoàn toàn.
- **FR-009**: Hệ thống PHẢI cung cấp luồng đặt lại mật khẩu qua email với link có hiệu lực trong 60 phút và chỉ sử dụng được một lần.
- **FR-010**: Hệ thống PHẢI kiểm soát quyền truy cập theo vai trò — `customer` và `admin` — và chặn mọi truy cập trái phép vào khu vực không được phép.
- **FR-011**: Hệ thống PHẢI điều hướng người dùng chưa xác thực về trang đăng nhập khi cố truy cập trang yêu cầu xác thực.
- **FR-012**: Hệ thống PHẢI hiển thị trạng thái đăng nhập rõ ràng (tên người dùng, avatar) trên mọi trang.
- **FR-013**: Hệ thống PHẢI ngăn chặn tấn công brute-force bằng cách giới hạn số lần đăng nhập thất bại liên tiếp (tối đa 5 lần trước khi tạm khóa).

### Key Entities

- **Người Dùng (User)**: Đại diện cho tài khoản trong hệ thống. Thuộc tính: email, mật khẩu (đã mã hóa), tên hiển thị, avatar, vai trò (customer/admin), trạng thái kích hoạt, thời điểm tạo.
- **Phiên Làm Việc (Session)**: Đại diện cho trạng thái xác thực hiện tại của người dùng. Thuộc tính: token định danh, thời hạn, thiết bị.
- **Token Đặt Lại Mật Khẩu**: Token dùng một lần gắn với email, có thời hạn 60 phút.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng mới có thể hoàn tất đăng ký và nhận email xác nhận trong vòng 2 phút.
- **SC-002**: Người dùng đã đăng ký có thể đăng nhập thành công trong vòng 30 giây.
- **SC-003**: 100% các trang yêu cầu xác thực đều từ chối quyền truy cập khi người dùng chưa đăng nhập.
- **SC-004**: 100% các trang trong khu vực Admin đều từ chối tài khoản Customer và người dùng chưa đăng nhập.
- **SC-005**: Link đặt lại mật khẩu hết hiệu lực chính xác sau 60 phút và không thể sử dụng lại sau khi đã dùng.
- **SC-006**: Thông báo lỗi đăng nhập không bao giờ tiết lộ liệu email có tồn tại trong hệ thống hay không.

---

## Assumptions

- Người dùng có kết nối internet ổn định để nhận email xác nhận.
- Chỉ hỗ trợ đăng nhập bằng email và mật khẩu (không có OAuth/Social login trong phiên bản đầu tiên).
- Tài khoản Admin được tạo thủ công bởi chủ dự án trực tiếp qua database (không có giao diện đăng ký Admin công khai).
- Mỗi người dùng chỉ có một vai trò tại một thời điểm (customer hoặc admin, không phải cả hai).
