# Feature Specification: Admin CRUD Reliability & Atomic Session Updates (Fix 2-Attempt Action Bug)

**Feature Branch**: `026-admin-crud-reliability-and-atomic-updates`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Hiện tại bên admin các thao tác cứ bị kiểu gì ý: ví dụ t vào mục quản lý đơn hàng t xoá bỏ 1 đơn xoá lần 1 cứ không được phải lần 2 mới được, các tính năng crud khác cx hay bị vậy là do gì, tìm bug và fix triệt để đi, nhớ là chỉ làm cái đó đừng có làm ảnh hưởng cái khác"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One-Click Order Deletion & Mutation in Admin (Priority: P1)

As an Administrator managing store orders, when I click to delete an order (or approve, reject, or edit), the system must immediately and reliably execute the action on the **very first click/confirmation**, without requiring a second attempt, page refresh, or lingering ghost records.

**Why this priority**: It is extremely frustrating and error-prone for admins to have to click actions twice or wonder if a mutation succeeded. Ensuring atomic, immediate first-attempt execution is the core requirement.

**Independent Test**:
- Open `/admin/orders`. Select an order and confirm deletion.
- Verify the order is removed instantly from view and permanently deleted in Supabase on click 1.
- Refresh the page: the deleted order MUST NOT reappear.

**Acceptance Scenarios**:

1. **Given** an administrator is viewing `/admin/orders` with an existing order, **When** the administrator clicks the Delete button and confirms the prompt, **Then** the UI displays an active loading indicator, awaits the deletion API call with a guaranteed fresh auth token, removes the order on the first attempt, and does not require a second click.
2. **Given** an administrator approves or rejects an order, **When** the admin triggers the action, **Then** the status mutation updates atomically in memory and sends a synchronized PATCH request with fresh authorization headers without race conditions or silent failures.

---

### User Story 2 - Proactive Auth Token Freshness for Admin Operations (Priority: P1)

As an Admin interacting with the dashboard over an extended session, when performing CRUD requests to Next.js API endpoints (`/api/orders`, `/api/admin/users`, `/api/admin/products`), the client must ensure the Supabase Auth access token is proactively refreshed before making the request if it is expired or expiring soon, preventing 401/403 rejections on the first attempt.

**Why this priority**: Expired JWT tokens cached in `localStorage` cause the server's `getUser(token)` to reject the first API call with 403 Forbidden. The rejection triggers client-side token refresh so the second click works. Proactive token validation eliminates this failure.

**Independent Test**:
- Emulate or await an expired/stale auth session token in client storage.
- Execute an admin CRUD operation.
- Verify `getAuthHeaders()` proactively invokes `refreshSession()` and sends a valid token, resulting in a 200 OK on the first request.

**Acceptance Scenarios**:

1. **Given** a session whose `access_token` has expired or is within 60 seconds of expiration, **When** any admin CRUD method calls `getAuthHeaders()`, **Then** the system calls `supabase.auth.refreshSession()` before dispatching the HTTP request.
2. **Given** the token is freshly refreshed, **When** the API receives the Bearer token, **Then** `getAuthenticatedUser(req)` succeeds on the first call and returns `isAdmin: true`.

---

### User Story 3 - Atomic State Management & Reliable Product / User CRUD (Priority: P2)

As an Administrator modifying products in `/admin/products` or managing user accounts in `/admin/users`, all CRUD operations (create, update, delete) must use functional state updates (`prev => ...`) and route through authenticated server APIs to guarantee that state closures never overwrite recent mutations and DB operations execute with service role authority.

**Why this priority**: Prevents stale React state closures from reverting updates and ensures `adminDeleteProduct` calls `/api/admin/products` with proper authorization rather than failing silently on client-side RLS.

**Independent Test**:
- Go to `/admin/products`, delete a product.
- Verify `/api/admin/products` DELETE is called, succeeds, and the product is gone both locally and in database on click 1.
- Go to `/admin/users`, toggle a user's role or reset password on click 1.

**Acceptance Scenarios**:

1. **Given** an admin deleting a product, **When** `adminDeleteProduct` executes, **Then** it dispatches a DELETE request to `/api/admin/products` with valid auth headers and updates state functionally.
2. **Given** an admin updating user roles or passwords, **When** the action is initiated, **Then** it uses functional state updates and fresh tokens, completing on attempt 1.

---

### Edge Cases

- What happens if the network is disconnected or server returns 500?
  - The UI must display an error alert/toast informing the admin, and restore/resync the state so the admin knows the operation did not complete on the remote server.
- What happens if an order ID is non-UUID (legacy or mock data)?
  - In `DELETE /api/orders`, instead of throwing a 400 Bad Request that fails the client operation, the API acknowledges the deletion of local-only entities with `{ success: true, message: "Local order cleaned" }`.
- What happens if multiple rapid clicks occur?
  - Buttons must be disabled and display loading spinners (`isProcessing` / `isDeleting`) until the in-flight request completes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `getAuthHeaders()` in `src/lib/store.tsx` MUST check `session.expires_at` and proactively refresh the token via `supabase.auth.refreshSession()` if expired or expiring within 60 seconds.
- **FR-002**: `deleteOrder`, `adminUpdateOrder`, `adminReviewOrder`, `adminUpdateOrderStatus`, and `cancelOrder` in `src/lib/store.tsx` MUST use React functional state setters (`setOrders(prev => ...)`) to avoid stale closure overrides.
- **FR-003**: `adminReviewOrder` MUST be an `async` function returning a `Promise<boolean>` that properly awaits the backend PATCH call instead of a fire-and-forget unhandled promise.
- **FR-004**: Order table buttons and Review Drawer buttons in `src/app/admin/orders/page.tsx` MUST be `async/await` enabled, tracking an `isProcessingId` or `isDeletingId` state to prevent duplicate clicks and provide clear visual feedback.
- **FR-005**: `adminDeleteProduct` in `src/lib/store.tsx` MUST call the backend `/api/admin/products` DELETE endpoint with `getAuthHeaders()` to ensure service-role deletion of product and foreign-key references.
- **FR-006**: In `src/app/api/orders/route.ts` DELETE handler, if `orderId` is not a UUID, return 200 with `{ success: true, message: "Local record removed" }` to prevent blocking the deletion of non-persisted test orders.
- **FR-007**: Strict isolation: NO changes to pricing, checkout, Coursera quantity/keys logic, customer vault, or other unrelated modules.

### Key Entities

- **Order**: Represents purchase transactions, updated atomically in memory and database.
- **Product**: Store catalog entity, deleted/updated via verified service-role server endpoints.
- **AdminSession**: Supabase JWT session with expiration validation and proactive token renewal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of order deletions in `/admin/orders` execute successfully on the FIRST click without requiring a second click.
- **SC-002**: Zero 403 Forbidden errors caused by expired JWT sessions during active admin operations.
- **SC-003**: All admin mutation actions display an immediate visual loading state and block duplicate concurrent clicks.
- **SC-004**: TypeScript compilation passes with zero errors (`npx tsc --noEmit`).

## Assumptions

- Admin is properly authenticated with an admin role in Supabase PostgreSQL `profiles.role === 'admin'` or whitelist.
- Supabase Auth refresh token is valid in client storage when access token expires.
- Unrelated customer-facing checkout, license keygeneration, and catalog features remain untouched.
