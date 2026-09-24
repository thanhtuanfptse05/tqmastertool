# Feature Specification: Academic Analysis and FAQs for LAB211 J1.L.P0021 & J1.L.P0022

**Feature Branch**: `030-lab211-14bai-analysis-and-faq`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "2 bài mới thiếu phân tích đề và Câu Hỏi Thường Gặp & Ôn Tập rồi"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Phân tích đề & Hướng dẫn tư duy cho J1.L.P0021 (Priority: P1)

Khi khách hàng hoặc sinh viên mở xem tài nguyên bài lab `J1.L.P0021` (Student Management System) trong modal bàn giao tài nguyên `LabDeliverableModal`, sinh viên có thể xem đầy đủ nội dung tóm tắt đề bài bằng tiếng Việt, hướng dẫn tư duy từng bước (mindset), và các khái niệm OOP áp dụng.

**Why this priority**: Đảm bảo sinh viên mua bài lab có đầy đủ tài liệu học tập, hiểu rõ cấu trúc bài tập và tự tin bảo vệ điểm cao với giảng viên.

**Independent Test**: Mở modal bàn giao, chọn bài `J1.L.P0021`, chuyển sang tab "Phân Tích & Hướng Dẫn" (hoặc xem khu vực phân tích), kiểm tra hiển thị tóm tắt, 6 bước mindset và danh sách khái niệm OOP.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở giao diện xem tài nguyên `J1.L.P0021`, **When** người dùng xem phần "Tư duy giải quyết bài toán", **Then** hệ thống hiển thị đầy đủ các bước tư duy thiết kế Model Student, Controller xử lý nghiệp vụ & validation, View tương tác console.
2. **Given** bài lab `J1.L.P0021` được chọn, **When** hệ thống gọi `getLabAnalysis("J1.L.P0021")`, **Then** trả về đối tượng `LabAnalysis` đầy đủ summary, mindset, oopConcepts, faq mà không bị `undefined`.

---

### User Story 2 - Phân tích đề & Hướng dẫn tư duy cho J1.L.P0022 (Priority: P1)

Khi khách hàng chọn xem bài lab `J1.L.P0022` (Candidate Management System - Experience, Fresher, Intern), sinh viên có thể xem phân tích chi tiết về tính kế thừa, lớp cha trừu tượng `Candidate`, 3 lớp con, tư duy đa hình và bảng câu hỏi ôn tập.

**Why this priority**: J1.L.P0022 là bài Long Assignment cốt lõi về Tính kế thừa & Đa hình trong Java OOP của LAB211, sinh viên thường bị hỏi vấn đáp rất kỹ về constructor kế thừa `super()`, abstract method và ép kiểu.

**Independent Test**: Chọn bài `J1.L.P0022` trong modal, kiểm tra các câu hỏi FAQ hiển thị đầy đủ 3 câu lý thuyết OOP và 2 câu hỏi thực hành áp dụng.

**Acceptance Scenarios**:

1. **Given** người dùng đang xem bài `J1.L.P0022`, **When** nhấn mở từng câu hỏi trong accordion "Câu Hỏi Hay Gặp & Ôn Tập", **Then** nội dung câu trả lời chuẩn xác xuất hiện mượt mà.
2. **Given** gọi `getLabAnalysis("J1.L.P0022")`, **When** kiểm tra `faq` array, **Then** có ít nhất 5 câu hỏi phân loại rõ `theory` và `applied`.

---

### User Story 3 - Bộ câu hỏi ôn tập và vấn đáp cho cả 2 bài lab (Priority: P2)

Mỗi bài lab mới (P0021 và P0022) được trang bị bộ câu hỏi phỏng vấn/vấn đáp thi cử (3 câu Lý thuyết OOP + 2 câu Thực hành code) bám sát form chấm thi giảng viên Đại học FPT.

**Why this priority**: Giúp sinh viên nắm vững bản chất code, không bị động khi giảng viên yêu cầu giải thích code hoặc chỉnh sửa trực tiếp tại chỗ.

**Independent Test**: Duyệt qua danh sách accordion FAQ của P0021 và P0022, kiểm tra câu hỏi lý thuyết và câu hỏi thực hành hiển thị đúng badge màu và nội dung chi tiết.

**Acceptance Scenarios**:

1. **Given** sinh viên ôn tập bài P0021, **When** xem FAQ lý thuyết, **Then** có câu hỏi giải thích về cấu trúc MVC, thuật toán sắp xếp `Collections.sort` với `Comparator`, và cách gom nhóm report Name + Course.
2. **Given** sinh viên ôn tập bài P0022, **When** xem FAQ thực hành, **Then** có câu hỏi hướng dẫn thêm loại ứng viên mới (ví dụ: `PartTimeCandidate`) hoặc lọc theo năm sinh.

---

### Edge Cases

- Truy vấn mã code với chữ thường `j1.l.p0021` hoặc khoảng trắng: Hàm `getLabAnalysis` chuẩn hóa tự động và trả về đúng đối tượng phân tích.
- Khi người dùng chuyển đổi qua lại giữa 14 bài lab: Modal không bị lỗi layout hoặc giật lag.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST bổ sung mục `J1.L.P0021` vào `LAB_ANALYSIS_MAP` trong `src/lib/lab-analysis.ts` với đầy đủ: `labCode`, `summary`, `mindset` (tối thiểu 5 bước), `oopConcepts` (tối thiểu 4 khái niệm), `faq` (tối thiểu 5 câu hỏi gồm 3 lý thuyết + 2 thực hành).
- **FR-002**: Hệ thống MUST bổ sung mục `J1.L.P0022` vào `LAB_ANALYSIS_MAP` trong `src/lib/lab-analysis.ts` với đầy đủ: `labCode`, `summary`, `mindset` (tối thiểu 5 bước), `oopConcepts` (tối thiểu 4 khái niệm), `faq` (tối thiểu 5 câu hỏi gồm 3 lý thuyết + 2 thực hành).
- **FR-003**: Hàm `getLabAnalysis("J1.L.P0021")` và `getLabAnalysis("J1.L.P0022")` MUST trả về dữ liệu hợp lệ, không trả về `undefined`.
- **FR-004**: Giao diện `LabDeliverableModal` MUST hiển thị hoàn chỉnh phân tích đề, mindset steps và danh sách câu hỏi FAQ khi người dùng chọn tab bài `J1.L.P0021` hoặc `J1.L.P0022`.

## Key Entities & Data Models

- **`LabAnalysis`**:
  - `labCode`: string
  - `summary`: string
  - `mindset`: string[]
  - `oopConcepts`: string[]
  - `faq`: LabFaqItem[]
- **`LabFaqItem`**:
  - `question`: string
  - `answer`: string
  - `type`: "theory" | "applied"

## Success Criteria *(mandatory)*

- **SC-001**: 100% bài lab trong gói standard (14 bài từ P0021 đến P0074) đều có dữ liệu phân tích học thuật trong `LAB_ANALYSIS_MAP`.
- **SC-002**: Không có bất kỳ lỗi biên dịch TypeScript (`tsc --noEmit`) nào.
- **SC-003**: Trải nghiệm giao diện đồng nhất: hiển thị đầy đủ Mindset Steps với checklist icon và FAQ Accordion tương tác mượt mà.
