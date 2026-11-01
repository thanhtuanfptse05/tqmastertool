# Implementation Plan: 034-supabase-egress-and-bandwidth-optimization

## 1. Technical Architecture & Component Changes

### A. Client-side Image Compression Utility (`src/lib/image-compress.ts`)
- Tạo utility module `compressImageFile(file: File, options?: ImageCompressOptions): Promise<File>`:
  - Sử dụng Canvas HTML5 để vẽ lại ảnh với kích thước tối đa 1200px (giữ đúng tỉ lệ aspect ratio).
  - Xuất ra định dạng `image/webp` (hoặc `image/jpeg` nếu trình duyệt không hỗ trợ WebP) với chất lượng nén 0.75 - 0.8.
  - Tự động nén nhiều bước nếu kích thước ảnh vẫn vượt quá ngưỡng 250KB.
  - Đảm bảo một ảnh chụp biên lai 5MB - 10MB từ camera điện thoại iPhone/Android được nén thành công về mức 80KB - 200KB trước khi rời khỏi máy khách.

### B. Upload Proof Hardening (`src/components/store/CheckoutModal.tsx` & `src/app/api/orders/upload-proof/route.ts`)
- `src/components/store/CheckoutModal.tsx`:
  - Trong `handleBillFileUpload`: gọi `await compressImageFile(file)` trước khi đóng gói `FormData`.
  - Hiển thị thông báo trạng thái "Đang tối ưu hóa & nén ảnh..." trong khi xử lý.
- `src/app/api/orders/upload-proof/route.ts`:
  - Hạ trần `maxSize` từ 10MB xuống 3MB để ngăn chặn việc spam upload tệp dung lượng quá lớn lên Supabase Storage.
  - Giữ nguyên cấu trúc lưu file và trả về URL public.

### C. Ngừng Tải Cưỡng Bức Ảnh Gốc Trong Bảng Admin (`src/app/admin/orders/page.tsx`)
- Thay thế thẻ `<img src={order.payment_proof_image} />` tải tự động ở mỗi hàng trong bảng bằng:
  - Một nút / badge trực quan: "Xem Bill" kèm icon xem trước.
  - Khi Admin click vào nút này hoặc click xem chi tiết đơn hàng, ảnh mới được tải on-demand và hiển thị trong Lightbox / Modal.
  - Loại bỏ hoàn toàn việc tải đồng loạt hàng trăm MB ảnh mỗi lần mở hoặc F5 trang `/admin/orders`.

### D. Xóa Bỏ Polling Vô Tận & Waterfall Spams (`src/app/customer/orders/page.tsx` & `src/components/store/CheckoutModal.tsx`)
- `src/app/customer/orders/page.tsx`:
  - Xóa bỏ `const interval = setInterval(() => { refreshOrders(); }, 6000);` vô tận.
  - Thay thế bằng bộ điều khiển có giới hạn (poll tối đa 4 lần với khoảng giãn cách 15s) và cung cấp nút bấm "Làm mới đơn hàng" rõ ràng cho người dùng.
- `src/components/store/CheckoutModal.tsx`:
  - Giãn chu kỳ kiểm tra tự động từ 2.5s lên 8s.
  - Giới hạn tối đa 30 lần kiểm tra (tương đương 4 phút), tự động dừng khi đóng modal hoặc hoàn thành.
  - Thay thế `select("*")` bằng câu lệnh select chỉ lấy các cột cần thiết: `select("id, status, transaction_ref, admin_notes, payment_proof_image")`.

### E. Tách Biệt Dữ Liệu Khách Vãng Lai & Caching Trong `StoreProvider` (`src/lib/store.tsx`)
- Trong `StoreProvider`:
  - Khách vãng lai chưa có phiên đăng nhập (`!session?.user`): **TUYỆT ĐỐI KHÔNG GỌI `fetchOrdersFromDB()`**.
  - Chỉ gọi `fetchOrdersFromDB()` khi `session?.user` tồn tại.
  - Lưu cache danh sách sản phẩm với TTL 10 phút, không fetch lại liên tục nếu dữ liệu đã có trong `localStorage` và chưa hết hạn.

---

## 2. Guardrails & Boundaries
- Giữ nguyên toàn bộ tính năng và nghiệp vụ hiện tại:
  - Luồng quét mã QR VietQR và nộp bill dự phòng hoạt động bình thường.
  - Webhook SePay hoạt động bình thường.
  - Luồng duyệt đơn của Admin hoạt động bình thường.
  - Không sửa đổi schema database hay xoá dữ liệu đang có.

