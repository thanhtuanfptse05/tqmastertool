# Feature Specification: Tool edX IOT102 (FPTU Bonus) — Product Data & Deliverables Vault Integration (Spec 012)

**Feature**: `012-tool-edx-iot102-data-and-deliverables`  
**Status**: In Progress  
**Version**: 1.0.0  
**Created**: 2026-09-17  
**Associated Documents**:
- `specs/002-product-catalog/spec.md`
- `specs/003-product-detail-demo/spec.md`
- `specs/007-customer-deliverable-vault/spec.md`
- `.sdd/shared_context.md`

---

## 1. Context & Business Goal

- **Bối cảnh sản phẩm**: Môn học IOT102 (Internet of Things) tại Đại học FPT yêu cầu sinh viên hoàn thành các học phần, xem video bài giảng, đọc tài liệu và làm quiz trên nền tảng edX để nhận điểm thưởng/bonus môn học. Quá trình này thường tốn hàng chục giờ đồng hồ học chay thủ công.
- **Sản phẩm**: **TOOL TỰ ĐỘNG EDX IOT102 – 1 CLICK LẤY FULL BONUS FPTU**.
  - Tự động học bài, tua video an toàn và hoàn thành modules trên edX.
  - Tác giả & Kênh hướng dẫn: **Tuấn và Quân FPT UNIVERSITY**.
- **Tài nguyên bàn giao khi khách mua (Deliverables Output Matrix)**:
  1. **Google Drive Folder**: `https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing` (Chứa tool, script, tài liệu cấu hình, file cài đặt)
  2. **Video Hướng Dẫn Chi Tiết**: `https://youtu.be/OxmUL2i8BX4?si=VKICEGOE39cqulVt`
  3. **Hướng Dẫn Cài Đặt & Vận Hành**: Quy trình 5 bước cài đặt extension/Tampermonkey, nạp script, chạy tool và kiểm tra điểm bonus trên edX.
- **Mục tiêu**:
  - Đưa sản phẩm lên web live ngay lập tức trong bảng `products` & `product_demos` của Supabase.
  - Tối ưu hóa giao diện hiển thị cho danh mục `tool` trên Catalog và Chi tiết sản phẩm (không bị lẫn nội dung lý thuyết OOP Java của LAB211).
  - Khách hàng sau khi đặt mua và hoàn tất thanh toán sẽ nhận được chính xác các nút: **Mở Google Drive**, **Xem Video Hướng Dẫn**, và **Đọc tài liệu cài đặt** ngay trong Kho Lưu Trữ (Deliverables Vault).

---

## 2. Product Schema & Metadata

### Bảng `public.products`
- `id`: UUID (sinh tự động hoặc cố định `e0a102ed-ed01-4b02-9a03-ed0000010200`)
- `category`: `'tool'`
- `title`: `'TOOL TỰ ĐỘNG EDX IOT102 – 1 CLICK LẤY FULL BONUS FPTU'`
- `slug`: `'tool-tu-dong-edx-iot102-fptu-bonus'`
- `price`: `99000` (99.000 VNĐ)
- `original_price`: `199000` (199.000 VNĐ - Giảm 50%)
- `thumbnail_url`: `'https://i.ytimg.com/vi/OxmUL2i8BX4/maxresdefault.jpg'`
- `status`: `'published'`
- `deliverable_type`: `'download_file'`
- `storage_file_path`: `NULL`
- `git_repo_url`: `'https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing'`
- `access_instructions`: 
  ```markdown
  ### 🚀 Hướng Dẫn Kích Hoạt & Cài Đặt Tool edX IOT102:
  1. **Bước 1**: Nhấn nút **"Mở Thư Mục Google Drive"** bên trên để tải bộ mã nguồn / script tool về máy tính.
  2. **Bước 2**: Nhấn nút **"Xem Video Hướng Dẫn"** (kênh Tuấn và Quân FPT) để theo dõi các thao tác trực quan từng bước.
  3. **Bước 3**: Cài tiện ích **Tampermonkey** hoặc nạp extension vào trình duyệt Chrome/Edge/Cốc Cốc, sau đó import script tool vào.
  4. **Bước 4**: Đăng nhập tài khoản edX của bạn, mở khóa học IOT102 và nhấn nút kích hoạt trên giao diện tool.
  5. **Bước 5**: Kiểm tra thanh tiến độ (Progress) trên edX để đảm bảo nhận đầy đủ điểm bonus môn IOT102.
  ```

### Bảng `public.product_demos`
- `gallery_images`: `["https://i.ytimg.com/vi/OxmUL2i8BX4/maxresdefault.jpg", "https://i.ytimg.com/vi/OxmUL2i8BX4/hqdefault.jpg"]`
- `live_demo_url`: `'https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing'`
- `video_demo_url`: `'https://youtu.be/OxmUL2i8BX4?si=VKICEGOE39cqulVt'`
- `features_list`:
  - "Tự động xem toàn bộ video bài giảng edX không cần canh giờ"
  - "Tự động chuyển bài & đánh dấu hoàn thành (Green Checkmark)"
  - "Hỗ trợ vượt qua các checkpoint reading & quiz module IOT102"
  - "1 Click lấy trọn vẹn điểm Bonus môn IOT102 Đại học FPT"
  - "An toàn tuyệt đối, cơ chế delay thông minh mô phỏng thao tác người dùng"
  - "Kèm video hướng dẫn cài đặt & vận hành chi tiết từ A-Z"
- `tech_stack_tags`: `["edX Automation", "IOT102", "FPT University", "JavaScript", "Tampermonkey / Extension", "Auto Bot"]`
- `code_preview_snippet`:
  ```javascript
  // [CodeVault Studio] edX IOT102 Automated Bonus Bot Runner
  const bot = new EdxAutoWorker({
    courseId: "course-v1:FPTU+IOT102x+2026",
    autoPlayVideo: true,
    smartDelayMs: 1500,
    bypassCheckpoints: true,
    targetBonusScore: 100
  });
  console.log("🚀 Bắt đầu chuỗi tự động hóa edX IOT102...");
  await bot.runScheduleSync();
  ```

---

## 3. UI/UX Flow & Deliverables Vault Integration

1. **Trang Chủ / Catalog**:
   - Khi chọn tab filter **"Tiện Ích Tool"**, sản phẩm xuất hiện với ảnh thumbnail sắc nét, badge "Tool", tag công nghệ tím/emerald.
   - Nhấn vào card mở `ProductDetailModal` hiển thị tab Tổng Quan, Video Review YouTube, và Code Snippet.
2. **Quy Trình Mua (Checkout)**:
   - Khách bấm **"Mua Ngay"** -> Tạo mã đơn hàng VietQR Napas 24/7.
   - Quét mã chuyển 99.000đ -> SePay / Admin xác nhận đơn hàng `completed`.
3. **Kho Tài Nguyên (Deliverables Vault)**:
   - Khách hàng vào `/customer/vault`:
   - Gói sản phẩm "TOOL TỰ ĐỘNG EDX IOT102" hiển thị nút:
     - 🌟 **"Mở Google Drive Tải Tool"** (link trực tiếp folder).
     - 📺 **"Xem Video Hướng Dẫn"** (mở video YouTube hoặc modal video).
     - 📖 **"Hướng Dẫn Cài Đặt"** (mở drawer/modal đọc chi tiết hướng dẫn).
4. **Chi Tiết Đơn Hàng (`OrderDetailModal`)**:
   - Nút hoàn tất chuyển đổi linh hoạt: Với Tool hiển thị **"Mở Kho Tool & Hướng Dẫn"**.

---

## 4. Acceptance Criteria
- [ ] Record sản phẩm và demo được chèn thành công vào Supabase database production.
- [ ] Catalog hiển thị sản phẩm khi filter danh mục "Tool" và "Tất Cả".
- [ ] Modal chi tiết hiển thị chuẩn Markdown, không xuất hiện nội dung lạc quẻ về OOP Java của LAB211.
- [ ] Trong Deliverables Vault (`/customer/vault`), khi có đơn hàng đã hoàn tất cho Tool, hiển thị link Google Drive và video YouTube hoạt động tốt.
- [ ] Typecheck `tsc --noEmit` pass 100%.
- [ ] Git commit và push lên repository.
