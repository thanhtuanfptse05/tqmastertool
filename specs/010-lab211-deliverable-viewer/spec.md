# Feature Specification: LAB211 Deliverable Viewer & Secure Downloader (Spec 010)

**Feature Branch**: `010-lab211-deliverable-viewer`  
**Status**: Draft (Planning Mode)  
**Version**: 1.0.0  
**Updated**: 2026-03-16  
**Implementation Files**:
- `src/types/index.ts`
- `src/lib/lab-parser.ts`
- `src/lib/lab-data.ts`
- `src/lib/store.tsx`
- `src/app/api/deliverables/lab/view/route.ts`
- `src/app/api/deliverables/lab/download/route.ts`
- `src/app/api/admin/upload/lab-package/route.ts`
- `src/components/store/LabDeliverableModal.tsx`
- `src/components/store/LabDocViewer.tsx`
- `src/components/store/LabCodeViewer.tsx`
- `src/app/customer/vault/page.tsx`
- `src/app/admin/products/page.tsx`

---

## 1. Context & Business Goal

- **Business Context**: Khách hàng mua mã nguồn môn học LAB211 (Java Core & OOP) tại CodeVault Studio cần xem trực tiếp nội dung đề bài (file Word `.docx`), duyệt cây thư mục mã nguồn theo gói package Java MVC, đọc code có highlight cú pháp và tải về từng file hoặc trọn bộ `.zip` với tên file gốc chính xác (ví dụ: `J1.L.P0023 - FRUIT.docx`, `FruitController.java`, `J1.L.P0023 - FRUIT.zip`).
- **Feature Goal**:
  1. **Upload Tự Động**: Admin chỉ cần tải file `.zip` (như file `LAB211.zip` hoặc từng bài lab riêng lẻ), hệ thống tự động giải nén, bóc tách file Word đề bài, cấu trúc package và source code Java, lưu trữ an toàn.
  2. **Trải Nghiệm Sau Mua (Deliverable Vault)**: Hiển thị giao diện "Kết quả sau khi mua" tuyệt đẹp gồm 2 khối chính:
     - Khối trên: Hiển thị nội dung đề bài file Word (`.docx`) được format chuẩn hóa (Yêu cầu, LOC, Slot, Quy tắc, Function details, Test case) kèm nút tải file Word chuẩn tên gốc.
     - Khối dưới: Bộ đọc mã nguồn Java (IDE Viewer) có cây thư mục package MVC, tab chuyển file, line numbers, highlight cú pháp, nút sao chép code và nút tải file Java đơn lẻ hoặc trọn gói ZIP.
  3. **Bảo Mật Tối Đa**:
     - Nghiêm cấm public URL trực tiếp vào private bucket.
     - Chỉ cho phép xem và tải khi `order.status === 'completed'` và khách hàng là chủ sở hữu đơn hàng (hoặc Admin).
     - Ngăn chặn triệt để lỗ hổng Zip Slip, Path Traversal (`../`), và MIME Sniffing.
     - Tải file về với chuẩn RFC 5987 / RFC 6266 (`Content-Disposition: attachment; filename="..."`) đảm bảo 100% đúng tên file gốc kể cả có dấu cách, tiếng Việt hay ký tự gạch ngang.

---

## 2. Actors & Roles

| Actor | Quyền Hạn Trong Feature Này |
|---|---|
| **Khách Hàng (Customer)** | Khi có đơn hàng `completed`, truy cập `/customer/vault` để xem toàn văn đề bài Word, duyệt code Java trực quan và tải file docx/java/zip đúng tên gốc. Bị chặn hoàn toàn nếu đơn chưa duyệt. |
| **Quản Trị Viên (Admin)** | Tải lên file ZIP môn Lab (như `LAB211.zip` hoặc từng bài) tại `/admin/products`. Hệ thống tự động parse và map vào sản phẩm tương ứng. Có toàn quyền xem trước và duyệt đơn. |
| **Khách Vãng Lai (Unauthenticated/Guest)** | Không có quyền truy cập API xem nội dung bài hay tải file deliverable. Trả về mã lỗi HTTP 401 hoặc 403. |

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 — Admin Tải Lên File ZIP LAB211 Tự Động Nhận Diện (Priority: P1)
- **GIVEN** Quản trị viên tại trang quản lý sản phẩm `/admin/products`
- **WHEN** Admin kéo thả hoặc chọn file ZIP chứa đề bài và code (ví dụ `LAB211.zip` hoặc `J1.L.P0023 - FRUIT.zip`)
- **THEN** Hệ thống tự động:
  - Kiểm tra tính an toàn của archive (chống Zip Slip).
  - Tìm kiếm cặp file Word (`.docx`) và thư mục source code (`src/**/*.java`).
  - Bóc tách cấu trúc bài lab, trích xuất text/HTML từ file Word.
  - Lưu trữ an toàn và liên kết dữ liệu bài lab với sản phẩm.
  - Hiển thị thông báo thành công kèm danh sách các bài lab đã nhận diện.

### User Story 2 — Khách Hàng Xem Đề Bài Word Sau Khi Đơn Hàng Được Duyệt (Priority: P1)
- **GIVEN** Khách hàng có đơn hàng LAB211 đã được Admin phê duyệt (`status === 'completed'`)
- **WHEN** Khách hàng vào `/customer/vault` và chọn bài lab (ví dụ: `J1.L.P0023 - FRUIT`)
- **THEN**:
  - Khối tài liệu Word hiển thị tiêu đề, mã bài, số dòng code (LOC), số slot học, nội dung chi tiết đề bài rõ ràng, đẹp mắt.
  - Có nút **"Tải File Đề Bài (.docx)"** -> Trình duyệt tải về đúng file với tên `J1.L.P0023 - FRUIT.docx`.

### User Story 3 — Khách Hàng Khám Phá & Tải Mã Nguồn Java (Priority: P1)
- **GIVEN** Khách hàng đang xem bài lab đã mở khóa
- **WHEN** Khách hàng cuộn xuống khối mã nguồn bên dưới
- **THEN**:
  - Giao diện IDE hiển thị cây thư mục packages (`controller`, `model`, `view`, `Main.java`).
  - Khi click chọn 1 file Java (ví dụ `FruitController.java`), editor bên phải render code với syntax highlighting và line numbers.
  - Có nút **"Sao Chép Code"** để copy nhanh vào clipboard.
  - Có nút **"Tải file này (.java)"** -> Tải đúng file `FruitController.java`.
  - Có nút **"Tải Trọn Gói Source Code (.zip)"** -> Tải đúng file `J1.L.P0023 - FRUIT.zip`.

### User Story 4 — Kiểm Soát Bảo Mật & Chặn Truy Cập Trái Phép (Priority: P1 - Bắt Buộc)
- **GIVEN** Người dùng chưa đăng nhập, hoặc có đơn hàng ở trạng thái `pending_payment`, `pending_approval`, `rejected`
- **WHEN** Cố gắng gọi API `/api/deliverables/lab/view` hoặc `/api/deliverables/lab/download`
- **THEN**:
  - Hệ thống kiểm tra điều kiện sở hữu và trạng thái đơn hàng.
  - Trả về HTTP 403 Forbidden kèm lý do cụ thể ("Đơn hàng chưa thanh toán hoặc chưa được Admin phê duyệt").
  - Tuyệt đối không trả về link storage hay nội dung source code.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL strictly enforce that LAB deliverables are accessible ONLY when an order associated with the user has `status === 'completed'`.
- **FR-002 (Event-Driven)**: WHEN an admin uploads a LAB zip archive, THE system SHALL extract all docx files, parse their structure, extract Java source files, and store the resulting lab package manifest.
- **FR-003 (Event-Driven)**: WHEN an authorized customer requests a file download, THE system SHALL stream the file with HTTP header `Content-Disposition: attachment; filename="${exactName}"; filename*=UTF-8''${encodeURIComponent(exactName)}`.
- **FR-004 (State-Driven)**: WHILE the customer is viewing a LAB deliverable, THE system SHALL display the Word assignment document first, followed by the source code explorer and viewer underneath.
- **FR-005 (Safety)**: THE system SHALL validate all archive entry paths against Directory Traversal (Zip Slip) and reject any entries containing `..` or leading slashes.

---

## 5. Canonical Data Models

```typescript
export interface LabSourceFile {
  path: string;        // "src/fruit/controller/FruitController.java"
  fileName: string;    // "FruitController.java"
  packageName: string; // "fruit.controller"
  language: "java" | "xml" | "properties" | "text";
  content: string;
  size: number;
}

export interface LabExerciseItem {
  id: string;               // "J1.L.P0023"
  code: string;             // "J1.L.P0023"
  title: string;            // "Fruit Shop Management"
  folderName: string;       // "J1.L.P0023 - FRUIT"
  docxFileName: string;     // "J1.L.P0023 - FRUIT.docx"
  docxContentHtml: string;  // Parsed HTML from docx
  docxTextPreview: string;  // Plain text summary
  loc?: number;             // e.g., 175
  slots?: number;           // e.g., 5
  sourceFiles: LabSourceFile[];
  zipFileName: string;      // "J1.L.P0023 - FRUIT.zip"
  zipStoragePath?: string;
  docxStoragePath?: string;
}

export interface LabPackageManifest {
  packageId: string;
  title: string;
  ruleMarkdown?: string;
  labs: LabExerciseItem[];
  totalLabs: number;
  updatedAt: string;
}
```

---

## 6. Security & Defense-in-Depth Specification

1. **Authorization Verification Formula**:
   ```
   CanAccess(userId, labId, orderId) = 
     (isAdmin(userId) OR (OrderExists(orderId) AND Order.user_id == userId AND Order.status == 'completed' AND OrderContainsProduct(orderId, labId)))
   ```
2. **Download Header Defense**:
   - `Content-Disposition: attachment; filename="..."; filename*=UTF-8''...`
   - `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document` (for docx)
   - `Content-Type: text/x-java-source; charset=utf-8` (for java)
   - `Content-Type: application/zip` (for zip)
   - `X-Content-Type-Options: nosniff`
   - `Cache-Control: private, no-cache, no-store, must-revalidate`
3. **Zip Slip Prevention**:
   - Verify `path.normalize(entryName).startsWith(baseDir)` and `!entryName.includes('..')`.

---

## 7. Verification & Acceptance Testing

- [ ] `tsc --noEmit` hoàn thành 0 lỗi.
- [ ] Admin upload file `LAB211.zip` thành công và nhận diện 12 bài lab.
- [ ] Khách hàng chưa mua / chưa duyệt: bị chặn 403 tại API.
- [ ] Khách hàng đã duyệt: xem đề bài Word chuẩn và xem code Java có highlight.
- [ ] Tải file Word đề bài: tên file lưu về đúng định dạng `J1.L.P0023 - FRUIT.docx`.
- [ ] Tải file mã nguồn Java: tên file lưu về đúng `FruitController.java`.
- [ ] Tải trọn bộ ZIP: tên file lưu về đúng `J1.L.P0023 - FRUIT.zip`.
