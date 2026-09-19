# SPEC-021: Chuyển Thẳng Sang Bước 3 (Thành Công & Cấp Key) Khi Thanh Toán Tự Động Xong

## 1. BỐI CẢNH & VẤN ĐỀ (BACKGROUND & PROBLEM)
- **Bối cảnh**: Người dùng chuyển khoản thành công qua VietQR (SePay Webhook hoặc bấm nút *"Tôi đã chuyển tiền — Kiểm tra ngay"*). Hệ thống đã phát hiện đơn hàng chuyển trạng thái sang `completed` và đã bắn pháo hoa confetti ăn mừng.
- **Vấn đề**:
  - Mặc dù pháo hoa đã nổ, giao diện `CheckoutModal.tsx` lại bị kẹt ở **Bước 2: Quét Mã QR** thay vì nhảy thẳng sang **Bước 3: Nhận Key & Tải** (`step = "success"`).
  - **Nguyên nhân gốc (Root Cause)**:
    - Trong `CheckoutModal.tsx`, `useEffect` khởi tạo modal có dependency `[checkoutProduct?.id, checkoutQuantity, activeOrderForPayment]`.
    - Khi `checkStatus` (Auto-polling) hoặc `handleManualCheckPayment` phát hiện đơn `completed`, hàm `submitPaymentProof(...)` được gọi -> hàm này cập nhật `activeOrderForPayment` trong store -> tạo ra object reference mới.
    - `useEffect` bị kích hoạt lại ngay lập tức: code thực hiện `if (activeOrderForPayment) { setStep("qr"); }`, đồng thời gọi `setGeneratedLicenseKey(null)` và `setGeneratedLicenses([])`.
    - Hậu quả: State `step` vừa set `"success"` bị đè ngay lập tức trở lại `"qr"`, xóa sạch toàn bộ Key vừa hiển thị.

---

## 2. MỤC TIÊU & YÊU CẦU NGHIỆP VỤ (OBJECTIVES)
1. **Chuyển thẳng sang Bước 3**: Ngay khi SePay ghi nhận tiền hoặc Auto-polling phát hiện đơn `completed`, giao diện modal phải chuyển tức thì sang `step = "success"`.
2. **Không bị reset state bởi useEffect**:
   - Sử dụng `useRef` lưu `prevOrderIdRef` để chỉ khởi tạo form khi mở đơn mới (`orderId` thay đổi hoặc modal vừa mở).
   - Tuyệt đối không reset `step` về `"qr"` hay xóa key khi đơn hàng chỉ cập nhật trạng thái `completed`.
3. **Khôi phục đầy đủ Key & Thông tin**:
   - Nếu `activeOrderForPayment?.status === "completed"`, tự động trích xuất License Info (`extractOrderLicenseInfo`) và hiển thị trực tiếp ở Bước 3.
4. **Đạt 0 lỗi TypeScript** (`npx tsc --noEmit`) và đẩy lên GitHub `origin/main`.

---

## 3. ACCEPTANCE CRITERIA (TIÊU CHÍ NGHIỆM THU)
- [ ] **AC-1**: Khi đơn hàng đạt `status === "completed"`, `CheckoutModal` lập tức hiển thị Bước 3 (`step = "success"`), hiển thị rõ:
  - Icon tích xanh thành công kèm thông báo *"Thanh Toán & Kích Hoạt Tự Động Thành Công!"*.
  - Danh sách License Key Coursera (30 ngày) cho từng email tài khoản kèm nút Sao chép.
  - Tóm tắt mã đơn hàng, số tiền, và nút *"Vào Kho Quà Tặng (My Vault)"*.
- [ ] **AC-2**: Không còn hiện tượng pháo hoa nổ nhưng màn hình đứng yên ở Bước 2 Quét Mã QR.
- [ ] **AC-3**: Cả 2 cơ chế (Auto-polling mỗi 2.5s và nút thủ công *"Tôi đã chuyển tiền — Kiểm tra ngay"*) đều chuyển mượt sang Bước 3.
- [ ] **AC-4**: Nếu khách hàng mở lại một đơn hàng đã hoàn tất từ Lịch sử đơn hàng, modal tự động hiển thị thẳng Bước 3 thành công.
- [ ] **AC-5**: Typecheck `npx tsc --noEmit` đạt 0 lỗi, commit và push GitHub.
