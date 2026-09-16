# Feature Specification: Complete Order CRUD, SePay Automation & Anti-Hack Security (Spec 011)

**Feature Branch**: `011-order-management-and-sepay-automation`  
**Status**: Draft (Planning Mode)  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/types/index.ts`
- `src/lib/store.tsx`
- `src/app/api/webhooks/sepay/route.ts`
- `src/app/api/orders/[id]/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- `src/app/customer/orders/page.tsx`
- `src/app/admin/orders/page.tsx`
- `src/components/store/OrderDetailModal.tsx`
- `src/components/store/AdminOrderEditModal.tsx`
- `src/app/api/deliverables/lab/view/route.ts`
- `src/app/api/deliverables/lab/download/route.ts`

---

## 1. Context & Business Goal

- **Business Context**:
  CodeVault Studio bán các sản phẩm số (Mã nguồn môn LAB211, Project, Tools). Hiện tại quy trình thanh toán VietQR thủ công còn thiếu các tính năng CRUD toàn diện cho cả User và Admin:
  1. **Khách hàng (User)**: Thiếu nút xem chi tiết đơn, thiếu hiển thị sản phẩm khi dữ liệu item bị lệch, thiếu chức năng hủy đơn hàng nhầm, thiếu xóa đơn rác đã hủy khỏi lịch sử.
  2. **Quản trị viên (Admin)**: Mới chỉ có nút duyệt/từ chối đơn ở trạng thái `pending_approval`. Thiếu quyền lực tối cao: Sửa trạng thái bất kỳ lúc nào (`pending_payment` -> `completed`, hoặc `completed` -> `blocked`), thiếu nút Xóa đơn rác/hack, thiếu nút Chặn quyền truy cập (Block Access) khi phát hiện gian lận.
  3. **Thanh toán tự động SePay**: Cần tích hợp Webhook SePay (`/api/webhooks/sepay`) để tự động mở khóa đơn hàng khi khách chuyển khoản khớp mã đơn và số tiền trong vòng 1-3 giây.
  4. **Bảo mật chống Hack (Anti-Hack Defense-in-Depth)**: Phòng chống triệt để các hành vi:
     - Giả mạo webhook SePay (fake POST request) -> Xác thực `SEPAY_API_KEY`.
     - Chuyển thiếu tiền (chuyển 1k cho đơn 80k) -> Xác thực `transferAmount >= total_amount`.
     - Tấn công Replay Attack (dùng lại 1 mã giao dịch) -> Lưu và đối chiếu `transaction_ref`.
     - Trích xuất file lậu khi bị chặn -> API kiểm tra trạng thái `completed` và chặn `blocked`/`rejected`.
     - Admin Master Control: Quyền Admin luôn ghi đè hệ thống tự động.

---

## 2. Actors & Roles

| Actor | Quyền Hạn CRUD & Thanh Toán |
|---|---|
| **Khách Hàng (Customer)** | - **Create**: Đặt đơn hàng mới từ giỏ hàng hoặc mua ngay.<br>- **Read**: Xem danh sách đơn, xem chi tiết đơn hàng (QR code, nội dung CK, sản phẩm, trạng thái thanh toán SePay/Bank).<br>- **Update**: Tiếp tục thanh toán, tải lên biên lai duyệt thủ công nếu chuyển sai cú pháp.<br>- **Delete/Cancel**: Hủy đơn khi còn ở trạng thái `pending_payment`; ẩn/xóa đơn đã hủy khỏi lịch sử cá nhân. |
| **Quản Trị Viên (Admin)** | - **Read**: Xem toàn bộ đơn hàng của tất cả người dùng, lọc 6 trạng thái, tìm kiếm nâng cao.<br>- **Update/Override**: Duyệt đơn (`completed`), Từ chối (`rejected`), Chuyển trạng thái tùy ý, **Chặn/Thu hồi quyền (`blocked`)** khi phát hiện gian lận.<br>- **Delete**: Xóa vĩnh viễn đơn hàng giả mạo, đơn rác, spam.<br>- **Audit**: Xem log giao dịch SePay, số tiền thực nhận, tài khoản ngân hàng chuyển đến. |
| **Hệ Thống Tự Động SePay (Webhook)** | - Gửi thông báo biến động số dư ngân hàng qua Webhook kèm API Key.<br>- Tự động kích hoạt duyệt đơn nếu khớp mã đơn (`vietqr_content`) và số tiền `>= total_amount`. |

---

## 3. User Scenarios & Acceptance Criteria

### Scenario 1 — Khách Hàng Quản Lý Toàn Diện Đơn Hàng (User CRUD)
- **GIVEN** Khách hàng tại trang `/customer/orders`
- **WHEN** Xem danh sách đơn
- **THEN**:
  - Mỗi đơn hiển thị rõ ràng thông tin sản phẩm (Tên, Ảnh thumbnail, Giá tiền), không bị khoảng trắng rỗng.
  - Có nút **"Xem Chi Tiết"**: mở popup xem lại mã QR VietQR, thông tin tài khoản ngân hàng, hướng dẫn nạp, và trạng thái nhận tiền SePay thời gian thực.
  - Có nút **"Hủy Đơn Hàng"**: nếu đơn còn ở trạng thái `pending_payment`.
  - Có nút **"Xóa Khỏi Lịch Sử"**: với các đơn đã hủy hoặc bị từ chối để dọn dẹp bảng.

### Scenario 2 — Quản Trị Viên Toàn Quyền CRUD Đơn Hàng (Admin Master Control)
- **GIVEN** Admin tại trang `/admin/orders`
- **WHEN** Quản lý đơn hàng
- **THEN**:
  - Lọc theo 6 tab trạng thái: `Tất cả`, `Chờ thanh toán (pending_payment)`, `Chờ duyệt bill (pending_approval)`, `Đã hoàn thành (completed)`, `Bị từ chối (rejected)`, `Bị chặn (blocked)`.
  - Trên từng đơn hàng, Admin có menu hành động:
    1. **Duyệt Ngay**: Chuyển thành `completed`, mở kho tải ngay.
    2. **Từ Chối**: Chuyển thành `rejected` kèm ghi chú lý do.
    3. **Chặn / Thu Hồi Quyền (Block Access)**: Chuyển thành `blocked` -> Ngay lập tức tước quyền truy cập kho Vault và chặn download tại API.
    4. **Sửa Đơn Hàng**: Chỉnh sửa ghi chú Admin, số tiền thực nhận, mã giao dịch.
    5. **Xóa Đơn Hàng**: Xóa vĩnh viễn đơn hàng khỏi cơ sở dữ liệu.

### Scenario 3 — Tự Động Hóa Với SePay Webhook & Phòng Thủ Chống Hack
- **GIVEN** Ngân hàng nhận được tiền chuyển khoản
- **WHEN** SePay gửi HTTP POST tới `/api/webhooks/sepay`
- **THEN**:
  - **Kiểm tra 1 (Auth)**: Header `Authorization: Apikey <SEPAY_API_KEY>` phải khớp chính xác với `process.env.SEPAY_API_KEY`. Nếu sai, trả về HTTP 401 Unauthorized ngay lập tức.
  - **Kiểm tra 2 (Transfer Type)**: Phải là `transferType === "in"` (tiền vào). Nếu là tiền ra, bỏ qua (HTTP 200).
  - **Kiểm tra 3 (Parse Code)**: Bóc tách mã đơn từ trường `content` (tìm chuỗi dạng `CV2026xxxx` hoặc `CV-2026-xxxx`).
  - **Kiểm tra 4 (Replay Attack)**: Kiểm tra nếu `transaction_ref` hoặc `sepay_id` đã tồn tại trong database -> Trả về `200 OK` (Idempotent), không cộng tiền lần 2.
  - **Kiểm tra 5 (Amount Defense)**: So sánh `transferAmount >= order.total_amount`.
    - Nếu ĐỦ TIỀN: Cập nhật `order.status = 'completed'`, lưu log SePay, mở khóa tài nguyên.
    - Nếu THIẾU TIỀN: Chuyển sang `pending_approval`, KHÔNG mở khóa, ghi chú Admin: `"Chuyển thiếu: Nhận ${transferAmount}đ / Cần ${total_amount}đ"`.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Security)**: THE `/api/webhooks/sepay` endpoint SHALL reject any request without a valid `Authorization: Apikey ${SEPAY_API_KEY}` header with HTTP 401.
- **FR-002 (Integrity)**: THE SePay webhook handler SHALL verify that `transferAmount >= order.total_amount` before marking any order as `completed`.
- **FR-003 (Idempotency)**: THE system SHALL log SePay transaction IDs and prevent duplicate processing of the same transaction reference.
- **FR-004 (Master Override)**: THE system SHALL allow administrators to transition any order to `blocked`, `completed`, `rejected`, or delete the order at any time, with admin actions superseding automated webhook states.
- **FR-005 (Access Revocation)**: WHEN an order has status `blocked`, `rejected`, `pending_payment`, or `cancelled`, THE deliverables view and download endpoints SHALL deny access with HTTP 403.
- **FR-006 (Customer CRUD)**: THE system SHALL allow authenticated customers to view order details, cancel `pending_payment` orders, and delete inactive orders from their personal view.

---

## 5. Security & Verification Matrix

| Nguy Cơ Hack | Biện Pháp Phòng Vệ Kỹ Thuật |
|---|---|
| Hacker gửi request giả mạo SePay | Xác thực SePay API Key bí mật qua Header `Authorization: Apikey <TOKEN>` |
| Hacker chuyển 1.000đ để chiếm đoạt sản phẩm 80.000đ | Kiểm tra toán học nghiêm ngặt `transferAmount >= total_amount`; nếu thiếu thì cắm cờ cảnh báo gian lận |
| Hacker gửi lại gói tin webhook cũ (Replay) | Kiểm tra `transaction_ref` duy nhất, chống xử lý lặp (Idempotent) |
| Hacker cố tình truy cập link tải private | API `/api/deliverables/lab/download` kiểm tra đơn `completed` và `!= blocked` |
| Khách gian lận hoặc chargeback sau khi đã duyệt | Nút **[Chặn Quyền (Block)]** của Admin vô hiệu hóa tức thì quyền tải và đọc mã nguồn |
