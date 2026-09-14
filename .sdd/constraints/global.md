# .sdd/constraints/global.md — Global Engineering Constraints

Version: 1.0.0 | Owner: @tech-lead | Status: ACTIVE

## 1. TECHNOLOGY STACK (STRICT)

### Frontend & Application Core
- Framework: Next.js 14+ (App Router)
- Language: TypeScript 5.x (Strict mode: `"strict": true`, `"noImplicitAny": true`)
- UI Library: React 18 / 19
- Styling: Tailwind CSS 3.4+ kết hợp CSS Modules / CSS Variables cho gradient & hiệu ứng
- 3D Engine: Three.js (`three`), `@react-three/fiber`, `@react-three/drei`
- Motion & Micro-interactions: `framer-motion`
- Icons: `lucide-react`
- Form & Validation: `react-hook-form` + `@hookform/resolvers` + `zod`

### Backend & Database Platform
- BaaS: Supabase (PostgreSQL 16)
- Client Libraries: `@supabase/supabase-js`, `@supabase/ssr` (Server-side cookies handling)
- Authentication: Supabase Auth (Email/Password & Magic Link / OAuth)
- File Storage: Supabase Storage
  - `product-assets` (Public bucket: thumbnails, screenshots, avatar)
  - `digital-deliverables` (Private bucket: code archives zip, releases)

### Payment & Banking
- Format: VietQR (EMVCo specification QR code URL generator)

---

## 2. NAMING CONVENTIONS

| Artifact | Convention | Example | Notes |
|---|---|---|---|
| React Components | PascalCase | `ProductCard3D.tsx` | 1 component per file |
| Hooks | camelCase với `use` prefix | `useCart.ts`, `useAdminOrders.ts` | Shared hooks trong `/hooks` |
| Utility Functions | camelCase | `formatVndCurrency.ts` | Pure functions |
| TypeScript Types | PascalCase | `Product`, `Order`, `ProductCategory` | Định nghĩa tại `src/types/` |
| Database Tables | snake_case, plural | `products`, `orders`, `profiles` | PostgreSQL standard |
| Database Columns | snake_case | `created_at`, `total_amount` | Foreign key có suffix `_id` |
| Route Directories | kebab-case | `/admin/revenue-analytics` | Next.js App router standard |
| API Endpoints | kebab-case | `/api/orders/verify-payment` | RESTful convention |

---

## 3. APPROVED EXTERNAL PACKAGES
- `three`: 3D library cốt lõi
- `@react-three/fiber`: React reconciler cho Three.js
- `@react-three/drei`: Helpers cho React Three Fiber (OrbitControls, Canvas, Float, Sparkles, MeshDistortMaterial)
- `framer-motion`: Thư viện chuyển động UI
- `lucide-react`: Bộ icon hiện đại
- `@supabase/supabase-js`, `@supabase/ssr`: SDK Supabase
- `zod`: Schema validation cho form và API
- `canvas-confetti`: Hiệu ứng chúc mừng sau khi đặt hàng thành công
- `tailwind-merge`, `clsx`: Class combination utility

---

## 4. BANNED PACKAGES & ANTI-PATTERNS
- **BANNED**: `any` type trong TypeScript. Phải dùng `unknown` kèm type guards hoặc định nghĩa schema với Zod.
- **BANNED**: `NEXT_PUBLIC_` prefix cho `SUPABASE_SERVICE_ROLE_KEY`. Service role key chỉ nằm trong server code.
- **BANNED**: Raw SQL string concatenation. Tất cả query phải dùng typed Supabase client query builder.
- **BANNED**: Lưu link tải zip công khai trong bảng `products` mà không qua phân quyền.
- **BANNED**: Chạy Three.js requestAnimationFrame liên tục ở background mà không unmount hoặc pause khi không trong viewport (gây tốn pin và nóng máy).
- **BANNED**: Hardcode giá trị ngân hàng hoặc số tài khoản trong component UI (phải dùng biến môi trường cấu hình).

---

## 5. STANDARD API ERROR FORMAT
Mọi API Route Handler hoặc Server Action trả về lỗi đều phải tuân theo cấu trúc:
```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;        // E.g. "ORDER_NOT_FOUND", "UNAUTHORIZED", "PAYMENT_NOT_APPROVED"
    message: string;     // Thông báo lỗi thân thiện cho người dùng
    details?: unknown;   // Zod validation issues nếu có
  };
  timestamp: string;     // ISO 8601
}
```
