# Rule: Spec-First Mandatory Workflow & Git Auto-Push

**CẤP ĐỘ QUY TẮC: BẮT BUỘC TỐI THƯỢNG (MANDATORY & INVIOLABLE)**

Áp dụng cho mọi tác vụ phát triển trong dự án CodeVault Studio:
Bất kỳ khi nào người dùng yêu cầu:
1. Lên ý tưởng hoặc phát triển tính năng mới
2. Sửa đổi, tối ưu hoặc refactor bất kỳ tính năng, giao diện (UI), API hay logic nào hiện có

### QUY TRÌNH BẮT BUỘC (TUÂN THỦ THEO ĐÚNG THỨ TỰ):

1. **Bước 1 (BẮT BUỘC ĐẦU TIÊN — SPEC TRƯỚC):**
   - Mở và cập nhật hoặc tạo mới file đặc tả kỹ thuật `spec.md` trong thư mục `specs/` (hoặc tài liệu trong `.sdd/`) TRƯỚC KHI chạm vào bất kỳ file code nào.
   - Nội dung spec phải phản ánh đầy đủ: Mục tiêu, Requirements, User Stories, Data Model / DB Schema, API routes, Edge cases và Acceptance Criteria.
   - Xác nhận spec đã hoàn thiện và đồng bộ với ý tưởng/yêu cầu người dùng.

2. **Bước 2 (CHỈ ĐƯỢC PHÉP CODE SAU KHI ĐÃ CÓ SPEC):**
   - Sau khi Bước 1 hoàn thành, mới được phép bắt đầu viết code hoặc sửa đổi mã nguồn trong `src/`, `public/`, `supabase/`.
   - Code phải bám sát 100% theo các đặc tả đã ghi trong spec.

3. **Bước 3 (KIỂM THỬ & ĐẨY CODE LÊN GITHUB):**
   - Kiểm tra lỗi biên dịch TypeScript (`npx tsc --noEmit`) và lint.
   - Sau khi hoàn thành và xác nhận hoạt động, thực hiện commit theo chuẩn conventional (`[type]: [scope] - [description]`) và đẩy ngay lên GitHub:
     ```bash
     git push origin main
     ```

### ĐIỀU CẤM KỴ TUYỆT ĐỐI:
- **CẤM** nhảy vào viết code hoặc sửa file code khi chưa cập nhật spec tương ứng trong `specs/` ("vibe coding").
- Bất kỳ hành động sửa code trước khi sửa spec đều bị coi là vi phạm nghiêm trọng hiến pháp dự án.
