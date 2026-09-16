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

### Scenario 4 — Server-Side Order Mutation API (`/api/orders`) & Phân Quyền RBAC Nghiêm Ngặt
- **GIVEN** Client frontend (Admin hoặc Khách hàng) gọi API `/api/orders`
- **WHEN** Gửi request `PATCH` hoặc `DELETE`
- **THEN**:
  - **Khách hàng (Customer)**:
    - CHỈ được phép cập nhật đơn của chính mình (`order.user_id === user.id`).
    - CHỈ được phép cập nhật: `status: 'pending_approval'`, `payment_proof_image`, `transaction_ref` (khi nộp biên lai) hoặc `status: 'cancelled'` (khi hủy đơn chưa thanh toán).
    - CẤM TUYỆT ĐỐI (HTTP 403): Khách hàng gửi `status: 'completed'`, `status: 'rejected'`, `status: 'blocked'`, sửa đổi `admin_notes`, hoặc đổi `total_amount`. Mọi hành vi tự duyệt đơn đều bị chặn ngay lập tức.
  - **Quản trị viên (Admin)**:
    - Bắt buộc phải có token xác thực hoặc email nằm trong whitelist Admin chính thức (`lequan12305@gmail.com`, `admin@codevault.io`) và `profile.role === 'admin'`.
    - Có toàn quyền: Duyệt đơn (`completed`), Từ chối (`rejected`), Chặn quyền (`blocked`), Sửa ghi chú, Xóa đơn hàng (`DELETE`).

### Scenario 5 — Chống Tấn Công IDOR Truy Cập Trái Phép Tài Nguyên Deliverables
- **GIVEN** Người dùng yêu cầu xem (`/api/deliverables/lab/view`) hoặc tải (`/api/deliverables/lab/download`)
- **WHEN** Gửi tham số `orderId`
- **THEN**:
  - Hệ thống xác thực danh tính người gọi (Auth Token).
  - Kiểm tra điều kiện:
    - `order.status === 'completed'` VÀ `order.status !== 'blocked'`.
    - Người gọi PHẢI LÀ CHỦ SỞ HỮU ĐƠN HÀNG (`order.user_id === user.id`) HOẶC LÀ QUẢN TRỊ VIÊN (`isAdmin`).
  - Nếu user A cố tình dùng `orderId` của user B -> Trả về HTTP 403 Forbidden.

### Scenario 6 — SePay Fail-Closed & Chống Tấn Công Double-Spending (Chi Tiêu Kép)
- **GIVEN** Webhook SePay nhận dữ liệu giao dịch
- **WHEN** Xử lý tại `/api/webhooks/sepay`
- **THEN**:
  - Bắt buộc `process.env.SEPAY_API_KEY` phải tồn tại. Nếu không có hoặc token sai -> HTTP 401 ngay lập tức (Fail-Closed).
  - Tra cứu xem `refCode` (mã giao dịch SePay/Ngân hàng) đã từng được dùng để duyệt một đơn hàng `completed` khác hay chưa. Nếu đã có -> Chặn đứng hành vi dùng 1 lần chuyển khoản để duyệt nhiều đơn (Replay/Double-spending attack).
  - So sánh `transferAmount >= order.total_amount`. Nếu thiếu tiền -> Chuyển sang `pending_approval`, gắn cờ cảnh báo Admin, không mở khóa tự động.

### Scenario 7 — Bảo Vệ Các Endpoint Upload Quản Trị Viên (`/api/admin/upload/*`)
- **GIVEN** Người dùng hoặc hacker gọi API `/api/admin/upload/asset`, `/api/admin/upload/deliverable`, hoặc `/api/admin/upload/lab-package`
- **WHEN** Gửi request `POST` kèm file
- **THEN**:
  - Máy chủ bắt buộc kiểm tra phiên đăng nhập và quyền Quản Trị Viên (`isAdmin === true`).
  - Nếu không có quyền Admin hoặc chưa xác thực danh tính -> Trả về HTTP 403 Forbidden ngay lập tức.
  - Ngăn chặn triệt để hành vi upload mã độc hoặc kích hoạt extractor trái phép trên hệ thống.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Security)**: THE `/api/webhooks/sepay` endpoint SHALL reject any request without a valid `Authorization: Apikey ${SEPAY_API_KEY}` header with HTTP 401, failing closed if `SEPAY_API_KEY` is undefined.
- **FR-002 (Integrity)**: THE SePay webhook handler SHALL verify that `transferAmount >= order.total_amount` before marking any order as `completed`.
- **FR-003 (Idempotency & Anti-Double-Spend)**: THE system SHALL verify that transaction references are unique across completed orders and reject duplicate reuse of the same transaction reference.
- **FR-004 (Master Override)**: THE system SHALL allow administrators to transition any order to `blocked`, `completed`, `rejected`, or delete the order at any time, with admin actions superseding automated webhook states.
- **FR-005 (Access Revocation)**: WHEN an order has status `blocked`, `rejected`, `pending_payment`, or `cancelled`, THE deliverables view and download endpoints SHALL deny access with HTTP 403.
- **FR-006 (Customer CRUD)**: THE system SHALL allow authenticated customers to view order details, cancel `pending_payment` orders, and delete inactive orders from their personal view.
- **FR-007 (Server Mutation Persistence)**: THE system SHALL process order DELETE and status PATCH via a server-side route `/api/orders` using `supabaseAdmin`, ensuring changes persist across page reloads.
- **FR-008 (RBAC Order Mutation Defense)**: THE `/api/orders` endpoint SHALL strictly enforce role-based access control: customers CANNOT transition orders to `completed`, `rejected`, or `blocked`, and cannot delete orders. Any unauthorized mutation attempt SHALL return HTTP 403 Forbidden.
- **FR-009 (Anti-IDOR Deliverables Access)**: THE deliverables view and download endpoints SHALL verify that the requester is the legitimate owner of the order (`order.user_id === user.id`) or a verified administrator.
- **FR-010 (Admin Role Whitelist Integrity)**: THE system SHALL restrict administrator elevation strictly to verified database roles (`profiles.role === 'admin'`) and explicit whitelist emails, rejecting arbitrary email pattern matches.
- **FR-011 (Admin Upload Security)**: ALL endpoints under `/api/admin/upload/*` SHALL require verified administrator credentials (`isAdmin === true`) and return HTTP 403 Forbidden for any unauthorized requests.

---

## 5. Security & Verification Matrix

| Nguy Cơ Hack | Biện Pháp Phòng Vệ Kỹ Thuật |
|---|---|
| Hacker gửi request giả mạo SePay | Xác thực SePay API Key bắt buộc qua Header `Authorization: Apikey <TOKEN>` (Fail-Closed) |
| Hacker chuyển 1.000đ để chiếm đoạt sản phẩm 80.000đ | Kiểm tra toán học nghiêm ngặt `transferAmount >= total_amount`; nếu thiếu thì cắm cờ cảnh báo gian lận |
| Hacker dùng 1 giao dịch ngân hàng để duyệt 2 đơn (Double-Spend) | Kiểm tra `transaction_ref` duy nhất trên bảng orders, chặn tái sử dụng mã giao dịch |
| Khách hàng tự gọi API PATCH để tự duyệt đơn thành `completed` | Phân quyền RBAC tại server: Chỉ Admin mới có quyền duyệt đơn; Customer bị chặn 403 |
| Hacker đoán mã đơn hàng của người khác để tải code (IDOR) | API `/api/deliverables/lab/*` kiểm tra `order.user_id === user.id` hoặc Admin |
| Khách gian lận hoặc chargeback sau khi đã duyệt | Nút **[Chặn Quyền (Block)]** của Admin vô hiệu hóa tức thì quyền tải và đọc mã nguồn |
| Hacker đăng ký email `hacker+admin@gmail.com` để chiếm quyền Admin | Loại bỏ regex lỏng lẻo, chỉ chấp nhận whitelist email cứng và role `admin` từ DB |
| Kẻ xấu upload file rác/mã độc vào Storage qua `/api/admin/upload/*` | Bắt buộc xác thực Quản trị viên (`isAdmin === true`), từ chối 403 với bất kỳ request nào khác |


