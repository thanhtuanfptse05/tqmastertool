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

### User Story 4: Quản Lý Người Dùng & Phân Quyền Trực Tiếp Từ Database (100% Database-Driven RBAC)
- **Là** Quản trị viên CodeVault,
- **Tôi muốn** trang Quản lý người dùng hiển thị đúng vai trò thực tế từ Database Supabase (`profiles.role`) và cho phép tôi nâng/hạ vai trò (Role) của bất kỳ tài khoản nào,
- **Để** khi tôi hạ vai trò của một tài khoản xuống Khách Hàng (`customer`), hệ thống phải lưu đúng vào Database và không được tự ý biến người đó trở lại thành Quản Trị Viên (`admin`).

**Acceptance Criteria:**
1. Endpoint `GET /api/admin/users` được bảo vệ bởi xác thực Admin, truy vấn trực tiếp từ `public.profiles` và đồng bộ với `auth.users` của Supabase.
2. Vai trò của tài khoản (`role`) được lấy **100% từ Database (`profiles.role`)**, TUYỆT ĐỐI KHÔNG hardcode danh sách email admin trong mã nguồn để ép role.
3. Khi Admin bấm "Hạ role: Khách", hệ thống gọi `PATCH /api/admin/users` cập nhật `role = 'customer'` trong bảng `profiles`. Sau đó, API `GET /api/admin/users` trả về đúng `customer`, không có cơ chế auto-heal ghi đè ngược lại thành `admin`.
4. Tài khoản bị hạ quyền xuống `customer` sẽ mất toàn bộ quyền truy cập vào các trang quản trị `/admin` và các API bảo mật của Admin.
5. Ngoại lệ an toàn duy nhất: Admin đang đăng nhập không thể tự hạ quyền hoặc tự xóa tài khoản của chính mình (`userId === requestingAdmin.id`) nhằm chống vô tình khóa tài khoản quản trị viên tối cao.
6. Khi Admin bấm "Đặt lại MK", hệ thống gọi API `PATCH /api/admin/users` cập nhật mật khẩu mới qua `auth.admin.updateUserById`.

---

## 3. THIẾT KẾ KỸ THUẬT (TECHNICAL SPECIFICATION)

### 3.1. API Endpoints

#### `POST /api/orders`
- **Mô tả:** Khởi tạo đơn hàng mới với giá trị được chốt từ server.

#### `POST /api/webhooks/sepay` (Hardened)
- **Mô tả:** Đối soát giá DB 2 lớp, chống sửa giá đơn hàng về 0 và chặn chuyển 1k.

#### `GET /api/admin/users`
- **Mô tả:** Lấy toàn bộ danh sách tài khoản người dùng từ Supabase `profiles` và `auth.users`.
- **Bảo mật:** Yêu cầu quyền Admin (kiểm tra qua `getAuthenticatedUser`).
- **Response (200):**
  ```json
  {
    "success": true,
    "users": [
      {
        "id": "UUID",
        "email": "string",
        "full_name": "string",
        "role": "admin" | "customer",
        "avatar_url": "string",
        "created_at": "ISO string"
      }
    ]
  }
  ```

#### `PATCH /api/admin/users`
- **Mô tả:** Thực hiện đổi vai trò người dùng (role) hoặc đặt lại mật khẩu mới (reset password).
- **Request Body (Role Update):**
  ```json
  { "action": "update_role", "userId": "UUID", "role": "admin" | "customer" }
  ```
- **Request Body (Reset Password):**
  ```json
  { "action": "reset_password", "userId": "UUID", "newPassword": "string (min 6 chars)" }
  ```

---

### User Story 5: Triệt Tiêu Fix Cứng Dữ Liệu — Đồng Bộ 100% Từ Database
- **Là** Quản trị viên và Khách hàng CodeVault,
- **Tôi muốn** toàn bộ link Google Drive, Video YouTube, tài liệu hướng dẫn và số liệu thống kê được lấy chính xác từ cơ sở dữ liệu Supabase,
- **Để** khi thêm hoặc sửa sản phẩm trong DB, toàn bộ giao diện Vault, Chi tiết đơn hàng, Mô tả sản phẩm và Dashboard tự động phản ánh dữ liệu mới nhất mà không bị fix cứng hay sai lệch nội dung.

**Acceptance Criteria:**
1. **Google Drive & Video Links:**
   - Cột `git_repo_url` trong bảng `products` lưu trữ chính xác link Google Drive tải tool.
   - Cột `video_demo_url` trong bảng `product_demos` lưu trữ chính xác link video hướng dẫn YouTube.
   - `DeliverableVaultPage` (`/customer/vault`) và `OrderDetailModal.tsx` đọc `git_repo_url` và `video_demo_url` từ database của sản phẩm đó, loại bỏ hoàn toàn các đoạn code ternary fix cứng URL.
2. **Dynamic Product Description & Deliverables Matrix:**
   - Trong `ProductDescriptionRenderer.tsx`, loại bỏ toàn bộ các đoạn text và video bị fix cứng edX/IOT102.
   - Giao diện render video banner dựa trên `product.demo.video_demo_url` và tiêu đề sản phẩm thực tế từ DB.
   - Ma trận 4 đầu ra hiển thị thông tin chung, chuẩn xác cho mọi loại tool chứ không gán cứng tên môn học IOT102 cho các tool khác như Coursera.
3. **Live Sync Admin Dashboard:**
   - Trang `AdminDashboardPage` (`/admin`) tự động gọi `refreshOrders()`, `refreshProducts()`, `refreshUsers()` khi tải trang để số liệu doanh thu, biểu đồ và số lượng đơn hàng luôn đồng bộ 100% thời gian thực từ Database.

---

## 4. CHECKLIST TRIỂN KHAI (DEFINITION OF DONE)
- [x] Cập nhật tài liệu đặc tả kỹ thuật `spec.md`.
- [x] Triển khai `src/app/api/admin/users/route.ts`.
- [x] Cập nhật `src/lib/supabase-server.ts` bổ sung whitelist master admins.
- [x] Cập nhật `src/lib/store.tsx` và `src/app/admin/users/page.tsx` fetch và quản trị người dùng từ DB.
- [ ] Cập nhật cơ sở dữ liệu Supabase: gán `git_repo_url` cho các sản phẩm Tool (Coursera & edX).
- [ ] Cập nhật `src/app/customer/vault/page.tsx` & `src/components/store/OrderDetailModal.tsx` lấy link Drive và Video trực tiếp từ sản phẩm DB.
- [ ] Cập nhật `src/components/store/ProductDescriptionRenderer.tsx` xóa bỏ dữ liệu fix cứng edX/IOT102, hiển thị dynamic theo sản phẩm.
- [ ] Cập nhật `src/app/admin/page.tsx` bổ sung `useEffect` fetch dữ liệu mới nhất từ DB khi mount.
- [ ] Kiểm tra typecheck TypeScript (`tsc --noEmit`).
- [ ] Push code lên GitHub.
