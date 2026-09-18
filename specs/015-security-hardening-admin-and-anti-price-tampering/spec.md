# SPEC-015: Security Hardening — Admin RBAC & Anti-Price-Tampering

## 1. TỔNG QUAN (OVERVIEW)
Đặc tả kỹ thuật này thiết lập các rào chắn phòng thủ an ninh mạng nhiều lớp (Defense-in-Depth) nhằm:
1. **Bảo vệ quyền Quản Trị Viên (Admin):**
   - Chống tấn công leo thang đặc quyền (Privilege Escalation) qua database hoặc client-side manipulation.
   - Xóa bỏ việc rò rỉ danh sách Email Quản trị viên ra phía Client bundle.
   - Chặn đứng mọi nỗ lực đăng ký giả mạo tài khoản admin.
   - Ẩn toàn bộ thông tin nhạy cảm của sản phẩm (`storage_file_path`, `git_repo_url`, `access_instructions`) khỏi danh mục công khai.
2. **Bảo vệ quy trình Thanh Toán Tự Động SePay (Anti-Price-Tampering & Fraud Prevention):**
   - Chuyển giao toàn bộ việc khởi tạo đơn hàng sang Server (`POST /api/orders`) — khóa chặt giá tiền theo dữ liệu niêm yết trong cơ sở dữ liệu `products`, triệt tiêu hoàn toàn khả năng can thiệp giá từ client.
   - Đối soát giá 2 lớp (Dual Price Check) trong SePay Webhook: So sánh số tiền nhận với tổng giá trị thực tế của các sản phẩm trong DB, gắn cờ gian lận `[PRICE_TAMPER_DETECTED]` và lập tức phong tỏa nếu phát hiện bất thường.
   - Cung cấp Migration SQL vá các chính sách Row-Level Security (RLS) của Supabase, ngăn chặn người dùng tự cập nhật trạng thái đơn hàng sang `completed`.

---

## 2. USER STORIES & ACCEPTANCE CRITERIA

### User Story 1: Bảo Vệ Quyền Quản Trị Viên Bất Khả Xâm Phạm
- **Là** Chủ hệ thống CodeVault,
- **Tôi muốn** chỉ những tài khoản có email trong Whitelist bí mật phía Server VÀ có vai trò `admin` trong database mới được cấp quyền Quản Trị Viên,
- **Để** ngay cả khi hacker tìm cách sửa đổi dữ liệu trong Supabase qua lỗ hổng client, hacker vẫn không thể chiếm đoạt quyền Quản trị.

**Acceptance Criteria:**
1. Hàm `getAuthenticatedUser` ở server chỉ trả về `isAdmin: true` khi:
   - Email người dùng khớp với Whitelist bí mật (`ADMIN_WHITELIST_EMAILS` hoặc `process.env.ADMIN_EMAILS`).
   - VÀ `profile.role === 'admin'`.
2. Client bundle (`store.tsx`) không chứa bất kỳ địa chỉ email admin cụ thể nào.
3. Form đăng ký tài khoản (`/api/auth/register`) lập tức từ chối và trả về HTTP 403 nếu email đăng ký trùng với email trong danh sách Admin Whitelist.
4. Bảng `profiles` có trigger SQL ngăn chặn mọi thao tác UPDATE cột `role` ngoại trừ vai trò Service Role.

---

### User Story 2: Khởi Tạo Đơn Hàng An Toàn Phía Server (Anti-Price Tampering)
- **Là** Chủ hệ thống CodeVault,
- **Tôi muốn** giá trị đơn hàng được tính toán và tạo hoàn toàn từ phía Server,
- **Để** khách hàng hoặc hacker không thể sửa giá sản phẩm về 0đ hoặc 1.000đ khi mở modal thanh toán.

**Acceptance Criteria:**
1. Endpoint `POST /api/orders` nhận `productId` và các thông tin liên hệ:
   - Truy vấn trực tiếp sản phẩm từ bảng `products` bằng `supabaseAdmin`.
   - Gán `total_amount = product.price` và `unit_price = product.price` từ cơ sở dữ liệu.
   - Khởi tạo đơn hàng với trạng thái `pending_payment` và mã chuyển khoản VietQR chuẩn định dạng.
2. Trả về thông tin đơn hàng đã xác thực cho client để hiển thị mã QR.
3. Bất kỳ giá trị `price` hay `total_amount` nào do client gửi lên đều bị loại bỏ/ghi đè bởi giá trị thực tế trong DB.

---

### User Story 3: Đối Soát Giá Thực Tế Trong SePay Webhook
- **Là** Hệ thống xử lý thanh toán tự động,
- **Tôi muốn** Webhook SePay phải tự động tính toán lại tổng tiền từ các mặt hàng thực tế trong đơn hàng,
- **Để** nếu khách chỉ chuyển 1.000đ cho món hàng 149.000đ, hệ thống KHÔNG duyệt tự động và lập tức báo động cho Quản Trị Viên.

**Acceptance Criteria:**
1. Khi nhận webhook từ SePay:
   - Truy vấn `order_items` liên kết với đơn hàng.
   - Truy vấn bảng `products` để lấy giá niêm yết hiện tại của các sản phẩm đó và tính `expectedRealTotal`.
   - Nếu `transferAmount < expectedRealTotal` hoặc `order.total_amount < expectedRealTotal`:
     - KHÔNG duyệt đơn (`status` giữ nguyên hoặc chuyển sang `pending_approval`).
     - Ghi chú `admin_notes` cảnh báo gian lận giá / thiếu tiền chi tiết.
     - KHÔNG sinh License Key hay cấp quyền truy cập tài nguyên.
2. Kiểm tra ngưỡng tối thiểu: Đơn hàng thanh toán tự động cho sản phẩm trả phí phải có số tiền chuyển >= 10.000đ.

---

## 3. THIẾT KẾ KỸ THUẬT (TECHNICAL SPECIFICATION)

### 3.1. API Endpoints

#### `POST /api/orders`
- **Mô tả:** Khởi tạo đơn hàng mới với giá trị được chốt từ server.
- **Request Body:**
  ```json
  {
    "productId": "string (UUID)",
    "customerEmail": "string (email, optional)",
    "customerName": "string (optional)"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "success": true,
    "order": {
      "id": "UUID",
      "order_code": "TQ-2026-xxxx",
      "total_amount": 149000,
      "vietqr_content": "TQ2026xxxx",
      "status": "pending_payment",
      "items": [...]
    }
  }
  ```

#### `POST /api/webhooks/sepay` (Hardened)
- **Bổ sung bước đối soát giá DB 2 lớp:**
  - Lấy toàn bộ `order_items` trong đơn hàng.
  - Lấy giá gốc từ bảng `products` tính `expectedRealTotal`.
  - Nếu `transferAmount < expectedRealTotal` hoặc `order.total_amount < expectedRealTotal`:
    - Chặn duyệt ngay lập tức, gắn nhãn `[FRAUD_PRICE_TAMPERING_DETECTED]`.

---

## 4. CHECKLIST TRIỂN KHAI (DEFINITION OF DONE)
- [x] Tạo tài liệu đặc tả kỹ thuật `spec.md`.
- [x] Cập nhật file `implementation_plan.md` xin phê duyệt của User.
- [ ] Thực hiện viết mã nguồn theo đúng Spec.
- [ ] Kiểm tra typecheck TypeScript (`tsc --noEmit`).
- [ ] Commit & Push lên GitHub theo đúng quy chế.
