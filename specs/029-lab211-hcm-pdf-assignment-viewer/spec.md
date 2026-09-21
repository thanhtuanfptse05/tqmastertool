# Feature Specification: LAB211 Campus HCM PDF Assignment Document Viewer & Safe Delivery (Spec 029)

**Feature Branch**: `029-lab211-hcm-pdf-assignment-viewer`  
**Created**: 2026-09-22  
**Status**: In Implementation  
**Input**: "check lại LAB211 Campus HCM cái này trong đó đề là file pdf chứ không phải word nên chỉnh lại đi nhớ là chỉ đối với LAB211 Campus HCM"

---

## 1. User Scenarios & Testing *(mandatory)*

### User Story 1 - Xem Đề Bài PDF Chuẩn Xác Trong Modal Bàn Giao Campus HCM (Priority: P1)
Khách hàng mua gói **SOURCE CODE LAB211 CAMPUS HCM** khi nhấn "Xem Đề & Code LAB211" tại trang đơn hàng hoặc "Xem Ngay" tại Kho Lưu Trữ (Deliverables Vault) sẽ thấy ngay nội dung đề bài dạng PDF mà không gặp lỗi parse file Word của Mammoth ("Can't find end of central directory : is this a zip file ?").

**Why this priority**: Lỗi hiện tại khiến khách hàng không đọc được đề bài trong modal do trình duyệt cố ép file PDF vào thư viện đọc docx (`mammoth`). Sửa lỗi này khôi phục trải nghiệm xem đề bài 100% cho Campus HCM.

**Independent Test**: Mở modal bàn giao với đơn hàng Campus HCM (`J1.L.P0028`), kiểm tra:
- Không còn thông báo cảnh báo màu cam của Mammoth.
- Hiển thị tài liệu đề bài PDF đầy đủ (embed PDF viewer và/hoặc bảng đặc tả HTML).

**Acceptance Scenarios**:
1. **Given** Người dùng sở hữu đơn hàng hoàn tất của `SOURCE CODE LAB211 CAMPUS HCM`, **When** mở modal `LabDeliverableModal` với bài `J1.L.P0028`, **Then** giao diện nhận diện đây là file PDF, không chạy mammoth docx parser và hiển thị tài liệu đề bài PDF trơn tru.
2. **Given** Người dùng đang ở bài `J1.L.P0038` hoặc `J1.L.P0039`, **When** chuyển tab, **Then** tài liệu PDF tương ứng được tải và hiển thị chính xác.

---

### User Story 2 - Chuẩn Hóa Nhãn UI & Nút Tải Đề Bài PDF (Priority: P2)
Toàn bộ nhãn giao diện hiển thị cho tài liệu đề bài của Campus HCM được đổi từ "Word" sang "PDF":
- Tiêu đề mục: `1. Đề Bài & Đặc Tả Yêu Cầu (File PDF Gốc)`.
- Badge tài liệu: `PDF Assignment Document`.
- Nút tải đề bài: `Tải File Đề (.pdf)`.
- Tải về đúng file `.pdf` tương ứng (`J1.L.P0028.TraditionalFeastOrderManagement_200LOCs.pdf`).

**Why this priority**: Mang lại sự chính xác tuyệt đối, tránh gây hiểu nhầm cho sinh viên về định dạng file gốc của giảng viên Campus HCM.

**Independent Test**: Bấm nút `Tải File Đề (.pdf)` và kiểm tra file tải về máy có đuôi `.pdf` và mở được bằng Adobe Acrobat / Chrome PDF viewer.

**Acceptance Scenarios**:
1. **Given** Khách hàng đang xem bài `J1.L.P0028`, **When** bấm `Tải File Đề (.pdf)`, **Then** trình duyệt tải file `J1.L.P0028.TraditionalFeastOrderManagement_200LOCs.pdf`.
2. **Given** Khách hàng mở modal của sản phẩm LAB211 chuẩn (GV TAMNT, TRUNGNT...), **When** xem Section 1, **Then** tiêu đề vẫn là `File Word Gốc`, badge `Word Assignment Document`, nút `Tải File Đề (.docx)`.

---

### User Story 3 - Hỗ Trợ Endpoint Download Cho Loại File PDF (Priority: P3)
Endpoint `/api/deliverables/lab/download` hỗ trợ `type="pdf"` và tự động nhận diện file `.pdf` nếu client gọi với `type="docx"` để đảm bảo tương thích ngược, đồng thời trả về `Content-Type: application/pdf`.

**Why this priority**: Đảm bảo máy chủ phản hồi đúng MIME type, ngăn ngừa lỗi trình duyệt cố phân tích PDF như một file docx nén.

**Independent Test**: Gọi `GET /api/deliverables/lab/download?orderId=...&labId=J1.L.P0028&type=pdf` và kiểm tra response header `Content-Type: application/pdf`.

**Acceptance Scenarios**:
1. **Given** Yêu cầu tải file đề bài với `labId=J1.L.P0028` và `type=pdf`, **When** API xử lý, **Then** trả về HTTP 200 kèm stream file PDF với header `Content-Type: application/pdf`.

---

## 2. Requirements & Functional Specifications

- **`FR-001`**: `LabDocViewer` phải kiểm tra `isPdf = lab.docxFileName?.toLowerCase().endsWith(".pdf")`.
- **`FR-002`**: Nếu `isPdf === true`:
  - Tuyệt đối không gọi `mammoth.convertToHtml` (tránh lỗi jszip).
  - Lấy binary từ `/api/deliverables/lab/download?type=pdf` (hoặc `type=docx`), tạo Blob Object URL dạng `application/pdf`.
  - Hiển thị trình xem PDF nhúng (`<object>` / `<iframe>` kèm fallback) hoặc toggle xem bản PDF gốc / xem tóm tắt đặc tả bài lab.
  - Badge hiển thị: `PDF Assignment Document` (màu đỏ PDF sang trọng).
  - Nút tải hiển thị: `Tải File Đề (.pdf)` và kích hoạt tải file `.pdf`.
- **`FR-003`**: `LabDeliverableModal` điều chỉnh tiêu đề Section 1:
  - Nếu `isCampusHcm` hoặc `currentLab.docxFileName?.endsWith(".pdf")`: `1. Đề Bài & Đặc Tả Yêu Cầu (File PDF Gốc)`.
  - Nếu là bài chuẩn: `1. Đề Bài & Đặc Tả Yêu Cầu (File Word Gốc)`.
- **`FR-004`**: `src/app/api/deliverables/lab/download/route.ts`:
  - Thêm `"pdf"` vào danh sách hợp lệ: `["docx", "pdf", "zip", "java"]`.
  - Khi file gốc kết thúc bằng `.pdf`, trả về `Content-Type: application/pdf`.
- **`FR-005`**: `src/lib/lab-parser.ts`:
  - `getLabAssetPhysicalPath` hỗ trợ `type === "pdf" || type === "docx"`.
  - Tìm kiếm file trong thư mục `private_deliverables/lab211/pdf/` cũng như `docx/`.
  - Thiết lập `contentType: "application/pdf"` cho các file `.pdf`.
- **`FR-006` (Ràng buộc bất biến)**: Hoàn toàn không sửa đổi hoặc làm ảnh hưởng đến cách hiển thị và tải đề bài Word của 18 gói sản phẩm LAB211 chuẩn khác.

---

## 3. Key Entities & Data Mapping

- **`LabExerciseItem`**:
  - `docxFileName`: Chuỗi tên file tài liệu đề bài (`.docx` đối với 12 lab chuẩn, `.pdf` đối với 3 lab Campus HCM).
  - `docxContentHtml`: Nội dung tóm tắt HTML đã trích xuất sẵn.

---

## 4. Success Criteria

- **`SC-001`**: Lỗi Mammoth ("Can't find end of central directory") biến mất hoàn toàn khi mở bất kỳ bài lab nào của Campus HCM.
- **`SC-002`**: Giao diện hiển thị đúng nhãn `(File PDF Gốc)`, badge `PDF Assignment Document`, và nút `Tải File Đề (.pdf)`.
- **`SC-003`**: Bấm nút tải đề bài tải về chính xác file PDF nguyên gốc.
- **`SC-004`**: 18 sản phẩm LAB211 chuẩn tiếp tục hoạt động với Word `.docx` như trước đây mà không có bất kỳ xung đột nào.
- **`SC-005`**: Typecheck TypeScript (`tsc --noEmit`) đạt 0 lỗi.
