# Implementation Plan: 028-require-auth-before-checkout

## 1. Technical Architecture & Component Changes

### A. Global State & Context (`src/lib/store.tsx`)
- Thêm state `pendingCheckout: { product: Product; quantity: number } | null` để lưu sản phẩm và số lượng khi khách bấm mua hàng lúc chưa đăng nhập.
- Thêm state `authNotice: string | null` để hiển thị thông điệp lý do bật modal đăng nhập.
- Cập nhật `openCheckout(product, quantity)`:
  - Nếu `!currentUser`: Lưu `{ product, quantity }` vào `pendingCheckout`, set `authNotice = "Vui lòng đăng nhập để tiến hành đặt mua sản phẩm."`, gọi `openAuthModal("login")` và `return` (không mở CheckoutModal).
- Thêm `useEffect` theo dõi `currentUser`:
  - Khi `currentUser` chuyển sang có dữ liệu và đang có `pendingCheckout`: tự động kích hoạt `openCheckout(pendingCheckout.product, pendingCheckout.quantity)` và dọn dẹp `pendingCheckout`.
- Cập nhật `createOrder`:
  - Kiểm tra `if (!currentUser) throw new Error("Vui lòng đăng nhập để tiếp tục.");`
  - Loại bỏ hoàn toàn fallback `user-guest`.
- Cập nhật `closeAuthModal`:
  - Reset `pendingCheckout` và `authNotice`.

### B. Client Checkout Modal & Route (`src/components/store/CheckoutModal.tsx`, `src/app/checkout/page.tsx`)
- Thêm cơ chế phòng vệ tại `CheckoutModal.tsx`:
  - Nếu modal được render hoặc `step` thay đổi khi `!currentUser`, lập tức gọi `closeCheckout()`, mở `openAuthModal("login")`, và return `null`.
  - Trong `handleConfirmOrder`: kiểm tra `if (!currentUser) { closeCheckout(); openAuthModal("login"); return; }`.
  - Trong phần xác nhận đơn hàng `step === "confirm"`: hiển thị rõ ràng thông tin người dùng đang đặt mua: tên và email của `currentUser`.
- Tuyến `/checkout/page.tsx`:
  - Nếu `!currentUser`, kích hoạt `openAuthModal("login")` và redirect về `/#catalog`.

### C. Server API Order Protection (`src/app/api/orders/route.ts`)
- Tại `POST /api/orders`:
  - Xác thực phiên người dùng qua `getAuthenticatedUser(req)`.
  - Nếu `!user`: từ chối với status 401 `{ error: "Vui lòng đăng nhập để tiến hành mua hàng." }`.
  - Gán `orderPayload.user_id = user.id` trực tiếp, xóa bỏ fallback `GUEST_PROFILE_ID`.

### D. Auth Modal Enhancement (`src/components/common/AuthModal.tsx`)
- Hiển thị banner `authNotice` (nếu có) để người dùng hiểu rõ lý do form đăng nhập hiển thị khi bấm nút mua hàng.

## 2. Guardrails & Boundaries
- "chỉ cái t yêu cầu cấm sửa cái khác": Tuyệt đối không thay đổi bất kỳ tính năng nào khác (không sửa đổi luồng SePay tự động, không đổi logic sinh key, không đổi giao diện danh mục/sản phẩm ngoài nút/hành động mua).
