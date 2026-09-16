// ==========================================================
// CANONICAL DATA TYPES & DOMAIN MODELS
// Conforming to .sdd/shared_context.md
// ==========================================================

export type UUID = string;

export type ProductCategory = "tool" | "project" | "lab211";

export type ProductStatus = "draft" | "published" | "archived";

export type OrderStatus =
  | "pending_payment"   // Khách vừa tạo đơn, chưa thanh toán
  | "pending_approval"  // Khách đã chuyển khoản/up bill, chờ Admin duyệt
  | "completed"         // ĐÃ DUYỆT (SePay tự động hoặc Admin duyệt) -> Khách xem được nội dung số
  | "rejected"          // Admin từ chối (chưa nhận được tiền / sai cú pháp)
  | "cancelled"         // Khách tự hủy
  | "blocked";          // ADMIN CHẶN / THU HỒI QUYỀN TRUY CẬP (chống hack, gian lận, chuyển thiếu tiền)

export type UserRole = "customer" | "admin";

export interface ProductDemo {
  id: UUID;
  product_id: UUID;
  gallery_images: string[];
  live_demo_url?: string;
  video_demo_url?: string;
  demo_credentials?: string;
  code_preview_snippet?: string;
  features_list: string[];
  tech_stack_tags: string[];
  updated_at?: string;
}

export interface Product {
  id: UUID;
  category: ProductCategory;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  price: number;
  original_price?: number;
  thumbnail_url: string;
  status: ProductStatus;
  
  // Protected Deliverable
  deliverable_type: "download_file" | "git_access" | "license_key" | "instructions_only";
  storage_file_path?: string;
  git_repo_url?: string;
  license_key_template?: string;
  access_instructions?: string;
  
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Embedded Demo data for client convenience
  demo?: ProductDemo;
}

export interface UserProfile {
  id: UUID;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
}

export interface Order {
  id: UUID;
  order_code: string;
  user_id: UUID;
  user_email?: string;
  user_name?: string;
  total_amount: number;
  status: OrderStatus;
  
  payment_method: "vietqr";
  vietqr_content: string;
  payment_proof_image?: string;
  transaction_ref?: string;
  
  reviewed_by_admin_id?: UUID;
  reviewed_at?: string;
  admin_notes?: string;
  
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Embedded Items
  items?: OrderItem[];
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  unit_price: number;
  product_title: string;
  product_category: ProductCategory;
  product_thumbnail?: string;
  created_at: string;
}

export interface UnlockedDeliverable {
  order_id: UUID;
  product_id: UUID;
  product_title: string;
  product_category: ProductCategory;
  signed_download_url?: string;
  git_repo_url?: string;
  license_key?: string;
  instructions: string;
}

export interface AuditLog {
  id: UUID;
  actor_id: UUID;
  actor_email?: string;
  action: string;
  target_table: string;
  target_id: UUID;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface CartItem {
  product: Product;
  added_at: string;
}

export interface LabSourceFile {
  path: string;
  fileName: string;
  packageName: string;
  language: "java" | "xml" | "properties" | "text";
  content: string;
  size: number;
}

export interface LabExerciseItem {
  id: string;
  code: string;
  title: string;
  folderName: string;
  docxFileName: string;
  docxContentHtml: string;
  docxTextPreview: string;
  loc?: number;
  slots?: number;
  sourceFiles: LabSourceFile[];
  zipFileName: string;
  zipSize?: number;
  docxSize?: number;
  zipStoragePath?: string;
  docxStoragePath?: string;
}

export interface LabPackageManifest {
  packageId: string;
  title: string;
  ruleMarkdown?: string;
  labs: LabExerciseItem[];
  totalLabs: number;
  updatedAt: string;
}

