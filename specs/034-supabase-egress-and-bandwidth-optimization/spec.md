# Feature Specification: Supabase Egress & Bandwidth Optimization

**Feature Branch**: `034-supabase-egress-and-bandwidth-optimization`

**Created**: 2026-11-01

**Status**: Ready for Implementation

**Input**: User description: "Kiểm tra lại toàn bộ dự án cho t hiện tại nó đốt băng thông các thứ của t cực khiếp supabase liên tục trong trạng thái là limit và hết mất bản free check nguyên nhân ngay và đề xuất cho t cách xử lý"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tối Ưu Hóa & Nén Ảnh Biên Lai, Chống Cạn Kiệt Băng Thông Supabase Storage (Priority: P1)

Khi khách hàng tải ảnh biên lai chuyển khoản (Payment Proof) từ điện thoại hoặc máy tính, hệ thống tự động nén ảnh (Client/API WebP compression & resize xuống tối đa 1000px, dung lượng < 200KB thay vì 5MB-10MB). Đồng thời, trong bảng Quản trị Đơn hàng (`/admin/orders`), hệ thống không tự động tải tất cả các ảnh bill gốc về một lúc mà chỉ hiển thị nút / badge "Xem Bill" (hoặc thumbnail siêu nhẹ on-demand khi Admin bấm xem chi tiết / đối soát).

**Why this priority**: Đây là nguyên nhân trực tiếp nhất khiến băng thông (Egress) của gói Supabase Free (2GB/tháng) bị cạn kiệt chỉ sau vài chục lượt tải trang admin hoặc nộp bill gốc từ điện thoại thông minh.

**Independent Test**:
1. Chọn 1 ảnh chụp màn hình chuyển khoản nặng ~5MB tải lên từ modal thanh toán. Kiểm tra kích thước file được lưu trữ trong Supabase Storage hoặc gửi qua API: file được nén xuống định dạng WebP với dung lượng dưới 250KB mà vẫn rõ nét các chi tiết giao dịch (mã GD, số tiền, ngày giờ).
2. Mở trang `/admin/orders` có 20 đơn hàng đã có bill: Trình duyệt không gửi hàng chục request tải hàng trăm MB ảnh từ Supabase Storage cùng một lúc. Mở chi tiết đơn hàng chỉ tải ảnh của đúng đơn đó.

**Acceptance Scenarios**:
1. **Given** Người dùng chọn một file ảnh biên lai (JPEG/PNG dung lượng 3MB - 10MB), **When** người dùng thực hiện upload qua `handleBillFileUpload`, **Then** hệ thống nén ảnh thành định dạng WebP tối ưu (max width/height 1200px, quality 0.75 - 0.8), giảm dung lượng xuống dưới 250KB trước khi upload lên Storage.
2. **Given** Trang Quản lý Đơn hàng `/admin/orders` hiển thị danh sách đơn hàng, **When** bảng đơn hàng render, **Then** cột "Ảnh Bill" hiển thị huy hiệu hoặc nút mở ảnh an toàn / lazy load thay vì tải cưỡng bức toàn bộ ảnh gốc 5-10MB cho mỗi hàng trong bảng.
3. **Given** Admin bấm vào xem chi tiết đơn hàng hoặc bấm vào nút xem ảnh bill, **When** modal xem ảnh mở ra, **Then** ảnh mới được tải về và hiển thị phóng to rõ nét.

---

### User Story 2 - Loại Bỏ Polling Vô Tận & Chuỗi Waterfall Queries Database (Priority: P2)

Khách hàng đang ở màn hình thanh toán VietQR (`CheckoutModal`) hoặc màn hình Lịch sử Đơn hàng (`/customer/orders`) không còn bị vòng lặp `setInterval` (2.5s và 6s) bắn liên tục hàng nghìn request waterfall vào cơ sở dữ liệu Supabase làm cạn kiệt Database Compute & Quota.

**Why this priority**: Vòng lặp `setInterval` 6s ở trang orders và 2.5s ở checkout kết hợp với chuỗi 4-5 truy vấn (`orders` -> `order_items` -> `api/orders` -> `products` -> `profiles`) ngốn tới 3.000+ truy vấn/giờ cho mỗi tab trình duyệt mở, dẫn đến việc Supabase bị chạm Rate Limit và khóa tạm thời.

**Independent Test**:
1. Mở tab `/customer/orders` có đơn hàng đang chờ duyệt/chờ thanh toán. Mở tab Network của DevTools: Không còn hiện tượng mỗi 6 giây lại spam 5 requests vào Supabase. Cơ chế polling chỉ kích hoạt có giới hạn (exponential backoff hoặc tối đa 3-5 lần, hoặc lắng nghe Realtime / nút Refresh thủ công).
2. Mở `CheckoutModal` ở bước `qr` hoặc `upload`: Polling kiểm tra trạng thái đơn hàng sử dụng khoảng cách hợp lý (8 - 10s) với số lần thử tối đa (timeout sau 5 phút), đồng thời chỉ select trường `status, admin_notes, payment_proof_image, transaction_ref` thay vì `select("*")`.

**Acceptance Scenarios**:
1. **Given** Khách hàng mở trang `/customer/orders`, **When** có đơn hàng ở trạng thái `pending_payment` hoặc `pending_approval`, **Then** hệ thống không dùng `setInterval(6000)` vô tận. Thay vào đó, cung cấp nút "Làm mới trạng thái" rõ ràng và chỉ tự động thăm dò tối đa 5 lần với khoảng thời gian giãn cách (15s, 30s) rồi dừng.
2. **Given** Khách hàng đang ở `CheckoutModal` bước quét mã QR VietQR, **When** hệ thống chờ SePay tự động duyệt, **Then** query kiểm tra chỉ truy vấn các cột cần thiết (`status, transaction_ref, admin_notes`), chu kỳ kiểm tra là 8-10 giây với cơ chế dừng thăm dò khi đóng modal hoặc quá 5 phút.

---

### User Story 3 - Tách Luồng Dữ Liệu Khách Vãng Lai & Giảm Tải Over-Fetching Toàn Cục (Priority: P3)

Khách vãng lai khi ghé thăm trang chủ `https://codevault.io` không còn bị hệ thống tự động chạy các truy vấn bảng `orders`, `order_items` và nạp toàn bộ nội dung demo đồ sộ của tất cả sản phẩm.

**Why this priority**: Giảm 70% dung lượng JSON data transfer trên mỗi lượt truy cập trang chủ, bảo vệ Database Egress của Supabase.

**Independent Test**:
1. Mở trang chủ ở chế độ ẩn danh (chưa đăng nhập): Kiểm tra Network tab: Hệ thống KHÔNG gửi truy vấn tới bảng `orders`.
2. Truy vấn lấy danh sách sản phẩm hiển thị trên trang chủ chỉ lấy các trường cần thiết để render thẻ card (`id, category, title, slug, short_description, price, original_price, thumbnail_url, status, deliverable_type`), không join tải trước mã nguồn demo khổng lồ (`code_preview_snippet`) của tất cả sản phẩm khi chưa ai xem chi tiết.

**Acceptance Scenarios**:
1. **Given** Khách vãng lai truy cập website (chưa có session Supabase), **When** `StoreProvider` khởi tạo, **Then** chỉ gọi `fetchProductsFromDB()`, TUYỆT ĐỐI không gọi `fetchOrdersFromDB()`.
2. **Given** Người dùng đăng nhập thành công, **When** phiên đăng nhập được xác nhận, **Then** hệ thống mới tiến hành nạp danh sách đơn hàng thuộc quyền sở hữu của người dùng đó.
3. **Given** Khách hàng xem trang chi tiết một sản phẩm cụ thể (`/products/[slug]` hoặc mở `ProductDetailModal`), **When** modal/trang mở, **Then** dữ liệu chi tiết demo của sản phẩm đó mới được tải hoặc sử dụng cache có sẵn.

---

### Edge Cases

- **Mạng yếu khi nén ảnh client-side**: Nếu trình duyệt không hỗ trợ Canvas HTML5 để nén ảnh (rất hiếm), hệ thống có fallback tải trực tiếp ảnh gốc nhưng giới hạn dung lượng ở mức tối đa 2MB thay vì 10MB.
- **Webhook SePay kích hoạt tự động**: Khi SePay tự động kích hoạt thành công đơn hàng qua webhook, khách hàng nhấn nút "Kiểm tra thanh toán" hoặc polling lần kế tiếp sẽ nhận ngay kết quả mà không cần spam request liên tục.
- **Admin duyệt đơn**: Khi Admin duyệt đơn từ Dashboard, client Admin chỉ cập nhật state cục bộ (optimistic UI) và thông báo thành công mà không gọi chuỗi waterfall tải lại toàn bộ database.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST triển khai tiện ích nén ảnh (Canvas-based image compression) phía Client trước khi gửi lên API upload biên lai thanh toán (`upload-proof`), ép dung lượng file xuống dưới 250KB và chuyển đổi sang định dạng tối ưu WebP/JPEG.
- **FR-002**: API `/api/orders/upload-proof` MUST giảm giới hạn dung lượng tải lên tối đa từ 10MB xuống 3MB để chặn spam file rác làm đầy bộ nhớ Supabase Storage.
- **FR-003**: Trang Quản trị Đơn hàng (`/admin/orders`) MUST không render cưỡng bức thẻ `<img src={order.payment_proof_image} />` kích thước đầy đủ cho mọi hàng trong danh sách bảng. Thay vào đó, hiển thị nút xem bill kèm xem trước khi click hoặc lazy load ảnh nhỏ.
- **FR-004**: Trang `/customer/orders` MUST xóa bỏ `setInterval(6000)` vô tận; thay thế bằng cơ chế làm mới thông minh (thăm dò có giới hạn số lần hoặc nút bấm thủ công của khách).
- **FR-005**: `CheckoutModal` MUST điều chỉnh khoảng thời gian kiểm tra trạng thái đơn hàng từ 2.5 giây lên 8 giây, giới hạn tối đa 30 lần kiểm tra (tương đương 4 phút) và tự động dừng khi modal đóng.
- **FR-006**: Trong `src/lib/store.tsx`, `StoreProvider` MUST chỉ gọi `fetchOrdersFromDB()` khi và chỉ khi đã có `session?.user` hợp lệ; khách vãng lai (unauthenticated) tuyệt đối không gửi request query đơn hàng.
- **FR-007**: `fetchOrdersFromDB` MUST tối ưu hóa các câu truy vấn SELECT, tránh lấy các trường nhạy cảm hoặc thừa thãi khi không cần thiết và tránh lặp lại các vòng lặp waterfall nếu dữ liệu đã có.
- **FR-008**: Lưu trữ bộ nhớ đệm (Client Caching với LocalStorage / In-memory TTL) cho danh sách sản phẩm để tránh việc người dùng chuyển tab/chuyển trang kích hoạt liên tục các lệnh gọi Supabase.

---

### Key Entities

- **PaymentProof**: Hình ảnh biên lai chuyển khoản ngân hàng được nén siêu gọn (<250KB) lưu tại Supabase Storage `product-assets/receipts`.
- **OrderPollingController**: Bộ điều khiển chu kỳ thăm dò trạng thái đơn hàng thông minh có timeout và backoff, giải phóng tài nguyên khi unmount.
- **StoreCache**: Cơ chế lưu đệm trạng thái products và orders với timestamp và cờ điều kiện xác thực.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Giảm ít nhất **90% dung lượng truyền tải Supabase Storage Egress** từ việc tải ảnh biên lai (mỗi ảnh tải lên dưới 250KB thay vì 5MB - 10MB).
- **SC-002**: Giảm ít nhất **85% tần suất truy vấn Database (API Invocations)** khi người dùng mở trang đơn hàng và trang thanh toán QR (loại bỏ polling 2.5s và 6s).
- **SC-003**: Khách vãng lai vào trang chủ gửi **0 request tới bảng `orders`** của Supabase.
- **SC-004**: Toàn bộ dự án vượt qua typecheck TypeScript (`npx tsc --noEmit`) không có lỗi.
- **SC-005**: Trải nghiệm thanh toán và đối soát đơn hàng của khách hàng và Admin vẫn mượt mà, tức thì, không bị gián đoạn tính năng.

---

## Assumptions

- Người dùng truy cập hệ thống bằng các trình duyệt hiện đại có hỗ trợ HTML5 Canvas và định dạng WebP (Chrome, Safari, Edge, Firefox).
- Giới hạn 2GB Egress/tháng của Supabase Free Tier sẽ được bảo toàn lâu dài sau khi các cơ chế nén và chống polling được áp dụng.
- Cổng thanh toán SePay Webhook vẫn là kênh xác nhận tự động chính; polling chỉ đóng vai trò đồng bộ trạng thái thứ cấp.
