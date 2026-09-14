# CLAUDE.md — Project Memory & Technical Guidance

# Đọc file .agents/AGENTS.md và .sdd/constitution.md trước để hiểu toàn bộ bối cảnh dự án

## 1. MANUAL MEMORY (Human & Lead Architect Maintained)

### Architecture Decisions (ADR)
- **ADR-001 (Tech Stack):** Next.js 14+ (App Router) + TypeScript + Supabase + Three.js + Framer Motion + VietQR.
- **Data Protection:** Không lưu trữ link download trực tiếp trên client. Lưu file trong Supabase Private Bucket `digital-deliverables`, chỉ sinh Signed URL 60 phút khi đơn hàng đã được Admin DUYỆT (`status = 'completed'`).
- **3D Strategy:** Dùng `@react-three/fiber` và `@react-three/drei` với lazy loading (`ssr: false`) để tránh ảnh hưởng First Load Time và SSR hydration.

### Important Business Rules
- Bán 3 danh mục chính:
  1. `tool`: Tool phần mềm, automation, utility scripts.
  2. `project`: Project môn học, fullstack web/mobile app, đồ án có báo cáo.
  3. `lab211`: Source code bài tập Java OOP môn LAB211 chuẩn trường ĐH.
- Đầy đủ Demo đa phương tiện: Multi-image gallery, link live demo, video demo, code preview snippet, tech stack tags.
- Bắt buộc có Admin duyệt: Khách tạo đơn -> Quét VietQR -> Upload biên lai chuyển khoản -> Đơn ở trạng thái `pending_approval` -> Admin kiểm tra và bấm Duyệt (`approved` / `completed`) -> Lúc này khách mới mở khóa được tài nguyên tải về.
- Admin Dashboard: Báo cáo doanh thu thời gian thực, tổng số đơn hàng, đơn chờ duyệt, thống kê sản phẩm hot.

### Lessons Learned & Performance Notes
- **Three.js Context Disposal:** Luôn gọi `.dispose()` trên geometry và material khi unmount Three.js component để tránh memory leak WebGL.
- **Supabase Service Key:** Chỉ import `@supabase/supabase-js` với `SUPABASE_SERVICE_ROLE_KEY` trong file nằm ở `src/lib/supabase/admin.ts` (Server-only), không bao giờ dùng trong Client Component.
- **VietQR Formatting:** Cú pháp chuyển khoản phải loại bỏ ký tự đặc biệt, chỉ giữ chữ cái và số (VD: `CV20268942`).

---

## 2. PATTERNS TO FOLLOW

### Service Pattern
- Business logic nằm trong `src/core/usecases/` hoặc `src/services/`.
- UI Components nằm trong `src/components/`.
- Data Access thông qua typed Supabase client `src/lib/supabase/client.ts` hoặc `src/lib/supabase/server.ts`.

### Visual Guidelines
- Theme: Modern Dark / Cyberpunk Aesthetic (Giao diện tối huyền bí, điểm nhấn neon tím/xanh ngọc, card mờ glassmorphism với `backdrop-blur-md`, viền border phát sáng subtle glow).
- Typography: Hiện đại, sạch sẽ (Inter / Outfit).

---

## 3. AUTO MEMORY (Claude Code & AI Agents append session insights here)
# [AI Agents will automatically record new learnings and patterns during execution]
