# ADR-001: Lựa Chọn Tech Stack, Supabase Backend, Three.js 3D & Luồng Duyệt Đơn Admin

- **Mã:** ADR-001
- **Trạng thái:** ACCEPTED
- **Ngày quyết định:** 2026-03-15
- **Tác giả:** @tech-lead & @product-architect
- **Phạm vi:** Toàn bộ hệ thống kiến trúc

---

## 1. BỐI CẢNH (CONTEXT)
Dự án cần phát triển một trang web thương mại điện tử chuyên bán các sản phẩm kỹ thuật số thuộc 3 danh mục:
1. Sản phẩm Tool (tiện ích, automation, phần mềm)
2. Sản phẩm Project môn học (đồ án tốt nghiệp, project full-stack, báo cáo kiến trúc)
3. Mã nguồn LAB211 (Java OOP labs)

**Yêu cầu kỹ thuật & trải nghiệm cốt lõi:**
- Giao diện phải cực kỳ đẹp mắt, chuyển động mượt mà và sử dụng thư viện **Three.js** để tạo hiệu ứng 3D tương tác.
- Hệ thống quản trị **Admin** có đầy đủ tính năng CRUD và Dashboard thống kê doanh thu, đơn hàng.
- Trình diễn demo đa phương tiện phong phú (không chỉ 1 ảnh chụp đơn điệu mà phải hỗ trợ nhiều ảnh gallery, live demo url, video preview, code preview).
- Quy trình thanh toán: Khách hàng thanh toán qua mã VietQR, **Admin phải duyệt đơn hàng** trước khi cấp quyền truy cập tài nguyên số (bảo vệ bản quyền mã nguồn).
- Database được chỉ định: **Supabase**.

---

## 2. QUYẾT ĐỊNH KỸ THUẬT (DECISION)

### 2.1 Frontend Framework: Next.js 14+ (App Router) & TypeScript
- **Lý do chọn:** Next.js cung cấp kiến trúc Hybrid hoàn hảo giữa Server Components (tối ưu SEO, bảo mật dữ liệu bàn giao, chạy server-side auth guard) và Client Components (xử lý Three.js Canvas, tương tác giỏ hàng, animation).
- **TypeScript Strict Mode:** Đảm bảo tính toàn vẹn kiểu dữ liệu giữa Database schema Supabase và Client models.

### 2.2 3D Graphics & Animations: Three.js + React Three Fiber + Framer Motion
- **Three.js Core & `@react-three/fiber` / `@react-three/drei`:** Cho phép nhúng 3D interactive hero, vật thể 3D xoay tương tác theo chuột (floating code cubes, glowing tech nodes) tạo ấn tượng thị giác choáng ngợp.
- **`framer-motion`:** Quản lý page transitions, stagger animations cho danh sách sản phẩm và modals.

### 2.3 Backend & Database: Supabase Platform
- **PostgreSQL 16:** CSDL quan hệ lưu trữ thông tin sản phẩm, demo đa phương tiện, đơn hàng, hóa đơn, audit logs.
- **Supabase Auth:** Xử lý xác thực người dùng và phân quyền RBAC (Role-based access control) giữa Customer và Admin.
- **Supabase Storage:**
  - Bucket `product-assets` (Public): Chứa ảnh đại diện, ảnh gallery demo, video thumbnail.
  - Bucket `digital-deliverables` (Private): Chứa file zip mã nguồn. Chỉ cho phép tải qua Signed URL ngắn hạn sinh ra sau khi Admin duyệt đơn.
- **Row Level Security (RLS):** Bảo vệ dữ liệu ở tầng cơ sở dữ liệu.

### 2.4 Thanh Toán & Luồng Duyệt Đơn: VietQR + Manual Admin Approval
- Hệ thống tự sinh mã QR chuẩn EMVCo chứa đúng số tiền và cú pháp `order_code`.
- Khách upload hình ảnh biên lai ngân hàng -> Trạng thái đơn chuyển thành `pending_approval`.
- Admin trực tiếp kiểm tra tại Admin Dashboard -> Bấm duyệt -> Đơn chuyển thành `completed` -> Mở khóa link tải có ký số và tài liệu đính kèm.

---

## 3. HỆ QUẢ & ĐÁNH GIÁ (CONSEQUENCES)

### Điểm Tích Cực (Pros):
- **Bảo mật tuyệt đối cho mã nguồn số:** Khách hàng không thể can thiệp frontend để lấy link tải trước khi có xác nhận tiền về từ ngân hàng.
- **Trải nghiệm WOW:** Three.js kết hợp Dark Cyberpunk mang lại sự khác biệt lớn so với các trang thương mại thông thường.
- **Tốc độ phát triển cao:** Supabase giảm thiểu thời gian setup backend server phức tạp, cho phép tập trung vào trải nghiệm người dùng và nghiệp vụ duyệt đơn.

### Thách Thức & Giải Pháp Khắc Phục (Mitigations):
- **Hiệu năng Three.js trên máy yếu:** Khắc phục bằng việc giới hạn DPR (`dpr={[1, 1.5]}`), bật chế độ `frameloop="demand"` và cleanup WebGL contexts khi component unmount.
- **Tải file lớn từ Supabase:** File zip được lưu trên Supabase Storage, link tải là Signed URL trỏ thẳng tới Storage CDN, không làm nghẽn máy chủ Next.js.
