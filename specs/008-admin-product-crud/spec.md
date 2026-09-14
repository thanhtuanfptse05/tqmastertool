# Feature Specification: Admin Product CRUD — Quản Lý Sản Phẩm & Cấu Hình Demo

**Feature Branch**: `008-admin-product-crud`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Tạo Sản Phẩm Mới (Priority: P1)

Admin muốn thêm một sản phẩm mới vào hệ thống với đầy đủ thông tin: tiêu đề, mô tả, giá, danh mục, ảnh và cấu hình demo. Sản phẩm được tạo ở trạng thái `draft` và chỉ publish khi Admin sẵn sàng.

**Why this priority**: Không có khả năng tạo sản phẩm thì không có gì để bán — đây là nền tảng của toàn bộ hệ thống.

**Independent Test**: Admin tạo một sản phẩm Tool mới với ảnh, mô tả và giá — xác nhận sản phẩm xuất hiện trong danh sách Admin với trạng thái `draft` và chưa hiển thị trên storefront.

**Acceptance Scenarios**:

1. **Given** Admin truy cập trang "Thêm sản phẩm mới", **When** form hiển thị, **Then** Admin thấy đầy đủ các trường: tên sản phẩm, mô tả ngắn, mô tả đầy đủ (rich text editor), giá (VNĐ), danh mục (Tools/Projects/LAB211), trạng thái (draft/published), cờ "Nổi bật" và cờ "3D Showcase".
2. **Given** Admin điền đầy đủ thông tin bắt buộc và bấm "Lưu nháp", **When** hệ thống xử lý, **Then** sản phẩm được tạo với trạng thái `draft` và Admin được điều hướng đến trang chỉnh sửa để tiếp tục thêm media và cấu hình demo.
3. **Given** Admin bấm "Publish" sau khi điền đủ thông tin bắt buộc, **When** hệ thống xử lý, **Then** sản phẩm chuyển sang `published` và xuất hiện ngay trên storefront.
4. **Given** Admin bỏ trống trường bắt buộc (tên, giá, danh mục), **When** submit, **Then** hệ thống không lưu và hiển thị thông báo lỗi cụ thể cho từng trường thiếu.

---

### User Story 2 — Quản Lý Media Gallery Sản Phẩm (Priority: P1)

Admin cần upload nhiều ảnh, nhúng video YouTube/Vimeo và thêm link demo trực tiếp để tạo bộ demo phong phú cho sản phẩm.

**Why this priority**: Media gallery chất lượng cao là yếu tố then chốt tăng tỉ lệ chuyển đổi — không có media thì trang sản phẩm kém thuyết phục.

**Independent Test**: Admin upload 3 ảnh, thêm 1 video YouTube và 1 link demo — xác nhận tất cả hiển thị đúng thứ tự trên trang chi tiết sản phẩm (storefront).

**Acceptance Scenarios**:

1. **Given** Admin đang chỉnh sửa sản phẩm, **When** họ vào section "Gallery & Demo", **Then** có thể upload tối đa 10 ảnh (JPG/PNG/WebP, tối đa 10MB mỗi ảnh) với chức năng kéo-thả và sắp xếp thứ tự bằng drag-and-drop.
2. **Given** Admin nhập URL YouTube hoặc Vimeo vào ô "Thêm video", **When** xác nhận, **Then** hệ thống hiển thị preview thumbnail video và thêm vào gallery.
3. **Given** Admin nhập URL demo trực tiếp và nhãn nút (ví dụ: "Xem Demo Trực Tiếp"), **When** lưu, **Then** nút demo với nhãn đó xuất hiện trên trang chi tiết sản phẩm.
4. **Given** Admin kéo-thả để sắp xếp lại thứ tự ảnh, **When** lưu thứ tự mới, **Then** gallery trên storefront hiển thị đúng thứ tự mới.

---

### User Story 3 — Cấu Hình Thông Tin Kỹ Thuật & Nội Dung Sản Phẩm (Priority: P1)

Admin cần nhập danh sách "Bao gồm" (những gì khách hàng nhận được) và yêu cầu kỹ thuật (ngôn ngữ, framework, phiên bản) để khách hàng biết chính xác sản phẩm bao gồm gì.

**Why this priority**: Thông tin rõ ràng giảm tỉ lệ hoàn tiền và tăng sự tin tưởng — đặc biệt quan trọng với sản phẩm số.

**Independent Test**: Admin thêm 3 mục vào "Bao gồm" và 2 yêu cầu kỹ thuật — xác nhận chúng hiển thị đúng trên trang chi tiết sản phẩm.

**Acceptance Scenarios**:

1. **Given** Admin đang chỉnh sửa sản phẩm, **When** họ vào section "Nội dung & Yêu cầu", **Then** có thể thêm/xóa các mục trong danh sách "Bao gồm" (ví dụ: "Source code Java, tài liệu Word") và "Yêu cầu kỹ thuật" (ví dụ: "Java 17, Maven").
2. **Given** Admin đã thêm danh sách bao gồm, **When** lưu, **Then** section "Bao gồm" xuất hiện trên trang chi tiết sản phẩm phía khách hàng.

---

### User Story 4 — Chỉnh Sửa & Xóa Sản Phẩm (Priority: P1)

Admin cần chỉnh sửa thông tin sản phẩm đã tồn tại (cập nhật giá, mô tả, ảnh) hoặc ẩn/xóa sản phẩm không còn bán nữa.

**Why this priority**: Quản lý vòng đời sản phẩm là tính năng CRUD cơ bản không thể thiếu.

**Independent Test**: Admin chỉnh sửa giá một sản phẩm, lưu và xác nhận giá mới hiển thị đúng trên storefront. Sau đó ẩn sản phẩm và xác nhận nó không còn hiện ở storefront.

**Acceptance Scenarios**:

1. **Given** Admin bấm "Chỉnh sửa" trên một sản phẩm, **When** trang chỉnh sửa tải, **Then** tất cả thông tin hiện tại được điền sẵn và Admin có thể thay đổi bất kỳ trường nào.
2. **Given** Admin thay đổi giá và lưu, **When** hệ thống cập nhật, **Then** giá mới hiển thị ngay trên storefront — nhưng các đơn hàng cũ vẫn giữ nguyên giá tại thời điểm đặt.
3. **Given** Admin chuyển trạng thái sản phẩm sang `hidden`, **When** lưu, **Then** sản phẩm biến mất khỏi storefront ngay lập tức nhưng vẫn tồn tại trong database và danh sách Admin.
4. **Given** Admin cố xóa sản phẩm đã có đơn hàng, **When** thực hiện, **Then** hệ thống cảnh báo "Sản phẩm này đã có X đơn hàng — xóa sẽ ảnh hưởng đến lịch sử" và yêu cầu xác nhận kép.

---

### User Story 5 — Danh Sách Sản Phẩm Admin (Priority: P1)

Admin cần tổng quan danh sách tất cả sản phẩm với khả năng lọc, tìm kiếm và quản lý nhanh trạng thái.

**Why this priority**: Điểm trung tâm quản lý sản phẩm — Admin cần thấy toàn bộ catalog.

**Independent Test**: Truy cập trang quản lý sản phẩm, lọc theo danh mục "LAB211", xác nhận chỉ hiển thị sản phẩm LAB211.

**Acceptance Scenarios**:

1. **Given** Admin truy cập trang Quản lý sản phẩm, **When** trang tải, **Then** hiển thị bảng gồm: ảnh thumbnail, tên sản phẩm, danh mục, giá, trạng thái (draft/published/hidden), số đơn hàng và thao tác (Chỉnh sửa / Ẩn / Xóa).
2. **Given** Admin chọn bộ lọc danh mục, **When** áp dụng, **Then** danh sách chỉ hiển thị sản phẩm thuộc danh mục đó.
3. **Given** Admin bật cờ "Nổi bật" trực tiếp từ danh sách, **When** lưu, **Then** sản phẩm xuất hiện trong section Featured trên trang chủ.

---

### Edge Cases

- Điều gì xảy ra khi Admin xóa ảnh đang là ảnh thumbnail chính của sản phẩm?
- Làm thế nào khi URL YouTube Admin nhập không hợp lệ hoặc video bị xóa?
- Điều gì xảy ra khi Admin publish sản phẩm mà chưa upload file tài nguyên số?
- Khi Admin chỉnh sửa mô tả sản phẩm, có tự động save nháp không (auto-save)?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admin PHẢI có thể tạo sản phẩm mới với các trường: tên, mô tả ngắn, mô tả đầy đủ (rich text), giá, danh mục, trạng thái, cờ nổi bật, cờ 3D showcase.
- **FR-002**: Hệ thống PHẢI yêu cầu tên, giá và danh mục là các trường bắt buộc khi tạo/chỉnh sửa sản phẩm.
- **FR-003**: Admin PHẢI có thể upload tối đa 10 ảnh (JPG/PNG/WebP, tối đa 10MB/ảnh) vào gallery sản phẩm.
- **FR-004**: Admin PHẢI có thể sắp xếp thứ tự ảnh trong gallery bằng drag-and-drop.
- **FR-005**: Admin PHẢI có thể nhúng video từ YouTube hoặc Vimeo bằng cách nhập URL.
- **FR-006**: Admin PHẢI có thể thêm tối đa 3 link demo với nhãn tùy chỉnh.
- **FR-007**: Admin PHẢI có thể quản lý danh sách "Bao gồm" và "Yêu cầu kỹ thuật" bằng cách thêm/xóa từng mục.
- **FR-008**: Admin PHẢI có thể chuyển đổi trạng thái sản phẩm giữa draft/published/hidden.
- **FR-009**: Hệ thống PHẢI cảnh báo khi Admin cố xóa sản phẩm đã có đơn hàng.
- **FR-010**: Admin PHẢI có thể bật/tắt cờ "Nổi bật" và "3D Showcase" cho từng sản phẩm.
- **FR-011**: Hệ thống PHẢI hiển thị danh sách sản phẩm Admin với bộ lọc theo danh mục, trạng thái và tìm kiếm theo tên.
- **FR-012**: Khi Admin thay đổi giá, hệ thống PHẢI giữ nguyên giá trong các đơn hàng cũ — chỉ áp dụng giá mới cho đơn hàng mới.

### Key Entities

- **Sản Phẩm (Product)**: Tên, mô tả ngắn, mô tả đầy đủ (rich text HTML), giá, danh mục (tool/project/lab211), trạng thái (draft/published/hidden), cờ featured, cờ 3D showcase, danh sách bao gồm, yêu cầu kỹ thuật, timestamps.
- **Media Item**: Loại (ảnh/video nhúng), URL, thứ tự, alt text, liên kết với sản phẩm.
- **Demo Link**: URL, nhãn nút hiển thị, thứ tự.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin có thể tạo một sản phẩm đầy đủ (thông tin cơ bản + ảnh + demo) trong vòng 10 phút.
- **SC-002**: Thay đổi trạng thái sản phẩm (publish/hide) phản ánh ngay trên storefront trong vòng 5 giây.
- **SC-003**: Upload 10 ảnh đồng thời hoàn tất trong vòng 60 giây trên kết nối internet bình thường.
- **SC-004**: 100% sản phẩm ở trạng thái draft/hidden không xuất hiện trên storefront.
- **SC-005**: Giá tại thời điểm đặt hàng trong đơn hàng cũ không thay đổi khi Admin cập nhật giá sản phẩm.

---

## Assumptions

- Rich text editor cho mô tả sản phẩm hỗ trợ định dạng cơ bản: bold, italic, heading, danh sách, liên kết.
- Video nhúng từ YouTube/Vimeo — không hỗ trợ upload video trực tiếp trong v1.
- Tối đa 10 ảnh và 3 link demo là đủ cho nhu cầu v1 — có thể tăng giới hạn trong v2.
- Admin xóa "logic" (soft delete) sản phẩm — không xóa khỏi database để bảo toàn lịch sử đơn hàng.
