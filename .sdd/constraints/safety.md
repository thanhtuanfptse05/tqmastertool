# .sdd/constraints/safety.md — Safety Constraints & Agent Guardrails

Version: 1.0.0 | Owner: @security-lead | Status: ACTIVE

## 1. DATA SAFETY & PRIVACY GUARDRAILS

### KHÔNG ĐƯỢC PHÉP (Blocking — Block Code / Block CI):
- **TUYỆT ĐỐI KHÔNG** để lộ bucket `digital-deliverables` ở chế độ public. Bucket này bắt buộc phải là Private.
- **TUYỆT ĐỐI KHÔNG** cung cấp public URL trực tiếp tới source code hoặc file zip.
- **TUYỆT ĐỐI KHÔNG** hard-delete các bản ghi trong bảng `orders`, `order_items`, `products` khi đã có giao dịch liên quan.
- **TUYỆT ĐỐI KHÔNG** commit file `.env`, `.env.local` hoặc bất kỳ file chứa Supabase Service Role Key lên Git.
- **TUYỆT ĐỐI KHÔNG** cho phép Client gọi trực tiếp Supabase mutation trên bảng `orders` để tự chuyển `status = 'completed'`. Logic duyệt đơn BẮT BUỘC phải chạy qua Server Action / API Handler đã xác thực role `admin`.

### PHẢI THỰC HIỆN (Mandatory):
- Luôn kiểm tra quyền sở hữu (`order.user_id === session.user.id`) trước khi sinh Signed Download URL.
- Thời gian sống của Signed URL không được vượt quá 3600 giây (1 giờ).
- Ghi nhận Audit Log vào bảng `audit_logs` đối với mọi quyết định duyệt hoặc từ chối đơn hàng của Admin.

---

## 2. CLIENT-SIDE THREE.JS & PERFORMANCE SAFETY

Để ngăn chặn sụt giảm hiệu năng, tràn bộ nhớ (memory leaks) hoặc crash trình duyệt:
- **WebGL Context Disposal:** Mọi Three.js Component (geometries, materials, textures, renderers) phải có cleanup function khi unmount:
  ```typescript
  // Quy tắc bắt buộc trong React Three Fiber / Three.js
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);
  ```
- **Performance Budget:**
  - Tối đa 1 Three.js Canvas active trên mỗi view chính.
  - Sử dụng `dpr={[1, 1.5]}` để tránh crash trên màn hình Retina độ phân giải 4K.
  - Sử dụng dynamic import với `ssr: false` cho toàn bộ các 3D components.
  - Chuyển sang chế độ vẽ theo yêu cầu (`frameloop="demand"`) khi 3D scene ở trạng thái tĩnh.

---

## 3. AGENT EXECUTION GUARDRAILS (Rào Chắn Cho AI Agent)

Khi AI Agent thực hiện code hoặc refactor trong dự án:
- **Không tự ý thay đổi schema DB** mà không cập nhật tài liệu `.sdd/shared_context.md`.
- **Không tự ý cài đặt package mới** ngoài danh sách đã được approve trong `.sdd/constraints/global.md`.
- **Không xóa file spec hoặc test** hiện hữu.
- **Khi sửa đổi logic thanh toán hoặc phân quyền**, phải kiểm tra lại cả 2 luồng: Khách hàng thường và Admin.
