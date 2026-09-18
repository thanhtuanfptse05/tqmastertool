# Feature Specification: Tool Coursera Multi-Quantity & Bulk License Keygen (Spec 016)

**Feature**: `016-coursera-multi-quantity-and-bulk-keygen`  
**Status**: Approved / Ready for Implementation  
**Version**: 1.0.0  
**Created**: 2026-09-18  
**Associated Documents**:
- `specs/004-order-checkout-vietqr/spec.md`
- `specs/006-admin-order-management/spec.md`
- `specs/007-customer-deliverable-vault/spec.md`
- `specs/011-order-management-and-sepay-automation/spec.md`
- `specs/013-tool-coursera-skip-extension-and-license-keygen/spec.md`
- `specs/015-security-hardening-admin-and-anti-price-tampering/spec.md`
- `.sdd/shared_context.md`

---

## 1. Bối Cảnh & Mục Tiêu Nghiệp Vụ (Context & Business Goals)

- **Vấn đề**: Hiện tại, sản phẩm **TOOL TỰ ĐỘNG COURSERA – AUTO SKIP VIDEO, READING & AI QUIZ** (đơn giá: **40.000 VNĐ / 1 tài khoản / 1 tháng**) chỉ hỗ trợ mua mặc định số lượng 1 cho 1 tài khoản Coursera. Sinh viên thường có nhu cầu mua cho nhóm bạn (2, 3 người) hoặc một người sở hữu nhiều tài khoản học các môn khác nhau.
- **Mục tiêu**:
  1. Cho phép khách hàng tùy chỉnh **Số lượng tài khoản (Quantity: 1, 2, 3, ..., max 20)** ngay tại trang chi tiết sản phẩm và trong modal thanh toán.
  2. Tổng số tiền thanh toán được tự động nhân lên tương ứng: `Tổng tiền = Số lượng × 40.000 VNĐ`.
  3. Tại bước thanh toán (Checkout), hệ thống yêu cầu khách hàng nhập đúng **N Email Coursera** tương ứng với N tài khoản đã chọn.
  4. Sau khi đơn hàng hoàn tất (SePay Webhook tự động duyệt khi nhận đủ tiền HOẶC Admin duyệt thủ công):
     - Hệ thống **tự động sinh N License Key** (gói 30 ngày) bằng thuật toán SHA-256 từ `admin_keygen.html`, trong đó mỗi key được mã hóa gắn liền với từng email Coursera tương ứng.
  5. Cung cấp giao diện hiển thị danh sách N License Key kèm nút Copy từng key và nút "Sao chép tất cả" tại:
     - Màn hình thông báo thành công (`CheckoutModal.tsx`).
     - Chi tiết đơn hàng (`OrderDetailModal.tsx`).
     - Kho lưu trữ tài nguyên số (`/customer/vault`).
     - Trang quản trị đơn hàng (`AdminOrdersPage`, `AdminOrderEditModal.tsx`).

---

## 2. Rào Chắn Bảo Mật & Phòng Thủ Gian Lận (Security & Anti-Tampering Matrix)

1. **Khóa Giá Cố Định Phía Máy Chủ (Server-Side Price Locking)**:
   - Client **TUYỆT ĐỐI KHÔNG ĐƯỢC** tự quyết định `total_amount` hay `unit_price`.
   - Route `POST /api/orders` chỉ nhận `productId` và `quantity`.
   - Máy chủ truy vấn `price` trực tiếp từ bảng `public.products` trong PostgreSQL, validate `quantity` là số nguyên dương hợp lệ (`1 <= quantity <= 20`), sau đó tính `total_amount = officialPrice * quantity`.
2. **Khớp Số Dòng Sản Phẩm (`order_items`) Với Cơ Chế Đối Soát SePay**:
   - Máy chủ chèn đúng `quantity` bản ghi vào bảng `public.order_items`, mỗi dòng có `unit_price = officialPrice`.
   - Khi SePay Webhook nhận giao dịch, hàm tính `expectedRealTotal = sum(items * catalogPrice)` sẽ tính tổng đúng bằng `quantity * officialPrice`. Nhờ đó cơ chế phòng thủ gian lận giá 2 lớp của SePay Webhook sẽ chấp thuận giao dịch một cách trơn tru, không báo động giả.
3. **Chống Trùng Lặp Email (Email Uniqueness Per Order)**:
   - Mỗi License Key Coursera chỉ gắn với 1 email đăng nhập Coursera. Do đó trong cùng 1 đơn hàng, tất cả N email được nhập phải hợp lệ và **không được trùng nhau**.
4. **Không Thay Đổi Thư Mục Extension**:
   - Tuyệt đối không can thiệp hay sửa đổi bất kỳ file nào trong thư mục `Coursera_Skip_Extension_full`.

---

## 3. Cấu Trúc Lưu Trữ Dữ Liệu & Data Tagging Format

Để đảm bảo tương thích ngược 100% với các đơn hàng cũ và không phá vỡ cấu trúc schema PostgreSQL hiện hành:
- **Trong `admin_notes`**:
  - Khi tạo đơn hoặc submit bill:
    `[COURSERA_EMAILS: email1@gmail.com, email2@gmail.com, ...]` kèm fallback `[COURSERA_EMAIL: email1@gmail.com]`
  - Khi hoàn thành (hoặc SePay Webhook / Admin duyệt):
    `[LICENSES: email1@gmail.com:CSR-... | email2@gmail.com:CSR-...]`
    `[COURSERA_EMAILS: email1@gmail.com, email2@gmail.com, ...]`
    `[KEY: CSR-...]` (Key đầu tiên cho legacy readers)
    `[COURSERA_EMAIL: email1@gmail.com]` (Email đầu tiên cho legacy readers)
- **Data Model trong Code (`coursera-keygen.ts`)**:
  ```typescript
  export interface CourseraLicenseItem {
    email: string;
    key: string;
    durationLabel: string;
    isExpired: boolean;
    expirationDate?: Date;
  }
  ```

---

## 4. API Endpoints Specification

### 4.1. `POST /api/orders`
- **Request Body**:
  ```json
  {
    "productId": "c0015e1a-c001-4c02-9a03-c00000010200",
    "quantity": 3,
    "customerEmails": ["student1@gmail.com", "student2@gmail.com", "student3@gmail.com"],
    "customerName": "Nguyễn Văn A"
  }
  ```
- **Validation**:
  - `quantity`: Số nguyên từ 1 đến 20 (mặc định 1 nếu không truyền).
  - Lấy đơn giá gốc từ database: `officialPrice = 40000`.
  - `total_amount = officialPrice * quantity`.
  - Nếu sản phẩm là Coursera và có mảng `customerEmails`: Lưu tag `[COURSERA_EMAILS: ...]` vào `admin_notes`.
- **Insert `order_items`**:
  - Tạo `quantity` bản ghi item tương ứng.

### 4.2. `PATCH /api/orders`
- **Request Body**:
  ```json
  {
    "orderId": "uuid-here",
    "status": "pending_approval",
    "payment_proof_image": "https://...",
    "transaction_ref": "MB123456",
    "customer_emails": ["student1@gmail.com", "student2@gmail.com", "student3@gmail.com"]
  }
  ```
- **Xử lý License Key khi `status === 'completed'`**:
  - Trích xuất toàn bộ email từ tag `[COURSERA_EMAILS: ...]`.
  - Tự động gọi `generateCourseraLicenseKey(email, 30)` cho từng email.
  - Cập nhật ghi chú `[LICENSES: ...]` trong `admin_notes`.

### 4.3. `POST /api/webhooks/sepay`
- Khi giao dịch nhận đủ tiền (`transferAmount >= order.total_amount`):
  - Tìm thấy đơn hàng qua nội dung chuyển khoản `vietqr_content`.
  - Nếu đơn hàng chứa sản phẩm Coursera: Trích xuất toàn bộ email trong `[COURSERA_EMAILS: ...]`.
  - Sinh toàn bộ License Keys cho danh sách email đó và lưu vào `admin_notes`.
  - Đổi trạng thái `status: 'completed'`.

---

## 5. UI/UX Flow & Acceptance Criteria

### 5.1. Product Detail (`ProductDetailModal.tsx` & `/products/[slug]`)
- Có bộ điều chỉnh số lượng `[-] [ 1 ] [+]` (1 đến 20).
- Hiển thị rõ:
  - Đơn giá: `40.000 VNĐ / 1 tài khoản / 1 tháng`.
  - Tổng tiền: `(Số lượng × 40.000) VNĐ`.
- Bấm "Đặt Mua Ngay" chuyển sang `CheckoutModal` với số lượng tương ứng.

### 5.2. Checkout Modal (`CheckoutModal.tsx`)
- **Step 1 (QR Code)**:
  - Cho phép người dùng tiếp tục tăng/giảm số lượng ngay trong modal nếu muốn đổi ý.
  - QR Code VietQR tự động cập nhật số tiền chuyển khoản `quantity * 40.000`.
  - Danh sách ô nhập Email Coursera hiển thị động theo số lượng:
    - Nếu quantity = 1: 1 ô nhập email.
    - Nếu quantity = N: N ô nhập email (đánh số `#1`, `#2`, ..., `#N`).
  - Validation: Chặn chuyển sang bước 2 nếu có bất kỳ email nào rỗng, không đúng định dạng email, hoặc trùng lặp email với nhau.
- **Step 3 (Mở kho / Hoàn tất)**:
  - Hiển thị danh sách N License Keys kèm Email tương ứng.
  - Nút Copy riêng cho từng key và nút "Sao chép tất cả key".

### 5.3. Vault & Order Details
- `/customer/vault` và `OrderDetailModal.tsx` hiển thị đầy đủ các key của đơn hàng.

---

## 6. Definition of Done (DoD)
- [x] Tài liệu Spec 016 được hoàn thành trước khi viết code.
- [ ] Hàm xử lý đa license key trong `coursera-keygen.ts` hoạt động chuẩn xác, tương thích ngược.
- [ ] API `POST /api/orders` tạo đơn với số lượng N, bảo vệ giá chống gian lận.
- [ ] API `PATCH /api/orders` và SePay Webhook tự động sinh đủ N keys cho N email khi hoàn tất.
- [ ] Giao diện Checkout cho phép chọn số lượng và nhập N email không trùng lặp.
- [ ] Giao diện Vault và Order Detail hiển thị đủ N keys.
- [ ] Kiểm tra toàn bộ dự án không có lỗi TypeScript (`npx tsc --noEmit`).
- [ ] Đẩy mã nguồn lên kho Git (`git push origin main`).
