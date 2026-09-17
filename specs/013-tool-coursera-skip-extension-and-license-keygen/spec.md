# Feature Specification: Tool Coursera Auto Skip & AI Quiz Solver — Product Data, Deliverables Vault & Automated License Keygen (Spec 013)

**Feature**: `013-tool-coursera-skip-extension-and-license-keygen`  
**Status**: Draft / In Planning  
**Version**: 1.0.0  
**Created**: 2026-09-18  
**Associated Documents**:
- `specs/002-product-catalog/spec.md`
- `specs/003-product-detail-demo/spec.md`
- `specs/004-order-checkout-vietqr/spec.md`
- `specs/006-admin-order-management/spec.md`
- `specs/007-customer-deliverable-vault/spec.md`
- `specs/011-order-management-and-sepay-automation/spec.md`
- `.sdd/shared_context.md`

---

## 1. Context & Business Goals

- **Bối cảnh sản phẩm**: Các khóa học trên nền tảng **Coursera** có số lượng video bài giảng, bài đọc (readings), bài thảo luận (discussions) và bài trắc nghiệm (quizzes) rất lớn. Sinh viên và người đi làm thường mất hàng chục đến hàng trăm giờ để học chay thủ công.
- **Sản phẩm**: **TOOL TỰ ĐỘNG COURSERA – AUTO SKIP VIDEO, READING & AI QUIZ SOLVER**.
  - Tiện ích mở rộng (Chrome Extension Manifest V3) tự động hoàn thành khóa học: tự động xem video, đánh dấu bài đọc, gửi thảo luận và tích hợp AI Gemini giải bài tập trắc nghiệm/Quiz.
  - Tác giả & Kênh hướng dẫn: **Tuấn và Quân FPT UNIVERSITY**.
- **Đầu ra bàn giao (Deliverables Output Matrix)**:
  1. **Google Drive Folder**: `https://drive.google.com/drive/folders/1NvEfBQGKhjjUD8-bbddFS_U9qJu_3N7M?usp=drive_link` (Bộ cài đặt Extension, mã nguồn và tài liệu).
  2. **Video Hướng Dẫn Sử Dụng**: `https://youtu.be/qld1bT_U8AQ?si=NjOoWFUhGmwrwc9U` (Kênh Tuấn và Quân FPT UNIVERSITY).
  3. **License Key Bản Quyền VIP (BẮT BUỘC)**: Để sử dụng tool trên coursera.org, extension yêu cầu License Key hợp lệ khớp chính xác với email tài khoản Coursera của người dùng.
- **Yêu cầu cốt lõi**:
  - Khách hàng bắt buộc phải nhập hoặc xác nhận Email tài khoản Coursera trước hoặc trong quá trình đặt hàng (Checkout).
  - Khi đơn hàng hoàn tất (Admin duyệt thủ công qua Admin Portal HOẶC SePay Webhook tự động duyệt khi nhận đủ tiền), hệ thống **TỰ ĐỘNG SINH LICENSE KEY** theo đúng thuật toán mã hóa SHA-256 từ `Coursera_Skip_Extension_full/admin_keygen.html`.
  - Khách hàng truy cập **Kho Tài Nguyên Số** (`/customer/vault`) hoặc chi tiết đơn hàng (`OrderDetailModal`) để nhận ngay License Key (1-click copy), mở Google Drive tải tool, xem video YouTube hướng dẫn và đọc các bước kích hoạt.
  - **RÀO CHẮN NGHIÊM NGẶT**: Tuyệt đối không sửa đổi bất kỳ file nào trong thư mục `Coursera_Skip_Extension_full`.

---

## 2. Product Schema & Metadata

### Bảng `public.products`
- `id`: `'c0015e1a-c001-4c02-9a03-c00000010200'` (UUID)
- `category`: `'tool'`
- `title`: `'TOOL TỰ ĐỘNG COURSERA – AUTO SKIP VIDEO, READING & AI QUIZ SOLVER'`
- `slug`: `'tool-tu-dong-coursera-auto-skip-quiz'`
- `short_description`: `'Bộ tiện ích mở rộng (Chrome Extension) tự động hoàn thành khóa học Coursera: tự động xem video, đánh dấu bài đọc, thảo luận và giải Quiz tự động bằng AI Gemini. Cấp License Key VIP vĩnh viễn theo email.'`
- `price`: `149000` (149.000 VNĐ)
- `original_price`: `299000` (299.000 VNĐ - Giảm 50%)
- `thumbnail_url`: `'https://i.ytimg.com/vi/qld1bT_U8AQ/maxresdefault.jpg'`
- `status`: `'published'`
- `deliverable_type`: `'license_key'`
- `git_repo_url`: `'https://drive.google.com/drive/folders/1NvEfBQGKhjjUD8-bbddFS_U9qJu_3N7M?usp=drive_link'`
- `access_instructions`: 
  ```markdown
  ### 🚀 Hướng Dẫn Kích Hoạt & Cài Đặt Tool Coursera Auto Skip:
  1. **Bước 1 — Tải Extension**: Nhấn nút **"Mở Thư Mục Google Drive"** bên trên để tải thư mục extension về máy tính và giải nén.
  2. **Bước 2 — Cài Đặt Vào Trình Duyệt**:
     - Mở trình duyệt (Chrome, Edge, Brave, Cốc Cốc) và truy cập đường dẫn: `chrome://extensions/`.
     - Bật chế độ nhà phát triển (**Developer mode**) ở góc phải trên.
     - Nhấn nút **"Tải tiện ích đã giải nén" (Load unpacked)** và chọn thư mục tool vừa tải về.
  3. **Bước 3 — Xem Video Hướng Dẫn**: Mở video hướng dẫn YouTube của kênh **Tuấn và Quân FPT UNIVERSITY** đính kèm để xem chi tiết các bước.
  4. **Bước 4 — Nhập License Key**:
     - Bấm vào biểu tượng tiện ích Coursera Auto Skipper trên thanh công cụ trình duyệt.
     - Dán mã **License Key** đã được cấp bên trên vào ô License Key. (Lưu ý: Key chỉ có hiệu lực với đúng email Coursera đã đăng ký).
     - *(Tùy chọn)* Nhập Gemini API Key miễn phí từ Google AI Studio nếu muốn dùng tính năng AI tự động giải Quiz.
  5. **Bước 5 — Tận Hưởng**: Mở trang khóa học trên Coursera, bấm **"Bắt Đầu Tự Động Hóa"** và thư giãn.
  ```

### Bảng `public.product_demos`
- `product_id`: `'c0015e1a-c001-4c02-9a03-c00000010200'`
- `gallery_images`: `["https://i.ytimg.com/vi/qld1bT_U8AQ/maxresdefault.jpg", "https://i.ytimg.com/vi/qld1bT_U8AQ/hqdefault.jpg"]`
- `live_demo_url`: `'https://drive.google.com/drive/folders/1NvEfBQGKhjjUD8-bbddFS_U9qJu_3N7M?usp=drive_link'`
- `video_demo_url`: `'https://youtu.be/qld1bT_U8AQ?si=NjOoWFUhGmwrwc9U'`
- `demo_credentials`: `'Kênh hướng dẫn chính chủ: Tuấn và Quân FPT UNIVERSITY'`
- `features_list`:
  - "Auto Skip Video & Mark Completed mọi bài giảng trên Coursera siêu tốc"
  - "Auto Reading & Auto Next Module tự động tích xanh 100% tiến độ"
  - "Tự động hoàn thành Discussion Forums (diễn đàn thảo luận)"
  - "Tích hợp AI Gemini thông minh tự động giải bài tập trắc nghiệm / Quiz chuẩn xác"
  - "Cấp License Key VIP Vĩnh Viễn gắn liền với Email tài khoản Coursera"
  - "Cơ chế chống phát hiện an toàn, tương thích mọi trình duyệt Chromium"
- `tech_stack_tags`: `["Coursera Automation", "Chrome Extension", "Manifest V3", "Gemini AI", "Auto Quiz", "JavaScript"]`
- `code_preview_snippet`:
  ```javascript
  // [CodeVault Studio] Coursera VIP Auto Skipper & AI Solver
  // Tác giả: Tuấn và Quân FPT UNIVERSITY
  const courseraEngine = new CourseraSkipper({
    licenseKey: "CSR-PERM-0000-XXXX-XXXX-XXXX-XXXX",
    geminiApiKey: "AIzaSyD-YOUR-GEMINI-API-KEY",
    autoSkipVideo: true,
    autoMarkReadings: true,
    solveQuizWithAI: true,
    onProgress: (item) => console.log(`[Coursera VIP] Hoàn tất: ${item.name} ✅`)
  });

  await courseraEngine.runFullAutoBypass();
  ```

---

## 3. Thuật Toán Sinh License Key (License Keygen Algorithm)

Thuật toán sinh License Key dựa trên chuẩn mã hóa của `admin_keygen.html` và cơ chế xác thực của `content.js`:

```typescript
import crypto from "crypto";

const SECRET_SALT = "Coursera_Skip_VIP_2024_@XyZ_Secret_Key_999";

/**
 * Sinh License Key chuẩn Coursera Auto Skipper
 * @param email Email tài khoản Coursera của khách
 * @param duration "perm" (vĩnh viễn) hoặc số ngày/giờ
 */
export function generateCourseraLicenseKey(
  email: string,
  duration: "perm" | number = "perm"
): string {
  const cleanEmail = email.trim().toLowerCase();
  let expStr = "PERM0000";

  if (duration !== "perm" && typeof duration === "number" && duration > 0) {
    const addMs = duration * 24 * 60 * 60 * 1000;
    const expDate = new Date(Date.now() + addMs);
    expStr = Math.floor(expDate.getTime() / 1000).toString(36).toUpperCase().padStart(8, "0");
  }

  // SHA256 (cleanEmail + expStr + SECRET_SALT)
  const hash = crypto
    .createHash("sha256")
    .update(cleanEmail + expStr + SECRET_SALT)
    .digest("hex");

  const rawKeyPart = hash.substring(0, 16).toUpperCase();
  const keyPart = rawKeyPart.match(/.{1,4}/g)?.join("-") || rawKeyPart;
  const expFormatted = expStr.match(/.{1,4}/g)?.join("-") || expStr;

  return `CSR-${expFormatted}-${keyPart}`;
}
```

### Cơ chế xác thực tại `content.js`:
- Phần đầu: `CSR`
- Độ dài: 7 parts cách nhau bằng dấu `-` (ví dụ: `CSR-PERM-0000-A1B2-C3D4-E5F6-7890`)
- `expFormatted = parts[1] + parts[2]` => `"PERM0000"` (không giới hạn thời gian)
- `hashPart = parts.slice(3).join('-')` => `"A1B2-C3D4-E5F6-7890"`
- `expectedHash = sha256(email.toLowerCase() + "PERM0000" + SECRET_SALT)`
- `expectedHash.substring(0, 16).toUpperCase()` khớp với `hashPart` => **License Hợp Lệ!**

---

## 4. End-to-End User Flow & Integration Points

### 4.1. Bắt Buộc Nhập Email Tài Khoản Coursera Khi Mua Hàng
1. Trong Modal Checkout (`CheckoutModal.tsx`), khi sản phẩm đặt mua có `deliverable_type === 'license_key'` hoặc category là `'tool'`:
   - Hiển thị input bắt buộc: **"Email đăng nhập Coursera để kích hoạt bản quyền"**.
   - Tự động điền email của `currentUser` nếu đã đăng nhập, cho phép sửa đổi nếu tài khoản Coursera dùng email khác.
   - Hiển thị thông báo hướng dẫn: *"Tool sẽ được mã hóa theo email này. Vui lòng nhập chính xác email bạn dùng trên Coursera."*
   - Validate định dạng email trước khi cho phép xác nhận đặt hàng.
   - Lưu trữ email này vào `order.user_email` (hoặc `customer_license_email`).

### 4.2. Tự Động Sinh Key Khi Đơn Hàng Hoàn Thành (`status === 'completed'`)
1. **Luồng SePay Tự Động (`/api/webhooks/sepay`)**:
   - Khi giao dịch khớp mã memo và nhận đủ tiền, webhook cập nhật `status: 'completed'`.
   - Webhook kiểm tra nếu đơn hàng chứa sản phẩm Coursera Tool (`deliverable_type === 'license_key'`), tự động gọi `generateCourseraLicenseKey(order.user_email)` và lưu vào trường `license_key` (và ghi chú `admin_notes`).
2. **Luồng Admin Duyệt Thủ Công (`/api/orders` PATCH & Admin Portal)**:
   - Khi Admin bấm "Duyệt Đơn & Mở Kho", route `/api/orders` phát hiện chuyển trạng thái sang `completed`.
   - Nếu đơn hàng chưa có `license_key` và thuộc sản phẩm license, tự động sinh và lưu `license_key`.
   - Store local (`store.tsx`) cũng đồng bộ cập nhật state.

### 4.3. Bàn Giao Tài Nguyên Tại Kho Lưu Trữ (`/customer/vault`)
1. Đối với Tool Coursera:
   - Hiển thị khối **License Key** nổi bật với font Monospace, hiệu ứng gradient, nút Copy 1-Click (`Copy` / `Check`).
   - Hiển thị thông tin email kích hoạt và thời hạn vĩnh viễn.
   - Nút **"Mở Google Drive"** (`https://drive.google.com/drive/folders/1NvEfBQGKhjjUD8-bbddFS_U9qJu_3N7M?usp=drive_link`).
   - Nút **"Video Hướng Dẫn"** và trình phát video YouTube nhúng trực tiếp (`qld1bT_U8AQ`).
   - Hướng dẫn cài đặt và kích hoạt 5 bước chi tiết.

### 4.4. Chi Tiết Đơn Hàng (`OrderDetailModal.tsx`)
- Khi đơn hàng hoàn thành, hiển thị thẻ License Key với nút Copy, link tải Google Drive và video YouTube tương ứng của từng sản phẩm Tool.

---

## 5. Acceptance Criteria (DoD)

- [ ] Sản phẩm Tool Coursera được tạo và lưu vào Supabase (`products`, `product_demos`) qua seed script.
- [ ] Hàm `generateCourseraLicenseKey` sinh ra License Key 100% tương thích với `admin_keygen.html` và `content.js`.
- [ ] Checkout Modal bắt buộc nhập Email Coursera đối với sản phẩm Tool yêu cầu License Key.
- [ ] Khi đơn hàng chuyển sang `completed` (cả qua SePay lẫn Admin duyệt), hệ thống tự động sinh và lưu License Key.
- [ ] Giao diện Vault (`/customer/vault`) hiển thị License Key, nút Copy, link Drive, video YouTube embed và tài liệu hướng dẫn.
- [ ] Giao diện `OrderDetailModal` hiển thị đầy đủ tài nguyên của Tool Coursera khi đơn hàng hoàn thành.
- [ ] Admin Portal hiển thị License Key và Email Coursera trong chi tiết đơn hàng.
- [ ] Không có lỗi TypeScript (`tsc --noEmit`).
- [ ] Tuyệt đối không can thiệp, sửa đổi file nào trong `Coursera_Skip_Extension_full`.
