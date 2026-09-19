# Feature Specification: Khôi Phục Bước 2 Tải Bill Dự Phòng & Chuyển Bước Không Bị Chặn (Spec 023)

**Feature Branch**: `023-dual-payment-mode-qr-and-backup-bill-upload`  
**Created**: 2026-09-19  
**Status**: Revised & Active  
**Input**: User feedback: "thừa à sao lại có 2 cái tải dự phòng này mà t bấm cả 2 còn không bám được làm như shit vậy , rõ ràng nghiệp vụ trước t nói là các bước 2 là bước tải bill dự phòng rồi cơ mà đọc lại đi"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Khôi Phục Đúng Nghiệp Vụ Chuẩn 3 Bước (Priority: P1)

Quy trình thanh toán của `CheckoutModal` tuân thủ nghiêm ngặt 3 bước chuẩn nghiệp vụ:
- **Bước 1**: `1. Quét Mã VietQR` (`step === "qr"`)
- **Bước 2**: `2. Tải Bill Dự Phòng` (`step === "upload"`)
- **Bước 3**: `3. Nhận Key & Tải` (`step === "success"`)

1. **Ở Bước 1: Quét Mã VietQR**:
   - Hiển thị mã QR VietQR tự động và thông tin tài khoản BIDV.
   - Nút hành động chính:
     - Nút nộp bill dự phòng: **"Tôi Đã Chuyển Tiền — Tải Ảnh Bill Dự Phòng ➔"** (Chuyển sang Bước 2).
     - Nút kiểm tra: **"Kiểm Tra Thanh Toán Ngay (SePay)"**.
   - **Đặc quyền thanh toán tự động**: Nếu ngân hàng xác nhận khớp tiền và nội dung qua SePay, hệ thống **TỰ ĐỘNG BỎ QUA BƯỚC 2 (Tải bill dự phòng), NHẢY THẲNG VÀO BƯỚC 3 THÀNH CÔNG VÀ CẤP KEY**.
   - **Nếu khách không muốn quét mã hoặc SePay chậm**: Khách bấm nút *"Tải ảnh bill dự phòng"*, modal lập tức chuyển sang **Bước 2**.

2. **Ở Bước 2: Tải Bill Dự Phòng**:
   - Stepper sáng rõ ràng số 2: **"2. Tải Bill Dự Phòng"**.
   - Header hiển thị: **"Gửi Bằng Chứng Chuyển Khoản (Admin Duyệt)"**.
   - Bảng thông tin tài khoản chuyển tiền (Ngân hàng BIDV, STK, Tên chủ TK, Số tiền, Nội dung chuyển khoản kèm nút 1-click copy).
   - Khu vực tải file ảnh biên lai (PNG, JPG, WEBP), có xem trước (preview) ảnh rõ nét.
   - Ô nhập mã giao dịch ngân hàng (tùy chọn).
   - Nút hành động:
     - *"Quay lại mã QR"* (trở về Bước 1).
     - *"Xác Nhận & Gửi Bill Cho Admin Duyệt"* (lưu ảnh vào Supabase, chuyển trạng thái đơn sang `pending_approval`, chuyển sang Bước 3 hiển thị thông báo Chờ Admin Duyệt).

3. **Ở Bước 3: Hoàn Tất / Chờ Duyệt**:
   - Stepper sáng số 3: **"3. Nhận Key & Tải"**.
   - Nếu duyệt tự động (`isAutoApproved`): Màn hình xanh chúc mừng, nổ pháo hoa, hiển thị đầy đủ License Keys.
   - Nếu chờ admin duyệt (`pending_approval`): Màn hình vàng hổ phách, thông báo "Đã Nhận Bằng Chứng Chuyển Khoản — Chờ Admin Duyệt".

**Acceptance Scenarios**:
1. **Given** khách đang ở Bước 1 Quét Mã QR, **When** khách bấm nút "Tải ảnh bill dự phòng", **Then** modal PHẢI CHUYỂN NGAY LẬP TỨC sang Bước 2, không bị chặn bởi bất kỳ validation email nào.
2. **Given** khách đang ở Bước 1, **When** SePay phát hiện tiền vào, **Then** modal tự động bỏ qua Bước 2 và nhảy thẳng sang Bước 3 hiển thị License Keys.
3. **Given** khách ở Bước 2 tải ảnh biên lai và bấm gửi, **Then** đơn hàng cập nhật `status = 'pending_approval'` và modal chuyển sang Bước 3 thông báo chờ duyệt.

---

### User Story 2 - Loại Bỏ Hoàn Toàn Tab Trùng Lặp & Sửa Lỗi Liệt Nút (Priority: P1)

1. **Loại bỏ tab thừa**: Xóa bỏ hoàn toàn thanh tab chuyển đổi ở trên đầu modal. Chỉ duy nhất nút chuyển bước ở dưới mã QR: *"Tôi Đã Chuyển Tiền — Tải Ảnh Bill Dự Phòng ➔"*.
2. **Sửa dứt điểm lỗi liệt nút**:
   - Hàm `handleProceedToUpload` TUYỆT ĐỐI KHÔNG gọi `validateEmails()` chặn chuyển bước.
   - Khi modal mở từ đơn hàng đã có (`activeOrderForPayment`), tự động trích xuất lại danh sách email Coursera từ `order.admin_notes` (nếu có) vào `customerEmails`, không để `[""]`.

---

## Edge Cases

- **Khách mở đơn hàng pending_payment từ Lịch sử đơn hàng**: Mở thẳng vào Bước 1 Quét Mã QR, với đầy đủ thông tin mã đơn, số tiền, và nút sang Bước 2 Tải Bill Dự Phòng.
- **Khách bấm nút quay lại ở Bước 2**: Trở về Bước 1 Quét Mã QR mà không bị reset ảnh bill đã chọn.

---

## Success Criteria *(mandatory)*

- **SC-001**: Bấm nút "Tải ảnh bill dự phòng" ở Bước 1 chuyển sang Bước 2 trong 0ms, 100% không bị chặn.
- **SC-002**: Stepper hiển thị chính xác: `1. Quét Mã VietQR` ➔ `2. Tải Bill Dự Phòng` ➔ `3. Nhận Key & Tải`.
- **SC-003**: Không có 2 nút tải bill trùng lặp trên cùng 1 màn hình.
- **SC-004**: `npx tsc --noEmit` đạt 0 lỗi biên dịch.
