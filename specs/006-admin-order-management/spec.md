# Feature Specification: Admin Order Management — Quản Lý & Duyệt Đơn Hàng (Spec 006)

**Feature Branch**: `006-admin-order-management`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/app/admin/orders/page.tsx`
- `src/app/admin/layout.tsx`
- `src/lib/store.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Toàn bộ luồng doanh thu số của CodeVault Studio dựa trên nguyên tắc **Bắt buộc Admin duyệt đơn thủ công (Mandatory Admin Manual Approval)** sau khi đối chiếu ảnh chụp biên lai ngân hàng với biến động số dư thực tế. Chỉ khi Admin phê duyệt, quyền tải mã nguồn và tài liệu mới được mở khóa cho khách hàng.
- **Feature Goal**: Xây dựng trung tâm điều hành duyệt đơn `/admin/orders` với bộ lọc trạng thái thông minh, công cụ phóng to biên lai (Lightbox Zoom), xem chi tiết khách hàng và 2 nút hành động then chốt: **[Duyệt Đơn & Mở Kho Tải]** và **[Từ Chối Đơn]** (kèm lý do).
- **Success Metrics**:
  - Thời gian duyệt đơn của Admin < 30 giây từ màn hình danh sách.
  - Phóng to ảnh biên lai sắc nét để đọc được số tài khoản, mã giao dịch và số tiền.
  - Khi duyệt thành công, trạng thái chuyển `completed` và kích hoạt mở kho tài nguyên số ngay lập tức.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Quản trị viên (Admin)** | Xem danh sách đơn hàng, lọc theo trạng thái (`pending_approval`, `completed`, `rejected`, `all`), tìm kiếm, mở Drawer chi tiết đơn, phóng to ảnh bill, duyệt đơn hoặc từ chối kèm lý do. |
| **Khách hàng (Customer)** | Không có quyền vào trang này (bị chặn bởi RBAC guard tại `src/app/admin/layout.tsx`). Nhận kết quả duyệt qua `/customer/orders`. |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Lọc & Tìm Kiếm Đơn Hàng Cần Xử Lý (Priority: P1)
- **GIVEN** Admin truy cập `/admin/orders`
- **WHEN** trang tải
- **THEN** mặc định hiển thị tab "Chờ duyệt" (`pending_approval`) kèm badge đếm số lượng đơn đang chờ xử lý; Admin có thể gõ mã đơn, email hoặc tên khách hàng để tìm kiếm ngay lập tức.

### User Story 2 — Kiểm Tra Chi Tiết Đơn Hàng & Phóng To Biên Lai (Priority: P1)
- **GIVEN** Admin bấm "Xem & Duyệt" trên một đơn hàng
- **WHEN** modal chi tiết đơn mở ra
- **THEN** hiển thị đầy đủ:
  1. Thẻ thông tin khách hàng (Tên, Email, User ID).
  2. Thẻ thanh toán (Tổng tiền VNĐ, Nội dung memo chuyển khoản, Mã GD do khách cung cấp).
  3. Danh sách sản phẩm trong đơn.
  4. Khung xem ảnh biên lai với nút "Phóng to xem rõ" mở Lightbox toàn màn hình.

### User Story 3 — Duyệt Đơn Hàng Thành Công (Priority: P1)
- **GIVEN** Admin kiểm tra biên lai thấy khớp số tiền và nội dung chuyển khoản
- **WHEN** bấm nút **[Duyệt Đơn & Mở Kho Tải]**
- **THEN** hệ thống gọi `adminReviewOrder(orderId, "approve")`, cập nhật trạng thái đơn thành `completed`, lưu thông tin `reviewed_by_admin_id`, `reviewed_at`, đóng modal và cập nhật trạng thái trên bảng.

### User Story 4 — Từ Chối Đơn Hàng Kèm Lý Do (Priority: P1)
- **GIVEN** Admin phát hiện biên lai giả mạo hoặc chưa nhận được tiền
- **WHEN** bấm nút **[Từ Chối Đơn]**
- **THEN** modal xác nhận lý do từ chối xuất hiện; Admin nhập lý do chi tiết và bấm "Xác Nhận Từ Chối" -> Đơn hàng cập nhật thành `rejected`, lý do được lưu vào `admin_notes` để khách hàng đọc được tại trang lịch sử đơn.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL restrict access to `/admin/orders` exclusively to users with `role === "admin"`.
- **FR-002 (State-Driven)**: WHILE orders exist in `pending_approval`, THE system SHALL display an alert banner and badge counter on both the dashboard and orders header.
- **FR-003 (Event-Driven)**: WHEN an admin clicks on the bill thumbnail or zoom button, THE system SHALL display the payment proof in a full-screen image lightbox.
- **FR-004 (Event-Driven)**: WHEN an admin approves an order, THE system SHALL set order status to `completed`, record review timestamps, and immediately make deliverables visible in the customer's vault.
- **FR-005 (Event-Driven)**: WHEN an admin rejects an order, THE system SHALL require an explanation note and set order status to `rejected`.

---

## 5. Data Model & Review Schema

```typescript
export interface Order {
  id: UUID;
  order_code: string;
  user_id: UUID;
  user_email?: string;
  user_name?: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: "vietqr";
  vietqr_content: string;
  payment_proof_image?: string;
  transaction_ref?: string;
  reviewed_by_admin_id?: UUID;
  reviewed_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}
```

---

## 6. Verification & Test Plan

- **Automated**: `tsc --noEmit` đạt 0 lỗi.
- **Manual Verification**:
  1. Tạo đơn hàng mới từ Storefront -> Nộp ảnh bill ở Bước 2.
  2. Mở `/admin/orders` -> Xác nhận đơn xuất hiện ở tab "Chờ duyệt".
  3. Bấm "Xem & Duyệt" -> Bấm "Phóng to xem rõ" -> Kiểm tra ảnh biên lai hiển thị sắc nét.
  4. Bấm "Duyệt Đơn & Mở Kho Tải" -> Kiểm tra đơn đổi sang badge xanh "Đã duyệt" -> Vào `/customer/vault` xác nhận sản phẩm đã được mở khóa tải về.
