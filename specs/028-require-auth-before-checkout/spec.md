# Feature Specification: 028-require-auth-before-checkout

**Feature Branch**: `028-require-auth-before-checkout`  
**Created**: 2026-09-21  
**Status**: Approved / In-Progress  
**Input**: User description: "web của t phải đăng nhập xong thì mới được mua hàng chứ, fix nguyên cái là bắt buộc đăng nhập xong mới mua hàng, chỉ cái t yêu cầu cấm sửa cái khác"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Khách vãng lai bấm "Mua ngay" bị yêu cầu đăng nhập (Priority: P1)

Người dùng chưa đăng nhập (khách vãng lai) lướt xem sản phẩm trên website (tại trang chủ, chi tiết sản phẩm dạng modal, hoặc trang slug chi tiết). Khi khách bấm nút "Mua ngay", hệ thống không cho phép mở modal thanh toán hoặc tạo đơn hàng guest, mà lập tức bật modal Đăng nhập (`AuthModal`), đồng thời lưu lại sản phẩm và số lượng đang chọn để tiếp tục sau khi đăng nhập.

**Why this priority**: Đây là yêu cầu cốt lõi bắt buộc của chủ sở hữu website: ngăn chặn mua hàng ẩn danh / khách vãng lai, đảm bảo mọi đơn hàng đều gắn với tài khoản định danh để quản lý quyền sở hữu tài nguyên số và bản quyền khóa học/tool.

**Independent Test**: Mở trình duyệt ẩn danh hoặc đăng xuất tài khoản. Bấm "Mua ngay" tại bất kỳ sản phẩm nào. Kiểm tra:
1. Modal thanh toán (`CheckoutModal`) KHÔNG hiển thị.
2. Không có đơn hàng nào được tạo ngầm trong database hay local storage.
3. Modal Đăng nhập (`AuthModal`) xuất hiện ngay lập tức với thông báo yêu cầu đăng nhập để mua hàng.

**Acceptance Scenarios**:

1. **Given** Người dùng chưa đăng nhập, **When** Bấm nút "Mua ngay" ở ProductCard, ProductDetailModal hoặc ProductSlugPage, **Then** Hệ thống chặn mở CheckoutModal, lưu sản phẩm đang chọn và hiển thị AuthModal yêu cầu đăng nhập.
2. **Given** Người dùng chưa đăng nhập, **When** Truy cập trực tiếp URL `/checkout`, **Then** Hệ thống chuyển hướng hoặc chặn hiển thị và bật AuthModal, tuyệt đối không tạo đơn hàng.

---

### User Story 2 - Tự động tiếp tục mua hàng sau khi đăng nhập thành công (Priority: P1)

Sau khi khách hàng đăng nhập (hoặc đăng ký) thành công thông qua AuthModal, hệ thống kiểm tra nếu trước đó người dùng đang có thao tác mua dở dang (pending checkout), hệ thống sẽ tự động mở modal thanh toán (`CheckoutModal`) cho sản phẩm đó với thông tin tài khoản đã đăng nhập của người dùng, mang lại trải nghiệm liền mạch và không bắt người dùng phải bấm mua lại từ đầu.

**Why this priority**: Giúp tăng tỷ lệ chuyển đổi đơn hàng và tối ưu trải nghiệm khách hàng ngay sau khi hoàn tất đăng nhập theo yêu cầu.

**Independent Test**: Chưa đăng nhập -> Bấm mua sản phẩm X -> AuthModal hiện -> Đăng nhập tài khoản test -> Modal thanh toán mở ra ngay với sản phẩm X và thông tin email/tên của tài khoản vừa đăng nhập.

**Acceptance Scenarios**:

1. **Given** Người dùng vừa đăng nhập thành công từ AuthModal sau khi bấm mua sản phẩm X, **When** Quá trình đăng nhập hoàn tất, **Then** Hệ thống tự động kích hoạt mở CheckoutModal cho sản phẩm X với đầy đủ thông tin tài khoản của người dùng.

---

### User Story 3 - Bảo vệ tuyệt đối phía Server API (Priority: P1)

Ngay cả khi có người cố tình gửi HTTP POST request trực tiếp đến `/api/orders` bằng công cụ như Postman/cURL hoặc script mà không có session token đăng nhập hợp lệ, máy chủ sẽ từ chối ngay lập tức với HTTP 401 Unauthorized.

**Why this priority**: Đảm bảo bảo mật nhiều lớp (Defense-in-depth). Không chỉ chặn ở client UI mà phải cưỡng chế bắt buộc xác thực ở tầng API.

**Independent Test**: Gửi request `POST /api/orders` không có header `Authorization: Bearer <valid_token>`. Kiểm tra response trả về mã lỗi 401 kèm message "Vui lòng đăng nhập để tiến hành mua hàng".

**Acceptance Scenarios**:

1. **Given** Request gửi tới `POST /api/orders` không có phiên đăng nhập hợp lệ, **When** Server tiếp nhận request, **Then** Server trả về mã trạng thái HTTP 401 Unauthorized và không tạo bất kỳ record nào trong database.
2. **Given** Request gửi tới `POST /api/orders` có phiên đăng nhập hợp lệ của User A, **When** Đơn hàng được tạo, **Then** `user_id` của đơn hàng bắt buộc phải là UUID của User A, tuyệt đối không dùng `GUEST_PROFILE_ID` hay `user-guest`.

---

### Edge Cases

- **Người dùng bấm đóng AuthModal khi đang ở luồng mua dở**: Hệ thống hủy trạng thái pending checkout, không mở CheckoutModal và không tạo đơn hàng.
- **Người dùng đăng ký tài khoản mới thay vì đăng nhập**: Sau khi đăng ký và đăng nhập thành công tài khoản mới, luồng mua hàng vẫn tiếp tục bình thường cho tài khoản mới đó.
- **Phiên đăng nhập hết hạn giữa chừng**: Nếu access token hết hạn khi bấm xác nhận đặt hàng, client và server đều yêu cầu đăng nhập lại trước khi tạo đơn hàng.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống BẮT BUỘC kiểm tra trạng thái đăng nhập (`currentUser`) trước khi cho phép mở `CheckoutModal` hoặc tạo đơn hàng.
- **FR-002**: Tại hàm `openCheckout` trong `src/lib/store.tsx`, nếu `currentUser` là `null`, hệ thống PHẢI lưu sản phẩm và số lượng vào `pendingCheckoutProduct` (hoặc biến lưu trữ tương đương), sau đó gọi `openAuthModal("login")` và kết thúc hàm ngay lập tức mà không gán `checkoutProduct`.
- **FR-003**: Khi `currentUser` chuyển từ `null` sang có dữ liệu (đăng nhập thành công), nếu đang có `pendingCheckoutProduct`, hệ thống tự động kích hoạt `openCheckout(pendingCheckoutProduct, pendingQuantity)` và xóa trạng thái chờ.
- **FR-004**: Trong `CheckoutModal.tsx`, nếu vì bất kỳ lý do nào mà modal hiển thị khi `currentUser` chưa đăng nhập, modal PHẢI tự động đóng và chuyển hướng mở `AuthModal`.
- **FR-005**: Tại API `POST /api/orders` (`src/app/api/orders/route.ts`), hệ thống BẮT BUỘC xác thực người dùng qua `getAuthenticatedUser(req)`. Nếu không có `user` hoặc `userId`, API PHẢI trả về HTTP 401 `{ error: "Vui lòng đăng nhập để tiến hành mua hàng" }` và từ chối tạo đơn hàng.
- **FR-006**: Xóa bỏ hoàn toàn việc sử dụng `GUEST_PROFILE_ID` trong `src/app/api/orders/route.ts` và `user-guest` trong `src/lib/store.tsx` khi tạo đơn hàng mới. Mọi đơn hàng phải có `user_id` là UUID thực tế của người dùng đã đăng nhập.
- **FR-007**: TUYỆT ĐỐI KHÔNG sửa đổi bất kỳ tính năng, giao diện hoặc logic nghiệp vụ nào khác ngoài phạm vi bắt buộc đăng nhập khi mua hàng theo đúng chỉ thị của người dùng ("chỉ cái t yêu cầu cấm sửa cái khác").

---

### Key Entities *(include if feature involves data)*

- **UserProfile**: Đại diện cho người dùng đã xác thực trong hệ thống (`id`, `email`, `full_name`, `role`).
- **Order**: Đơn hàng mua sản phẩm số, bắt buộc có quan hệ 1-nhiều với `UserProfile` qua trường `user_id` (UUID bắt buộc, không được null hoặc guest).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các lần bấm nút "Mua ngay" hoặc "Thanh toán" bởi người dùng chưa đăng nhập đều bị chặn hiển thị màn hình thanh toán và chuyển tiếp đến modal đăng nhập.
- **SC-002**: 100% đơn hàng mới được tạo trên hệ thống đều có `user_id` của tài khoản người dùng thực tế đã xác thực (tỷ lệ đơn hàng vô danh/guest = 0%).
- **SC-003**: 100% các request không xác thực gửi đến `POST /api/orders` đều bị máy chủ từ chối với mã phản hồi HTTP 401.
- **SC-004**: Người dùng đăng nhập thành công sau khi bấm mua hàng được tự động chuyển tiếp vào bước thanh toán của sản phẩm đã chọn mà không cần tìm kiếm và bấm lại từ đầu.
- **SC-005**: 0% ảnh hưởng hoặc thay đổi ngoài phạm vi yêu cầu (bảo toàn toàn bộ luồng duyệt đơn, SePay, admin và deliverables).

---

## Assumptions

- Website đã có sẵn hệ thống xác thực Supabase Auth và modal đăng nhập `AuthModal` hoạt động ổn định.
- Khi người dùng đăng nhập thành công, context `useStore` sẽ cập nhật `currentUser` với đầy đủ `id`, `email`, `full_name`.
- Yêu cầu của người dùng là tuyệt đối không sửa đổi các tính năng khác của website.
