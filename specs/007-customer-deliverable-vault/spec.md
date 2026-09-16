# Feature Specification: Customer Deliverable Vault — Mở Khóa & Tải Tài Nguyên Số (Spec 007)

**Feature Branch**: `007-customer-deliverable-vault`  
**Status**: Implemented  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/app/customer/vault/page.tsx`
- `src/app/customer/orders/page.tsx`
- `src/lib/store.tsx`
- `src/types/index.ts`

---

## 1. Context & Goal

- **Business Context**: Sau khi đơn hàng được Admin phê duyệt chuyển khoản (`status === "completed"`), khách hàng cần một không gian riêng tư (Deliverable Vault) để tải file mã nguồn, nhận link kho Git riêng tư, nhận khóa bản quyền và xem tài liệu hướng dẫn cài đặt.
- **Feature Goal**: Xây dựng trang `/customer/vault` và `/customer/orders` với cơ chế kiểm soát quyền truy cập nghiêm ngặt: chỉ đơn hàng `completed` mới sinh quyền truy cập tài nguyên số, hỗ trợ tải file không giới hạn cho khách hàng hợp lệ.
- **Success Metrics**:
  - 100% tài nguyên chỉ mở khóa khi `order.status === 'completed'`.
  - Đơn hàng ở trạng thái `pending_payment` hoặc `pending_approval` bị chặn hoàn toàn khỏi Vault.
  - Tải file mã nguồn .ZIP mượt mà, kèm hướng dẫn chi tiết từng bước.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Khách hàng (Customer)** | Truy cập `/customer/vault` để xem và tải các gói tài nguyên đã được duyệt, sao chép License Key, mở link GitHub private repo; xem lịch sử trạng thái tại `/customer/orders`. |
| **Quản trị viên (Admin)** | Duyệt đơn tại `/admin/orders`, hành động này kích hoạt mở khóa tài nguyên trong Vault của khách. |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Mở Khóa Tài Nguyên Sau Khi Admin Duyệt (Priority: P1)
- **GIVEN** đơn hàng của khách hàng được Admin chuyển sang `status === 'completed'`
- **WHEN** khách hàng truy cập `/customer/vault`
- **THEN** danh sách gói tài nguyên hiển thị thẻ sản phẩm tương ứng với:
  - Tên gói sản phẩm và danh mục.
  - Nút "Tải Mã Nguồn (.ZIP)".
  - Link kho Git riêng tư (nếu có `git_repo_url`).
  - Khóa bản quyền kèm nút sao chép (nếu có `license_key`).
  - Khối hướng dẫn cài đặt & chạy mã nguồn chi tiết.

### User Story 2 — Chặn Truy Cập Khi Đơn Chưa Được Duyệt (Priority: P1)
- **GIVEN** khách hàng có đơn hàng đang ở `pending_approval` hoặc `pending_payment`
- **WHEN** truy cập `/customer/vault`
- **THEN** hàm `getUnlockedDeliverables()` không trả về sản phẩm đó; nếu khách hàng chưa có đơn `completed` nào, hiển thị card nét đứt thông báo "Kho tài nguyên chưa có sản phẩm nào" kèm lời giải thích và link dẫn sang `/customer/orders`.

### User Story 3 — Theo Dõi Trạng Thái Tại "Đơn Hàng Của Tôi" (Priority: P1)
- **GIVEN** khách hàng truy cập `/customer/orders`
- **WHEN** xem danh sách đơn hàng
- **THEN** từng đơn hiển thị badge trạng thái chuẩn màu:
  - `completed`: Badge xanh lá "Đã duyệt / Hoàn thành" kèm nút "Tải mã nguồn tại Vault".
  - `pending_approval`: Badge vàng "Chờ Admin duyệt bill" với hiệu ứng animate-pulse và thông báo "Dự kiến mở kho sau 3-10 phút".
  - `pending_payment`: Badge xanh dương "Chờ chuyển khoản" kèm nút "Tiếp tục thanh toán" để mở lại QR.
  - `rejected`: Badge đỏ "Bị từ chối" kèm lý do cụ thể do Admin cung cấp.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL strictly gate deliverable access using the rule `order.status === "completed"`.
- **FR-002 (State-Driven)**: WHILE an order is not `completed`, THE system SHALL omit its deliverable resources from `getUnlockedDeliverables()`.
- **FR-003 (Event-Driven)**: WHEN the customer clicks "Tải Mã Nguồn (.ZIP)", THE system SHALL trigger the browser download for the authorized package.
- **FR-004 (Optional Feature)**: WHERE a product includes a license key or Git repo, THE system SHALL display the credential block with a 1-click clipboard copy button.
- **FR-005 (State-Driven)**: WHILE rendering `/customer/orders`, THE system SHALL display admin review notes for rejected orders.

---

## 5. Data Model & Interfaces

```typescript
export interface UnlockedDeliverable {
  order_id: UUID;
  product_id: UUID;
  product_title: string;
  product_category: ProductCategory;
  signed_download_url?: string;
  git_repo_url?: string;
  license_key?: string;
  instructions: string;
}
```

---

## 6. Verification & Test Plan

- **Automated**: `tsc --noEmit` đạt 0 lỗi.
- **Manual Verification**:
  1. Tạo đơn hàng mới (trạng thái `pending_approval`) -> Truy cập `/customer/vault` -> Xác nhận chưa thấy xuất hiện tài nguyên.
  2. Vào `/admin/orders` -> Duyệt đơn sang `completed` -> Quay lại `/customer/vault` -> Xác nhận gói sản phẩm xuất hiện đầy đủ.
  3. Bấm "Tải Mã Nguồn (.ZIP)" -> File zip tải về thành công.
  4. Bấm copy License Key -> Kiểm tra copy đúng chuỗi `CV-XXXX-XXXX`.
