# AGENTS.md — Root Level Agent Context

> **Lưu ý:** File này liên kết trực tiếp với [.agents/AGENTS.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.agents/AGENTS.md) và [.sdd/constitution.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/constitution.md).

## 🚨 NGUYÊN TẮC BẮT BUỘC TỐI THƯỢNG (ABSOLUTE MANDATORY RULE)
### ⚡ SPEC-FIRST WORKFLOW (BẮT BUỘC: SỬA SPEC TRƯỚC — CODE SAU)
**ÁP DỤNG CHO TẤT CẢ AI AGENT TỪ NAY TRỞ VỀ SAU:**
Bất cứ khi nào người dùng yêu cầu **lên ý tưởng, phát triển tính năng mới, hoặc sửa đổi/refactor bất kỳ thứ gì**, hành động BẮT BUỘC ĐẦU TIÊN là:
1. **BƯỚC 1 — CẬP NHẬT HOẶC TẠO MỚI SPEC TRƯỚC:** Phải sửa đổi/tạo mới tài liệu `spec.md` tương ứng trong thư mục `specs/` (hoặc `.sdd/`) phản ánh chi tiết logic, schema, UI, API trước khi động vào code.
2. **BƯỚC 2 — CHỈ ĐƯỢC PHÉP CODE SAU KHI ĐÃ CẬP NHẬT SPEC:** Tuyệt đối không được phép chỉnh sửa hoặc viết bất kỳ dòng code nào khi spec chưa được cập nhật.
3. **BƯỚC 3 — KIỂM TRA & ĐẨY CODE LÊN GITHUB:** Chạy typecheck (`tsc --noEmit`), kiểm tra chất lượng và đẩy code lên remote GitHub ngay sau khi hoàn thành.
4. **CẤM TUYỆT ĐỐI:** Hành vi "vibe coding" (nhảy thẳng vào viết code/sửa code mà chưa cập nhật spec) bị coi là vi phạm nghiêm trọng quy chế dự án.

---

Vui lòng đọc các tài liệu cốt lõi trước khi thực hiện bất kỳ hành động nào trong dự án:
1. **Hiến pháp dự án:** [.sdd/constitution.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/constitution.md)
2. **Nguồn sự thật chung (Schema & Models):** [.sdd/shared_context.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/shared_context.md)
3. **Bộ rào chắn:**
   - [Global Constraints](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/constraints/global.md)
   - [Business Constraints](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/constraints/business.md)
   - [Safety Constraints](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/constraints/safety.md)
4. **Quyết định kiến trúc:** [.sdd/rfcs/ADR-001-architecture-and-stack.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/rfcs/ADR-001-architecture-and-stack.md)
5. **Tiến độ dự án:** [plan.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/plan.md)
