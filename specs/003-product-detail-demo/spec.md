# Feature Specification: Product Detail & Rich Demo Engine

**Feature Branch**: `003-product-detail-demo`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Xem Chi Tiết Sản Phẩm Với Demo Phong Phú (Priority: P1)

Một người dùng quan tâm đến một sản phẩm (Tool, Project hoặc LAB211) muốn xem thông tin chi tiết đầy đủ trước khi mua. Trang chi tiết hiển thị mô tả đầy đủ, bộ demo phong phú (ảnh, video, link demo sống) và thông tin giá.

**Why this priority**: Demo chất lượng cao là yếu tố quyết định hành vi mua hàng — người dùng cần "xem trước khi mua" để tin tưởng vào sản phẩm số.

**Independent Test**: Truy cập trang chi tiết sản phẩm bất kỳ, xác nhận gallery media hiển thị, có thể bấm vào ảnh/video để xem lớn hơn, và link demo (nếu có) mở đúng trong tab mới.

**Acceptance Scenarios**:

1. **Given** người dùng bấm vào một sản phẩm từ danh sách, **When** trang chi tiết tải, **Then** hiển thị đầy đủ: tiêu đề, mô tả chi tiết, giá, danh mục, bộ media gallery (ảnh + video), nút "Thêm vào giỏ hàng" / "Mua ngay".
2. **Given** Admin đã gắn link demo trực tiếp vào sản phẩm, **When** người dùng bấm nút "Xem Demo", **Then** link demo mở trong tab mới mà không điều hướng rời khỏi trang sản phẩm.
3. **Given** sản phẩm có nhiều ảnh trong gallery, **When** người dùng bấm vào một ảnh, **Then** hiển thị lightbox toàn màn hình với khả năng điều hướng qua lại giữa các ảnh bằng phím mũi tên hoặc vuốt.
4. **Given** sản phẩm có video nhúng (YouTube / Vimeo), **When** người dùng bấm nút play, **Then** video phát trực tiếp trong trang mà không điều hướng ra ngoài.

---

### User Story 2 — Demo Tương Tác 3D (Priority: P2)

Một số sản phẩm có thể được trình bày với hiệu ứng 3D tương tác trên canvas — tạo trải nghiệm trực quan nổi bật hơn các cửa hàng số thông thường.

**Why this priority**: Tạo sự khác biệt thương hiệu và tăng mức độ tương tác — không block luồng mua hàng nhưng ảnh hưởng đến tỉ lệ chuyển đổi.

**Independent Test**: Truy cập một sản phẩm có 3D canvas được bật, xác nhận canvas render và tương tác được (xoay/zoom) mà không gây lag hoặc lỗi hiển thị.

**Acceptance Scenarios**:

1. **Given** Admin đã bật tùy chọn "3D Showcase" cho sản phẩm, **When** người dùng truy cập trang chi tiết, **Then** 3D canvas được hiển thị ở vị trí nổi bật trong trang với khả năng xoay và phóng to bằng chuột/cảm ứng.
2. **Given** 3D canvas đang hiển thị, **When** người dùng tương tác (kéo để xoay), **Then** canvas phản hồi mượt mà ở tốc độ ≥ 30 FPS trên thiết bị trung bình.
3. **Given** thiết bị của người dùng không hỗ trợ WebGL hoặc canvas 3D chạy chậm, **When** hệ thống phát hiện, **Then** tự động fallback hiển thị ảnh tĩnh thay thế mà không gây lỗi.

---

### User Story 3 — Xem Thông Tin Kỹ Thuật & Bao Gồm (Priority: P2)

Người dùng muốn biết chính xác sản phẩm số bao gồm những gì trước khi mua (danh sách file, công nghệ sử dụng, phiên bản, hướng dẫn cài đặt).

**Why this priority**: Giảm tỉ lệ hoàn trả và tăng sự tin tưởng — người dùng mua hàng số cần biết chính xác họ nhận được gì.

**Independent Test**: Xem trang chi tiết và xác nhận phần "Bao gồm" hoặc "Thông tin kỹ thuật" hiển thị danh sách nội dung sản phẩm.

**Acceptance Scenarios**:

1. **Given** Admin đã nhập danh sách nội dung sản phẩm, **When** người dùng xem trang chi tiết, **Then** một section rõ ràng hiển thị danh sách những gì được bao gồm (ví dụ: "Source code Java, tài liệu Word, README").
2. **Given** Admin đã nhập yêu cầu kỹ thuật, **When** người dùng xem, **Then** hiển thị thông tin về ngôn ngữ lập trình, công nghệ, phiên bản phần mềm cần thiết.

---

### User Story 4 — Sản Phẩm Liên Quan (Priority: P3)

Sau khi xem chi tiết một sản phẩm, người dùng thấy các sản phẩm tương tự cùng danh mục để khuyến khích khám phá thêm.

**Why this priority**: Tăng cơ hội cross-sell — giá trị thêm nhưng không ảnh hưởng đến trải nghiệm cốt lõi.

**Independent Test**: Ở cuối trang chi tiết, xác nhận section "Sản phẩm liên quan" hiển thị tối thiểu 3 sản phẩm cùng danh mục.

**Acceptance Scenarios**:

1. **Given** người dùng đang xem chi tiết một sản phẩm Tools, **When** họ cuộn xuống cuối trang, **Then** hệ thống hiển thị tối thiểu 3 sản phẩm Tools khác với ảnh và giá.

---

### Edge Cases

- Điều gì xảy ra khi sản phẩm không có ảnh nào — có hiển thị placeholder không?
- Làm thế nào khi link demo do Admin nhập không còn hoạt động (404)?
- Khi 3D canvas đang tải, có hiển thị skeleton/loading indicator không?
- Người dùng đã mua sản phẩm truy cập lại trang chi tiết — có thấy nút "Tải về" thay vì "Mua ngay" không?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI hiển thị trang chi tiết sản phẩm với đầy đủ: tiêu đề, mô tả chi tiết (hỗ trợ rich text), giá, danh mục và trạng thái.
- **FR-002**: Hệ thống PHẢI hỗ trợ gallery media với nhiều ảnh và video nhúng từ YouTube/Vimeo.
- **FR-003**: Hệ thống PHẢI hiển thị lightbox khi người dùng bấm vào ảnh trong gallery.
- **FR-004**: Hệ thống PHẢI hiển thị nút "Xem Demo" nếu Admin đã gắn link demo — link mở trong tab mới.
- **FR-005**: Hệ thống PHẢI hiển thị section "Bao gồm" liệt kê nội dung sản phẩm nếu Admin đã nhập.
- **FR-006**: Hệ thống PHẢI hỗ trợ hiển thị 3D canvas tương tác khi Admin bật tùy chọn "3D Showcase".
- **FR-007**: Hệ thống PHẢI tự động fallback sang ảnh tĩnh nếu thiết bị không hỗ trợ 3D canvas.
- **FR-008**: Hệ thống PHẢI hiển thị sản phẩm liên quan cùng danh mục ở cuối trang chi tiết.
- **FR-009**: Hệ thống PHẢI hiển thị nút "Tải về" / "Truy cập ngay" thay vì "Mua ngay" với người dùng đã mua sản phẩm đó.
- **FR-010**: Trang chi tiết sản phẩm PHẢI có URL thân thiện và hỗ trợ chia sẻ mạng xã hội với metadata OG đầy đủ.

### Key Entities

- **Sản Phẩm chi tiết (Product Detail)**: Mô tả đầy đủ (rich text), danh sách ảnh, danh sách video nhúng, link demo, danh sách nội dung bao gồm, yêu cầu kỹ thuật, cờ 3D showcase.
- **Media Item**: Loại (ảnh / video nhúng), URL, thứ tự hiển thị, alt text.
- **Demo Link**: URL đến trang demo bên ngoài, nhãn hiển thị.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Trang chi tiết sản phẩm tải đầy đủ trong vòng 3 giây.
- **SC-002**: 3D canvas tương tác ở tốc độ ≥ 30 FPS trên thiết bị trung bình (không phải high-end).
- **SC-003**: 100% trường hợp thiết bị không hỗ trợ 3D đều hiển thị fallback ảnh tĩnh mà không có lỗi console.
- **SC-004**: Người dùng đã mua sản phẩm thấy nút tải về/truy cập đúng — không thấy nút mua lại.
- **SC-005**: Link demo luôn mở trong tab mới — không điều hướng rời khỏi trang chi tiết.

---

## Assumptions

- Admin sẽ cung cấp link YouTube/Vimeo cho video nhúng — không hỗ trợ upload video trực tiếp lên server trong v1.
- 3D canvas sử dụng model 3D đơn giản hoặc hiệu ứng particle — không cần render model 3D phức tạp của sản phẩm thực.
- Link demo được Admin nhập thủ công — hệ thống không tự động crawl hay kiểm tra tính hợp lệ của link.
- Sản phẩm liên quan được tìm tự động theo danh mục — không cần Admin cấu hình thủ công.
