# Feature Specification: Complete Order CRUD, SePay Automation & Anti-Hack Security (Spec 011)

**Feature Branch**: `011-order-management-and-sepay-automation`  
**Status**: In Progress / Updating  
**Version**: 1.1.0  
**Updated**: 2026-09-18  
**Implementation Files**:
- `src/types/index.ts`
- `src/lib/store.tsx`
- `src/lib/vietqr.ts`
- `src/app/api/webhooks/sepay/route.ts`
- `src/app/api/orders/route.ts`
- `src/app/customer/orders/page.tsx`
- `src/app/admin/orders/page.tsx`
- `src/components/store/OrderDetailModal.tsx`
- `src/components/store/CheckoutModal.tsx`
- `src/components/store/AdminOrderEditModal.tsx`
- `src/app/api/deliverables/lab/view/route.ts`
- `src/app/api/deliverables/lab/download/route.ts`

---

## 1. Context & Business Goal

- **Business Context**:
  CodeVault Studio bán các sản phẩm số (Mã nguồn môn LAB211, Project, Tools tiện ích như Coursera Tool, Edx Tool).
  Hệ thống tích hợp cổng thanh toán tự động **SePay** kết hợp phương án duyệt thủ công dự phòng qua tài khoản định danh BIDV Virtual Account (VA).
  
- **Cấu hình SePay chính thức**:
  - **Webhook URL**: `https://tuanvaquan.io.vn/api/webhooks/sepay`
  - **Phương thức xác thực**: API Key thông qua Header `Authorization: Apikey <SEPAY_API_KEY>` (hỗ trợ `Apikey` hoặc `Bearer`)
  - **Ngân hàng**: `BIDV` (Ngân hàng TMCP Đầu tư và Phát triển Việt Nam)
  - **Tài khoản nhận tiền (VA)**: `96247TQMASTER`
  - **Chủ tài khoản**: `TQMASTER`
  - **Bộ lọc tiền tố mã thanh toán**: `TQ` (Mã nội dung thanh toán trên VietQR: `TQ2026xxxx` hoặc `TQxxxx`)

- **Yêu cầu nghiệp vụ cốt lõi**:
  1. **Quét mã QR VietQR chuẩn SePay**: Tạo mã VietQR BIDV - `96247TQMASTER` với số tiền chính xác và nội dung bắt đầu bằng `TQ` để SePay nhận diện biến động số dư.
  2. **Bắt buộc nộp ảnh biên lai (Mandatory Bill Proof Upload)**: Kể cả giao dịch tự động thành công hay chưa, người dùng **bắt buộc phải tải ảnh biên lai chuyển khoản lên** trước khi hoàn tất đơn hàng.
  3. **Phân nhánh duyệt sau khi nộp bill**:
     - *Nhánh 1 (Tự động duyệt thành công)*: Nếu SePay webhook đã đối soát tiền vào thành công (`status === 'completed'`), đơn hàng được giữ nguyên trạng thái `completed`, lưu ảnh biên lai vào đơn, thông báo duyệt thành công tức thì và hiển thị ngay License Key (nếu mua Coursera Tool).
     - *Nhánh 2 (Duyệt thủ công dự phòng)*: Nếu SePay chưa nhận được tiền (do chuyển nhầm cú pháp, mạng ngân hàng trễ, hoặc chuyển thiếu), đơn hàng chuyển sang `pending_approval` để chờ Admin kiểm tra biên lai và bấm duyệt thủ công. Khi Admin bấm duyệt, đơn cũng tự động chuyển sang `completed` và tự động sinh License Key Coursera.
  4. **Bảo toàn tính năng chống xóa đơn (Anti-Delete Protection)**:
     - Khách hàng tuyệt đối không được phép xóa đơn hàng ở các trạng thái `completed`, `pending_approval`, hoặc `blocked`.
     - Chỉ Admin có quyền xóa đơn rác/spam.
  5. **Tự động sinh License Key Coursera**:
     - Áp dụng trên cả 2 kênh: SePay duyệt tự động HOẶC Admin bấm duyệt thủ công. Key có thời hạn 30 ngày định dạng `CV-CRS-30D-...` và được đính kèm vào `admin_notes` / đơn hàng.

---

## 2. Actors & Roles

| Actor | Quyền Hạn CRUD & Thanh Toán |
|---|---|
| **Khách Hàng (Customer)** | - **Create**: Đặt đơn hàng mới từ giỏ hàng hoặc mua ngay (mã VietQR tiền tố `TQ`).<br>- **Read**: Xem danh sách đơn, xem chi tiết đơn hàng (QR code BIDV VA, nội dung CK, trạng thái thanh toán).<br>- **Update**: Tải ảnh biên lai chuyển khoản (bắt buộc). Không thể tự ý đổi `status = completed`.<br>- **Delete/Cancel**: Hủy đơn khi còn ở trạng thái `pending_payment`; CẤM xóa đơn `completed`, `pending_approval`, `blocked`. |
| **Quản Trị Viên (Admin)** | - **Read**: Xem toàn bộ đơn hàng của tất cả người dùng, lọc theo trạng thái.<br>- **Update/Override**: Duyệt đơn thủ công (`completed`) kèm auto sinh Key Coursera, Từ chối (`rejected`), Chặn/Thu hồi quyền (`blocked`).<br>- **Delete**: Toàn quyền xóa đơn rác/spam.<br>- **Audit**: Xem log giao dịch SePay, số tiền thực nhận, mã GD SePay/Ngân hàng. |
| **Hệ Thống Tự Động SePay (Webhook)** | - Gửi biến động số dư qua Webhook kèm API Key `spsk_live_...`.<br>- Tự động kích hoạt duyệt đơn nếu khớp mã đơn (`vietqr_content` / `code` tiền tố `TQ`) và số tiền `>= total_amount`.<br>- Tự động sinh License Key Coursera khi duyệt thành công. |

---

## 3. User Scenarios & Acceptance Criteria

### Scenario 1 — Khách Hàng Thanh Toán VietQR BIDV VA & Nộp Biên Lai Bắt Buộc
- **GIVEN** Khách hàng mở modal thanh toán đơn hàng (sản phẩm số hoặc Coursera Tool)
- **WHEN** Xem mã QR VietQR
- **THEN**:
  - Mã QR hiển thị đúng ngân hàng BIDV, số tài khoản `96247TQMASTER`, chủ tài khoản `TQMASTER`.
  - Nội dung chuyển khoản định dạng `TQ2026xxxx` (khớp bộ lọc tiền tố `TQ` của SePay).
  - Nếu là sản phẩm Coursera Tool: Yêu cầu nhập chính xác Email Coursera trước khi tiếp tục.
  - Người dùng bấm nút **"Tôi đã chuyển khoản -> Tải ảnh biên lai"** để chuyển sang bước nộp bill.
  - Hệ thống BẮT BUỘC người dùng phải tải lên ảnh chụp biên lai ngân hàng (`billImage`). Không thể bấm hoàn tất nếu chưa chọn ảnh.

### Scenario 2 — Hoàn Tất Thanh Toán Tự Động Qua SePay (Auto-Approval Flow)
- **GIVEN** Người dùng đã quét QR chuyển khoản đúng và tải ảnh biên lai lên
- **WHEN** Người dùng bấm "Xác Nhận Đã Thanh Toán" VÀ SePay Webhook đã ghi nhận giao dịch thành công trước/trong lúc nộp
- **THEN**:
  - Máy chủ lưu ảnh biên lai vào đơn hàng nhưng GIỮ NGUYÊN trạng thái `completed` (không bị ghi đè thành `pending_approval`).
  - Giao diện chúc mừng hiển thị trạng thái: **"Thanh toán tự động thành công qua SePay!"**.
  - Nếu là Coursera Tool: License Key (thời hạn 30 ngày) được hiển thị trực tiếp để người dùng sao chép ngay.
  - Các nút mở kho tải tài nguyên (Vault / Deliverables) được kích hoạt ngay lập tức.

### Scenario 3 — Duyệt Thủ Công Dự Phòng Khi SePay Chưa Ghi Nhận (Fallback Flow)
- **GIVEN** Người dùng nộp biên lai nhưng SePay chưa nhận được tiền (mạng chậm, chuyển sai nội dung, chuyển thiếu tiền)
- **WHEN** Bấm xác nhận nộp biên lai
- **THEN**:
  - Đơn hàng chuyển sang trạng thái `pending_approval`.
  - Giao diện thông báo: "Biên lai đã được tiếp nhận! Đơn hàng đang chờ Admin đối soát và phê duyệt."
  - Khi Admin vào `/admin/orders` và bấm **"Duyệt Đơn & Mở Kho"**:
    - Trạng thái chuyển thành `completed`.
    - Hệ thống tự động kiểm tra và sinh License Key Coursera (nếu chưa có).
    - Khách hàng nhận được quyền tải tài nguyên và xem key trong My Vault.

### Scenario 4 — SePay Webhook Tự Động Hóa & Chống Hack (Anti-Hack Defense-in-Depth)
- **GIVEN** SePay gửi HTTP POST tới `/api/webhooks/sepay`
- **WHEN** Xử lý giao dịch
- **THEN**:
  - **Xác thực API Key**: Kiểm tra header `Authorization: Apikey <SEPAY_API_KEY>` (hỗ trợ `spsk_live_DXEB1eDLNX5VM7inLYKRDLzAL3KQQL2f`). Nếu sai hoặc thiếu -> trả về HTTP 401.
  - **Kiểm tra loại giao dịch**: Bỏ qua `transferType === "out"`, chỉ nhận tiền vào (`transferType === "in"`).
  - **Bóc tách mã thanh toán**: Đọc từ `body.code` hoặc `body.content` khớp mẫu `TQ2026\d+`, `TQ\d+`, hoặc `CV2026\d+`.
  - **Chống Replay Attack & Double-spending**: Kiểm tra `transaction_ref` không bị tái sử dụng trên đơn đã hoàn thành khác.
  - **Chống gian lận chuyển thiếu tiền**: So sánh `transferAmount >= order.total_amount`. Nếu thiếu -> chuyển `pending_approval` và cảnh báo Admin, không duyệt tự động.
  - **Chống mở khóa đơn bị Admin chặn**: Nếu đơn có trạng thái `blocked`, từ chối mở khóa tự động.

### Scenario 5 — Bảo Vệ Toàn Vẹn Đơn Hàng & Chống Xóa Trái Phép
- **GIVEN** Khách hàng gọi API `DELETE /api/orders`
- **WHEN** Đơn hàng có trạng thái `completed`, `pending_approval`, hoặc `blocked`
- **THEN**:
  - Máy chủ trả về HTTP 403 Forbidden: "Không thể xóa đơn hàng đang xử lý hoặc đã hoàn tất thanh toán."
  - Chỉ Admin mới có quyền xóa đơn hàng khỏi cơ sở dữ liệu.

---

## 4. Functional Requirements (EARS)

- **FR-001 (SePay Authentication)**: THE `/api/webhooks/sepay` endpoint SHALL reject any request without a valid `Authorization: Apikey ${SEPAY_API_KEY}` header with HTTP 401.
- **FR-002 (Prefix Matching)**: THE system SHALL generate VietQR memos with prefix `TQ` (e.g. `TQ2026xxxx`) matching the SePay webhook filter, and the webhook handler SHALL support parsing `TQ` and `CV` prefixes from both `body.code` and `body.content`.
- **FR-003 (Mandatory Bill Proof)**: THE checkout modal SHALL require the customer to upload a payment proof image before submitting the order for final verification.
- **FR-004 (Auto-Approval Persistence)**: WHEN an order has already been transitioned to `completed` by the SePay webhook, subsequent payment proof submissions SHALL attach the image without reverting the status to `pending_approval`.
- **FR-005 (Coursera License Generation)**: THE system SHALL automatically generate a 30-day Coursera license key whenever an order containing Coursera tools transitions to `completed`, whether triggered by the SePay webhook OR by Admin manual approval.
- **FR-006 (Anti-Deletion Rule)**: THE system SHALL prevent non-admin users from deleting orders with status `completed`, `pending_approval`, or `blocked`.
- **FR-007 (Fallback Manual Approval)**: WHEN an order cannot be verified automatically by SePay, THE system SHALL transition the order to `pending_approval`, enabling administrators to review the uploaded proof image and approve manually with key generation.
- **FR-008 (Schema Sanitization & Cache Safety)**: THE `PATCH /api/orders` endpoint SHALL unconditionally strip `customer_email` and non-column fields from the DB update payload to prevent PostgreSQL / Supabase PostgREST schema cache rejection (`Could not find the 'customer_email' column of 'orders' in the schema cache`). The customer Coursera email SHALL be safely parsed and recorded inside `admin_notes` tag `[COURSERA_EMAIL: email]` while maintaining existing notes.

---

## 5. Security & Verification Matrix

| Kịch Bản Nguy Cơ | Giải Pháp Phòng Thủ Kỹ Thuật |
|---|---|
| Hacker gửi request webhook giả mạo | Xác thực `SEPAY_API_KEY` (`spsk_live_...`) nghiêm ngặt tại header `Authorization: Apikey ...` |
| Khách chuyển thiếu tiền (ví dụ chuyển 2.000đ cho đơn 149.000đ) | Webhook kiểm tra `transferAmount >= order.total_amount`; nếu thiếu tiền -> cắm cờ cảnh báo `pending_approval`, không mở kho |
| Khách dùng 1 mã chuyển khoản duyệt nhiều đơn | Kiểm tra trùng lặp `transaction_ref` trên các đơn đã `completed` |
| Khách tự gọi API PATCH để tự sửa trạng thái thành `completed` | Phân quyền RBAC nghiêm ngặt: Non-admin gửi `status: completed` bị chặn HTTP 403 |
| Khách cố tình xóa đơn hàng đã thanh toán thành công | Chặn `DELETE` đối với các đơn `completed`, `pending_approval`, `blocked` |
| Đơn hàng bị Admin chặn (`blocked`) do vi phạm | Webhook SePay từ chối mở khóa đơn có trạng thái `blocked` |



