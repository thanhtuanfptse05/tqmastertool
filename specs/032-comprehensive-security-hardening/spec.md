# Feature Specification: Comprehensive Security Hardening & Vulnerability Remediation (Spec 032)

**Feature Branch**: `032-comprehensive-security-hardening`  
**Created**: 2026-09-24  
**Status**: In Implementation  
**Input**: "fix hết đi" (Khắc phục toàn bộ các lỗ hổng bảo mật và điểm yếu kiến trúc đã phát hiện qua kiểm toán mã nguồn).

---

## 1. User Scenarios & Testing *(mandatory)*

### User Story 1 - Bảo Vệ Tuyệt Đối Quyền Quản Trị & Loại Bỏ Hardcode Email Mẫu (Priority: P1)
Hệ thống loại bỏ hoàn toàn email mẫu `admin@gmail.com` khỏi danh sách `ADMIN_WHITELIST_EMAILS`. Quyền Quản trị viên (Admin) chỉ được cấp khi tài khoản đáp ứng 1 trong 2 điều kiện an toàn:
1. Giá trị trường `role` trong bảng `profiles` tại PostgreSQL có giá trị `'admin'` (nguồn chân lý duy nhất được kiểm soát bởi DB trigger `prevent_role_escalation`).
2. Email khớp với biến môi trường server bí mật `ADMIN_EMAILS` (do chủ hệ thống cấu hình bí mật trên Vercel/Server).

**Why this priority**: Ngăn chặn nguy cơ bất kỳ ai đăng ký tài khoản với email `admin@gmail.com` chiếm đoạt toàn quyền Admin của hệ thống.

**Independent Test**:
- Kiểm tra mã nguồn `src/lib/supabase-server.ts`: Không còn chuỗi `admin@gmail.com`.
- Thử gửi request API với token của user có email `admin@gmail.com` nhưng `role = 'customer'` trong DB: Server trả về HTTP 403 Forbidden.

**Acceptance Scenarios**:
1. **Given** Người dùng đăng ký tài khoản mới với email `admin@gmail.com`, **When** gọi các endpoint Quản trị (`/api/admin/*`, `PATCH /api/orders`), **Then** hệ thống từ chối quyền truy cập (403 Forbidden).
2. **Given** Admin thực sự đăng nhập có `profiles.role === 'admin'` hoặc email nằm trong biến môi trường `ADMIN_EMAILS`, **When** thao tác, **Then** hệ thống cho phép truy cập bình thường.

---

### User Story 2 - Khóa Chặt API Tải File & Chống Quét Mã Đơn Hàng (Priority: P1)
- Xóa bỏ hoàn toàn ngoại lệ `isGuestOrder` tại endpoint `/api/deliverables/lab/download`. Bất kỳ yêu cầu tải file deliverable nào cũng bắt buộc phải có phiên đăng nhập hợp lệ (`user !== null` hoặc `isAdmin === true`) và người dùng phải là chủ sở hữu thực sự của đơn hàng có `status === 'completed'`.
- Nâng cấp độ dài và độ hỗn loạn (Entropy) của mã đơn hàng (`order_code`): Thay vì chỉ 4 chữ số ngẫu nhiên (`1000 - 9999`, chỉ 9.000 khả năng), mã đơn hàng mới được tạo bằng chuỗi ngẫu nhiên bảo mật 6 ký tự Hex (hơn 16.7 triệu khả năng, ví dụ: `TQ-2026-A8F2B1`), ngăn chặn hoàn toàn tấn công dò quét (Brute-force Enumeration) và triệt tiêu nguy cơ trùng mã SePay.

**Why this priority**: Chặn đứng rủi ro rò rỉ file mã nguồn/đề bài qua việc quét mã đơn hàng hoặc khai thác đơn hàng vãng lai.

**Independent Test**:
- Gọi `GET /api/deliverables/lab/download` không kèm token Authorization: Server trả về 401/403.
- Tạo đơn hàng mới qua `POST /api/orders`: Mã đơn hàng sinh ra có định dạng `TQ-2026-[6 ký tự Hex]`.
- Webhook SePay nhận diện chính xác cả mã mới (6 ký tự Hex) lẫn mã cũ (4 số).

**Acceptance Scenarios**:
1. **Given** Đơn hàng có `status === 'completed'`, **When** một người dùng khác (không phải chủ đơn) cố tình gọi API download với mã đơn đó, **Then** server trả về 403 (Quyền tải bị từ chối).
2. **Given** Khách hàng vừa tạo đơn hàng, **When** kiểm tra mã chuyển khoản VietQR, **Then** mã có độ ngẫu nhiên cao, không trùng lặp và không thể đoán trước.

---

### User Story 3 - Cô Lập Bí Mật Keygen Salt Về Phía Server-Only (Priority: P2)
Chuỗi muối bảo mật `COURSERA_SECRET_SALT` và hàm sinh key `generateCourseraLicenseKey` được cô lập 100% tại Server-Side (hoặc đọc từ `process.env.COURSERA_SECRET_SALT`), loại bỏ khỏi bundle Javascript tải về trình duyệt người dùng. Client components chỉ nhập các tiện ích phân tích chuỗi hiển thị (`extractOrderLicenseInfo`, `parseLicenseKeyDuration`).

**Why this priority**: Chặn đứng nguy cơ người dùng bóc tách file JS của web để lấy Salt và tự tạo License Key VIP miễn phí cho tiện ích mở rộng.

**Independent Test**:
- Kiểm tra bundle client JS sau khi build: Không chứa chuỗi salt bí mật.
- Quy trình duyệt đơn hàng: Keygen chạy an toàn tại server API `PATCH /api/orders` và lưu vào DB.

**Acceptance Scenarios**:
1. **Given** Khách hàng duyệt đơn hoặc xem tài nguyên, **When** mã nguồn client chạy, **Then** client không trực tiếp import thuật toán sinh key có chứa secret salt.

---

### User Story 4 - Bảo Mật Thông Tin Bàn Giao Tool/Project (Priority: P2)
Tạo cơ chế bảo vệ cho các trường thông tin bàn giao nhạy cảm của bảng `products` (`git_repo_url`, `access_instructions`, `storage_file_path`):
- Tạo migration PostgreSQL hoặc hàm an toàn: Ngăn chặn người dùng ẩn danh (Role `anon` của Supabase) đọc các cột nhạy cảm của bảng `products` qua DevTools.
- Thông tin bàn giao thực tế (Google Drive, Repo Git) chỉ được trả về thông qua API backend khi đơn hàng của khách hàng đã chuyển sang trạng thái `completed`.

**Why this priority**: Ngăn chặn kẻ xấu dùng Supabase client SDK trong console DevTools để trích xuất link Google Drive/GitHub của các Tool mà không cần thanh toán.

**Acceptance Scenarios**:
1. **Given** Người dùng chưa mua hàng, **When** chạy `supabase.from('products').select('git_repo_url')` từ Console DevTools, **Then** không lấy được link thật hoặc nhận về null/bị từ chối.
2. **Given** Khách hàng có đơn hàng hoàn tất, **When** vào Kho Lưu Trữ (Deliverables Vault), **Then** nhận được link bàn giao đầy đủ.

---

### User Story 5 - Kiểm Soát Xác Thực Upload Biên Lai & Thêm HTTP Security Headers (Priority: P3)
- Endpoint upload biên lai thanh toán (`/api/orders/upload-proof`) yêu cầu bắt buộc phải có tài khoản đăng nhập hoặc mã đơn hàng hợp lệ đang ở trạng thái `pending_payment`, ngăn chặn bot spam rác làm tràn bộ nhớ Supabase Storage.
- Cấu hình các HTTP Security Headers tiêu chuẩn trong `next.config.mjs`: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

**Why this priority**: Chống tấn công Clickjacking, MIME-sniffing, và ngăn chặn DoS cạn kiệt dung lượng lưu trữ đám mây.

**Acceptance Scenarios**:
1. **Given** Người dùng ẩn danh gửi request rác đến `/api/orders/upload-proof`, **When** không có thông tin đơn hàng hợp lệ, **Then** server từ chối upload.
2. **Given** Trình duyệt truy cập web, **When** kiểm tra Response Headers, **Then** các header bảo mật `X-Content-Type-Options`, `X-Frame-Options` xuất hiện đầy đủ.

---

## 2. Requirements & Functional Specifications

- **`FR-001`**: `src/lib/supabase-server.ts`:
  - Loại bỏ hoàn toàn `"admin@gmail.com"` khỏi `ADMIN_WHITELIST_EMAILS`.
  - Chỉ duy trì danh sách whitelist an toàn: `["admin@codevault.io"]` và biến môi trường `process.env.ADMIN_EMAILS`.
- **`FR-002`**: `src/app/api/deliverables/lab/download/route.ts`:
  - Xóa bỏ hoàn toàn biến và logic `isGuestOrder`.
  - Mọi yêu cầu tải bắt buộc phải có session: `if (!user && !isAdmin) return 401/403`.
  - Nếu không phải Admin, bắt buộc `order.user_id === user.id`.
- **`FR-003`**: `src/app/api/orders/route.ts`:
  - Nâng cấp sinh `orderCode`: Sử dụng `crypto.randomBytes(3).toString("hex").toUpperCase()` (6 ký tự Hex, ví dụ `TQ-2026-F3A9C2`).
  - `cleanMemo`: `TQ2026${hexCode}`.
  - Cập nhật regex SePay Webhook tại `src/app/api/webhooks/sepay/route.ts` hỗ trợ bắt cả mã hex 6 ký tự lẫn mã số 4 ký tự cũ.
- **`FR-004`**: `src/lib/coursera-keygen.ts`:
  - `COURSERA_SECRET_SALT` sử dụng fallback an toàn từ `process.env.COURSERA_SECRET_SALT || "Coursera_Skip_VIP_2024_@XyZ_Secret_Key_999"`.
  - Tách các hàm thuần hiển thị (parser, formatter) khỏi module chứa secret salt, hoặc đảm bảo client components trong `store.tsx` không gọi `generateCourseraLicenseKey` trực tiếp trên client (giao toàn quyền sinh key cho `PATCH /api/orders` trên server).
- **`FR-005`**: `src/app/api/orders/upload-proof/route.ts`:
  - Yêu cầu xác thực `getAuthenticatedUser(req)`.
  - Kiểm tra `orderId` hợp lệ và thuộc về người dùng, trạng thái đơn hàng là `pending_payment` trước khi cho phép tải ảnh lên Storage.
- **`FR-006`**: `next.config.mjs`:
  - Thêm cấu hình Security Headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **`FR-007`**: `supabase/migrations/005_security_deliverables_and_hardening.sql`:
  - Tạo script SQL bảo vệ các cột nhạy cảm của bảng `products` khỏi việc đọc công khai trái phép bởi role `anon`.

---

## 3. Success Criteria

- **`SC-001`**: `admin@gmail.com` không còn bất kỳ đặc quyền nào trên hệ thống.
- **`SC-002`**: Không thể tải bất kỳ file deliverable nào nếu không đăng nhập tài khoản sở hữu đơn hàng hợp lệ.
- **`SC-003`**: Mã đơn hàng sinh mới có độ hỗn loạn cao (6 ký tự Hex = 16.7 triệu khả năng), chống quét mã và chống va chạm thanh toán SePay.
- **`SC-004`**: Endpoint upload biên lai được bảo vệ chống spam rác.
- **`SC-005`**: Các HTTP Security Headers xuất hiện đầy đủ trong response.
- **`SC-006`**: Toàn bộ codebase vượt qua typecheck TypeScript (`npx tsc --noEmit`) với 0 lỗi.
