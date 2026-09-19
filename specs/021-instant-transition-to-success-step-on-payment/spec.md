# Feature Specification: Chuyển Thẳng Sang Bước 3 (Thành Công & Cấp Key) Khi Thanh Toán Tự Động Xong

**Feature Branch**: `021-instant-transition-to-success-step-on-payment`

**Created**: 2026-09-19

**Status**: Implemented

**Input**: User description: "cái này hiện tại chuyển tiền ok hết rồi tuy nhiên là nó mới có bắn pháo hoa chứ t muốn nếu mà thanh toán tự động thành công là sẽ nhảy thẳng vào bước 3 hiện là thành công luôn"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tự Động Nhảy Sang Bước 3 Khi Thanh Toán Hoàn Tất (Priority: P1)

Khi khách hàng quét mã VietQR và chuyển khoản thành công, hệ thống SePay đối soát biến động số dư và chuyển trạng thái đơn hàng sang `completed`. Giao diện `CheckoutModal` của khách hàng phải tự động chuyển ngay lập tức từ **Bước 2: Quét Mã QR** sang **Bước 3: Nhận Key & Tải** (`step = "success"`), hiển thị màn hình chúc mừng, nổ pháo hoa và bàn giao toàn bộ License Key VIP.

**Why this priority**: Đây là luồng trải nghiệm khách hàng cốt lõi (Core Checkout Journey). Nếu khách chuyển tiền xong mà màn hình vẫn kẹt ở Bước 2 Quét Mã QR, khách hàng sẽ hoang mang, tưởng thanh toán chưa được ghi nhận và có thể chuyển khoản lặp lại.

**Independent Test**: Có thể kiểm thử độc lập bằng cách mở đơn hàng đang chờ thanh toán, cập nhật trạng thái đơn thành `completed` trong Supabase (hoặc kích hoạt SePay Webhook), và xác nhận modal lập tức chuyển sang Bước 3 hiển thị đầy đủ License Keys.

**Acceptance Scenarios**:

1. **Given** khách hàng đang mở modal ở Bước 2 (`step = "qr"`) chờ chuyển khoản, **When** hệ thống nhận diện giao dịch thành công (`status === "completed"` qua SePay hoặc nút kiểm tra thủ công), **Then** modal phải lập tức chuyển sang Bước 3 (`step = "success"`), hiển thị tích xanh và danh sách License Key.
2. **Given** giao dịch đã hoàn tất thành công, **When** pháo hoa confetti kích hoạt ăn mừng, **Then** giao diện bên dưới pháo hoa PHẢI là màn hình Bước 3 (Thành Công), TUYỆT ĐỐI KHÔNG được giữ nguyên mã QR hay bị giật về Bước 2.

---

### User Story 2 - Khóa Cứng Trạng Thái & Chặn Xung Đột Reset State (Priority: P1)

Khi `activeOrderForPayment` trong global store được cập nhật trạng thái từ `pending_payment` sang `completed`, component `CheckoutModal` không được phép chạy lại logic reset form, không được đè `setStep("qr")` và không được xóa `generatedLicenses`.

**Why this priority**: Đây là nguyên nhân kỹ thuật gốc rễ gây ra lỗi "pháo hoa nổ nhưng màn hình không nhảy bước". Cần bảo vệ nghiêm ngặt tính toàn vẹn của state React.

**Independent Test**: Kích hoạt hàm `submitPaymentProof(...)` khi modal đang ở `step = "success"`, xác nhận state `step` vẫn giữ nguyên là `"success"` và các key bản quyền không bị xóa rỗng.

**Acceptance Scenarios**:

1. **Given** modal đã chuyển sang `step = "success"`, **When** `activeOrderForPayment` cập nhật dữ liệu mới trong store, **Then** hook `useEffect` phải giữ nguyên `step = "success"` và không được reset dữ liệu về form khởi tạo.
2. **Given** khách đang ở `step = "qr"` hoặc `step = "upload"`, **When** component re-render, **Then** form không được reset số lượng hoặc danh sách email đã nhập.

---

### User Story 3 - Mở Đơn Hàng Đã Hoàn Tất Từ Lịch Sử (Priority: P2)

Khi khách hàng truy cập Lịch Sử Đơn Hàng (`/customer/orders`) và bấm xem một đơn hàng đã có trạng thái `completed`, modal phải nhận diện đơn đã hoàn tất và mở thẳng vào Bước 3 thành công thay vì bắt khách xem lại mã VietQR.

**Why this priority**: Giúp khách hàng dễ dàng tra cứu lại License Key và hướng dẫn tải tài nguyên bất kỳ lúc nào từ lịch sử mua hàng.

**Independent Test**: Chọn một đơn hàng có `status === "completed"`, kích hoạt `openCheckout` hoặc `setActiveOrderForPayment`, kiểm tra modal mở ngay tại Bước 3.

**Acceptance Scenarios**:

1. **Given** một đơn hàng có `status === "completed"`, **When** người dùng mở modal thanh toán của đơn đó, **Then** modal tự động trích xuất các License Keys từ `admin_notes` và hiển thị trực tiếp ở Bước 3 (`step = "success"`).

---

### Edge Cases

- **Mất kết nối mạng tạm thời khi polling**: Interval 2.5s bắt lỗi nhẹ nhàng (`console.warn`), không làm crash modal, tiếp tục thử lại ở chu kỳ tiếp theo.
- **Khách hàng bấm nút "Tôi đã chuyển tiền" liên tục**: Nút có cờ `disabled={isCheckingPayment}` kèm biểu tượng loading quay tròn để ngăn chặn gửi trùng lặp request lên database.
- **Đơn hàng có nhiều License Keys**: Giao diện Bước 3 tự động cuộn (scrollable container) và hỗ trợ nút *"Sao chép tất cả"* cùng nút sao chép riêng biệt từng key.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST tự động kiểm tra trạng thái đơn hàng định kỳ mỗi 2500ms khi modal đang ở Bước 2 (`step = "qr"`).
- **FR-002**: Hệ thống MUST lập tức chuyển `step` sang `"success"` ngay khi phát hiện đơn hàng có `status === "completed"`.
- **FR-003**: Hệ thống MUST trích xuất toàn bộ danh sách License Keys Coursera (`extractOrderLicenseInfo`) và hiển thị đầy đủ cùng email sở hữu tại Bước 3.
- **FR-004**: Hook khởi tạo trong `CheckoutModal` MUST chặn đứng hành vi đè state `step` về `"qr"` hoặc xóa rỗng `generatedLicenses` khi `activeOrderForPayment.status === "completed"`.
- **FR-005**: Hệ thống MUST cung cấp nút kiểm tra thủ công *"Tôi đã chuyển tiền — Kiểm tra ngay"* để khách chủ động kích hoạt chuyển sang Bước 3 nếu không muốn chờ polling.
- **FR-006**: Bước 3 MUST cung cấp đường dẫn trực tiếp *"Vào Kho Quà Tặng (My Vault)"* và *"Xem Chi Tiết Đơn Hàng"* để khách hàng truy cập tài nguyên ngay lập tức.

### Key Entities

- **Order**: Đại diện cho đơn hàng (`id`, `order_code`, `status`, `total_amount`, `admin_notes`, `license_key`).
- **CourseraLicenseItem**: Thực thể khóa bản quyền gồm `email`, `key`, `durationLabel`, `isExpired`, `daysRemaining`, `formattedExpDate`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các đơn hàng chuyển khoản thành công tự động chuyển sang Bước 3 trong vòng tối đa 2.5 giây kể từ khi SePay cập nhật DB mà không cần người dùng tải lại trang.
- **SC-002**: 0 trường hợp bị giật ngược màn hình về Bước 2 Quét Mã QR sau khi pháo hoa đã nổ.
- **SC-003**: 100% License Keys gắn liền với đơn hàng được hiển thị đầy đủ, chính xác, và có nút sao chép hoạt động trơn tru tại Bước 3.
- **SC-004**: Hệ thống vượt qua 100% bài kiểm tra biên dịch TypeScript (`npx tsc --noEmit` đạt 0 lỗi).

---

## Assumptions

- SePay Webhook URL đã được cấu hình chính xác vào subdomain `https://tool.tuanvaquan.io.vn/api/webhooks/sepay`.
- Khách hàng sử dụng trình duyệt hỗ trợ Canvas Confetti và CSS Animation hiện đại.
- Cơ chế Supabase Realtime/Polling có độ trễ dưới 500ms trong điều kiện mạng thông thường.
