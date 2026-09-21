# Tasks: 028-require-auth-before-checkout

- [x] **TASK-001**: Cập nhật StoreContext trong `src/lib/store.tsx` để chặn mở checkout khi chưa đăng nhập và lưu pending checkout
  - Thêm `pendingCheckout` và `authNotice` state
  - Bắt buộc kiểm tra `!currentUser` trong `openCheckout`
  - Tự động khôi phục luồng mua hàng sau khi login thành công
  - Xóa bỏ fallback `user-guest` trong `createOrder`
- [x] **TASK-002**: Cập nhật `src/components/store/CheckoutModal.tsx` và `src/app/checkout/page.tsx`
  - Thêm guard check chuyển hướng sang `AuthModal` nếu `!currentUser`
  - Hiển thị thông tin tài khoản mua hàng ở bước xác nhận đơn
- [x] **TASK-003**: Cập nhật `src/components/common/AuthModal.tsx`
  - Hiển thị banner `authNotice` nếu được gọi từ luồng mua hàng
- [x] **TASK-004**: Cập nhật Server API `POST /api/orders` trong `src/app/api/orders/route.ts`
  - Bắt buộc `getAuthenticatedUser(req)`, trả về 401 nếu chưa đăng nhập
  - Gán `orderPayload.user_id = user.id`, loại bỏ hoàn toàn `GUEST_PROFILE_ID`
- [x] **TASK-005**: Kiểm thử tổng thể & Verify TypeScript compilation
  - Chạy `npx tsc --noEmit` đạt mã thoát 0 (0 error)
  - Chạy `npm run lint` đạt mã thoát 0 (0 error)
- [x] **TASK-006**: Đẩy thay đổi lên git remote GitHub (`git push origin main`)
