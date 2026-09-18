# Feature Specification: Coursera License Lifecycle & Re-order Management (Spec 019)

**Feature**: `019-coursera-license-lifecycle-and-reorder-management`  
**Status**: Approved / In-Progress  
**Version**: 1.0.0  
**Created**: 2026-09-18  
**Associated Documents**:
- `specs/013-tool-coursera-skip-extension-and-license-keygen/spec.md`
- `specs/016-coursera-multi-quantity-and-bulk-keygen/spec.md`
- `specs/017-checkout-auto-polling-and-instant-activation/spec.md`
- `specs/018-deliverable-access-control-and-isolation/spec.md`
- `.sdd/shared_context.md`

---

## 1. Bối Cảnh & Mục Tiêu Nghiệp Vụ (Context & Business Goals)

### 1.1 Vấn Đề
1. **Khóa Mua Khi "Đã Sở Hữu" Gây Trở Ngại Cho Dạng Subscription**:
   - Trước đây, hệ thống áp dụng cờ `isPurchased` chung cho toàn bộ sản phẩm nếu đơn hàng trước đó đã hoàn tất.
   - Với các sản phẩm Source Code (LAB211, Project Capstone), việc sở hữu là trọn đời và mua 1 lần.
   - Tuy nhiên, **Tool Tự Động Coursera** (danh mục `tool`) là gói dịch vụ bản quyền định kỳ (40.000đ / tháng / tài khoản). Khách hàng có nhu cầu:
     - Mua định kỳ khi sắp hoặc đã hết hạn.
     - Mua thêm nhiều lần cho bạn bè, tài khoản khác mà không bị khóa nút mua hoặc hiển thị nhầm "Đã sở hữu".
2. **Khách Hàng Không Biết Khi Nào Key Hết Hạn**:
   - Khi hết thời hạn 30 ngày, người dùng cần được thông báo trực quan rõ ràng với trạng thái **Màu Đỏ ("🚨 Key đã hết hạn ngày DD/MM/YYYY")** để chủ động gia hạn thay vì lúng túng khi mở extension.
3. **Nguy Cơ Lãng Phí / Mua Nhầm Khi Key Cũ Vẫn Còn Hạn**:
   - Ví dụ: Khách hàng mua cho email `caotuan01122005@gmail.com` mới dùng 3 ngày (vẫn còn 27 ngày hạn). Nếu người này mua tiếp cùng email đó:
     - Hệ thống cần **cảnh báo rõ ràng số ngày còn hạn**.
     - **Không được sinh key mới**, mà giữ nguyên key cũ đang còn hạn cho khách hàng.
   - Ngược lại: Nếu email đó đã mua và **đã hết hạn quá 30 ngày**, khi mua lại hệ thống **bắt buộc phải sinh ra một License Key hoàn toàn mới**, tuyệt đối không dùng lại key cũ đã hết hạn.

---

## 2. Yêu Cầu Chức Năng Chi Tiết (Functional Requirements)

### FR-001: Loại Bỏ Chế Độ "Đã Sở Hữu" Cho Sản Phẩm Tool
- **Thẻ sản phẩm (`ProductCard.tsx`) & Chi tiết (`ProductDetailModal.tsx`, `/products/[slug]`)**:
  - Biến `isPurchased` chỉ áp dụng cho sản phẩm không phải danh mục `tool` (`product.category !== "tool"`).
  - Với sản phẩm `tool`:
    - Nhãn phụ hiển thị: `"Gói bản quyền 30 ngày / tài khoản"` (thay cho `"Sở hữu vĩnh viễn"`).
    - Nút mua luôn luôn hoạt động: `"Mua ngay"` / `"Mua thêm"`.
    - Không hiển thị badge `"Đã sở hữu"` màu xanh của sản phẩm trọn đời.

### FR-002: Trạng Thái Hết Hạn Trực Quan (Badge Đỏ Khi Hết Hạn)
- Cập nhật hàm phân tích `parseLicenseKeyDuration(key)` trong `src/lib/coursera-keygen.ts`:
  - `isExpired = true` khi `Date.now() > expTimestamp`.
  - `daysRemaining = Math.max(0, Math.ceil((expTimestamp - Date.now()) / (1000 * 60 * 60 * 24)))`.
  - `expirationDate`: `Date`.
  - `statusBadge`:
    - Khi hết hạn (`isExpired`):
      - Nhãn: `"🚨 Đã hết hạn (ngày DD/MM/YYYY)"`.
      - Màu sắc: Nền đỏ nhạt, viền đỏ, chữ đỏ đậm (`bg-rose-50 border-rose-300 text-rose-700`).
      - Cảnh báo: `"License Key này đã hết hạn sử dụng. Vui lòng mua gói mới để tiếp tục sử dụng."`
    - Khi còn hạn (`!isExpired`):
      - Nhãn: `"Còn X ngày (Hết hạn DD/MM/YYYY)"`.
      - Màu sắc: Nền xanh lá, viền xanh lá, chữ xanh (`bg-emerald-50 border-emerald-300 text-emerald-700`).
- Áp dụng trên toàn bộ giao diện:
  - `OrderDetailModal.tsx` (Chi tiết đơn hàng).
  - `/customer/vault` (Kho tài nguyên của bạn).
  - `CheckoutModal.tsx` (Màn hình hoàn tất thanh toán).
  - `AdminOrdersPage` & `AdminOrderEditModal.tsx` (Quản trị viên theo dõi hạn dùng của khách).

### FR-003: Cơ Chế Kiểm Tra Email & Tái Sử Dụng Key Còn Hạn / Sinh Mới Khi Đã Hết Hạn
1. **API Kiểm Tra Bản Quyền Theo Email (`GET /api/licenses/status?email=...`)**:
   - Nhận vào `email`.
   - Tra cứu trong database `orders` (các đơn hàng `completed` có chứa Coursera Tool).
   - Trích xuất key gần nhất của email đó:
     - Nếu key còn hạn (`!isExpired && daysRemaining > 0`):
       - Trả về: `hasActiveLicense: true, daysRemaining, expirationDate, key, message`.
     - Nếu key đã hết hạn hoặc chưa từng mua:
       - Trả về: `hasActiveLicense: false, isExpired: true, message`.
2. **Cảnh Báo Tại Giao Diện Nhập Email Ở Checkout (`CheckoutModal.tsx`)**:
   - Khi khách hàng nhập email Coursera:
   - Hệ thống tự động kiểm tra trạng thái:
     - Nếu email đang có key còn hạn: Hiển thị hộp cảnh báo màu vàng/xanh:
       `"⚠️ Lưu ý: Email [email] hiện vẫn còn [X] ngày bản quyền (đến ngày DD/MM/YYYY). Key hiện tại: [CSR-...]. Bạn không cần mua thêm cho email này!"`
3. **Quy Tắc Sinh / Giữ Key Tại Backend Kích Hoạt Đơn Hàng**:
   - Áp dụng đồng bộ tại:
     - `PATCH /api/orders` (Admin duyệt thủ công).
     - `POST /api/webhooks/sepay` (Webhook tự động duyệt khi chuyển khoản thành công).
     - `store.tsx` (Client store sync).
   - Logic kích hoạt:
     ```ts
     for (const email of targetEmails) {
       const existingLicense = await findLatestActiveLicenseForEmail(email);
       if (existingLicense && !existingLicense.isExpired) {
         // CÒN HẠN: Giữ nguyên key cũ, KHÔNG sinh key mới!
         licensesToSave.push({ email, key: existingLicense.key, reused: true });
       } else {
         // ĐÃ HẾT HẠN HOẶC CHƯA MUA: Bắt buộc sinh key mới toanh (30 ngày mới từ thời điểm hiện tại)!
         const newKey = generateCourseraLicenseKey(email, 30);
         licensesToSave.push({ email, key: newKey, reused: false });
       }
     }
     ```
   - Ghi chú đơn hàng: Ghi rõ trạng thái đối với các key được giữ nguyên:
     `"Email [email] vẫn còn [X] ngày bản quyền, giữ nguyên key đang hoạt động [CSR-...]"`

---

## 3. Ràng Buộc Kỹ Thuật & An Toàn (Technical & Safety Constraints)

1. **Anti-Reuse Cho Key Hết Hạn**:
   - Tuyệt đối không bao giờ được cấp lại key cũ nếu key đó đã hết hạn. Mỗi lần mua lại sau khi hết hạn phải sinh key mới với `expTimestamp` tính từ `Date.now() + 30 days`.
2. **Tương Thích Thuật Toán Extension**:
   - Thuật toán xác thực trong `content.js` của extension Coursera phụ thuộc vào cấu trúc `CSR-EXP1-EXP2-HASH1-HASH2-HASH3-HASH4`. Cả key cũ còn hạn và key mới sinh ra đều phải tuân thủ chuẩn 7-part này và mã hóa đúng theo `COURSERA_SECRET_SALT`.
   - **Tuyệt đối không sửa file trong `Coursera_Skip_Extension_full`**.
3. **Hiệu Năng & Tránh N+1 Query**:
   - API kiểm tra bản quyền theo email sử dụng query trực tiếp `orders` index theo `status` và `order_items`.

---

## 4. Acceptance Criteria (Tiêu Chuẩn Chấp Thuận)

- [ ] Sản phẩm Tool Coursera không bao giờ hiển thị nút bị vô hiệu hóa hay badge "Đã sở hữu". Nút "Mua ngay" luôn mở modal thanh toán bình thường.
- [ ] License Key đã hết hạn (quá 30 ngày) tự động hiển thị Badge ĐỎ: `"🚨 Đã hết hạn (ngày DD/MM/YYYY)"` trên tất cả màn hình (`OrderDetailModal`, `/customer/vault`, Admin).
- [ ] License Key còn hạn hiển thị Badge XANH: `"Còn X ngày (Hết hạn DD/MM/YYYY)"`.
- [ ] Khi nhập email còn hạn vào Checkout: Hiển thị cảnh báo thông tin cho khách biết email này vẫn còn X ngày hạn.
- [ ] Khi đơn hàng hoàn thành:
  - Nếu email còn hạn: Giữ nguyên key cũ, không sinh key mới.
  - Nếu email đã hết hạn: Sinh key mới 100%, không tái sử dụng key cũ.
- [ ] `npx tsc --noEmit` đạt 0 lỗi.
- [ ] Đẩy toàn bộ thay đổi lên GitHub remote `main`.
