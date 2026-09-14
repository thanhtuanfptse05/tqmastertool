# Feature Specification: Customer Deliverable Vault — Mở Khóa & Tải Tài Nguyên Số

**Feature Branch**: `007-customer-deliverable-vault`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Truy Cập Tài Nguyên Sau Khi Đơn Được Duyệt (Priority: P1)

Sau khi Admin duyệt đơn hàng, khách hàng cần có thể truy cập và tải về các tài nguyên số đã mua (source code, tài liệu, file zip). Quyền truy cập phải được kiểm soát chặt chẽ — chỉ người dùng đã mua mới được tải.

**Why this priority**: Đây là "sản phẩm" thực sự mà khách hàng trả tiền để nhận. Nếu không thể tải được tài nguyên thì toàn bộ luồng thương mại điện tử bị thất bại hoàn toàn.

**Independent Test**: Dùng tài khoản đã có đơn hàng `completed`, vào trang "Tài nguyên của tôi" và xác nhận link tải xuống hoạt động, tải được file đúng.

**Acceptance Scenarios**:

1. **Given** đơn hàng của người dùng vừa được Admin duyệt (chuyển sang `completed`), **When** người dùng vào trang "Tài nguyên của tôi" hoặc chi tiết đơn hàng, **Then** hiển thị nút "Tải về" / "Truy cập ngay" cho tài nguyên tương ứng.
2. **Given** người dùng bấm "Tải về", **When** hệ thống xử lý, **Then** hệ thống kiểm tra quyền sở hữu (đơn hàng của người dùng này với sản phẩm này phải là `completed`), tạo signed URL tạm thời và bắt đầu tải file ngay lập tức.
3. **Given** signed URL đã hết hạn (sau 15 phút), **When** người dùng cố dùng URL đó để tải, **Then** hệ thống từ chối và người dùng cần quay lại trang để tạo signed URL mới.
4. **Given** người dùng đã đăng xuất hoặc hết phiên, **When** họ cố truy cập URL tải về, **Then** hệ thống yêu cầu đăng nhập lại trước khi cấp quyền tải.

---

### User Story 2 — Xem Danh Sách Tài Nguyên Đã Mua (Priority: P1)

Người dùng muốn xem tổng quan tất cả sản phẩm số đã mua và có thể tải lại bất kỳ lúc nào (không giới hạn số lần tải).

**Why this priority**: Người dùng cần khả năng tải lại khi thay thiết bị hoặc file bị xóa — đây là giá trị cốt lõi của việc mua sản phẩm số.

**Independent Test**: Vào trang "Thư viện của tôi", xác nhận danh sách hiển thị tất cả sản phẩm đã mua thành công với nút tải về hoạt động.

**Acceptance Scenarios**:

1. **Given** người dùng đã mua và được duyệt 3 sản phẩm, **When** họ truy cập trang "Thư viện của tôi", **Then** hiển thị cả 3 sản phẩm với thumbnail, tên, ngày mua và nút "Tải về".
2. **Given** người dùng bấm "Tải về" cho một sản phẩm đã mua lâu, **When** hệ thống kiểm tra quyền, **Then** tạo signed URL mới và bắt đầu tải — không có giới hạn thời gian từ khi mua.
3. **Given** người dùng chưa có đơn hàng completed nào, **When** họ vào "Thư viện của tôi", **Then** hiển thị trạng thái rỗng thân thiện với hướng dẫn "Hãy khám phá sản phẩm và bắt đầu mua hàng".

---

### User Story 3 — Bảo Vệ Chống Truy Cập Trái Phép (Priority: P1)

Người dùng chưa mua hoặc đơn hàng chưa được duyệt không được phép truy cập bất kỳ tài nguyên số nào — kể cả khi họ có URL tải về.

**Why this priority**: Bảo vệ nội dung số là nền tảng của mô hình kinh doanh — nếu bị bypass thì doanh thu bằng 0.

**Independent Test**: Thử truy cập URL tải về của người dùng khác hoặc URL cũ của người dùng chưa mua, xác nhận hệ thống từ chối và không trả về file.

**Acceptance Scenarios**:

1. **Given** người dùng chưa mua sản phẩm X cố truy cập URL tải file của sản phẩm X, **When** hệ thống kiểm tra, **Then** từ chối với mã lỗi 403 và thông báo "Bạn chưa mua sản phẩm này".
2. **Given** người dùng có đơn hàng `pending_approval` (chưa được duyệt) cố tải file, **When** hệ thống kiểm tra trạng thái đơn, **Then** từ chối và thông báo "Đơn hàng đang chờ Admin duyệt — bạn sẽ nhận được email khi có thể tải về".
3. **Given** người dùng chia sẻ signed URL cho người khác, **When** người khác cố dùng URL đó, **Then** hệ thống từ chối vì signed URL được gắn với session/IP người tạo hoặc đã hết hạn.

---

### User Story 4 — Admin Upload Tài Nguyên Cho Sản Phẩm (Priority: P1)

Admin cần upload file ZIP (hoặc file tài nguyên khác) cho từng sản phẩm, file này sẽ được tải về bởi khách hàng sau khi mua. Đây là phần cấu hình sản phẩm — nằm trong tính năng này vì quan hệ mật thiết với vault.

**Why this priority**: Không có file upload thì không có tài nguyên để giao cho khách hàng — phải có trước khi publish sản phẩm.

**Independent Test**: Admin upload file ZIP cho một sản phẩm, sau đó có khách mua và tải về — xác nhận file nhận được đúng và toàn vẹn.

**Acceptance Scenarios**:

1. **Given** Admin đang quản lý một sản phẩm, **When** họ vào section "Tài Nguyên Kỹ Thuật Số", **Then** có thể upload file tài nguyên (ZIP, PDF, v.v.) tối đa 500MB với progress bar hiển thị tiến trình.
2. **Given** Admin upload file thành công, **When** hoàn tất, **Then** file được lưu trong private storage và liên kết với sản phẩm — chỉ có thể tải qua hệ thống xác thực.
3. **Given** Admin cần thay thế file tài nguyên (cập nhật phiên bản mới), **When** upload file mới, **Then** file cũ bị xóa và file mới được liên kết — các đơn hàng completed đã tồn tại vẫn có thể tải file mới.

---

### Edge Cases

- Điều gì xảy ra khi file tài nguyên bị xóa khỏi storage nhưng đơn hàng vẫn ở trạng thái completed?
- Làm thế nào khi người dùng tải về file bị lỗi/corrupt — có cơ chế báo lỗi và tải lại không?
- Điều gì xảy ra khi sản phẩm bị Admin ẩn sau khi khách đã mua — quyền tải về có bị thu hồi không?
- Khi Admin cập nhật file tài nguyên, người dùng đã mua có nhận được thông báo "Phiên bản mới" không?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI chỉ cho phép tải tài nguyên khi đơn hàng của người dùng đó với sản phẩm đó có trạng thái `completed`.
- **FR-002**: Hệ thống PHẢI tạo signed URL tạm thời (hết hạn sau 15 phút) mỗi khi người dùng yêu cầu tải — không lưu URL cố định công khai.
- **FR-003**: Hệ thống PHẢI từ chối mọi yêu cầu tải file không có quyền sở hữu hợp lệ với mã lỗi 403.
- **FR-004**: Hệ thống PHẢI hiển thị trang "Thư viện của tôi" liệt kê tất cả sản phẩm đã mua thành công.
- **FR-005**: Hệ thống KHÔNG được giới hạn số lần tải — người dùng có thể tải lại bất kỳ lúc nào miễn là tài khoản còn hoạt động.
- **FR-006**: Admin PHẢI có thể upload tài nguyên số (file ZIP, PDF, v.v.) tối đa 500MB cho từng sản phẩm.
- **FR-007**: Tài nguyên số PHẢI được lưu trong private storage — không accessible trực tiếp bằng URL mà không qua xác thực.
- **FR-008**: Hệ thống PHẢI thông báo rõ ràng khi người dùng có đơn hàng `pending_approval` cố tải file — giải thích lý do và tình trạng hiện tại.
- **FR-009**: Khi Admin cập nhật file tài nguyên, người dùng đã mua đều tải được file mới nhất.
- **FR-010**: Hệ thống PHẢI hiển thị trạng thái tải file (progress bar hoặc spinner) khi file đang được tải xuống.

### Key Entities

- **Tài Nguyên Số (Digital Asset)**: Liên kết với sản phẩm, đường dẫn private storage, tên file, kích thước, phiên bản, thời điểm upload.
- **Quyền Truy Cập (Access Grant)**: Liên kết giữa người dùng và sản phẩm, xác lập khi đơn hàng chuyển sang `completed`.
- **Signed URL**: URL tạm thời sinh ra mỗi khi người dùng yêu cầu tải — hết hạn sau 15 phút.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% yêu cầu tải file từ người dùng không có quyền sở hữu hợp lệ đều bị từ chối (0% bypass).
- **SC-002**: Người dùng có đơn hàng `completed` có thể bắt đầu tải file trong vòng 10 giây sau khi bấm "Tải về".
- **SC-003**: Signed URL luôn hết hạn chính xác sau 15 phút — không thể sử dụng sau khoảng thời gian này.
- **SC-004**: File tải về nguyên vẹn — checksum khớp với file gốc Admin upload.
- **SC-005**: Trang "Thư viện của tôi" hiển thị đúng tất cả sản phẩm có đơn hàng `completed` của người dùng đó.

---

## Assumptions

- Tài nguyên số được lưu trong Supabase Private Storage — không dùng public bucket.
- Signed URL được generate với thời gian sống 15 phút — đủ để bắt đầu tải, ngay cả file lớn.
- Sản phẩm bị Admin ẩn sau khi đã mua vẫn không thu hồi quyền tải về của khách đã mua — tôn trọng giao dịch đã hoàn thành.
- Không có DRM (Digital Rights Management) phức tạp trong v1 — chỉ kiểm soát quyền truy cập ở tầng API.
- File tài nguyên tối đa 500MB phù hợp với giới hạn của Supabase Storage Free/Pro tier.
