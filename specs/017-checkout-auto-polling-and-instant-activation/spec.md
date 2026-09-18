# SPEC-017: Checkout Auto-Polling & Instant Order Activation

## 1. BỐI CẢNH & VẤN ĐỀ (PROBLEM STATEMENT)
- **Thực trạng**: Khi khách hàng quét mã VietQR và chuyển tiền thành công qua ngân hàng, SePay webhook bắn về server để duyệt đơn tự động. Tuy nhiên, tại màn hình thanh toán (`CheckoutModal.tsx` Step 2):
  1. Giao diện **không có cơ chế Auto-Polling** kiểm tra trạng thái đơn hàng tự động.
  2. Nút duy nhất khách thấy là *"Tôi đã chuyển khoản — Tải ảnh bill"*. Khi khách bấm vào và nộp bill, hệ thống chuyển trạng thái đơn hàng thành `pending_approval` ("Chờ Admin Duyệt").
  3. Khách hàng cảm thấy bị "sai nghiệp vụ" vì đã chuyển tiền thành công nhưng vẫn bị bắt chờ Admin duyệt thủ công.
- **Mục tiêu**:
  1. Tích hợp **Auto-Polling** định kỳ mỗi 2.5s khi khách đang mở màn hình QR để tự động phát hiện khi đơn hàng chuyển sang `completed`.
  2. Bổ sung nút **"Kiểm tra thanh toán ngay"** để khách có thể chủ động kiểm tra ngay mà không cần nộp bill.
  3. Khi phát hiện đơn hàng đã `completed`, modal lập tức tự động nhảy sang Step 3 (Hoàn thành & Bàn giao Key), bắn pháo hoa ăn mừng và hiển thị đầy đủ License Keys.
  4. Nộp ảnh biên lai thủ công chỉ là phương án dự phòng (fallback) nếu sau 60s ngân hàng/SePay bị nghẽn chưa kịp bắn webhook.

---

## 2. USER STORIES & ACCEPTANCE CRITERIA

### User Story 1: Tự động phát hiện thanh toán thành công
- **Là** một khách hàng mua Tool Coursera hoặc sản phẩm số,
- **Tôi muốn** sau khi chuyển khoản trên app ngân hàng, màn hình website tự động nhận diện và nhảy sang trang nhận key,
- **Để** tôi có key sử dụng ngay lập tức mà không cần chụp màn hình biên lai hay chờ đợi Admin.

### Acceptance Criteria:
- [x] **AC-1**: Khi khách ở Step 2 (QR Code), một background timer thực hiện polling `/api/orders?id=...` mỗi 2.5 giây.
- [x] **AC-2**: Ngay khi API trả về `status === "completed"`, polling dừng lại, modal tự động chuyển sang `step = "success"`, trích xuất License Keys và kích hoạt hiệu ứng pháo hoa confetti.
- [x] **AC-3**: Có nút bấm *"Kiểm tra thanh toán ngay"* với hiệu ứng spinner loading để khách chủ động kích hoạt kiểm tra tức thì.
- [x] **AC-4**: Nếu sau 45-60s ngân hàng chưa gửi biến động số dư, hiển thị gợi ý hỗ trợ nộp biên lai để Admin duyệt nhanh.

---

## 3. THIẾT KẾ KỸ THUẬT (TECHNICAL DESIGN)

### 3.1. API Polling Endpoint
- Tận dụng `GET /api/orders` hoặc endpoint kiểm tra đơn hàng nhanh theo `orderId`.
- Kiểm tra trực tiếp bảng `orders` trong Supabase để lấy trạng thái mới nhất: `status`, `admin_notes`, `transaction_ref`.

### 3.2. State Machine trong CheckoutModal
- `isCheckingPayment`: Boolean state biểu thị đang kiểm tra trạng thái giao dịch.
- `pollingTimer`: `NodeJS.Timeout` chạy mỗi 2500ms khi `step === "payment"` và `activeOrderForPayment` tồn tại.
- Hủy timer khi modal đóng hoặc khi `step !== "payment"`.

---

## 4. KIỂM THỬ & BẢO ĐẬM NGHIỆP VỤ
- **Happy Path**: Khách chuyển tiền -> SePay bắn webhook -> Order chuyển `completed` -> Auto-polling bắt được trong vòng 2-3s -> UI chuyển thẳng sang `step = "success"` có key ngay.
- **Fallback Path**: Ngân hàng nghẽn -> Khách nộp bill -> Order chuyển `pending_approval` -> Admin duyệt thủ công.
