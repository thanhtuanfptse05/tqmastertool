# Feature Specification: Payment Proof Fallback & Upload Auth Hardening

**Feature Branch**: `033-payment-proof-fallback-hardening`

**Created**: 2026-09-24

**Status**: Ready for Implementation

**Input**: User description: "sao t đăng nhập rồi mà nó cứ báo là Vui lòng đăng nhập để tải lên ảnh biên lai thanh toán. và t đang bảo t muốn là cái đó là cái dự phòng trong trường hợp người dùng chuyển tiền rồi vẫn chưa nhận được hàng thì vẫn có thể up ảnh bill cho admin lấy đó là bằng chứng duyệt mà"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Khách Hàng Đăng Nhập Tải Ảnh Bill Không Bị Lỗi 401 (Priority: P1)

Khách hàng đã đăng nhập tài khoản trên website tiến hành thanh toán hoặc gửi ảnh bill biên lai chuyển khoản. Khi chọn tệp ảnh tải lên, hệ thống phải xác thực thành công phiên làm việc của người dùng và lưu trữ ảnh an toàn, tuyệt đối không hiện cảnh báo sai "Vui lòng đăng nhập để tải lên ảnh biên lai thanh toán."

**Why this priority**: Đây là lỗi chặn luồng (blocking bug) khiến người dùng dù đã đăng nhập vẫn không thể tải được ảnh bill lên hệ thống, làm gián đoạn toàn bộ cơ chế thanh toán dự phòng.

**Independent Test**:
Đăng nhập tài khoản trên web, mở modal thanh toán đơn hàng, bấm "Tôi Đã Chuyển Tiền — Tải Ảnh Bill Dự Phòng ➔", chọn 1 file ảnh biên lai hợp lệ. Ảnh phải tải lên thành công và hiển thị preview ngay trong modal mà không có bất kỳ thông báo lỗi 401 nào.

**Acceptance Scenarios**:
1. **Given** Người dùng đã đăng nhập và đang ở màn hình tải bill (`step === "upload"`), **When** người dùng chọn một file ảnh JPG/PNG hợp lệ, **Then** client gửi kèm `Authorization: Bearer <access_token>` và `orderId`, server xác thực hợp lệ, lưu ảnh vào bucket `product-assets/receipts`, và trả về URL ảnh thành công.
2. **Given** Người dùng đã tạo đơn hàng hợp lệ ở trạng thái `pending_payment`, **When** người dùng tải ảnh biên lai gửi kèm `orderId`, **Then** server kiểm tra đơn hàng tồn tại và chấp thuận việc upload ảnh biên lai cho đơn hàng đó.

---

### User Story 2 - Cơ Chế Dự Phòng (Fallback) Khi Chuyển Khoản Nhưng Chưa Tự Động Duyệt (Priority: P2)

Trong trường hợp người dùng đã chuyển tiền qua tài khoản ngân hàng / VietQR nhưng cổng SePay bị trễ mạng hoặc chưa kịp tự động duyệt, người dùng có thể dễ dàng chuyển sang bước nộp ảnh biên lai chuyển khoản làm bằng chứng để Admin duyệt đơn thủ công.

**Why this priority**: Đảm bảo trải nghiệm mua hàng thông suốt, khách hàng không bị lo lắng mất tiền khi hệ thống webhook tự động gặp sự cố tạm thời hoặc chuyển khoản chậm từ phía ngân hàng.

**Independent Test**:
Tại màn hình mã QR VietQR, người dùng nhấn nút "Tôi Đã Chuyển Tiền — Tải Ảnh Bill Dự Phòng ➔". Giao diện chuyển mượt mà sang form tải ảnh bill với thông tin đơn hàng đã điền sẵn, tải ảnh lên và nhấn "Xác Nhận & Gửi Bill Cho Admin Duyệt". Đơn hàng chuyển sang trạng thái `pending_approval` và hiển thị trong danh sách chờ duyệt của Admin.

**Acceptance Scenarios**:
1. **Given** Khách hàng đang ở màn hình QR VietQR và đã chuyển khoản thành công ngoài ngân hàng, **When** khách hàng bấm "Tôi Đã Chuyển Tiền — Tải Ảnh Bill Dự Phòng ➔", **Then** hệ thống mở form nộp bill với đầy đủ thông tin số tiền, mã đơn và ô tải ảnh.
2. **Given** Khách hàng nộp ảnh bill thành công, **When** bấm "Xác Nhận & Gửi Bill Cho Admin Duyệt", **Then** đơn hàng chuyển sang `pending_approval`, lưu `payment_proof_image`, và hiển thị thông báo đã gửi bill thành công.

---

### User Story 3 - Tải Bill Trực Tiếp Từ Lịch Sử Đơn Hàng (Priority: P3)

Khách hàng sau khi chuyển khoản nếu lỡ đóng modal thanh toán vẫn có thể vào mục "Lịch sử đơn hàng" hoặc mở "Chi tiết đơn hàng", thấy đơn hàng ở trạng thái `pending_payment` và bấm nút "Tải Ảnh Bill Chuyển Khoản Dự Phòng" để nộp bill ngay mà không bị lạc hướng.

**Why this priority**: Phục vụ kịch bản khách thanh toán xong lỡ tắt trình duyệt hoặc đổi tab, sau đó quay lại nộp bill.

**Independent Test**:
Vào `/customer/orders`, mở chi tiết một đơn `pending_payment`, bấm nút tải bill dự phòng, giao diện chuyển trực tiếp tới bước nộp bill.

**Acceptance Scenarios**:
1. **Given** Đơn hàng của khách đang ở trạng thái `pending_payment`, **When** khách xem chi tiết đơn trong `OrderDetailModal`, **Then** có nút hành động rõ ràng "Tải Ảnh Bill Dự Phòng" để nộp biên lai cho Admin duyệt.

---

### Edge Cases

- **Token hết hạn / LocalStorage desync**: Nếu phiên đăng nhập ở client bị trễ hoặc refresh token chưa xong nhưng có gửi kèm `orderId` của đơn hàng đang chờ thanh toán (`pending_payment`), server kiểm tra đơn hàng hợp lệ trong DB và cho phép lưu trữ ảnh bill cho đơn hàng đó mà không chặn người dùng.
- **Upload spam từ hacker không có đơn hàng và không đăng nhập**: Yêu cầu request upload phải thỏa mãn ít nhất một trong hai: có `user` hợp lệ (Bearer token) HOẶC có `orderId` hợp lệ thuộc đơn `pending_payment` / `pending_approval` trong cơ sở dữ liệu. Requests nặc danh không có token và không có đơn hàng hợp lệ sẽ bị từ chối 401 ngay lập tức.
- **File không hợp lệ hoặc quá 10MB**: Bị từ chối với thông báo lỗi tiếng Việt rõ ràng.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Client trong `CheckoutModal.tsx` tại hàm `handleBillFileUpload` BẮT BUỘC phải lấy Supabase session token (`supabase.auth.getSession()`) và truyền header `Authorization: Bearer <token>`.
- **FR-002**: Client BẮT BUỘC phải đính kèm `orderId` vào `FormData` khi gọi `POST /api/orders/upload-proof`.
- **FR-003**: Server API `POST /api/orders/upload-proof` BẮT BUỘC phải hỗ trợ xác thực kép:
  1. Kiểm tra session qua `getAuthenticatedUser(req)`.
  2. Nếu token không có sẵn trên header/cookie, kiểm tra `orderId` gửi kèm. Nếu `orderId` là đơn hàng hợp lệ tồn tại trong bảng `orders` với trạng thái `pending_payment` hoặc `pending_approval`, cho phép tải ảnh biên lai gắn với đơn hàng đó.
- **FR-004**: Giao diện nút "Tôi Đã Chuyển Tiền — Tải Ảnh Bill Dự Phòng ➔" trong `CheckoutModal.tsx` phải nổi bật, rõ ràng để khách hàng dễ dàng sử dụng khi chuyển tiền mà chưa nhận được tài nguyên ngay.
- **FR-005**: Trong `OrderDetailModal.tsx`, khi đơn hàng ở trạng thái `pending_payment`, bổ sung nút hành động "Tải Ảnh Bill Dự Phòng" giúp khách hàng nộp bổ sung biên lai nhanh chóng.

---

## Key Entities *(include if feature involves data)*

- **Order**: Thực thể đơn hàng trong bảng `orders` chứa `id`, `user_id`, `status` (`pending_payment`, `pending_approval`, `completed`), `payment_proof_image`, `transaction_ref`.
- **PaymentProof**: Tệp ảnh biên lai lưu trữ tại Supabase Storage bucket `product-assets` dưới đường dẫn `receipts/bill_{timestamp}_{random}.{ext}`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% người dùng đã đăng nhập tải ảnh bill không còn gặp lỗi 401 "Vui lòng đăng nhập để tải lên ảnh biên lai thanh toán".
- **SC-002**: Hệ thống duy trì tính năng bảo vệ chống DDoS/spam storage: không cho phép request nặc danh không có đơn hàng hợp lệ tải ảnh lên.
- **SC-003**: Kiểm tra kiểu dữ liệu TypeScript (`npx tsc --noEmit`) đạt 0 lỗi.
- **SC-004**: Trạng thái đơn hàng sau khi nộp bill cập nhật sang `pending_approval` và hiển thị đầy đủ hình ảnh bill cho Admin kiểm tra.

---

## Assumptions

- Người dùng truy cập trên trình duyệt hiện đại có hỗ trợ Supabase client JS.
- Bucket `product-assets` đã được cấu hình và hoạt động bình thường trên Supabase Storage.
