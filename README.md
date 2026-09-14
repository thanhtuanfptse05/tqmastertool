# CodeVault Studio

> **Nền tảng thương mại điện tử chuyên bán sản phẩm số** — Tools, University Projects & LAB211 Source Code.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (Strict) |
| Styling | Tailwind CSS |
| 3D / Animation | Three.js (`@react-three/fiber`), Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Private Storage |
| Payment | VietQR (Manual Bank Transfer) |

---

## 📦 Product Categories

1. **Tools** — Tiện ích, automation bots, extensions
2. **Projects** — Capstone, fullstack code, tài liệu môn học
3. **LAB211** — Java OOP lab source code

---

## 💳 Payment Flow

```
Đặt hàng → VietQR Chuyển khoản → Upload Bill → Admin Duyệt → Mở khóa Tài nguyên
```

---

## 📂 Project Structure (SDD)

```
.sdd/               # Spec-Driven Development documents
  constitution.md   # Project constitution
  shared_context.md # Schema, API contracts, models
  constraints/      # Global, business, safety constraints
  rfcs/             # Architecture Decision Records
  specs/            # Feature specs (deprecated — moved to specs/)
specs/              # Feature specifications (9 features)
  001-user-auth/
  002-product-catalog/
  003-product-detail-demo/
  004-order-checkout-vietqr/
  005-order-bill-submission/
  006-admin-order-management/
  007-customer-deliverable-vault/
  008-admin-product-crud/
  009-admin-dashboard/
.agents/            # AI Agent operating rules (AGENTS.md)
.specify/           # Spec-kit configuration
src/                # Application source code (Next.js)
plan.md             # Master project roadmap
```

---

## 🛡️ Security Constraints

- Supabase **Service Role Key** chỉ tồn tại server-side — KHÔNG BAO GIỜ expose ra client.
- Tài nguyên số phục vụ qua **Signed URL** tạm thời (15 phút) — không có public URL.
- Quyền tải file chỉ được cấp khi `order.status === 'completed'`.
- Tất cả đơn hàng yêu cầu **upload ảnh bill** — Admin duyệt thủ công trước khi mở khóa.

---

## 📋 Feature Status

| # | Feature | Status |
|---|---|---|
| 001 | User Auth & Authorization | 📝 Spec Ready |
| 002 | Product Catalog | 📝 Spec Ready |
| 003 | Product Detail & Demo Engine | 📝 Spec Ready |
| 004 | Order Checkout & VietQR | 📝 Spec Ready |
| 005 | Bill Upload & Submission | 📝 Spec Ready |
| 006 | Admin Order Management | 📝 Spec Ready |
| 007 | Customer Deliverable Vault | 📝 Spec Ready |
| 008 | Admin Product CRUD | 📝 Spec Ready |
| 009 | Admin Dashboard | 📝 Spec Ready |

---

## 📖 Documentation

- [Constitution](.sdd/constitution.md)
- [Shared Context & Schema](.sdd/shared_context.md)
- [ADR-001 Architecture](.sdd/rfcs/ADR-001-architecture-and-stack.md)
- [Master Plan](plan.md)
- [Agent Rules](.agents/AGENTS.md)
