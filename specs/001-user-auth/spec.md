# Feature Specification: User Authentication & Authorization (Spec 001)

**Feature Branch**: `001-user-auth`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**: 
- `src/components/common/AuthModal.tsx`
- `src/lib/store.tsx`
- `src/lib/supabase.ts`
- `src/app/admin/users/page.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Nền tảng bán tài nguyên số (tools, projects, bài lab Java) yêu cầu người dùng có định danh để mua hàng, quản lý đơn hàng VietQR và mở khóa tải file từ Kho tài nguyên số (Deliverable Vault).
- **Feature Goal**: Cung cấp cơ chế xác thực tinh gọn (không yêu cầu xác nhận email rườm rà, đăng ký là kích hoạt ngay), hỗ trợ session client-side và Supabase Auth, cùng phân quyền RBAC (`customer` và `admin`).
- **Success Metrics**:
  - Thời gian đăng ký và đăng nhập < 10 giây qua modal popup trực quan.
  - Phân quyền Admin chặt chẽ: Chỉ tài khoản có `role === 'admin'` hoặc email quản trị viên mới được vào `/admin/*`.
  - Hỗ trợ Admin đặt lại mật khẩu trực tiếp cho khách hàng mà không cần cấu hình SMTP phức tạp.

---

## 2. Actors & Roles

| Actor | Vai Trò | Quyền Hạn |
|---|---|---|
| **Khách vãng lai (Guest)** | Chưa đăng nhập | Duyệt catalog sản phẩm, xem demo, mở AuthModal để đăng nhập/đăng ký. |
| **Khách hàng (Customer)** | `role === 'customer'` | Đặt hàng VietQR, upload ảnh biên lai, xem `/customer/orders` và tải mã nguồn tại `/customer/vault` sau khi được duyệt. |
| **Quản trị viên (Admin)** | `role === 'admin'` | Toàn quyền vào `/admin/*`: duyệt đơn, CRUD sản phẩm, đổi role người dùng, cấp lại mật khẩu. |

> **Quy tắc nhận diện Super Admin (`checkIsAdminEmail`)**:  
> Hệ thống tự động gán quyền Admin cho các email quản trị đặc biệt: `lequan12305@gmail.com`, `admin@codevault.io`, hoặc các email có tiền tố `admin@`, `*+admin@*`.

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Đăng Ký Tài Khoản Tức Thì & Bỏ Xác Nhận Email (Zero Friction Onboarding) (Priority: P1)
- **GIVEN** người dùng mở `AuthModal` ở chế độ "register"
- **WHEN** nhập Họ tên, Email hợp lệ và Mật khẩu (tối thiểu 6 ký tự) và bấm "Kích Hoạt Tài Khoản"
- **THEN** hệ thống:
  1. Gửi request đến server API `/api/auth/register`.
  2. Server sử dụng Supabase Service Role (`supabaseAdmin.auth.admin.createUser`) với tham số `email_confirm: true` để tạo tài khoản và tự động đánh dấu đã xác thực email ngay lập tức, loại bỏ hoàn toàn yêu cầu click link trong email.
  3. Client gọi `supabase.auth.signInWithPassword` để thiết lập phiên làm việc (session + JWT token) chính thống với Supabase Auth.
  4. Đóng modal, lưu trạng thái đăng nhập và cho phép khách hàng thực hiện mua hàng, thanh toán VietQR và truy cập Vault ngay lập tức.

### User Story 2 — Đăng Nhập & Tự Động Giải Cứu Tài Khoản Chưa Confirm (Priority: P1)
- **GIVEN** người dùng mở `AuthModal` ở chế độ "login"
- **WHEN** nhập Email và Mật khẩu hợp lệ
- **THEN** hệ thống kiểm tra thông tin và đăng nhập qua `signInWithPassword`:
  1. Nếu thành công: Thiết lập `currentUser`, đồng bộ phiên Supabase Auth và cập nhật TopNav.
  2. Nếu tài khoản gặp lỗi "Email not confirmed" (do tạo trước đây khi chưa tắt confirm mail): Client tự động gọi `/api/auth/auto-confirm` để backend kích hoạt tài khoản ngay tức thì, sau đó tự động đăng nhập lại thành công mà không bắt người dùng phải check mail.

### User Story 3 — Đăng Xuất An Toàn (Priority: P2)
- **GIVEN** người dùng đang ở trạng thái đăng nhập
- **WHEN** bấm nút "Đăng xuất" trên menu người dùng
- **THEN** hệ thống xóa `currentUser` khỏi state và `localStorage` (`cv_current_user`), gọi `supabase.auth.signOut()`, đưa người dùng về trạng thái Guest.

### User Story 4 — Kiểm Soát Truy Cập Phân Quyền (RBAC Guard & Bảo Mật Tuyệt Đối) (Priority: P1)
- **GIVEN** người dùng có `role !== 'admin'` hoặc chưa đăng nhập
- **WHEN** cố gắng truy cập trực tiếp các route quản trị `/admin/*`
- **THEN** `src/app/admin/layout.tsx` kiểm tra quyền và hiển thị màn hình chặn truy cập an toàn ("Yêu Cầu Quyền Quản Trị Viên").
- **SECURITY REQUIREMENT (BẢO MẬT TUYỆT ĐỐI)**:
  - CẤM TUYỆT ĐỐI đặt các nút "Đăng Nhập Nhanh" (quick-login bypass), tự động điền credentials, hay hiển thị email/mật khẩu Admin trong giao diện client.
  - Không được hardcode mật khẩu hay email Admin trong mã nguồn frontend.
  - Màn hình chặn chỉ cung cấp nút "Đăng Nhập Quản Trị Viên" (kích hoạt AuthModal trống để người dùng tự nhập) và "Quay lại Trang Chủ".

### User Story 5 — Admin Quản Lý Người Dùng & Cấp Lại Mật Khẩu (Priority: P2)
- **GIVEN** Admin truy cập `/admin/users`
- **WHEN** xem danh sách người dùng, Admin có thể:
  1. Tìm kiếm người dùng theo email hoặc họ tên.
  2. Bấm "Đổi Role" để chuyển đổi quyền giữa `customer` ↔ `admin` (`adminUpdateRole`).
  3. Bấm "Đặt lại MK", nhập mật khẩu mới (tối thiểu 6 ký tự) trong modal xác nhận để cập nhật mật khẩu cho user (`adminResetPassword`).

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL authenticate users using email and password with minimum 6 characters.
- **FR-002 (Event-Driven - Zero-Delay Activation)**: WHEN a user registers or logs in, THE system SHALL ensure the user's email status is automatically confirmed (`email_confirm: true`) via backend admin authority, eliminating email confirmation waiting screens and preventing `Email not confirmed` errors from blocking purchases.
- **FR-003 (Event-Driven)**: WHEN an admin updates a user role at `/admin/users`, THE system SHALL update the role in client state and sync with Supabase `profiles` table.
- **FR-004 (Event-Driven)**: WHEN an admin triggers password reset, THE system SHALL validate the new password is at least 6 characters and update the record.
- **FR-005 (State-Driven)**: WHILE a user is authenticated, THE system SHALL display user avatar, full name, and appropriate navigation links (e.g. "Quản Trị Admin" if role is `admin`).
- **FR-006 (Unwanted Behavior - Anti-Leak & Secure RBAC Guard)**: IF a non-admin user accesses `/admin/*`, THEN THE system SHALL block access and show a secure Access Restricted barrier. The barrier MUST NOT display or expose any admin email, password, or 1-click login shortcut. All authentication must occur through manual credential entry via AuthModal or redirects.

---

## 5. Data Model & Interfaces

```typescript
export type UUID = string;
export type UserRole = "customer" | "admin";

export interface UserProfile {
  id: UUID;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
}
```

---

## 6. Verification & Test Plan

- **Automated / Compilation**: `tsc --noEmit` đạt 0 lỗi.
- **Manual Verification**:
  1. Mở TopNav -> Bấm "Đăng nhập" -> Chuyển sang "Đăng ký" -> Tạo tài khoản mới -> Xác nhận đăng nhập thành công ngay lập tức.
  2. Đăng xuất -> Đăng nhập bằng `lequan12305@gmail.com` hoặc `admin@codevault.io` -> Kiểm tra nút "Quản Trị Admin" xuất hiện trên TopNav.
  3. Truy cập `/admin/users` -> Tìm kiếm user -> Bấm "Đổi Role" và "Đặt lại MK" -> Xác nhận state được lưu.
