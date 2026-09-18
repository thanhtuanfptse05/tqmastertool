# SPEC-018: Deliverable Access Control & Strict Category Isolation

## 1. BỐI CẢNH & LỖ HỔNG BẢO MẬT (PROBLEM STATEMENT)
- **Sự cố**: Khách hàng mua **Tool Coursera Auto Skip (40.000đ)** sau khi đơn hàng chuyển sang trạng thái `completed` thì tại trang Đơn Hàng (`/customer/orders`) lại xuất hiện nút **"Xem Đề & Code"**, cho phép truy cập xem trọn bộ 12 bài Lab Java MVC và tải file ZIP của gói **LAB211**.
- **Nguyên nhân gốc rễ**:
  1. **Frontend (`CustomerOrdersPage`)**: Điều kiện hiển thị nút bàn giao chỉ kiểm tra `order.status === "completed"`, không kiểm tra danh mục sản phẩm trong đơn hàng. Mọi đơn hàng completed đều bị gán cứng nút `Xem Đề & Code`.
  2. **Backend API (`/api/deliverables/lab/view` & `/api/deliverables/lab/download`)**: Chỉ kiểm tra `order.status === "completed"`, hoàn toàn không kiểm tra đơn hàng có thực sự mua sản phẩm thuộc danh mục `lab211` hay không.
- **Mục tiêu giải quyết**:
  1. **Category Authorization Gate (Rào chắn phân quyền danh mục)**: Đơn hàng chỉ được phép truy cập tài nguyên LAB211 nếu trong `order_items` có chứa sản phẩm `category === 'lab211'`.
  2. **Giao diện phân định chính xác**:
     - Đơn hàng **LAB211**: Hiển thị nút *"Xem Đề & Code"* và *"Tải .ZIP"*.
     - Đơn hàng **Tool** (Coursera, Auto Skip...): Hiển thị *"Lấy Key & Hướng Dẫn"* / *"Mở Drive Tải Tool"*, TUYỆT ĐỐI KHÔNG hiển thị *"Xem Đề & Code"*.
     - Đơn hàng **Project**: Hiển thị *"Mở Kho Mã Nguồn"*.
  3. **Backend API Bảo Vệ Đa Tầng**: Chặn đứng trả về `403 Forbidden` tại `/api/deliverables/lab/view` và `/api/deliverables/lab/download` nếu đơn hàng không chứa item LAB211.

---

## 2. ACCEPTANCE CRITERIA

- [x] **AC-1 (Frontend Isolation)**: Trang `/customer/orders` kiểm tra chính xác sản phẩm trong đơn hàng. Đơn hàng Tool chỉ hiển thị nút xem tài nguyên Tool (Key, Drive, Vault). Không bao giờ hiển thị *"Xem Đề & Code"* cho Tool hay Project.
- [x] **AC-2 (Backend View Gate)**: API `/api/deliverables/lab/view` kiểm tra `order_items`. Nếu đơn hàng không có sản phẩm `category === 'lab211'`, từ chối ngay với mã lỗi `403` và thông báo `"Đơn hàng không chứa tài nguyên LAB211"`.
- [x] **AC-3 (Backend Download Gate)**: API `/api/deliverables/lab/download` áp dụng cùng logic kiểm tra nghiêm ngặt, ngăn chặn tải file `LAB211.zip` hoặc tài liệu Word/Java nếu đơn hàng không mua LAB211.
- [x] **AC-4 (Vault Consistency)**: Trang `/customer/vault` duy trì tính nhất quán, hiển thị đúng thẻ tài nguyên theo danh mục sản phẩm đã mua.

---

## 3. THIẾT KẾ KỸ THUẬT & TRIỂN KHAI

### 3.1. Helper phân định danh mục đơn hàng
```ts
export function isOrderContainingLab(order: Order, products: Product[]): boolean {
  return order.items?.some((item) => {
    if (item.product_category === "lab211") return true;
    const prod = products.find((p) => p.id === item.product_id);
    return prod?.category === "lab211";
  }) || false;
}
```

### 3.2. Server-side Gate trong `api/deliverables/lab/view` và `download`
Query `order_items` join hoặc check:
```ts
const { data: items } = await supabase
  .from("order_items")
  .select("product_id, product_category, product_title")
  .eq("order_id", orderId);

const hasLab211 = items?.some(i => i.product_category === "lab211" || i.product_title.toLowerCase().includes("lab211"));
if (!hasLab211) {
  return NextResponse.json(
    { error: "Đơn hàng này không bao gồm tài nguyên LAB211. Quyền truy cập bị từ chối." },
    { status: 403 }
  );
}
```
