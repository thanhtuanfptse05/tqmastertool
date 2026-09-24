# Feature Specification: LAB211 Standard 14 Labs Native Assignment Document Viewer & Dual Delivery (Spec 031)

**Feature Branch**: `031-lab211-word-assignment-native-viewer`  
**Created**: 2026-09-24  
**Status**: Draft  
**Input**: "ê bên src lab là file word đấy sao không để dạng gốc như của hcm ý là để hiện thị file word luôn ý, giúp t làm đi mà nhớ là chỉ áp dụng cho lab211 thôi đấy"

---

## 1. User Scenarios & Testing *(mandatory)*

### User Story 1 - Xem Đề Bài Dạng Tài Liệu Gốc Sắc Nét Cho 14 Bài LAB211 Chuẩn (Priority: P1)
Khách hàng mua gói **SOURCE CODE LAB 14 BÀI LAB211 CÁC GIẢNG VIÊN** khi nhấn xem chi tiết bài lab trong `LabDeliverableModal` (hoặc Deliverable Vault) sẽ thấy ngay tài liệu đề bài hiển thị dạng gốc sắc nét (Native Document Viewer) với đầy đủ thanh công cụ tài liệu, số trang (1/N), thu phóng (Zoom), và nguyên vẹn layout trang giấy A4 y hệt như trải nghiệm của gói Campus HCM (như ảnh chụp thực tế của người dùng). Không còn hiển thị dạng văn bản HTML chuyển đổi thô sơ (Mammoth).

**Why this priority**: Mang lại trải nghiệm học tập và xem đề bài chuyên nghiệp, đồng bộ 100% giữa tất cả các gói LAB211, giúp sinh viên đọc đề thi dễ dàng, giữ nguyên cấu trúc bảng biểu, hình vẽ và căn lề của đề bài gốc FPT.

**Independent Test**: Mở modal `LabDeliverableModal` với bất kỳ bài nào trong 14 bài (`J1.L.P0021`, `J1.L.P0022`, `J1.L.P0023`, `J1.S.P0006`, ...), kiểm tra:
- Khung tài liệu hiển thị Native Document Viewer với giao diện trang đề bài gốc chuẩn Word/PDF.
- Có thanh cuộn, phân trang, phóng to thu nhỏ.
- Có nút chuyển đổi linh hoạt: "Tài Liệu Gốc" và "Tóm Tắt Yêu Cầu".

**Acceptance Scenarios**:
1. **Given** Người dùng sở hữu đơn hàng hoàn tất gói 14 bài LAB211, **When** chọn xem bài `J1.L.P0021` (hoặc bất kỳ bài nào trong 14 bài), **Then** trình xem hiển thị bản tài liệu đề bài gốc trực quan, sắc nét tương tự Campus HCM.
2. **Given** Người dùng chuyển qua lại giữa các bài lab trong danh sách, **Then** tài liệu đề bài tương ứng được tải mượt mà và hiển thị chính xác.

---

### User Story 2 - Hỗ Trợ Tải Song Song Cả File Word (.docx) Và File Đề (.pdf) (Priority: P2)
Người dùng có nhu cầu lưu trữ đề bài trên máy tính cá nhân có thể tải trực tiếp file Word gốc (`.docx`) để chỉnh sửa, hoặc tải file tài liệu chuẩn in ấn (`.pdf`). Giao diện cung cấp nút tải tiện lợi với thông tin tên file rõ ràng.

**Why this priority**: Đáp ứng trọn vẹn cả 2 nhu cầu: sinh viên cần file Word để nộp bài/sửa đề hoặc cần file PDF để in ấn/đọc trên iPad/điện thoại.

**Independent Test**: Bấm nút tải đề bài và kiểm tra file tải về máy đúng tên file gốc và mở được bằng Microsoft Word hoặc Adobe Acrobat.

**Acceptance Scenarios**:
1. **Given** Người dùng đang ở Section 1 (Đề bài), **When** nhấn nút "Tải File Đề (.docx)", **Then** file Word gốc được tải về máy.
2. **Given** Người dùng đang xem tài liệu, **When** nhấn nút "Mở Tab Mới / Toàn Màn Hình", **Then** tài liệu mở trong tab mới với độ phân giải cao nhất.

---

### User Story 3 - API Phân Giải Tài Liệu Gốc An Toàn & Chuẩn MIME Type (Priority: P3)
Endpoint `/api/deliverables/lab/download` hỗ trợ đầy đủ `type="pdf"` và `type="docx"` cho toàn bộ 14 bài LAB211 chuẩn:
- Khi `type="pdf"`, server stream file PDF tương ứng từ `private_deliverables/lab211/pdf/` với `Content-Type: application/pdf`.
- Khi `type="docx"`, server stream file Word tương ứng từ `private_deliverables/lab211/docx/` với `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

**Why this priority**: Đảm bảo phân quyền bảo mật (Anti-IDOR, Order status completed, Category check) và stream file nhanh chóng, không bị lỗi CORS hay lỗi parse nhị phân.

**Independent Test**: Gọi API download với `type=pdf` cho `J1.L.P0021` và kiểm tra response 200 kèm `Content-Type: application/pdf`.

**Acceptance Scenarios**:
1. **Given** Khách hàng đã duyệt đơn, **When** client request `type=pdf` cho mã bài `J1.L.P0021`, **Then** server phản hồi stream PDF chuẩn xác.

---

### User Story 4 - Ràng Buộc Cô Lập: Chỉ Áp Dụng Cho LAB211 (Priority: P4)
Tuân thủ nghiêm ngặt yêu cầu của người dùng: *"nhớ là chỉ áp dụng cho lab211 thôi đấy"*. Mọi thay đổi về Document Viewer, file resolution, và modal bàn giao chỉ có hiệu lực với các sản phẩm danh mục `lab211`. Không ảnh hưởng đến các sản phẩm Tool, Extension, Capstone hay các khóa học khác.

**Why this priority**: Đảm bảo tính ổn định và tính toàn vẹn của toàn bộ hệ sinh thái CodeVault Studio.

**Acceptance Scenarios**:
1. **Given** Khách hàng xem đơn hàng Tool Coursera hoặc IoT102, **Then** modal bàn giao tương ứng của Tool hoạt động độc lập và không chịu ảnh hưởng bởi thay đổi của LAB211.

---

## 2. Requirements & Functional Specifications

- **`FR-001`**: Hệ thống phải có sẵn file PDF tương ứng cho tất cả 14 bài LAB211 chuẩn trong `private_deliverables/lab211/pdf/`, được xuất bản nguyên gốc từ file `.docx` của giảng viên FPT.
- **`FR-002`**: `LabDocViewer` được nâng cấp để hỗ trợ chế độ Native Document Viewer cho toàn bộ các bài LAB211:
  - Nếu bài có file PDF sẵn (cả 14 bài chuẩn lẫn 3 bài HCM), mặc định mở trình xem tài liệu gốc nhúng (`<object>` / `<iframe>`).
  - Hỗ trợ chuyển đổi linh hoạt: tab "Tài Liệu Gốc" và tab "Tóm Tắt Yêu Cầu".
  - Hiển thị badge nhận diện: "Tài Liệu Đề Bài Gốc".
  - Hỗ trợ nút "Tải File Đề (.docx)" và/hoặc "Tải File Đề (.pdf)".
- **`FR-003`**: `src/lib/lab-parser.ts`:
  - Hàm `getLabAssetPhysicalPath(labId, type)`: Khi `type === "pdf"`, ưu tiên tìm file PDF tương ứng trong `private_deliverables/lab211/pdf/` theo mã bài (`J1.L.P0021.pdf`, `J1.L.P0022.pdf`, v.v.).
  - Khi `type === "docx"`, tìm file docx trong `private_deliverables/lab211/docx/`.
- **`FR-004`**: `src/lib/lab-data.ts`:
  - Bổ sung hoặc mapping thuộc tính `pdfFileName` cho từng bài lab, bảo đảm tính nhất quán giữa danh sách bài học và tài nguyên vật lý.
- **`FR-005`**: Giao diện hiển thị phải sang trọng, sắc nét, có nút "Mở toàn màn hình / Tab mới", tương thích cả màn hình desktop lẫn thiết bị di động.
- **`FR-006` (Ràng buộc bắt buộc)**: Chỉ áp dụng cơ chế xem tài liệu đề bài này cho các bài thuộc môn LAB211.

---

## 3. Key Entities & Data Mapping

- **`LabExerciseItem`**:
  - `code`: Mã đề (`J1.L.P0021`, `J1.L.P0022`, ...).
  - `docxFileName`: Tên file Word gốc (`J1.L.P0021.docx`, ...).
  - `pdfFileName` (mới hoặc resolved): Tên file PDF đề bài gốc (`J1.L.P0021.pdf`, ...).

---

## 4. Success Criteria

- **`SC-001`**: Mở bất kỳ bài nào trong 14 bài LAB211 chuẩn hiển thị ngay Native Document Viewer sắc nét dạng trang giấy gốc y hệt như Campus HCM.
- **`SC-002`**: Người dùng có thể xem tài liệu gốc hoặc chuyển sang tab tóm tắt yêu cầu một cách mượt mà.
- **`SC-003`**: Nút tải file hoạt động chính xác, cho phép tải file Word `.docx` hoặc PDF.
- **`SC-004`**: Không gây bất kỳ xung đột nào đến các danh mục sản phẩm khác (Tool, Coursera, Capstone).
- **`SC-005`**: Toàn bộ codebase vượt qua kiểm tra `npx tsc --noEmit` với 0 lỗi.

---

## 5. Edge Cases & Assumptions

- **Trình duyệt di động không hỗ trợ embed object PDF**: Tự động hiển thị thẻ preview kèm nút mở trực tiếp bằng PDF viewer ngoài của thiết bị.
- **Tên file docx có khoảng trắng hoặc ký tự đặc biệt**: Hệ thống chuẩn hóa tên file PDF ánh xạ (`J1.L.P0023 - FRUIT.pdf`, `J1.S.P0006 - BinarySearch.pdf`, ...) tương thích 100% với tên file docx.
