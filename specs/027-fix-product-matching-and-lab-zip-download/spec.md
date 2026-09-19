# Feature Specification: Fix Product Matching Collision & LAB211 Deliverable ZIP Download

**Feature Branch**: `feat/027-fix-product-matching-and-lab-zip-download`

**Created**: 2026-09-19

**Status**: Ready for Implementation

**Input**: User description: "Kiểm tra ngay lại cả phần database luôn. sao t chọn mua src cô hoaibm nhưng đơn hàng lại là cô nangnth. và tính năng tải zip bên trong khi xem này đang bị lỗi này không tải về được. nhớ sửa đúng trọng tâm không sửa cái khác"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exact Product Title Resolution in Orders (Priority: P1)

As a customer buying a specific LAB211 lecture code package (such as "SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM"),
I want the order history, order details modal, and customer vault to accurately show the exact product I purchased,
So that my order does not mistakenly display a different lecturer (e.g. "GIẢNG VIÊN NANGNTH") due to equal price matching collisions (both 90.000đ).

**Why this priority**:
Displaying the incorrect product title causes immediate user distrust and gives the false impression that the wrong item was purchased. Because 18 LAB211 products all share the same price of 90.000đ, matching products by price instead of product ID or stored order item title causes catastrophic collision.

**Independent Test**:
- Can be tested by creating or viewing an order with `product_id` for HOAIBM (`0eda4e3d-1b83-4bbf-96e6-1fc50f5fec95`) or item title "SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM", and confirming that both `/customer/orders` and `OrderDetailModal` display "SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM" without being overridden by NANGNTH.

**Acceptance Scenarios**:
1. **Given** an order item with title "SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM" and unit price 90.000đ, **When** viewed on the customer order list (`/customer/orders`), **Then** the card body displays "SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM" and does not fallback to the first 90.000đ product in the product catalog array.
2. **Given** an order item viewed inside `OrderDetailModal`, **When** the modal renders items, **Then** product title resolution strictly respects `item.product_title || matchedProd?.title`, where `matchedProd` is matched ONLY by `p.id === item.product_id` or `p.slug === item.product_id`, never by price.
3. **Given** customer vault (`/customer/vault`), **When** deliverables are computed, **Then** product matching uses strict ID lookup rather than `p.price === item.unit_price || p.price === order.total_amount`.

---

### User Story 2 - Resilient Full Archive ZIP Download in Deliverable Viewer (Priority: P1)

As a customer with an approved LAB211 order,
I want clicking the "Tải Trọn Gói 12 Bài (.zip)" button inside the LAB211 viewer to reliably download `LAB211.zip`,
So that I receive all 12 complete Java source code projects without network failures or silent download blocks.

**Why this priority**:
Customers purchase the LAB211 package primarily to download the complete source code archive. If clicking the download button does nothing or returns 403/404, the customer experience is blocked.

**Independent Test**:
- Open `LabDeliverableModal` for order `TQ-2026-2048`, click "Tải Trọn Gói 12 Bài (.zip)", and verify that `LAB211.zip` (833 KB) begins downloading immediately.

**Acceptance Scenarios**:
1. **Given** an authorized user or guest with an approved order (`status === 'completed'`), **When** clicking "Tải Trọn Gói 12 Bài (.zip)" in `LabDeliverableModal`, **Then** the browser performs an authenticated blob fetch with session token and initiates the download of `LAB211.zip`.
2. **Given** an order code like `TQ-2026-2048` or UUID passed as `orderId`, **When** `GET /api/deliverables/lab/download` executes, **Then** the server queries `orders` by `id` OR `order_code`, successfully finding the order.
3. **Given** a download request for `labId=all&type=zip`, **When** the file is resolved, **Then** `path.join(process.cwd(), "private_deliverables", "lab211", "zips", "LAB211_Full.zip")` (or root `LAB211.zip`) is read and streamed with headers `Content-Type: application/zip` and safe `Content-Disposition`.
4. **Given** a request failure (e.g. order pending approval or not found), **When** the customer clicks the button, **Then** a clear alert message is surfaced explaining why the download cannot proceed instead of failing silently.

---

### User Story 3 - Guest Order Persistence in Database (Priority: P2)

As an unauthenticated customer purchasing a product via VietQR,
I want my order to be persisted directly into PostgreSQL `orders` and `order_items` tables via `POST /api/orders`,
So that the server has a record of my order for bank reconciliation, admin approval, and deliverable downloading.

**Why this priority**:
Previously, unauthenticated guest checkouts caused `POST /api/orders` to fail with PostgreSQL error `23502 (orders.user_id violates not-null constraint)`. This left orders stranded in local storage and caused deliverable downloads to fail with 403 (order not found).

**Independent Test**:
- Trigger `POST /api/orders` without an auth header, and confirm that an order row is created in `orders` with the guest profile ID (`68169ca4-2f3e-41a1-bed7-ef3da207b738`) and returns HTTP 200.

**Acceptance Scenarios**:
1. **Given** a guest checkout payload to `POST /api/orders`, **When** `user` is null, **Then** the system assigns the dedicated guest profile ID (`68169ca4-2f3e-41a1-bed7-ef3da207b738`) so foreign key constraints are met.
2. **Given** an order created for the guest profile, **When** the order is marked `completed` by admin or SePay, **Then** the guest deliverable authorization gate permits downloading based on matching order code and completed status.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST strictly resolve product title in `customer/orders`, `OrderDetailModal`, `customer/vault`, and `store.tsx` using `item.product_title` as primary truth, and only match against `products` using `p.id === item.product_id` or `p.slug === item.product_id`.
- **FR-002**: System MUST NOT use price-based matching (`p.price === item.unit_price` or `p.price === order.total_amount`) as a fallback when identifying individual products, because multiple distinct products share identical pricing (e.g. 18 LAB211 products all priced at 90.000đ).
- **FR-003**: System MUST support looking up orders in `GET /api/deliverables/lab/download` by either UUID `id` OR string `order_code` (e.g. `TQ-2026-2048`).
- **FR-004**: In `GET /api/deliverables/lab/download`, system MUST permit downloads for orders where `order.user_id` is the designated guest profile (`68169ca4-2f3e-41a1-bed7-ef3da207b738` or null) as long as `order.status === 'completed'`.
- **FR-005**: In `POST /api/orders`, when `user` is null (guest checkout), system MUST assign `orderPayload.user_id = '68169ca4-2f3e-41a1-bed7-ef3da207b738'` (the verified guest customer profile) so PostgreSQL NOT NULL constraint is satisfied.
- **FR-006**: In `LabDeliverableModal.tsx` and `LabCodeViewer.tsx`, download actions MUST obtain the active Supabase session token, pass `Authorization: Bearer <token>` and `?token=<token>`, perform `fetch` -> `blob`, and gracefully display user-friendly error alerts if the request is rejected.
- **FR-007**: Path resolution in `GET /api/deliverables/lab/download` MUST use Node.js `path.join` to ensure cross-platform compatibility on Windows and Linux.

---

## Key Entities & Data Models

- **`Order`**:
  - `id`: UUID
  - `order_code`: string (e.g. `TQ-2026-2048`)
  - `user_id`: UUID (points to `profiles.id`, fallback `68169ca4-2f3e-41a1-bed7-ef3da207b738` for guest)
  - `total_amount`: number (90000)
  - `status`: OrderStatus (`pending_payment` | `pending_approval` | `completed` | `rejected` | `cancelled` | `blocked`)
- **`OrderItem`**:
  - `id`: UUID / string
  - `order_id`: UUID
  - `product_id`: UUID (`0eda4e3d-1b83-4bbf-96e6-1fc50f5fec95` for HOAIBM)
  - `product_title`: string ("SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM")
  - `unit_price`: number (90000)
- **`GUEST_PROFILE_ID`**: `"68169ca4-2f3e-41a1-bed7-ef3da207b738"` (email `guest@codevault.local`).

---

## Success Criteria *(mandatory)*

- **SC-001**: An order created for "SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM" displays as "SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM" across Customer Orders, Order Detail Modal, and Customer Vault.
- **SC-002**: Clicking "Tải Trọn Gói 12 Bài (.zip)" in `LabDeliverableModal` triggers a clean download of `LAB211.zip` (833 KB) without 403/404 errors.
- **SC-003**: `POST /api/orders` succeeds with status 200 for guest checkouts without triggering PostgreSQL 23502 NOT NULL violations.
- **SC-004**: No regressions in Coursera multi-license checkout or admin order management.
- **SC-005**: All TypeScript checks pass (`tsc --noEmit`).

---

## Edge Cases

- **Order created locally before fix**: Order `TQ-2026-2048` has been manually synced to PostgreSQL with status `completed` and item `SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM`.
- **Client passes `order_code` instead of UUID**: The download endpoint checks both `id.eq.${orderId}` and `order_code.eq.${orderId}`.
- **Browser blocks direct anchor download**: Using `fetch` -> `blob` -> `URL.createObjectURL` bypasses cross-origin or popup blocker issues and surfaces server error messages clearly.
