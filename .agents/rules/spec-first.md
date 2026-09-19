# Rule: Spec-First Mandatory Workflow & Git Auto-Push

**CẤP ĐỘ QUY TẮC: BẮT BUỘC TỐI THƯỢNG (MANDATORY & INVIOLABLE)**

Áp dụng cho mọi tác vụ phát triển trong dự án CodeVault Studio:
Bất kỳ khi nào người dùng yêu cầu:
1. Lên ý tưởng hoặc phát triển tính năng mới
2. Sửa đổi, tối ưu hoặc refactor bất kỳ tính năng, giao diện (UI), API hay logic nào hiện có

### QUY TRÌNH BẮT BUỘC (TUÂN THỦ THEO ĐÚNG THỨ TỰ):

1. **Bước 0 (ĐỌC VÀ KHÁM PHÁ CODE TRƯỚC VỚI CODEGRAPH & GRAPHIFY):**
   - Trước khi sửa hay phân tích bất kỳ dòng code nào, BẮT BUỘC dùng **CodeGraph** (`codegraph_explore` / CLI) để trace call paths và symbol verbatim sources.
   - Dùng **Graphify** (`graphify query`, `graphify path`, `graphify explain`) để nắm bản đồ phụ thuộc toàn dự án.
   - Tuyệt đối không đoán mò cấu trúc code.

2. **Bước 1 (BẮT BUỘC ĐẦU TIÊN — SOẠN SPEC CHUẨN VỚI SPECKIT):**
   - Bắt buộc sử dụng skill của **SpecKit** (`speckit-specify`, `speckit-plan`, `speckit-tasks`, `speckit-clarify`, `speckit-analyze`).
   - Mọi file `spec.md` trong `specs/` phải tuân thủ nghiêm ngặt định dạng template chuẩn SpecKit (`.specify/templates/spec-template.md`):
     - **User Scenarios & Testing**: Ưu tiên User Stories (P1, P2, P3...) với Acceptance Scenarios định dạng **Given - When - Then**.
     - **Requirements**: Liệt kê các Functional Requirements rõ ràng (`FR-001`, `FR-002`...).
     - **Key Entities**: Thực thể dữ liệu và tương quan schema.
     - **Success Criteria**: Tiêu chí thành công có thể đo lường (`SC-001`, `SC-002`...).
     - **Edge Cases & Assumptions**: Kịch bản biên và các giả định hệ thống.
   - TRƯỚC KHI chạm vào bất kỳ file code nào, tài liệu spec chuẩn SpecKit phải hoàn tất 100%.

3. **Bước 2 (CHỈ ĐƯỢC PHÉP CODE SAU KHI ĐÃ CÓ SPEC CHUẨN SPECKIT):**
   - Sau khi Bước 1 hoàn thành, mới được phép bắt đầu viết code hoặc sửa đổi mã nguồn trong `src/`, `public/`, `supabase/`.
   - Code phải bám sát 100% theo các đặc tả đã ghi trong spec.

4. **Bước 3 (KIỂM THỬ, CẬP NHẬT ĐỒ THỊ & ĐẨY CODE LÊN GITHUB):**
   - Kiểm tra lỗi biên dịch TypeScript (`npx tsc --noEmit`) và lint.
   - Chạy `graphify update .` để đồ thị tri thức luôn khớp với code mới nhất.
   - Thực hiện commit theo chuẩn conventional (`[type]: [scope] - [description]`) và đẩy ngay lên remote GitHub:
     ```bash
     git push origin main
     ```

### ĐIỀU CẤM KỴ TUYỆT ĐỐI:
- **CẤM** nhảy vào viết code hoặc sửa file code khi chưa cập nhật spec chuẩn SpecKit trong `specs/` ("vibe coding").
- **CẤM** viết spec cẩu thả không tuân theo cấu trúc chuẩn của SpecKit template.
- Bất kỳ hành động sửa code trước khi sửa spec đều bị coi là vi phạm nghiêm trọng hiến pháp dự án.
