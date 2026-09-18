# Feature Specification: Explicit Order Confirmation Before Creation (Spec 020)

**Feature**: `020-explicit-order-confirmation-before-creation`  
**Status**: Approved / In-Progress  
**Version**: 1.0.0  
**Created**: 2026-09-18  
**Associated Documents**:
- `specs/004-order-checkout-vietqr/spec.md`
- `specs/006-admin-order-management/spec.md`
- `specs/016-coursera-multi-quantity-and-bulk-keygen/spec.md`
- `specs/017-checkout-auto-polling-and-instant-activation/spec.md`
- `specs/019-coursera-license-lifecycle-and-reorder-management/spec.md`
- `.sdd/shared_context.md`

---

## 1. Bối Cảnh & Vấn Đề Nghiệp Vụ (Context & Problem Statement)

### 1.1 Hiện Trạng & Lỗ Hổng Nghiệp Vụ
- Hiện tại, khi người dùng bấm nút **"Mua ngay"** trên thẻ sản phẩm (`ProductCard`), trang chi tiết (`/products/[slug]`) hoặc modal xem nhanh (`ProductDetailModal`), `CheckoutModal` lập tức tự động kích hoạt `createOrder(...)` thông qua `useEffect`:
  ```tsx
  React.useEffect(() => {
    if (checkoutProduct && !activeOrderForPayment) {
      createOrder(checkoutProduct, quantity);
    }
  }, [checkoutProduct, activeOrderForPayment, quantity]);
  ```
- Hàm `createOrder` lập tức gửi `POST /api/orders` lên máy chủ và chèn ngay một bản ghi vào bảng `public.orders` và `public.order_items` với trạng thái `pending_payment` (Chờ CK).
- Nguy hiểm hơn, khi khách hàng bấm tăng/giảm số lượng trong modal (`handleQuantityChange`), hàm này lại tiếp tục gọi `createOrder` tạo thêm các đơn hàng mới liên tục.
- **Hệ quả**:
  - Khách hàng chỉ mới bấm "Mua ngay" để xem thử giá hoặc xem thử thông tin, chưa hề có ý định thanh toán rồi đóng modal, hệ thống đã tính là 1 đơn hàng và lưu vĩnh viễn vào Database.
  - Cả trang **Quản trị đơn hàng Admin (`/admin/orders`)** và trang **Lịch sử đơn hàng của User (`/customer/orders`)** bị ngập tràn hàng chục đơn hàng "rác" ở trạng thái "Chờ CK".
  - Gây nhầm lẫn cho Admin trong việc đối soát doanh thu thật và gây khó chịu cho khách hàng khi thấy lịch sử mua hàng của mình xuất hiện những đơn mà họ chưa từng xác nhận mua.

---

## 2. Mục Tiêu Nghiệp Vụ (Business Goals)

1. **Nguyên Tắc Xác Nhận Có Chủ Đích (Explicit Confirmation Protocol)**:
   - Thao tác bấm nút "Mua ngay" trên trang web **CHỈ MỞ POPUP XEM XÉT ĐƠN HÀNG (Order Review & Confirmation)**, **TUYỆT ĐỐI KHÔNG ĐƯỢC TẠO ĐƠN HÀNG TRONG DATABASE**.
   - Nếu người dùng đóng popup (bấm dấu X, bấm "Hủy", bấm ra ngoài): **KHÔNG CÓ BẤT KỲ ĐƠN HÀNG NÀO ĐƯỢC TẠO RA**, Database hoàn toàn sạch sẽ, không có đơn hàng nào xuất hiện ở trang Admin hay User.
2. **Chỉ Tạo Đơn Hàng Khi Khách Bấm "Xác Nhận Đặt Hàng"**:
   - Khách hàng xem xét sản phẩm, tùy chỉnh số lượng `[-] [ quantity ] [+]`, nhập Email (nếu mua Tool Coursera).
   - Khi và chỉ khi khách hàng bấm nút **"Xác Nhận Đặt Hàng & Thanh Toán"**:
     - Hệ thống mới chính thức gọi `createOrder(...)` để lưu đơn hàng vào PostgreSQL và gán mã đơn hàng chính thức (`TQ-2026-XXXX`).
     - Chuyển sang màn hình **VietQR (Napas 247)** để thanh toán, kích hoạt cơ chế auto-polling SePay hoặc nộp bill.
     - Lúc này đơn hàng mới chính thức xuất hiện tại trang Đơn hàng của User và Admin với trạng thái `pending_payment`.
3. **Tương Thích Mượt Mà Với Đơn Hàng Cũ (Continue Payment)**:
   - Khi khách hàng truy cập `/customer/orders` và bấm "Tiếp tục thanh toán" cho một đơn hàng đã tồn tại từ trước:
     - `activeOrderForPayment` đã có sẵn dữ liệu trong store.
     - Modal sẽ mở thẳng vào bước quét mã QR (`step = "qr"`), không bắt khách xác nhận lại.

---

## 3. Thiết Kế Luồng Trải Nghiệm (Workflow & State Machine)

```
[Khách bấm "Mua ngay"]
       │
       ▼
[Modal Bước 1: step = "confirm"]
       │
       ├─► [Bấm "Hủy" hoặc Đóng Modal (X)] ───────────► Đóng popup, KHÔNG TẠO ĐƠN
       │
       ├─► [Tăng / Giảm số lượng] ────────────────────► Chỉ cập nhật state UI, tính lại tổng tiền, KHÔNG TẠO ĐƠN
       │
       ├─► [Nhập Email Coursera] ──────────────────────► Kiểm tra validate & hạn dùng (Spec 019), KHÔNG TẠO ĐƠN
       │
       ▼ [Khách bấm: "XÁC NHẬN ĐẶT HÀNG & LẤY MÃ QR"]
       │
       ├─► Validate thông tin thành công
       ├─► Gọi createOrder(product, quantity, emails) -> POST /api/orders
       ├─► Tạo đơn hàng chính thức trong DB PostgreSQL
       │
       ▼
[Modal Bước 2: step = "qr"]
       │
       ├─► Hiển thị VietQR kèm memo và số tiền chính xác
       ├─► Tự động polling SePay duyệt đơn (Spec 017)
       ├─► Tùy chọn nộp bill dự phòng (step = "upload")
       │
       ▼ [Thanh toán thành công]
[Modal Bước 3: step = "success"] ──► Nhả License Key & Tài nguyên số
```

---

## 4. Chi Tiết Kỹ Thuật (Technical Implementation Details)

### 4.1 Cấu Trúc Trạng Thái trong `CheckoutModal.tsx`
- State `step`: `"confirm" | "qr" | "upload" | "success"`.
- Khi mở modal từ `openCheckout(product, quantity)`:
  - Nếu không có `activeOrderForPayment` (hoặc `activeOrderForPayment.id` chưa khớp với sản phẩm hiện tại):
    - `step` khởi tạo là `"confirm"`.
    - `activeOrderForPayment = null`.
    - **XÓA BỎ HOÀN TOÀN `useEffect` tự động gọi `createOrder` khi mở modal**.
- Xóa bỏ việc gọi `createOrder` trong `handleQuantityChange`:
  - `handleQuantityChange` chỉ cập nhật: `setQuantity(clampedQty)` và resize mảng `customerEmails`.

### 4.2 Hàm `handleConfirmOrder`
```tsx
const handleConfirmOrder = async () => {
  if (isLicenseRequired) {
    if (!validateEmails()) return;
  }
  setIsCreatingOrder(true);
  try {
    const cleanEmails = customerEmails.map(e => e.trim().toLowerCase()).filter(e => e.includes("@"));
    const newOrder = await createOrder(checkoutProduct, quantity, cleanEmails);
    setStep("qr");
  } catch (err: any) {
    alert("Không thể khởi tạo đơn hàng: " + err.message);
  } finally {
    setIsCreatingOrder(false);
  }
};
```

### 4.3 Xử Lý Đóng Modal & Reset State
- Khi bấm nút `closeCheckout`:
  - Reset `step = "confirm"`, `checkoutProduct = null`, `activeOrderForPayment = null`.

---

## 5. Tiêu Chuẩn Chấp Thuận (Acceptance Criteria)

- [ ] Khi bấm "Mua ngay" trên trang web: Màn hình mở ra ở bước **"Xác Nhận Đơn Hàng"**.
- [ ] Khi khách bấm dấu X hoặc "Hủy": Đóng modal, không có bất kỳ đơn hàng nào được ghi vào Database, không xuất hiện ở trang `/admin/orders` hay `/customer/orders`.
- [ ] Khi khách tăng giảm số lượng `[-] [ + ]`: Chỉ cập nhật số lượng và tổng tiền trên màn hình, không tạo đơn hàng mới.
- [ ] Chỉ khi khách bấm **"Xác Nhận Đặt Hàng & Tiếp Tục Thanh Toán"**: Hệ thống mới tạo đúng 1 đơn hàng duy nhất trong DB và chuyển sang màn hình VietQR.
- [ ] Đơn hàng sau khi xác nhận hiển thị chính xác tại danh sách đơn của User và Admin với trạng thái `Chờ CK`.
- [ ] Khi khách bấm "Tiếp tục thanh toán" từ đơn hàng có sẵn trong `/customer/orders`: Mở thẳng vào màn hình VietQR.
- [ ] `npx tsc --noEmit` đạt 0 lỗi.
- [ ] Đẩy toàn bộ thay đổi lên GitHub remote `main`.
