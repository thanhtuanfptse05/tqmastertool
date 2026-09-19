# Feature Specification: Phương Thức Thanh Toán Kép (Quét Mã VietQR Tự Động & Tải Ảnh Bill Dự Phòng Cho Admin Duyệt)

**Feature Branch**: `023-dual-payment-mode-qr-and-backup-bill-upload`  
**Created**: 2026-09-19  
**Status**: In Progress  
**Input**: User description: "Hỏng rồi sao giờ trong trường hợp là t muốn dùng cái tải ảnh bill dự phòng cho admin duyệt mà sao giờ không thể tải ảnh bill nữa rồi. chỉ không cần tải ảnh bill dự phòng trong trường hợp đã thanh toán thành công mà, còn nếu k muốn quét mã thì cho tải bill dự phòng lên"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Thanh Toán Linh Hoạt: Quét Mã QR Tự Động Hoặc Tải Ảnh Bill Dự Phòng (Priority: P1)

Khi khách hàng chuyển từ Bước 1 (Xác nhận đơn hàng) sang Bước 2 (Thanh toán), giao diện cung cấp 2 chế độ thanh toán rõ ràng, trực quan, chuyển đổi mượt mà qua lại bằng 1 click:
1. **Chế độ 1: Quét Mã VietQR (Tự Động 24/7 - Khuyên Dùng)**:
   - Hiển thị mã QR động, thông tin tài khoản ngân hàng thụ hưởng, số tiền, cú pháp chuyển tiền chuẩn xác.
   - Cơ chế Auto-polling và Webhook SePay hoạt động ngầm. Khi ngân hàng xác nhận giao dịch khớp tiền và nội dung, hệ thống **tự động chuyển thẳng sang Bước 3 (thành công & cấp key) mà KHÔNG CẦN tải ảnh biên lai**.
2. **Chế độ 2: Tải Ảnh Bill Dự Phòng (Admin Duyệt Thủ Công)**:
   - Dành cho khách không muốn quét mã (chuyển khoản từ app ngân hàng khác, chuyển thường, giao dịch liên ngân hàng bị nghẽn) hoặc khách đã chuyển tiền xong nhưng muốn nộp bằng chứng ngay để Admin phê duyệt.
   - Vẫn hiển thị đầy đủ thông tin chuyển khoản (STK, Ngân hàng, Nội dung, Số tiền kèm nút sao chép 1-click).
   - Tích hợp khu vực tải ảnh biên lai (PNG, JPG, WEBP) với preview trực quan và ô nhập mã giao dịch ngân hàng.
   - Khách bấm nút "Xác Nhận & Gửi Bill Cho Admin Duyệt", đơn hàng chuyển sang trạng thái `pending_approval`, và modal chuyển sang màn hình Bước 3 thông báo tiếp nhận bill thành công kèm hướng dẫn chờ Admin duyệt.

**Why this priority**: Khắc phục triệt để trải nghiệm bị bế tắc khi khách hàng không muốn quét mã hoặc muốn nộp bill dự phòng mà không tìm thấy hoặc không thể tải bill lên.

**Independent Test**:
- Tạo một đơn hàng mới, tại Bước 2 bấm chuyển đổi giữa 2 tab "Quét Mã QR" và "Tải Ảnh Bill Dự Phòng". Xác nhận cả 2 giao diện hiển thị đầy đủ thông tin và không bị reset dữ liệu.
- Ở Tab Tải Bill Dự Phòng: Chọn 1 ảnh biên lai thực tế tải lên, xác nhận ảnh hiển thị preview, bấm gửi bill, kiểm tra đơn hàng chuyển thành `pending_approval` và hiển thị màn hình chờ Admin duyệt.

**Acceptance Scenarios**:
1. **Given** khách hàng đang ở Bước 2 thanh toán, **When** khách hàng bấm chọn tab/chế độ "Tải Ảnh Bill Dự Phòng", **Then** giao diện chuyển sang form tải ảnh biên lai với đầy đủ thông tin tài khoản và nút gửi duyệt cho Admin.
2. **Given** khách hàng chọn phương thức Quét mã VietQR và tiền vào tài khoản thành công qua SePay, **Then** hệ thống tự động nhảy sang Bước 3 mở key mà KHÔNG bắt khách nộp ảnh bill.
3. **Given** khách hàng chọn nộp ảnh bill dự phòng, **When** tải ảnh hợp lệ và bấm gửi, **Then** modal chuyển sang Bước 3 với trạng thái "Đã Nhận Bằng Chứng Chuyển Khoản — Chờ Admin Duyệt".

---

### User Story 2 - Chuẩn Hóa Tiến Trình Thanh Toán (Stepper & Header) (Priority: P2)

Thanh tiến trình (Progress Stepper) và tiêu đề Header phải phản ánh đúng bản chất luồng thanh toán kép:
- **Bước 1**: `1. Xác Nhận Đơn` (chọn số lượng, nhập Coursera emails)
- **Bước 2**: `2. Thanh Toán (QR / Bill)` (cho phép quét mã tự động hoặc nộp bill biên lai)
- **Bước 3**: `3. Hoàn Tất (Nhận Key / Chờ Duyệt)`

**Why this priority**: Tránh gây hiểu nhầm cho khách hàng rằng hệ thống đã bỏ chức năng tải bill dự phòng hay ép buộc chỉ có duy nhất quét mã.

**Independent Test**:
- Kiểm tra hiển thị tiêu đề và stepper ở từng bước: `confirm`, `qr` (chế độ QR), `upload` (chế độ tải bill), `success` (chế độ tự động hoàn tất hoặc chờ admin duyệt).

**Acceptance Scenarios**:
1. **Given** modal đang ở bước tải bill, **When** người dùng nhìn vào Header và Stepper, **Then** Header ghi rõ "Gửi Biên Lai Thanh Toán" và Stepper thể hiện rõ đang ở giai đoạn Thanh toán / Nộp bill.
2. **Given** đơn hàng được nộp bill chờ duyệt, **When** ở Bước 3, **Then** giao diện hiển thị badge màu hổ phách "Trạng thái: Chờ Admin Duyệt (pending_approval)" kèm giải thích rõ ràng.

---

### User Story 3 - Bảo Lưu Toàn Vẹn Dữ Liệu Khi Chuyển Đổi Phương Thức (Priority: P1)

Khi khách hàng chuyển qua lại giữa chế độ Quét QR và chế độ Tải Bill Dự Phòng, toàn bộ thông tin đơn hàng, số lượng, danh sách Email Coursera đã nhập, và ảnh bill đã chọn (nếu có) PHẢI được bảo toàn 100%, không bị xóa hoặc reset.

**Why this priority**: Tránh làm phiền khách hàng phải nhập lại email hay tải lại ảnh khi đổi ý giữa 2 cách thanh toán.

**Independent Test**: Nhập 2 email Coursera ở bước 1 -> sang bước 2 -> bấm sang Tab Tải Bill -> chọn ảnh -> bấm quay lại Quét QR -> bấm lại Tải Bill -> xác nhận email và ảnh đã chọn vẫn còn nguyên vẹn.

---

## Edge Cases

- **Khách hàng nộp bill nhưng SePay lại báo tiền vào trước**: Nếu SePay xác nhận trước khi Admin duyệt, hệ thống tự động nâng cấp trạng thái từ `pending_approval` lên `completed` và nổ pháo hoa mở key ngay lập tức.
- **Tải ảnh bill vượt quá dung lượng 10MB**: Hiển thị thông báo lỗi rõ ràng "Dung lượng ảnh biên lai không được vượt quá 10MB".
- **Khách hàng mở lại đơn `pending_payment` từ Lịch sử đơn hàng**: Modal mở ra ở Bước 2 với đầy đủ 2 lựa chọn Quét mã QR hoặc Tải ảnh bill dự phòng.
- **Khách hàng mở lại đơn `pending_approval` từ Lịch sử đơn hàng**: Modal mở thẳng vào Bước 3 hiển thị trạng thái "Đang Chờ Admin Duyệt" và ảnh biên lai đã nộp.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Modal thanh toán MUST cung cấp 2 chế độ thanh toán trực quan tại Bước 2: `qr` (Quét VietQR tự động) và `upload` (Tải ảnh bill dự phòng cho Admin duyệt).
- **FR-002**: Người dùng MUST có thể chuyển đổi qua lại giữa 2 chế độ bằng 1 click (qua tab hoặc nút chuyển đổi nổi bật) mà không bị mất dữ liệu đơn hàng hay danh sách email.
- **FR-003**: Khi khách hàng quét mã VietQR thành công qua SePay, hệ thống MUST tự động chuyển sang Bước 3 thành công mà KHÔNG yêu cầu tải bill.
- **FR-004**: Khi khách hàng ở chế độ Tải Bill, hệ thống MUST cho phép chọn ảnh từ máy tính (JPG, PNG, WEBP) hoặc dán URL ảnh, có preview xem trước, và nút submit "Gửi Bằng Chứng & Chờ Admin Duyệt".
- **FR-005**: Khi gửi bill thành công, đơn hàng MUST được cập nhật `status = 'pending_approval'`, lưu `payment_proof_image`, `transaction_ref`, và chuyển sang Bước 3 hiển thị thông báo Chờ Admin Duyệt.
- **FR-006**: Tiến trình Stepper MUST hiển thị `1. Xác Nhận Đơn`, `2. Thanh Toán (QR / Bill)`, `3. Hoàn Tất (Nhận Key / Chờ Duyệt)`.
- **FR-007**: Admin Dashboard MUST hiển thị đầy đủ đơn hàng `pending_approval` kèm ảnh bill để Admin đối soát và phê duyệt cấp key.

### Key Entities

- **Order**: Đơn hàng với `status` (`pending_payment`, `pending_approval`, `completed`), `payment_proof_image`, `transaction_ref`.
- **CourseraLicenseItem**: Khóa bản quyền sinh ra tự động khi đơn hàng hoàn tất (`completed`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% khách hàng có thể dễ dàng chuyển sang chế độ nộp bill dự phòng ngay tại màn hình thanh toán mà không bị kẹt ở mã QR.
- **SC-002**: Đơn hàng nộp bill được lưu đầy đủ ảnh vào Supabase storage (`product-assets/receipts/...`) và cập nhật trạng thái `pending_approval`.
- **SC-003**: Không có lỗi biên dịch TypeScript (`npx tsc --noEmit` đạt 0 lỗi).
- **SC-004**: Giữ nguyên cơ chế tự động chuyển sang Bước 3 của Spec 021 khi SePay ghi nhận giao dịch thành công.
