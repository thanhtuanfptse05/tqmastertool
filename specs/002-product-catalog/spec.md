# Feature Specification: Product Catalog — Duyệt & Tìm Kiếm Sản Phẩm

**Feature Branch**: `002-product-catalog`

**Created**: 2026-03-15

**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Duyệt Danh Sách Sản Phẩm Theo Danh Mục (Priority: P1)

Một khách truy cập (chưa đăng nhập hoặc đã đăng nhập) muốn xem tất cả sản phẩm trong một danh mục cụ thể (Tools, Projects, LAB211). Họ truy cập trang danh mục và thấy lưới sản phẩm trực quan với thông tin cơ bản.

**Why this priority**: Đây là bước đầu tiên trong hành trình mua hàng. Không có trang duyệt sản phẩm thì toàn bộ luồng thương mại điện tử bị tê liệt.

**Independent Test**: Truy cập trang danh mục, xác nhận hiển thị đúng danh sách sản phẩm với ảnh, tên, giá và huy hiệu danh mục — không cần đăng nhập.

**Acceptance Scenarios**:

1. **Given** khách truy cập bất kỳ trang danh mục, **When** trang tải xong, **Then** hệ thống hiển thị lưới sản phẩm của danh mục đó với ảnh thumbnail, tên sản phẩm, giá và huy hiệu danh mục (Tool / Project / LAB211).
2. **Given** danh mục có hơn 12 sản phẩm, **When** người dùng cuộn xuống cuối trang, **Then** hệ thống tải thêm sản phẩm tự động (infinite scroll) hoặc cung cấp nút "Xem thêm".
3. **Given** người dùng đang ở trang chủ, **When** họ bấm vào một trong 3 danh mục chính (Tools, Projects, LAB211), **Then** hệ thống điều hướng đến trang danh mục tương ứng với bộ lọc đã được áp dụng.
4. **Given** danh mục không có sản phẩm nào, **When** trang được tải, **Then** hệ thống hiển thị trạng thái rỗng thân thiện với người dùng (không hiển thị lưới trống).

---

### User Story 2 — Tìm Kiếm Sản Phẩm (Priority: P1)

Người dùng biết tên sản phẩm hoặc từ khóa cụ thể và muốn tìm nhanh. Họ gõ vào thanh tìm kiếm và thấy kết quả ngay lập tức.

**Why this priority**: Tìm kiếm là cách nhanh nhất để người dùng đến sản phẩm họ muốn — thiếu tìm kiếm tốt làm giảm đáng kể tỉ lệ chuyển đổi.

**Independent Test**: Gõ tên một sản phẩm đã biết vào thanh tìm kiếm và xác nhận sản phẩm đó xuất hiện trong kết quả trong vòng 1 giây.

**Acceptance Scenarios**:

1. **Given** người dùng đang gõ từ khóa vào thanh tìm kiếm, **When** họ nhập ít nhất 2 ký tự, **Then** hệ thống hiển thị gợi ý tìm kiếm nhanh (autocomplete) bên dưới thanh tìm kiếm.
2. **Given** người dùng submit từ khóa tìm kiếm, **When** hệ thống xử lý, **Then** hiển thị danh sách kết quả gồm sản phẩm khớp với tên, mô tả hoặc thẻ từ khóa, kèm thời gian phản hồi dưới 1 giây.
3. **Given** từ khóa tìm kiếm không khớp với sản phẩm nào, **When** hệ thống trả về kết quả, **Then** hiển thị thông báo "Không tìm thấy sản phẩm phù hợp" và gợi ý danh mục hoặc sản phẩm liên quan.
4. **Given** người dùng xóa từ khóa trong thanh tìm kiếm, **When** thanh tìm kiếm trống, **Then** gợi ý biến mất và trở về trạng thái danh mục ban đầu.

---

### User Story 3 — Lọc & Sắp Xếp Sản Phẩm (Priority: P2)

Người dùng muốn thu hẹp danh sách sản phẩm theo giá, trạng thái (mới nhất, phổ biến nhất) hoặc kết hợp nhiều bộ lọc.

**Why this priority**: Tăng khả năng khám phá nhưng không block luồng cốt lõi — người dùng vẫn có thể mua hàng khi không có bộ lọc.

**Independent Test**: Áp dụng bộ lọc "Giá thấp đến cao" và xác nhận thứ tự sản phẩm thay đổi đúng, sau đó đặt lại bộ lọc và xác nhận kết quả về trạng thái ban đầu.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở trang danh mục, **When** họ chọn bộ lọc "Sắp xếp theo: Giá thấp đến cao", **Then** danh sách sản phẩm được sắp xếp lại theo giá tăng dần ngay lập tức.
2. **Given** người dùng đã áp dụng bộ lọc, **When** họ bấm "Đặt lại bộ lọc", **Then** tất cả bộ lọc bị xóa và danh sách trở về thứ tự mặc định.
3. **Given** người dùng áp dụng bộ lọc khoảng giá, **When** bộ lọc được áp dụng, **Then** chỉ hiển thị sản phẩm trong khoảng giá đó và số lượng kết quả được cập nhật rõ ràng.

---

### User Story 4 — Trang Chủ Hero & Nổi Bật (Priority: P2)

Khách truy cập lần đầu thấy trang chủ ấn tượng với hiệu ứng 3D, các sản phẩm nổi bật và call-to-action rõ ràng hướng đến từng danh mục.

**Why this priority**: Tạo ấn tượng đầu tiên và điều hướng người dùng đến danh mục phù hợp — ảnh hưởng đến tỉ lệ giữ chân.

**Independent Test**: Truy cập trang chủ, xác nhận 3D canvas hiển thị, sản phẩm nổi bật được hiển thị và mỗi nút danh mục điều hướng đúng.

**Acceptance Scenarios**:

1. **Given** khách truy cập trang chủ, **When** trang tải, **Then** hero section hiển thị canvas 3D interactive, tagline nền tảng và 3 nút CTA cho 3 danh mục (Tools, Projects, LAB211).
2. **Given** trang chủ đang hiển thị, **When** người dùng cuộn xuống, **Then** hệ thống hiển thị section "Sản phẩm nổi bật" gồm tối đa 6 sản phẩm được Admin đánh dấu là featured.
3. **Given** người dùng bấm vào một sản phẩm nổi bật, **When** hệ thống điều hướng, **Then** người dùng được chuyển đến trang chi tiết sản phẩm đó.

---

### Edge Cases

- Điều gì xảy ra khi kết quả tìm kiếm có hơn 100 sản phẩm — phân trang hay infinite scroll?
- Làm thế nào khi người dùng tìm kiếm bằng ký tự đặc biệt hoặc SQL injection?
- Điều gì xảy ra khi ảnh thumbnail sản phẩm bị lỗi tải — có placeholder fallback không?
- Khi Admin ẩn một sản phẩm, nó có biến mất ngay lập tức khỏi kết quả tìm kiếm không?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI hiển thị sản phẩm theo 3 danh mục riêng biệt: Tools, Projects và LAB211.
- **FR-002**: Hệ thống PHẢI hiển thị mỗi sản phẩm với: ảnh thumbnail, tên, giá, huy hiệu danh mục và trạng thái (mới, phổ biến).
- **FR-003**: Hệ thống PHẢI cung cấp tìm kiếm theo từ khóa với kết quả trong vòng 1 giây.
- **FR-004**: Hệ thống PHẢI hỗ trợ gợi ý tìm kiếm (autocomplete) khi người dùng nhập từ 2 ký tự trở lên.
- **FR-005**: Hệ thống PHẢI cho phép lọc sản phẩm theo danh mục, khoảng giá và sắp xếp (mới nhất, giá tăng dần/giảm dần).
- **FR-006**: Hệ thống PHẢI hỗ trợ phân trang hoặc lazy-load để tải sản phẩm không gây chậm trang.
- **FR-007**: Hệ thống PHẢI hiển thị trạng thái rỗng thân thiện khi không có sản phẩm hoặc không có kết quả tìm kiếm.
- **FR-008**: Trang chủ PHẢI hiển thị tối đa 6 sản phẩm được Admin đánh dấu là "nổi bật".
- **FR-009**: Hệ thống PHẢI chỉ hiển thị sản phẩm có trạng thái "published" — sản phẩm bị ẩn hoặc nháp không được xuất hiện.
- **FR-010**: Hệ thống PHẢI cho phép người dùng đặt lại tất cả bộ lọc về trạng thái mặc định.

### Key Entities

- **Sản Phẩm (Product)**: Tên, mô tả ngắn, giá, danh mục (tool/project/lab211), trạng thái (published/hidden/draft), ảnh thumbnail, huy hiệu (mới/phổ biến), cờ featured.
- **Danh Mục (Category)**: Tool, Project, LAB211 — là giá trị enum cố định.
- **Kết Quả Tìm Kiếm**: Tập hợp sản phẩm khớp với từ khóa, hỗ trợ tìm kiếm trong tên, mô tả và thẻ.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Trang danh mục tải và hiển thị sản phẩm trong vòng 2 giây trên kết nối internet bình thường.
- **SC-002**: Kết quả tìm kiếm được trả về trong vòng 1 giây sau khi người dùng submit từ khóa.
- **SC-003**: 100% sản phẩm có trạng thái "hidden" hoặc "draft" không xuất hiện trong danh sách hoặc kết quả tìm kiếm.
- **SC-004**: Trang chủ hiển thị đúng tối đa 6 sản phẩm được đánh dấu featured bởi Admin.
- **SC-005**: Người dùng có thể điều hướng từ trang chủ đến trang danh mục và chi tiết sản phẩm mà không cần đăng nhập.

---

## Assumptions

- Tìm kiếm hoạt động trên client/server (full-text search) — không cần tích hợp công cụ tìm kiếm chuyên biệt trong v1.
- Hiệu ứng 3D hero section được xây dựng riêng trong tính năng `003-product-detail-demo` — tính năng này chỉ định nghĩa dữ liệu và layout hiển thị.
- Người dùng chưa đăng nhập vẫn có thể duyệt toàn bộ danh mục và tìm kiếm — chỉ cần đăng nhập khi đặt hàng.
- Số lượng sản phẩm ban đầu dự kiến dưới 200 — chưa cần tối ưu database phức tạp.
