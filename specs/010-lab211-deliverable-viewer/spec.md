# Feature Specification: LAB211 Deliverable Viewer & Secure Downloader (Spec 010)

**Feature Branch**: `010-lab211-deliverable-viewer`  
**Status**: Implemented (Production)  
**Version**: 2.1.0  
**Updated**: 2026-09-17  
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

### User Story 5 — Hiển Thị Mô Tả Chi Tiết Giàu Định Dạng (Rich Markdown Parser) (Priority: P1)
- **GIVEN** Khách hàng xem chi tiết sản phẩm LAB211 trong `ProductDetailModal`
- **WHEN** Modal hiển thị `detailed_description` chứa cú pháp markdown (`###`, `**`, `-`, `1.`, `---`)
- **THEN**:
  - Hệ thống parse và render thành giao diện trực quan cao cấp, không hiển thị text thô hay ký tự markdown.
  - Các mục `###` được render thành header badges và section headers có icon.
  - Các dòng số thứ tự 12 bài lab được hiển thị dạng thẻ danh sách có mã bài (`J1.L.P0023`), tiêu đề, và ghi chú rõ ràng.
  - Các gạch đầu dòng đặc điểm chấm điểm được render dạng bullet list có highlight.
  - Phần "Tặng kèm đặc quyền" được đóng khung nổi bật dạng quà tặng (Gift Card VIP) có link dẫn đến web lý thuyết OOP.

### User Story 6 — Tặng Kèm Full Web Lý Thuyết Nền Tảng OOP (Priority: P1)
- **GIVEN** Sản phẩm LAB211 của 18 Giảng viên
- **WHEN** Khách hàng xem sản phẩm trước mua hoặc truy cập Vault sau mua
- **THEN**:
  - Toàn bộ phần quà tặng được chuẩn hóa thành: **Full Website Lý thuyết Nền tảng OOP (PRO192 & LAB211)**: `https://thanhtuanfptse05.github.io/PRO192-21392-theory/`.
  - Trong Deliverable Vault và chi tiết sản phẩm, xuất hiện nút truy cập trực tiếp "Mở Web Lý Thuyết OOP".

### User Story 7 — Đầu Ra Rõ Ràng Của Mỗi Sản Phẩm LAB211 (Deliverable Outputs) (Priority: P1)
- **GIVEN** Khách hàng mở modal chi tiết sản phẩm hoặc xem trong Vault
- **WHEN** Khách hàng kiểm tra "Đầu ra sản phẩm" (Outputs)
- **THEN** Hệ thống liệt kê chi tiết 4 thành phần đầu ra hoàn chỉnh:
  1. **Tài liệu Đề bài Word (.docx)**: Đề bài gốc 12 bài có quy định LOC, test cases.
  2. **Trọn bộ Mã nguồn MVC Java (.java & .zip)**: 100% chuẩn JDK 8 / NetBeans 17, clean code.
  3. **Console Run Output Thực Tế**: Bản ghi kết quả chạy mẫu, menu, validation đầu ra.
  4. **Tài liệu Lý Thuyết OOP Nền Tảng**: Link web lý thuyết OOP ôn tập vấn đáp.

### User Story 8 — Trải Nghiệm Demo Chân Thực Không Lộ Mã Nguồn (Priority: P1)
- **GIVEN** Khách hàng bấm sang tab "Demo & Chạy Thử" trên Modal chi tiết sản phẩm
- **WHEN** Khách hàng muốn xem sản phẩm hoạt động như thế nào trước khi mua
- **THEN**:
  - Không để lộ code logic/thuật toán Java nhằm bảo vệ bản quyền.
  - Hiển thị giao diện mô phỏng **Terminal Console NetBeans IDE 17** cực kỳ chân thực:
    - Có header NetBeans/Console với các nút Run, Stop, Clear, Build Success `JDK 1.8`.
    - Cho phép chọn xem các bài lab tiêu biểu (`J1.L.P0023 - Fruit Shop`, `J1.S.P0070 - TPBank Captcha`, `J1.S.P0074 - Matrix Calculation`, `J1.S.P0056 - Worker Management`).
    - Hiển thị kịch bản chạy mẫu thực tế từng bước: Menu, nhập dữ liệu, validation khi nhập sai, bảng tính toán kết quả format đẹp mắt.
    - Có chế độ tương tác giả lập các lệnh menu để người dùng bấm thử và thấy phản hồi console ngay lập tức.

### User Story 9 — Giao Diện Fluid Full-Width & Trình Bày Đề Bài Word Thoáng Đẹp (Priority: P1)
- **GIVEN** Khách hàng hoặc Admin mở modal Deliverable Vault (`LabDeliverableModal`)
- **WHEN** Người dùng xem đề bài trên các kích cỡ màn hình khác nhau (Laptop, Full HD, 2K, 4K)
- **THEN**:
  - Giao diện modal mở rộng dạng **fluid full-width** (`w-full max-w-[99vw]`), tận dụng tối đa không gian màn hình mà không bị gò bó bởi giới hạn pixel cứng (loại bỏ `max-w-[1400px]`).
  - Khối hiển thị đề bài Word (`LabDocViewer`) có chiều cao rộng rãi, thoáng mắt (`min-h-[550px] max-h-[780px]` hoặc `h-[75vh]`) kèm nút chuyển đổi thu gọn / mở rộng toàn phần.
  - Bố cục đề bài Word được làm đẹp chuyên nghiệp chuẩn văn bản bài thi:
    - Loại bỏ các dòng text rác trùng lặp từ quá trình extract (như các dòng lặp lại code bài, LOC, slot ngay dưới bảng tóm tắt).
    - Giữ nguyên 100% nội dung gốc của đề bài.
    - Phân khu rõ ràng: Bảng thông tin đề thi, Background Context, Program Specifications, Function details, Expectation of UI, Guidelines / Test Cases.
    - Khối màn hình mẫu / console / menu / test case được định dạng tông màu sáng trang nhã đồng bộ với nền giấy Word (nền slate-50/100 sáng dịu, viền border-slate-200/border-indigo-100, chữ đậm nét font monospace dễ đọc), tuyệt đối không dùng nền đen chữ xanh gây chói và đứt gãy thị giác trên nền tài liệu trắng.

---

## 4. Functional Requirements (EARS)

- **FR-001 (Ubiquitous)**: THE system SHALL strictly enforce that LAB deliverables are accessible ONLY when an order associated with the user has `status === 'completed'`.
- **FR-002 (Event-Driven)**: WHEN an admin uploads a LAB zip archive, THE system SHALL extract all docx files, parse their structure, extract Java source files, and store the resulting lab package manifest.
- **FR-003 (Event-Driven)**: WHEN an authorized customer requests a file download, THE system SHALL stream the file with HTTP header `Content-Disposition: attachment; filename="${exactName}"; filename*=UTF-8''${encodeURIComponent(exactName)}`.
- **FR-004 (State-Driven)**: WHILE the customer is viewing a LAB deliverable, THE system SHALL display the Word assignment document first, followed by the source code explorer and viewer underneath, accompanied by the OOP Theory website link banner.
- **FR-005 (Safety)**: THE system SHALL validate all archive entry paths against Directory Traversal (Zip Slip) and reject any entries containing `..` or leading slashes.
- **FR-006 (Rich Formatting)**: THE system SHALL parse product markdown descriptions into structured UI components including headers, list items, badges, and gift cards.
- **FR-007 (Demo Simulation & IP Protection)**: THE system SHALL provide an interactive NetBeans 17 console run simulator in the product demo tab WITHOUT exposing internal Java code implementations.
- **FR-008 (Fluid Layout)**: THE system SHALL render the deliverable modal in a 100% fluid maximum width layout (`max-w-[99vw]`) adapting seamlessly across desktop and ultra-wide viewports.
- **FR-009 (Enhanced Word Typography & Light Harmonious Highlight Styling)**: THE system SHALL render Word document assignments with generous vertical view height (750-800px / 75vh), clean typography with distinctive section accent cards, polished responsive tables, and elegant light-themed highlight blocks (soft slate/indigo background with crisp dark text and left accent border, avoiding dark black/green terminal contrast on white paper), while maintaining 100% original text fidelity.
- **FR-010 (Full Lab List Selector)**: THE lab selector bar SHALL display ALL available labs (not limited to 8), scrollable horizontally with smooth scrollbar, so users can see and access every lab exercise without truncation.
- **FR-011 (Default Expanded View)**: THE deliverable viewer SHALL default to an expanded/spacious reading view with the Word document rendered at generous height and full width. Users may toggle between compact and expanded modes.
- **FR-012 (Lab Explanation & Coding Mindset Section)**: BETWEEN the Word assignment viewer and the Java source code viewer, THE system SHALL display a dedicated "Phân Tích Đề & Hướng Dẫn Tư Duy" panel providing: (1) a brief plain-Vietnamese summary of what the lab requires, (2) step-by-step coding mindset guidance (how to approach and structure the solution), and (3) key OOP concepts applied in the lab.
- **FR-013 (FAQ Section)**: BELOW the source code viewer, THE system SHALL display a "Câu Hỏi Thường Gặp & Ôn Tập" panel containing: 3 theory questions about OOP/Java concepts relevant to the lab, 2 applied questions about extending or modifying the program features (testing adaptability), all displayed in an expandable/collapsible accordion format.
- **FR-014 (Standardized LAB211 Package Download Filename)**: WHEN downloading the full/all lab deliverable archive from the API endpoint `/api/deliverables/lab/download?labId=all&type=zip` or clicking download in the Deliverable Vault or modal, THE download filename header and browser anchor attribute SHALL strictly be `LAB211.zip`.

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

---

## 8. Catalog Definition: Danh Sách Sản Phẩm LAB211 Theo Giảng Viên (18 Thầy/Cô)

- Đơn giá đồng bộ: **80,000 VNĐ** (Giá gốc: 200,000 VNĐ - Giảm giá đặc biệt cho sinh viên FPT).
- File deliverable dùng chung: `LAB211.zip` (đầy đủ 12 bài lab + Word docx + code MVC Java 8 + test case 10/10).
- Tên chuẩn hóa: `SOURCE CODE LAB211 GIẢNG VIÊN [MÃ_GIẢNG_VIÊN_IN_HOA]`.

Danh sách 18 giảng viên:
1. `SOURCE CODE LAB211 GIẢNG VIÊN HIENNM23`
2. `SOURCE CODE LAB211 GIẢNG VIÊN TAMNT`
3. `SOURCE CODE LAB211 GIẢNG VIÊN ANHLT`
4. `SOURCE CODE LAB211 GIẢNG VIÊN HUYNM`
5. `SOURCE CODE LAB211 GIẢNG VIÊN VANTTN`
6. `SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM`
7. `SOURCE CODE LAB211 GIẢNG VIÊN THANHDT`
8. `SOURCE CODE LAB211 GIẢNG VIÊN THANGPD`
9. `SOURCE CODE LAB211 GIẢNG VIÊN TRUNGNT`
10. `SOURCE CODE LAB211 GIẢNG VIÊN DONGLM`
11. `SOURCE CODE LAB211 GIẢNG VIÊN TUANVM`
12. `SOURCE CODE LAB211 GIẢNG VIÊN YNT4`
13. `SOURCE CODE LAB211 GIẢNG VIÊN ANNV22`
14. `SOURCE CODE LAB211 GIẢNG VIÊN TRITD`
15. `SOURCE CODE LAB211 GIẢNG VIÊN NUINX`
16. `SOURCE CODE LAB211 GIẢNG VIÊN DIEUNT`
17. `SOURCE CODE LAB211 GIẢNG VIÊN HANHNT84`
18. `SOURCE CODE LAB211 GIẢNG VIÊN NANGNTH`

---

## 9. Implementation Notes (v2.1 — 2026-09-17)

### 9.1 Vault Page (`/customer/vault`) — Đã Triển Khai
- **Thiết kế**: Card ngang gọn — icon danh mục, tên sản phẩm đúng từ DB, badge xác nhận, 2 nút: **Xem Ngay** (mở LabDeliverableModal) + **Tải .ZIP** (authenticated fetch).
- **Reactive state**: Dùng `React.useMemo([currentUser, orders, products])` thay vì closure từ store, đảm bảo re-render đúng khi orders thay đổi.
- **Filter orders**: `o.user_id === currentUser.id || o.user_email === currentUser.email` — khớp với logic trang Đơn Hàng.

### 9.2 Order Items Fetch — 3-Tier Fallback
Supabase join RLS có thể block `order_items (*)` trong nested select. `fetchOrdersFromDB` dùng 3 tầng:
1. **Tier 1**: Supabase join `select('*, order_items (*)')` 
2. **Tier 2**: Standalone client `select('*').from('order_items').in('order_id', [...])`
3. **Tier 3**: Server-side `GET /api/orders?orderIds=...` dùng `supabaseAdmin` (Service Role) — bypass hoàn toàn RLS, trả về items kèm `product_title` đúng.

### 9.3 Authenticated Download
- **Vấn đề cũ**: `<a href="/api/deliverables/...">` không gửi Authorization header → API trả 403.
- **Fix**: `handleAuthDownload()` dùng `fetch()` + `Bearer <supabase_session_token>` → nhận Blob → tạo object URL → trigger download.
- Download button hiển thị trạng thái "Đang tải..." khi đang fetch.

### 9.4 Giá Sản Phẩm
- LAB211: **90,000đ** (cập nhật 2026-09-17, trước đó 80,000đ)

### 9.5 API Endpoints Liên Quan
| Method | Endpoint | Mô Tả |
|--------|----------|--------|
| `GET` | `/api/orders?orderIds=id1,id2` | Lấy orders + items dùng admin client (bypass RLS) |
| `GET` | `/api/deliverables/lab/download` | Tải file docx/zip/java có xác thực |
| `GET` | `/api/deliverables/lab/view` | Xem nội dung bài lab (JSON) |
