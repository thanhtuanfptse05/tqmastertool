# SHARED CONTEXT — Digital Store (Tools, Projects & LAB211)

# File này là NGUỒN SỰ THẬT CHUNG (Single Source of Truth) cho toàn bộ AI Agents và Developers
# Read bởi: Tất cả AI Agents trước khi bắt đầu bất kỳ task hoặc module nào
# Version: 1.0.0 | Updated: 2026-03-15

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)
- Tên dự án: **CodeVault Studio** (Nền tảng thương mại điện tử chuyên cung cấp sản phẩm số: Tool phần mềm, Project môn học và Source code LAB211)
- Đặc trưng UI: Giao diện Cyberpunk/Modern Dark Theme cực kỳ cao cấp, hiệu ứng 3D tương tác sử dụng Three.js (`@react-three/fiber`), chuyển động mượt mà với `framer-motion`.
- Quy trình kinh doanh cốt lõi:
  1. Khách hàng duyệt các danh mục sản phẩm (Tool, Project, LAB211), xem demo đa phương tiện (Gallery ảnh, link live demo, video preview, code preview).
  2. Khách đặt mua đơn hàng -> Hệ thống sinh mã VietQR với nội dung chuyển khoản tự động.
  3. Khách hàng chuyển khoản và tải lên bằng chứng giao dịch (ảnh biên lai hoặc mã GD ngân hàng).
  4. Đơn hàng chuyển sang trạng thái chờ duyệt (`pending_approval`).
  5. **Admin truy cập Admin Portal**: Kiểm tra thanh toán -> Bấm "Duyệt đơn" (Approve) hoặc "Từ chối" (Reject).
  6. **Sau khi được Admin duyệt**: Đơn hàng chuyển thành `completed` -> Hệ thống mở khóa kho tài nguyên số (Link tải mã nguồn bảo mật có thời hạn từ Supabase Storage, link repo GitHub, tài liệu hướng dẫn kèm theo).
  7. **Admin Dashboard**: Thống kê doanh thu, đơn hàng thành công, số lượng đơn chờ duyệt, danh sách sản phẩm bán chạy.

---

## 2. DATA TYPES & DOMAIN MODELS (Canonical Source of Truth)

```typescript
// Định dạng UUID v4 chuẩn cho ID
export type UUID = string;

// 3 Danh mục sản phẩm cốt lõi
export type ProductCategory = 'tool' | 'project' | 'lab211';

// Trạng thái sản phẩm
export type ProductStatus = 'draft' | 'published' | 'archived';

// Trạng thái đơn hàng (Quy trình duyệt của Admin)
export type OrderStatus = 
  | 'pending_payment'   // Khách vừa tạo đơn, chưa thanh toán
  | 'pending_approval'  // Khách đã chuyển khoản/up bill, chờ Admin duyệt
  | 'completed'         // Admin ĐÃ DUYỆT -> Khách xem được nội dung số
  | 'rejected'          // Admin từ chối (chưa nhận được tiền / sai cú pháp)
  | 'cancelled';        // Khách tự hủy

// Vai trò người dùng
export type UserRole = 'customer' | 'admin';

// Cấu trúc Demo phong phú cho Tools, Projects, LAB211
export interface ProductDemo {
  id: UUID;
  product_id: UUID;
  gallery_images: string[];     // Mảng URL ảnh demo, screenshots
  live_demo_url?: string;       // Link website/web app đang chạy thực tế
  video_demo_url?: string;      // Link video YouTube, Loom hoặc MP4
  demo_credentials?: string;    // Tài khoản test demo nếu có
  code_preview_snippet?: string;// Đoạn code mẫu demo (hữu ích cho LAB211/Projects)
  features_list: string[];      // Danh sách tính năng nổi bật
  tech_stack_tags: string[];    // Tags công nghệ (vd: Java, Next.js, Python, Three.js)
}

// Thực thể Sản phẩm
export interface Product {
  id: UUID;
  category: ProductCategory;    // 'tool' | 'project' | 'lab211'
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string; // Hỗ trợ Markdown đầy đủ
  price: number;                // Giá niêm yết (VND)
  original_price?: number;      // Giá gốc trước khi giảm (VND)
  thumbnail_url: string;        // Ảnh đại diện chính
  status: ProductStatus;
  
  // Dữ liệu Deliverable (BẢO MẬT - Chỉ trả về khi Admin đã duyệt đơn)
  deliverable_type: 'download_file' | 'git_access' | 'license_key' | 'instructions_only';
  storage_file_path?: string;   // Đường dẫn file trong Supabase Private Bucket
  git_repo_url?: string;        // Link repo private nếu có
  license_key_template?: string;
  access_instructions?: string; // Hướng dẫn cài đặt / chạy đồ án sau khi mua
  
  created_at: string;           // ISO 8601
  updated_at: string;
  deleted_at?: string;          // Soft delete
}

// Thông tin người dùng
export interface UserProfile {
  id: UUID;                     // Trùng với auth.users.id
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  role: UserRole;               // 'customer' | 'admin'
  created_at: string;
}

// Đơn hàng
export interface Order {
  id: UUID;
  order_code: string;           // Mã đơn thân thiện: VD: "CV-2026-8942"
  user_id: UUID;
  total_amount: number;         // Tổng số tiền cần thanh toán (VND)
  status: OrderStatus;
  
  // Thông tin thanh toán VietQR
  payment_method: 'vietqr';
  vietqr_content: string;       // Cú pháp chuyển tiền: "CV20268942"
  payment_proof_image?: string; // URL ảnh chụp màn hình bill chuyển khoản
  transaction_ref?: string;     // Mã giao dịch ngân hàng do khách điền
  
  // Thông tin duyệt của Admin
  reviewed_by_admin_id?: UUID;
  reviewed_at?: string;
  admin_notes?: string;         // Ghi chú từ admin (lý do từ chối nếu có)
  
  created_at: string;
  updated_at: string;
}

// Chi tiết sản phẩm trong đơn hàng
export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  unit_price: number;
  product_title: string;
  product_category: ProductCategory;
}

// Payload mở khóa sau khi Admin duyệt
export interface UnlockedDeliverable {
  order_id: UUID;
  product_id: UUID;
  product_title: string;
  signed_download_url?: string; // URL có hiệu lực 60 phút
  git_repo_url?: string;
  license_key?: string;
  instructions: string;
}
```

---

## 3. DATABASE SCHEMA (SUPABASE POSTGRESQL)

```sql
-- Kích hoạt extension pgcrypto cho UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Bảng hồ sơ người dùng
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng sản phẩm
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('tool', 'project', 'lab211')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  detailed_description TEXT,
  price NUMERIC(12, 0) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(12, 0),
  thumbnail_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Dữ liệu bàn giao (Chỉ admin và người đã duyệt đơn mới được đọc)
  deliverable_type TEXT NOT NULL DEFAULT 'download_file',
  storage_file_path TEXT,
  git_repo_url TEXT,
  access_instructions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Bảng demo chi tiết cho sản phẩm (Hỗ trợ demo đa dạng ảnh, live link, video, specs)
CREATE TABLE public.product_demos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb NOT NULL,
  live_demo_url TEXT,
  video_demo_url TEXT,
  demo_credentials TEXT,
  code_preview_snippet TEXT,
  features_list JSONB DEFAULT '[]'::jsonb NOT NULL,
  tech_stack_tags JSONB DEFAULT '[]'::jsonb NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng đơn hàng
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  total_amount NUMERIC(12, 0) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'pending_approval', 'completed', 'rejected', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'vietqr',
  vietqr_content TEXT NOT NULL,
  payment_proof_image TEXT,
  transaction_ref TEXT,
  reviewed_by_admin_id UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Bảng chi tiết đơn hàng
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  unit_price NUMERIC(12, 0) NOT NULL,
  product_title TEXT NOT NULL,
  product_category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng nhật ký kiểm toán (Audit Logs)
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 4. API & SERVER ACTIONS CONTRACTS (SOURCE OF TRUTH)

### Public / Customer Storefront
- `GET /api/products`: Lấy danh sách sản phẩm theo category ('tool' | 'project' | 'lab211') có phân trang, search, tags filter. (Trả về public fields, KHÔNG chứa deliverable secret).
- `GET /api/products/:slug`: Lấy chi tiết sản phẩm và dữ liệu demo (`product_demos`).
- `POST /api/orders/create`: Tạo đơn hàng mới cho user đã đăng nhập. Trả về thông tin đơn hàng và thông số VietQR (ngân hàng, STK, số tiền, cú pháp `order_code`).
- `POST /api/orders/:id/submit-proof`: Khách hàng upload ảnh bill chuyển khoản hoặc gửi mã giao dịch ngân hàng, đổi trạng thái sang `pending_approval`.
- `GET /api/customer/my-orders`: Xem danh sách đơn hàng của khách.
- `GET /api/customer/orders/:id/deliverable`: Lấy tài nguyên bàn giao (chỉ thành công nếu order `status === 'completed'`). Server tạo signed download URL từ Supabase Storage.

### Admin Portal
- `GET /api/admin/dashboard/stats`: Thống kê: Tổng doanh thu, Doanh thu tháng/tuần, Số đơn chờ duyệt (`pending_approval`), Tổng số sản phẩm, Top sản phẩm bán chạy.
- `GET /api/admin/orders`: Danh sách tất cả đơn hàng (bộ lọc: `pending_approval`, `completed`, `rejected`, search theo `order_code`, khách hàng).
- `PATCH /api/admin/orders/:id/review`: Admin duyệt đơn (`action: 'approve'` -> `completed`) hoặc từ chối (`action: 'reject'` -> `rejected` kèm lý do `admin_notes`).
- `POST /api/admin/products`: Tạo sản phẩm mới kèm cấu hình demo đa phương tiện và tài liệu bàn giao.
- `PUT /api/admin/products/:id`: Cập nhật thông tin sản phẩm và demo links/gallery.
- `DELETE /api/admin/products/:id`: Soft delete sản phẩm (`deleted_at = now()`).
- `POST /api/admin/upload/asset`: Upload hình ảnh demo vào Supabase Storage public bucket.
- `POST /api/admin/upload/deliverable`: Upload file source code zip vào Supabase Storage private bucket.

---

## 5. ENVIRONMENT VARIABLES SPECIFICATION

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Supabase Service Role (CHỈ DÙNG TẠI SERVER - TUYỆT ĐỐI KHÔNG PREFIX NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# VietQR Bank Account Configuration
NEXT_PUBLIC_VIETQR_BANK_ID=MB          # Mã ngân hàng (MB, VCB, TCB, etc.)
NEXT_PUBLIC_VIETQR_ACCOUNT_NO=0123456789
NEXT_PUBLIC_VIETQR_ACCOUNT_NAME=NGUYEN VAN A
NEXT_PUBLIC_VIETQR_TEMPLATE=compact2

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. ACTIVE SPRINT & ROADMAP CONTEXT
- **Sprint 0: Setup & SDD Foundation (Hiện tại)**: Thiết lập cấu trúc dự án chuẩn SDD, bộ hiến pháp Constitution, Constraints, Shared Context và ADR.
- **Sprint 1: Supabase Database & Auth Schema**: Triển khai DDL tables, RLS policies, Storage buckets (`product-assets` [public] & `digital-deliverables` [private]).
- **Sprint 2: 3D Visual Experience & Modern UI**: Xây dựng Theme Cyberpunk / Modern Dark, Three.js 3D Hero canvas, dynamic layout, Framer Motion cards.
- **Sprint 3: Product Showcase & Rich Demo Engine**: Trang chi tiết Tool, Project, LAB211 với multi-image gallery, live demo, video preview, code snippet preview.
- **Sprint 4: Ordering & VietQR Payment Flow**: Giỏ hàng / Đặt mua tức thì, sinh mã QR ngân hàng, form gửi xác nhận thanh toán.
- **Sprint 5: Admin Portal & Approval Engine**: Dashboard doanh thu, bảng CRUD sản phẩm & demo, bảng duyệt đơn hàng (Admin approve -> unlock deliverable).
- **Sprint 6: Customer Deliverable Portal & Hardening**: Mở khóa tài nguyên số, signed URL download, audit logs, tối ưu hiệu năng Three.js 60fps.
