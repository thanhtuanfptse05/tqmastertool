# Feature Specification: Coursera-Exclusive Quantity Selection, Emails & License Keygen (Spec 025)

**Feature Branch**: `025-coursera-exclusive-quantity-and-keys`  
**Created**: 2026-09-19  
**Status**: Draft / Ready for Approval  
**Input**: Sửa đúng yêu cầu: Trong toàn bộ database sản phẩm, CHỈ DUY NHẤT sản phẩm Tool Coursera được phép chọn số lượng, tương ứng với số lượng email đăng nhập Coursera, và tự động sinh License Key theo từng email. TẤT CẢ các sản phẩm khác (edX, Shopee bot, Crypto bot, Capstone projects, LAB211...) TUYỆT ĐỐI KHÔNG CÓ chọn số lượng (cố định = 1), KHÔNG yêu cầu nhập email Coursera, và KHÔNG sinh bất kỳ License Key nào.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mua Sản Phẩm Không Phải Coursera (Priority: P1)

Khách hàng chọn mua bất kỳ sản phẩm nào khác ngoài Tool Coursera (ví dụ: Tool EDX IOT102, Shopee Bot, Crypto Bot, Đồ án Capstone Dental, LAB211 Java):
- Hệ thống cố định số lượng là 1 (không hiển thị bộ tăng giảm số lượng `[-] 1 [+]` trong CheckoutModal).
- Hệ thống không hiển thị khung nhập "Email Coursera Kích Hoạt Key".
- Tổng tiền luôn bằng đúng 1 x Giá gốc sản phẩm.
- Khi đơn hàng hoàn tất thanh toán (qua SePay hoặc Admin duyệt), hệ thống KHÔNG sinh bất kỳ License Key Coursera nào, KHÔNG ghi tag `[LICENSES: ...]` vào ghi chú, mà mở khóa trực tiếp đường link tải file / tài nguyên số tương ứng.

**Why this priority**: Ngăn chặn bug nghiêm trọng đang khiến các sản phẩm khác bị hiển thị tăng giảm số lượng sai lệch, bị bắt nhập email Coursera vô lý, và bị sinh key CSR rác.

**Independent Test**:
- Bấm "Mua ngay" trên sản phẩm `TOOL TỰ ĐỘNG EDX IOT102` hoặc `Đồ án Capstone`:
  - Trong modal checkout: Không có nút +/- số lượng, số lượng luôn = 1.
  - Không có ô nhập email Coursera.
  - Sau khi thanh toán: Không có key CSR nào sinh ra, kho chỉ hiện link tải file Google Drive / zip.

**Acceptance Scenarios**:
1. **Given** Khách hàng mở modal checkout sản phẩm `TOOL TỰ ĐỘNG EDX IOT102` hoặc `Shopee Bot`, **When** Xem màn hình đặt hàng, **Then** Số lượng cố định là 1, không có nút tăng giảm số lượng, không có ô nhập email Coursera.
2. **Given** Đơn hàng của sản phẩm khác Coursera chuyển sang trạng thái `completed`, **When** Hệ thống xử lý kích hoạt (Webhook SePay hoặc Admin duyệt), **Then** Không có license key nào được tạo, không có chuỗi tag `[KEY: ...]` hay `[LICENSES: ...]` trong admin_notes.

---

### User Story 2 - Mua Riêng Sản Phẩm Tool Coursera (Priority: P1)

Khách hàng chọn mua sản phẩm **TOOL TỰ ĐỘNG COURSERA – AUTO SKIP VIDEO, READING & AI QUIZ**:
- Được phép tùy chọn số lượng từ 1 đến 20 tài khoản.
- Giao diện hiển thị chính xác N ô nhập email tương ứng với N số lượng đã chọn.
- Bắt buộc nhập đủ N email Coursera hợp lệ và không trùng lặp.
- Khi thanh toán hoàn tất (SePay webhook tự động nhận diện hoặc Admin duyệt), hệ thống tự động sinh đúng N License Key chuẩn `CSR-...` tương ứng với từng email đã nhập.
- Hiển thị đầy đủ danh sách N key kèm nút copy tại màn hình thành công, modal chi tiết đơn và kho tài nguyên (/customer/vault).

**Why this priority**: Đây là nghiệp vụ cốt lõi dành riêng cho sản phẩm Coursera đã được định nghĩa nhưng cần cô lập triệt để, không ảnh hưởng sang các sản phẩm khác.

**Independent Test**:
- Chọn số lượng = 3 cho Tool Coursera:
  - Hiển thị đúng 3 ô nhập email.
  - Tổng tiền = 3 x 40.000đ = 120.000đ.
  - Hoàn tất thanh toán: Sinh đúng 3 license keys tương ứng 3 email.

**Acceptance Scenarios**:
1. **Given** Khách hàng mua Tool Coursera với số lượng = 2, **When** Nhập 2 email khác nhau và bấm Tiếp tục thanh toán, **Then** Hệ thống tạo đơn hàng với tổng tiền = 80.000đ và lưu trữ 2 email này.
2. **Given** Đơn hàng Tool Coursera được duyệt thành công, **When** Kiểm tra kết quả, **Then** Màn hình hiển thị đúng 2 License Key ứng với 2 email đăng nhập.

---

### User Story 3 - Chống Nhận Diện Nhầm Trong Backend & Webhook (Priority: P1)

Hệ thống backend API (`/api/orders`, `/api/orders/[id]`), SePay Webhook (`/api/webhooks/sepay`) và State Store (`store.tsx`):
- Loại bỏ triệt để các logic fallback nguy hiểm: `total_amount % 40000 === 0` hoặc `total_amount === 149000`.
- Điều kiện kiểm tra sản phẩm Coursera PHẢI dựa trực tiếp và duy nhất vào thông tin sản phẩm: slug chứa `coursera` hoặc title chứa `coursera` (hoặc item trong đơn hàng chứa từ khóa `coursera`).
- Đơn hàng không phải Coursera nếu gửi `quantity > 1` qua API sẽ tự động bị ép về `quantity = 1` tại máy chủ.

**Why this priority**: Loại bỏ lỗi nghiêm trọng khiến các đơn hàng có giá chia hết cho 40.000đ (như 200k, 400k, 800k) hoặc giá 149k bị nhận nhầm là Coursera rồi tự động gán key rác.

**Acceptance Scenarios**:
1. **Given** Khách hàng đặt mua một đồ án giá 400.000đ (chia hết cho 40k), **When** SePay Webhook nhận được thanh toán 400.000đ, **Then** Hệ thống duyệt đơn thành công như một tài nguyên số thông thường và TUYỆT ĐỐI KHÔNG sinh key Coursera.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST chỉ kích hoạt tính năng chọn số lượng (Quantity selector: 1..20) DUY NHẤT cho sản phẩm Tool Coursera (nhận diện qua `product.slug.includes("coursera") || product.title.toLowerCase().includes("coursera")`).
- **FR-002**: Tất cả các sản phẩm khác trong database (bao gồm toàn bộ tool khác, capstone project, lab211) MUST có số lượng cố định là 1. Giao diện CheckoutModal MUST ẩn bộ nút chọn số lượng hoặc hiển thị dạng text cố định "Số lượng: 1".
- **FR-003**: Hệ thống MUST chỉ hiển thị phần nhập "Email Coursera Kích Hoạt Key" cho sản phẩm Tool Coursera. Các sản phẩm khác tuyệt đối không hiển thị khung nhập email này.
- **FR-004**: Route `POST /api/orders` MUST kiểm tra xem sản phẩm có phải là Coursera hay không. Nếu KHÔNG phải Coursera, `effectiveQty` MUST bị cưỡng chế bằng 1, và tổng tiền `totalAmount = officialPrice * 1`.
- **FR-005**: SePay Webhook (`/api/webhooks/sepay/route.ts`), API Route (`/api/orders/route.ts`) và Store review (`store.tsx`) MUST XÓA BỎ hoàn toàn logic đoán mò theo giá tiền `total_amount % 40000 === 0` và `total_amount === 149000`. Chỉ được coi là Coursera khi order_items hoặc product title/slug thực sự chứa chuỗi "coursera".
- **FR-006**: Giao diện Kho lưu trữ (`customer/vault/page.tsx`) và Chi tiết đơn hàng (`OrderDetailModal.tsx`) MUST chỉ hiển thị box "License Key Bản Quyền" và "Email kích hoạt Coursera" nếu sản phẩm của item đó thực sự là Coursera. Với các sản phẩm khác, chỉ hiển thị thông tin tải tài nguyên số (Google Drive, zip, hướng dẫn) mà không hiển thị khung key.
- **FR-007**: Thành phần `ProductCard.tsx` MUST chỉ hiển thị nhãn phụ "Gói 30 ngày / tài khoản" cho Tool Coursera. Các sản phẩm khác (kể cả tool edX, shopee...) hiển thị nhãn "Sở hữu vĩnh viễn" hoặc tài nguyên số trọn đời.

---

## Key Entities & Data Models

- **Product**:
  - `slug`: chuỗi định danh (chứa `"coursera"` đối với tool Coursera).
  - `category`: `"tool" | "project" | "lab211"`.
  - `price`: đơn giá niêm yết.
- **Order**:
  - `status`: `"pending_payment" | "pending_approval" | "completed" | "rejected" | "cancelled" | "blocked"`.
  - `total_amount`: với Coursera = `quantity * 40000`; với sản phẩm khác = `1 * product.price`.
  - `admin_notes`: chỉ chứa tag `[COURSERA_EMAILS: ...]` và `[LICENSES: ...]` nếu là đơn hàng Coursera.

---

## Success Criteria *(mandatory)*

- **SC-001**: 100% các sản phẩm không phải Coursera trong hệ thống khi mở CheckoutModal chỉ có số lượng = 1, không có ô nhập email Coursera, và không sinh key bản quyền.
- **SC-002**: Sản phẩm Tool Coursera vẫn giữ nguyên đầy đủ chức năng: chọn số lượng 1..20, tương ứng số email nhập vào, sinh đúng số license keys khi hoàn tất thanh toán.
- **SC-003**: Loại bỏ 100% các trường hợp nhận diện nhầm đơn hàng (loại bỏ hoàn toàn điều kiện `% 40000 === 0` và `149000`).
- **SC-004**: Lệnh `npx tsc --noEmit` chạy thành công không có bất kỳ lỗi biên dịch nào.
