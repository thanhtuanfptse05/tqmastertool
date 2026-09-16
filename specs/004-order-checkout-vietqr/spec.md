# Feature Specification: Order Checkout & VietQR Payment (Spec 004)

**Feature Branch**: `004-order-checkout-vietqr`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/components/store/CheckoutModal.tsx`
- `src/app/checkout/page.tsx`
- `src/lib/vietqr.ts`
- `src/lib/store.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Nền tảng phân phối sản phẩm số sử dụng phương thức chuyển khoản ngân hàng qua VietQR (chuẩn Napas 247 liên ngân hàng Việt Nam). Khách hàng quét mã QR để chuyển khoản nhanh, đảm bảo chính xác số tiền và nội dung đơn hàng, sau đó chuyển sang bước gửi ảnh biên lai.
- **Feature Goal**: Cung cấp quy trình Checkout 3 bước tinh gọn (`qr` → `upload` → `success`), tự động sinh mã VietQR với nội dung chuẩn hóa, hỗ trợ sao chép số tài khoản và số tiền 1-click.
- **Success Metrics**:
  - Mã QR VietQR quét thành công trên 100% ứng dụng Mobile Banking của các ngân hàng Việt Nam (MBBank, Vietcombank, Techcombank, VPBank, ACB...).
  - Thời gian khởi tạo đơn hàng và render mã QR < 500ms.
  - Nội dung chuyển khoản chuẩn hóa `CV2026xxxx` không dấu, chống sai lệch khi ngân hàng xử lý.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Khách hàng (Customer / Guest)** | Mở CheckoutModal, quét mã QR thanh toán hoặc sao chép thông tin chuyển khoản, chuyển tiếp sang bước upload bill. |
| **Quản trị viên (Admin)** | Cấu hình thông tin tài khoản thụ hưởng trong `src/lib/vietqr.ts` (`DEFAULT_VIETQR_CONFIG`). |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Mở Thanh Toán VietQR Tức Thì (Priority: P1)
- **GIVEN** người dùng bấm nút "Mua Ngay" tại bất kỳ sản phẩm nào
- **WHEN** hệ thống kích hoạt `openCheckout(product)`
- **THEN** tự động khởi tạo đơn hàng với trạng thái `pending_payment`, sinh mã đơn dạng `CV-2026-XXXX`, memo dạng `CV2026XXXX` và hiển thị modal `CheckoutModal` ở Bước 1: Quét Mã QR.

### User Story 2 — Quét Mã VietQR & Sao Chép Thông Tin (Priority: P1)
- **GIVEN** modal thanh toán đang ở Bước 1
- **WHEN** khách hàng quét mã QR hoặc bấm nút sao chép:
  - Bấm copy Số tài khoản (`0338309088`)
  - Bấm copy Số tiền (`formatVND(order.total_amount)`)
  - Bấm copy Nội dung chuyển tiền (`order.vietqr_content`)
- **THEN** thông tin tương ứng được sao chép vào clipboard, hiển thị icon Check và chữ "Đã copy" trong 2 giây.

### User Story 3 — Chuyển Tiếp Sang Bước Upload Biên Lai (Priority: P1)
- **GIVEN** khách hàng đã hoàn tất thao tác chuyển khoản trên app ngân hàng
- **WHEN** bấm nút "Tôi Đã Chuyển Khoản — Gửi Ảnh Biên Lai →"
- **THEN** modal chuyển sang Bước 2 (`upload`) để tải ảnh hóa đơn giao dịch.

### User Story 4 — Hoàn Tất & Chờ Duyệt (Priority: P1)
- **GIVEN** khách hàng gửi ảnh biên lai thành công ở Bước 2
- **WHEN** đơn hàng cập nhật trạng thái sang `pending_approval`
- **THEN** modal chuyển sang Bước 3 (`success`), hiệu ứng pháo hoa confetti kích hoạt, hiển thị thông báo "Đã Nhận Yêu Cầu Duyệt Đơn!" kèm nút điều hướng đến `/customer/orders`.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL generate a unique order code formatted as `CV-2026-XXXX` and a sanitized banking memo `CV2026XXXX`.
- **FR-002 (Event-Driven)**: WHEN an order is initiated, THE system SHALL generate the VietQR image URL using the standard Napas 247 service:
  `https://img.vietqr.io/image/{bank}-{account}-{template}.png?amount={amount}&addInfo={memo}&accountName={name}`.
- **FR-003 (State-Driven)**: WHILE on Step 1 (QR), THE system SHALL provide 1-click clipboard copy for Account Number, Amount, and Transfer Memo.
- **FR-004 (State-Driven)**: WHILE an order is not yet verified by proof upload, its status SHALL remain `pending_payment`.
- **FR-005 (Event-Driven)**: WHEN the customer clicks "Tôi Đã Chuyển Khoản", THE system SHALL transition the modal view to Step 2 without losing current order state.

---

## 5. Data Model & Configurations

```typescript
export interface VietQRConfig {
  bankId: string;       // e.g. "MBBANK" (970422)
  accountNo: string;    // e.g. "0338309088"
  accountName: string;  // e.g. "TRAN THANH TUAN"
  template: string;     // e.g. "compact2"
}

export const DEFAULT_VIETQR_CONFIG: VietQRConfig = {
  bankId: "MBBANK",
  accountNo: "0338309088",
  accountName: "TRAN THANH TUAN",
  template: "compact2",
};
```

---

## 6. Verification & Test Plan

- **Automated**: `tsc --noEmit` đạt 0 lỗi.
- **Manual Verification**:
  1. Bấm "Mua ngay" trên sản phẩm bất kỳ -> Kiểm tra ảnh QR xuất hiện rõ nét.
  2. Dùng camera điện thoại hoặc app Banking quét thử -> Kiểm tra số tài khoản, tên chủ TK (TRAN THANH TUAN), số tiền và nội dung memo tự động điền chính xác.
  3. Bấm copy số tài khoản -> Paste ra kiểm tra `0338309088`.
  4. Bấm "Tôi đã chuyển khoản" -> Modal chuyển sang bước 2.
