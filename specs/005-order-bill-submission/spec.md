# Feature Specification: Order Bill Submission — Upload Bill Xác Nhận Thanh Toán (Spec 005)

**Feature Branch**: `005-order-bill-submission`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/components/store/CheckoutModal.tsx`
- `src/app/api/orders/upload-proof/route.ts`
- `src/lib/store.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Trong mô hình thanh toán VietQR chuyển khoản ngân hàng thủ công, việc tải lên ảnh chụp màn hình biên lai giao dịch thành công (Proof of Payment) là bằng chứng xác thực bắt buộc để quản trị viên đối chiếu số dư biến động tài khoản trước khi duyệt mở khóa tài nguyên số.
- **Feature Goal**: Cung cấp API tải ảnh biên lai an toàn lên Supabase Storage (`/api/orders/upload-proof`) với dung lượng tối đa 10MB, hỗ trợ preview ảnh tức thì và cập nhật trạng thái đơn hàng sang `pending_approval`.
- **Success Metrics**:
  - Tải ảnh biên lai lên Storage bucket hoàn tất trong < 2 giây.
  - Chặn 100% file không phải định dạng ảnh hoặc vượt quá 10MB.
  - Trạng thái đơn hàng lập tức chuyển sang `pending_approval` để hiển thị cảnh báo trên Admin Dashboard.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Khách hàng (Customer)** | Chọn file ảnh biên lai chuyển khoản (JPG/PNG/WEBP/GIF), xem preview, điền mã giao dịch ngân hàng tùy chọn, gửi xác nhận thanh toán. |
| **Hệ thống API Route** | Kiểm tra MIME type, kích thước file, tải lên bucket `product-assets` tại thư mục `receipts/`, trả về URL công khai/signed. |
| **Quản trị viên (Admin)** | Xem ảnh biên lai do khách hàng tải lên qua Drawer duyệt đơn tại `/admin/orders`. |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Tải Lên Ảnh Biên Lai Giao Dịch (Priority: P1)
- **GIVEN** khách hàng đang ở Bước 2 của `CheckoutModal`
- **WHEN** kéo thả hoặc bấm chọn file ảnh biên lai từ thiết bị
- **THEN** client gửi file qua `POST /api/orders/upload-proof`, nhận URL và hiển thị thumbnail preview của ảnh kèm nút thay đổi ảnh nếu cần.

### User Story 2 — Xác Nhận Gửi Bằng Chứng Thanh Toán (Priority: P1)
- **GIVEN** ảnh biên lai đã tải lên và hiển thị preview hợp lệ
- **WHEN** khách hàng bấm "Xác Nhận & Gửi Đơn Hàng" (có thể điền thêm mã giao dịch ngân hàng `transactionRef`)
- **THEN** hệ thống gọi `submitPaymentProof(orderId, proofUrl, transactionRef)`, cập nhật trạng thái đơn hàng thành `pending_approval`, kích hoạt hiệu ứng confetti ăn mừng và chuyển sang màn hình hoàn tất (Bước 3).

### User Story 3 — Xử Lý File Không Hợp Lệ & Báo Lỗi (Priority: P2)
- **GIVEN** khách hàng chọn file vượt quá 10MB hoặc file không phải ảnh (PDF, EXE, DOCX...)
- **WHEN** upload
- **THEN** hệ thống báo lỗi rõ ràng: "Vui lòng chọn ảnh định dạng JPG, PNG hoặc WEBP" hoặc "Dung lượng ảnh biên lai không được vượt quá 10MB", không cho phép submit đơn.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL restrict payment proof uploads to MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- **FR-002 (Ubiquitous)**: THE system SHALL reject payment proof files exceeding 10MB (10 * 1024 * 1024 bytes) with HTTP 400.
- **FR-003 (Event-Driven)**: WHEN an authorized proof image is uploaded via `POST /api/orders/upload-proof`, THE server SHALL store the file in `product-assets` under `receipts/bill_{timestamp}_{rand}.{ext}`.
- **FR-004 (Event-Driven)**: WHEN the customer submits the payment proof form at Step 2, THE system SHALL submit the proof to `PATCH /api/orders` and transition the UI to Step 3 (Confirmation & Decision Screen) regardless of whether the order was already auto-approved by SePay or is pending manual approval.
- **FR-005 (State-Driven)**: WHILE an order is in `pending_approval`, it SHALL appear in the Admin Review Queue with an alert badge and the uploaded proof image.
- **FR-006 (Schema & Robustness)**: THE `PATCH /api/orders` handler SHALL strictly sanitize incoming update payload, stripping non-column fields (specifically `customer_email`, `items`, and client metadata) to prevent Supabase PostgREST schema cache rejection (`Could not find the 'customer_email' column of 'orders' in the schema cache`). Any provided customer/coursera email SHALL be safely encoded into `admin_notes` tag `[COURSERA_EMAIL: email]` instead of being directly written to non-existent DB columns.
- **FR-007 (Step 3 Branching)**:
  - If the order was auto-approved by SePay (`isAutoApproved === true` or `status === 'completed'`), Step 3 SHALL display "Thanh Toán & Kích Hoạt Tự Động Thành Công!", green badge, immediate License Key (if tool), and access to My Vault.
  - If the order is pending manual verification (`status === 'pending_approval'`), Step 3 SHALL display "Đã Nhận Bằng Chứng Chuyển Khoản!", amber badge "Trạng thái: Chờ Admin Duyệt", expected review SLA (3-10 minutes), and order history button.

---

## 5. API Specification

### `POST /api/orders/upload-proof`
- **Content-Type**: `multipart/form-data`
- **Form Body**:
  - `file`: `File` (Binary, max 10MB)
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "url": "https://<supabase-url>/storage/v1/object/public/product-assets/receipts/bill_1710500000_abc123.jpg",
    "path": "receipts/bill_1710500000_abc123.jpg"
  }
  ```
- **Response Error (400 / 500)**:
  ```json
  {
    "error": "Dung lượng ảnh biên lai không được vượt quá 10MB"
  }
  ```

### `PATCH /api/orders` (Submit Bill Proof)
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "orderId": "uuid",
    "status": "pending_approval",
    "payment_proof_image": "https://...",
    "transaction_ref": "FT...",
    "customer_email": "optional_coursera_email@domain.com"
  }
  ```
- **Server Behavior**:
  - Always strips `customer_email` from DB update payload and attaches `[COURSERA_EMAIL: ...]` to `admin_notes`.
  - Whitelists only valid columns of table `public.orders` before executing `supabaseAdmin.from('orders').update(payload)`.
  - If order is already `completed` via SePay webhook, maintains `status = 'completed'` and returns `{ isAutoApproved: true }`.
  - If order is `pending_payment`, updates `status = 'pending_approval'`, attaches proof and returns `{ isAutoApproved: false }`.

---

## 6. Verification & Test Plan

- **Automated**: Typecheck `npx tsc --noEmit`.
- **Manual Verification**:
  1. Mua bất kỳ sản phẩm nào -> Chuyển sang Bước 2 -> Chọn file ảnh biên lai hợp lệ -> Preview hiển thị.
  2. Bấm "Xác Nhận Đã Chuyển Khoản" -> Không còn lỗi schema cache `customer_email`.
  3. Hệ thống chuyển ngay sang Bước 3 hiển thị đúng nhánh tương ứng (Duyệt tự động hoặc Chờ Admin duyệt).
  4. Mở `/admin/orders` kiểm tra đơn hàng mới xuất hiện ngay tại tab "Chờ duyệt" kèm ảnh bill.
