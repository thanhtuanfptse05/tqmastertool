# AGENTS.md — Root Level Agent Context

> **Lưu ý:** File này liên kết trực tiếp với [.agents/AGENTS.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.agents/AGENTS.md) và [.sdd/constitution.md](file:///d:/wd%20c%20sang%20d/Documents/WEB%20m%E1%BB%9Bi/.sdd/constitution.md).

## 🚨 NGUYÊN TẮC BẮT BUỘC TỐI THƯỢNG (ABSOLUTE MANDATORY RULE)

### 1. ⚡ SPEC-FIRST WORKFLOW VỚI SPECKIT (BẮT BUỘC DÙNG SKILL CỦA SPECKIT ĐỂ VIẾT SPEC)
**ÁP DỤNG CHO TẤT CẢ AI AGENT TỪ NAY TRỞ VỀ SAU:**
Bất cứ khi nào người dùng yêu cầu **lên ý tưởng, phát triển tính năng mới, hoặc sửa đổi/refactor bất kỳ thứ gì**, hành động BẮT BUỘC ĐẦU TIÊN là:
1. **BƯỚC 1 — DÙNG SKILL CỦA SPECKIT ĐỂ SOẠN SPEC CHUẨN:**
   - Phải sử dụng quy trình và mẫu đặc tả của **SpecKit** (skills: `speckit-specify`, `speckit-plan`, `speckit-tasks`, `speckit-clarify`, `speckit-analyze`, `speckit-implement`).
   - Mọi tài liệu `spec.md` trong thư mục `specs/` phải tuân thủ nghiêm ngặt cấu trúc chuẩn SpecKit (`.specify/templates/spec-template.md`):
     - **User Scenarios & Testing**: Ưu tiên theo User Journey P1, P2, P3... với Acceptance Scenarios định dạng chuẩn **Given - When - Then**.
     - **Requirements**: Liệt kê các Functional Requirements rõ ràng theo mã (`FR-001`, `FR-002`...).
     - **Key Entities**: Thực thể dữ liệu và quan hệ.
     - **Success Criteria**: Các chỉ số đo lường thành công (`SC-001`, `SC-002`...).
     - **Edge Cases & Assumptions**: Kịch bản biên và các giả định.
2. **BƯỚC 2 — CHỈ ĐƯỢC PHÉP CODE SAU KHI ĐÃ CẬP NHẬT SPEC:** Tuyệt đối không được phép chỉnh sửa hoặc viết bất kỳ dòng code nào khi spec chưa được cập nhật.
3. **BƯỚC 3 — KIỂM TRA & ĐẨY CODE LÊN GITHUB:** Chạy typecheck (`tsc --noEmit`), kiểm tra chất lượng và đẩy code lên remote GitHub ngay sau khi hoàn thành.
4. **CẤM TUYỆT ĐỐI:** Hành vi "vibe coding" (nhảy thẳng vào viết code/sửa code mà chưa cập nhật spec chuẩn SpecKit) bị coi là vi phạm nghiêm trọng quy chế dự án.

---

### 2. 🔍 ĐỌC & PHÂN TÍCH CODEBASE VỚI CODEGRAPH VÀ GRAPHIFY
Trước khi đọc raw file, grep hoặc sửa mã nguồn, BẮT BUỘC phải sử dụng **CodeGraph** và **Graphify**:
1. **CodeGraph** (`codegraph_explore` MCP tool hoặc `codegraph explore` CLI):
   - Sử dụng CodeGraph đầu tiên để tìm kiếm symbol, truy vết call graph đa bước (multi-hop), và phân tích luồng thực thi hàm/component.
2. **Graphify** (`graphify query`, `graphify path`, `graphify explain` / MCP `query_graph`, `shortest_path`, `get_node`):
   - Tra cứu kiến trúc tổng quan tại `graphify-out/` để xác định mối quan hệ phụ thuộc giữa các module và file liên quan.
   - Chạy `graphify update .` sau khi sửa code để giữ đồ thị tri thức luôn cập nhật.
3. **Tuyệt đối không đoán mò cấu trúc code**: Luôn dùng CodeGraph và Graphify để có góc nhìn toàn diện về dependencies trước khi chỉnh sửa.

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
