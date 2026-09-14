# Feature Specification: Order Bill Submission — Upload Bill Xác Nhận Thanh Toán

**Feature Branch**: `005-order-bill-submission`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Upload Ảnh Bill Thanh Toán (Priority: P1)

Sau khi chuyển khoản thành công, người dùng phải upload ảnh chụp màn hình hoặc ảnh chụp màn hình biên lai chuyển khoản để Admin có thể xác minh. Đây là bước bắt buộc trước khi đơn hàng được chuyển sang trạng thái chờ duyệt.

**Why this priority**: Đây là bước kết nối giữa thanh toán thực tế và hệ thống — nếu không có bill upload thì Admin không thể duyệt và người dùng không nhận được tài nguyên.

**Independent Test**: Sau khi đặt hàng, upload một ảnh JPG hợp lệ dưới 5MB, xác nhận hệ thống hiển thị preview, trạng thái đơn hàng chuyển sang `pending_approval` và Admin nhận được thông báo.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở trang thanh toán VietQR và đã chuyển khoản, **When** họ bấm "Tôi đã thanh toán — Tải ảnh bill lên", **Then** hiển thị giao diện upload với vùng kéo-thả ảnh và nút duyệt file.
2. **Given** người dùng chọn file ảnh hợp lệ (JPG, PNG, JPEG dưới 5MB), **When** upload hoàn tất, **Then** hệ thống hiển thị preview ảnh bill, cho phép người dùng xác nhận hoặc chọn lại ảnh khác.
3. **Given** người dùng xác nhận ảnh bill và bấm "Gửi xác nhận thanh toán", **When** hệ thống xử lý, **Then** trạng thái đơn hàng chuyển từ `pending_payment` sang `pending_approval`, hiển thị thông báo "Đơn hàng đang chờ Admin xét duyệt" và người dùng nhận được email xác nhận.
4. **Given** người dùng upload file không hợp lệ (PDF, exe, ảnh > 5MB), **When** hệ thống kiểm tra, **Then** từ chối với thông báo lỗi cụ thể "Chỉ chấp nhận ảnh JPG/PNG dưới 5MB".

---

### User Story 2 — Thay Thế Bill Đã Upload (Priority: P2)

Người dùng nhận ra đã upload nhầm ảnh hoặc ảnh bị mờ muốn upload lại ảnh mới trước khi Admin duyệt.

**Why this priority**: Giảm thiểu đơn hàng bị từ chối do bill không đọc được — cải thiện trải nghiệm người dùng.

**Independent Test**: Upload một ảnh, sau đó bấm "Thay thế ảnh" và upload ảnh mới — xác nhận ảnh cũ bị thay thế và đơn hàng vẫn ở trạng thái `pending_approval`.

**Acceptance Scenarios**:

1. **Given** đơn hàng đang ở trạng thái `pending_approval` (chưa được Admin xem xét), **When** người dùng truy cập chi tiết đơn hàng, **Then** hiển thị nút "Thay thế ảnh bill" cho phép upload lại.
2. **Given** người dùng upload ảnh bill mới, **When** xác nhận, **Then** ảnh cũ bị xóa, ảnh mới được lưu và thông báo cho Admin biết bill đã được cập nhật.
3. **Given** Admin đã bắt đầu xem xét đơn hàng (trạng thái đang xử lý), **When** người dùng cố thay thế bill, **Then** hệ thống thông báo "Đơn hàng đang được xét duyệt — không thể thay thế bill lúc này".

---

### User Story 3 — Nhận Thông Báo Kết Quả Duyệt Đơn (Priority: P1)

Sau khi Admin duyệt hoặc từ chối đơn hàng, người dùng cần được thông báo ngay để biết kết quả và hành động tiếp theo.

**Why this priority**: Người dùng cần biết khi nào có thể truy cập tài nguyên đã mua — thông báo kịp thời là phần cốt lõi của trải nghiệm sau mua hàng.

**Independent Test**: Admin duyệt một đơn hàng và xác nhận người dùng nhận được email thông báo với link truy cập tài nguyên trong vòng 5 phút.

**Acceptance Scenarios**:

1. **Given** Admin duyệt đơn hàng thành công, **When** trạng thái chuyển sang `completed`, **Then** hệ thống gửi email thông báo cho người dùng với nội dung "Đơn hàng đã được duyệt — bạn có thể tải tài nguyên ngay" kèm link trực tiếp đến trang tải về.
2. **Given** Admin từ chối đơn hàng với lý do, **When** trạng thái chuyển sang `rejected`, **Then** hệ thống gửi email thông báo cho người dùng với lý do từ chối và hướng dẫn cần làm gì tiếp theo (liên hệ hỗ trợ hoặc upload lại bill).
3. **Given** người dùng đang ở trang đơn hàng của tôi, **When** trạng thái đơn hàng thay đổi (duyệt/từ chối), **Then** badge trạng thái cập nhật đúng màu (xanh = completed, đỏ = rejected, vàng = pending).

---

### Edge Cases

- Điều gì xảy ra khi kết nối mạng bị ngắt trong quá trình upload ảnh — có tự resume không?
- Làm thế nào khi ảnh bill bị xoay 90° hoặc upside-down — có tự xoay hay người dùng phải xoay trước khi upload?
- Điều gì xảy ra khi người dùng cố submit cùng đơn hàng nhiều lần (double submit)?
- Khi đơn bị từ chối, người dùng có thể upload lại bill để tái yêu cầu duyệt không?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI bắt buộc yêu cầu upload ảnh bill trước khi đơn hàng được chuyển sang `pending_approval`.
- **FR-002**: Hệ thống PHẢI chỉ chấp nhận ảnh bill định dạng JPG, JPEG hoặc PNG với kích thước tối đa 5MB.
- **FR-003**: Hệ thống PHẢI hiển thị preview ảnh sau khi chọn file và cho phép người dùng xem lại trước khi xác nhận.
- **FR-004**: Hệ thống PHẢI hỗ trợ kéo-thả file (drag & drop) vào vùng upload.
- **FR-005**: Hệ thống PHẢI chuyển trạng thái đơn hàng sang `pending_approval` chỉ sau khi upload bill thành công và người dùng xác nhận.
- **FR-006**: Hệ thống PHẢI cho phép người dùng thay thế ảnh bill nếu đơn hàng chưa được Admin bắt đầu xem xét.
- **FR-007**: Hệ thống PHẢI gửi email thông báo cho người dùng khi đơn được duyệt (completed) hoặc từ chối (rejected).
- **FR-008**: Hệ thống PHẢI hiển thị thông báo rõ ràng sau khi upload thành công về trạng thái đơn hàng và thời gian xét duyệt dự kiến.
- **FR-009**: Hệ thống PHẢI lưu trữ ảnh bill an toàn trong private storage — không accessible qua URL công khai.
- **FR-010**: Hệ thống PHẢI hiển thị lỗi cụ thể khi upload thất bại (sai định dạng, quá dung lượng, lỗi mạng).

### Key Entities

- **Bill Ảnh (Payment Bill)**: Liên kết đến đơn hàng, URL lưu trữ (private), tên file gốc, kích thước, thời điểm upload.
- **Đơn Hàng (trạng thái liên quan)**: `pending_payment` → (upload bill) → `pending_approval` → (Admin duyệt) → `completed` hoặc `rejected`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng có thể upload ảnh bill và gửi xác nhận trong vòng 2 phút.
- **SC-002**: 100% đơn hàng phải có ảnh bill trước khi chuyển sang trạng thái `pending_approval` — không có ngoại lệ.
- **SC-003**: Ảnh bill được lưu trong private storage — không thể truy cập trực tiếp bằng URL mà không có quyền Admin.
- **SC-004**: Người dùng nhận được email thông báo kết quả duyệt trong vòng 5 phút sau khi Admin thay đổi trạng thái.
- **SC-005**: Người dùng không thể thay thế bill sau khi Admin đã bắt đầu xem xét.

---

## Assumptions

- Ảnh bill được lưu trong Supabase Private Storage (không phải public bucket).
- Email thông báo được gửi qua dịch vụ email tích hợp sẵn — không cần cấu hình SMTP riêng trong v1.
- Không có OCR tự động để đọc thông tin chuyển khoản từ ảnh bill — Admin xác minh bằng mắt thường.
- Kích thước giới hạn file là 5MB — đủ cho ảnh chụp màn hình chất lượng cao mà không gây tốn băng thông.
