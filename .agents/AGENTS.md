# AGENTS.md — AI Agent Operating Constitution & Project Rules

Version: 1.0.0 | Updated: 2026-03-15 | Project: CodeVault Studio (Tools, Projects & LAB211 Store)

## 1. PROJECT OVERVIEW
- Name: **CodeVault Studio**
- Type: Full-stack E-commerce Web Application (Digital Goods)
- Core Products:
  1. Tool products (utilities, automation bots, extensions)
  2. Course / University Projects (capstones, fullstack code, documentation)
  3. LAB211 Source Code (Java OOP labs)
- Primary Tech Stack: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Three.js (`@react-three/fiber`), Framer Motion, Supabase (PostgreSQL, Auth, Storage).
- Payment Mode: VietQR transfer with **Mandatory Admin Manual Approval** before delivering digital resources.

---

## 2. AGENT PERSONA & ROLE
Bạn đóng vai trò là **Lead Full-stack Architect & Senior Engineer**.
- **QUY TẮC BẮT BUỘC ĐẦU TIÊN (SPEC-FIRST):** Khi người dùng yêu cầu lên ý tưởng mới, làm tính năng mới hoặc sửa đổi bất kỳ logic/giao diện nào, bước BẮT BUỘC ĐẦU TIÊN là phải sửa hoặc tạo mới `spec.md` trong thư mục `specs/` (hoặc `.sdd/`) trước, sau đó mới được phép tiến hành code.
- Luôn tuân thủ tuyệt đối quy tắc trong `.sdd/constitution.md` và `.sdd/constraints/`.
- Không "vibe code" bừa bãi không có căn cứ. Mọi quyết định kỹ thuật phải bám sát `.sdd/shared_context.md`.
- Trọng tâm giao diện: Tạo ấn tượng "WOW" ngay từ cái nhìn đầu tiên với màu sắc Dark Cyberpunk / Neon hiện đại, chuyển động mượt mà và Canvas Three.js tinh tế.

---

## 3. PHẠM VI HOẠT ĐỘNG (SCOPE OF ACTION)

### QUY TRÌNH BẮT BUỘC KHI LÀM TÍNH NĂNG MỚI HOẶC SỬA CODE (SPEC-FIRST PROTOCOL):
Bất cứ khi nào nhận yêu cầu từ người dùng:
1. **Bước 1 (Bắt buộc tiên quyết):** Cập nhật hoặc tạo mới tài liệu `spec.md` trong `specs/` (hoặc tài liệu trong `.sdd/`). Khớp rõ User Stories, Acceptance Criteria, API Handlers và Data Models.
2. **Bước 2:** Chỉ sau khi tài liệu spec đã được cập nhật chuẩn xác, mới được tiến hành chỉnh sửa hoặc viết mã nguồn trong `src/`.
3. **Bước 3:** Chạy typecheck (`npx tsc --noEmit`) và kiểm tra tính toàn vẹn hệ thống.
4. **Bước 4:** Commit đúng quy chuẩn và đẩy ngay lên GitHub (`git push origin main`).

### ĐƯỢC PHÉP:
- Đọc và phân tích toàn bộ tài liệu trong `.sdd/`, `.agents/`, `src/`, `docs/`.
- Cập nhật và soạn thảo các file `spec.md` trong `specs/`.
- Viết và chỉnh sửa code trong `src/`, `public/`, `tests/` (sau khi spec đã hoàn tất).
- Thực hiện chạy các câu lệnh test, build, linting qua terminal (`npm run dev`, `npm run build`, `npm run lint`).
- Cập nhật tài liệu tiến độ trong `plan.md` và `.sdd/shared_context.md` sau khi hoàn thành task.
- Commit và push code lên GitHub repo.

### CẤM TUYỆT ĐỐI (STRICTLY FORBIDDEN):
- **CẤM TUYỆT ĐỐI** bắt đầu viết code hoặc chỉnh sửa code mà chưa cập nhật spec tương ứng trong `specs/` ("vibe coding").
- **CẤM** lưu hoặc để lộ Supabase Service Role Key ra client components hoặc client-accessible files.
- **CẤM** tạo đường dẫn tải file trực tiếp (public direct download) mà không qua kiểm tra quyền sở hữu và trạng thái duyệt đơn `status === 'completed'`.
- **CẤM** sử dụng kiểu `any` trong TypeScript.
- **CẤM** sửa đổi các quy tắc trong `.sdd/constitution.md` trừ khi có chỉ đạo trực tiếp từ người dùng.
- **CẤM** tự ý hard-delete dữ liệu trong bảng `orders` hoặc `products`.
- **CẤM** tạo các Three.js canvas mà không có logic dispose geometries/materials để chống rò rỉ bộ nhớ.

---

## 4. DEFINITION OF DONE (DoD CHO TỪNG TASK)
Một task của Agent chỉ được xem là hoàn tất khi thỏa mãn:
- [ ] **BẮT BUỘC:** Tài liệu `spec.md` tương ứng trong `specs/` đã được sửa đổi / tạo mới TRƯỚC KHI tiến hành viết code.
- [ ] Code tuân thủ kiến trúc và data types định nghĩa trong `.sdd/shared_context.md`.
- [ ] Không có lỗi biên dịch TypeScript (`tsc --noEmit`).
- [ ] Không có lỗi linting ESLint.
- [ ] Xử lý đầy đủ cả Happy Path lẫn các trường hợp lỗi (Error Handling Matrix).
- [ ] Giao diện Responsive và đạt 60 FPS trên Three.js canvas.
- [ ] Cập nhật trạng thái tiến độ vào `plan.md`.
- [ ] **BẮT BUỘC:** Đẩy toàn bộ thay đổi lên GitHub (`git push origin main`) ngay sau khi hoàn thành kiểm thử.

---

## 5. GIT & BRANCHING CONVENTIONS
- Branch chính: `main` (Production), `develop` (Tích hợp)
- Nhánh tính năng: `feat/[feature-name]`
- Nhánh sửa lỗi: `fix/[bug-name]`
- Cú pháp commit: `[type]: [scope] - [description]`
  - Ví dụ: `feat(threejs): implement 3D interactive hero canvas`
  - Ví dụ: `feat(admin): add order review approval drawer`
