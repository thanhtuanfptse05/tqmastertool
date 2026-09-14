# Feature Spec: [Tên Tính Năng] (EXECUTABLE SPEC TEMPLATE)

# Status: Draft | In Review | Approved | Implemented
# Version: 1.0.0
# Author: [Tên Tác Giả / Agent]
# Approved By: [Tech Lead / Product Owner]
# Target Sprint: [Sprint X]
# Level: Standard (hoặc Full / Light tùy độ phức tạp)

---

## 1. CONTEXT & GOAL (Tại Sao Tính Năng Này Tồn Tại?)
- **Bối cảnh nghiệp vụ (Business Context):** Mô tả vấn đề cần giải quyết từ góc độ người dùng hoặc hệ thống.
- **Mục tiêu tính năng (Feature Goal):** Kết quả mong đợi sau khi tính năng hoàn thành.
- **Chỉ số thành công (Success Metrics):** Tiêu chí đo lường định lượng (ví dụ: thời gian xử lý < 2s, tỷ lệ duyệt thành công > 99%).

---

## 2. ACTORS & ROLES (Ai Tương Tác & Quyền Hạn Gì?)
| Actor | Mô tả | Quyền Hạn Trong Feature Này |
|---|---|---|
| Khách vãng lai (Guest) | Chưa đăng nhập | Xem danh sách, xem demo sản phẩm |
| Khách hàng (Customer) | Đã đăng nhập tài khoản | Đặt hàng, quét mã QR, upload bill, xem link tải đã duyệt |
| Quản trị viên (Admin) | Có role 'admin' | CRUD sản phẩm, duyệt/từ chối đơn hàng, xem dashboard |
| Hệ thống (System/Cron) | Tự động hóa | Sinh mã đơn, tạo signed URL hết hạn, log audit |

---

## 3. FUNCTIONAL REQUIREMENTS (Quy Tắc EARS Notation)
*Áp dụng cú pháp EARS (Easy Approach to Requirements Syntax) để triệt tiêu sự mơ hồ:*

- **Ubiquitous (Mọi lúc):**
  - `THE system SHALL [hành vi luôn xảy ra].`
- **Event-Driven (Khi có sự kiện kích hoạt):**
  - `WHEN [sự kiện xảy ra], THE system SHALL [phản hồi của hệ thống].`
- **State-Driven (Khi ở trạng thái nhất định):**
  - `WHILE [hệ thống đang ở trạng thái X], THE system SHALL [hành vi].`
- **Optional Feature (Tính năng có điều kiện):**
  - `WHERE [điều kiện hoặc cấu hình bật], THE system SHALL [hành vi].`
- **Unwanted Behavior (Xử lý ngoại lệ / lỗi):**
  - `IF [lỗi hoặc dữ liệu không hợp lệ], THEN THE system SHALL [xử lý lỗi & trả về mã].`

---

## 4. NON-FUNCTIONAL REQUIREMENTS
- **Hiệu năng:** Thời gian phản hồi API P95 < 300ms; Three.js 3D viewport giữ mức 60 FPS trên thiết bị tiêu chuẩn.
- **Bảo mật:** Không tiết lộ link tải số khi đơn chưa duyệt; dữ liệu đầu vào được validate qua Zod.
- **Giao diện & Trải nghiệm:** Chuyển động mượt mà bằng Framer Motion, giao diện tương thích hoàn hảo từ mobile đến 4K.

---

## 5. DATA MODEL & SCHEMA CHANGES
- **Bảng liên quan:** [Tên các bảng trong Supabase]
- **Trường dữ liệu mới (nếu có):**
  ```sql
  -- DDL migration snippet nếu có
  ```
- **TypeScript Interface:**
  ```typescript
  // Interfaces hoặc Zod Schema tương ứng
  ```

---

## 6. ERROR HANDLING MATRIX
| Tình Huống Lỗi | Điều Kiện Kích Hoạt | HTTP Status | Error Code | Thông Báo Trả Về |
|---|---|---|---|---|
| Thiếu thông tin | Input form không hợp lệ | 400 | `INVALID_INPUT` | "Vui lòng điền đầy đủ các trường bắt buộc" |
| Chưa đăng nhập | Header thiếu auth token | 401 | `UNAUTHORIZED` | "Bạn cần đăng nhập để thực hiện thao tác này" |
| Không đủ quyền | Customer gọi route admin | 403 | `FORBIDDEN` | "Bạn không có quyền truy cập khu vực này" |
| Chưa được duyệt | Khách tải file khi chưa duyệt | 403 | `ORDER_NOT_APPROVED` | "Đơn hàng đang chờ Admin kiểm duyệt thanh toán" |

---

## 7. ACCEPTANCE CRITERIA (Given - When - Then)
### Scenario 1: Happy Path
- **GIVEN** [Tiền đề hợp lệ]
- **WHEN** [Hành động xảy ra]
- **THEN** [Kết quả kỳ vọng]

### Scenario 2: Error / Edge Case
- **GIVEN** [Tiền đề phát sinh lỗi]
- **WHEN** [Người dùng thao tác]
- **THEN** [Hệ thống ngăn chặn và hiển thị lỗi tương ứng]

---

## 8. OUT OF SCOPE (Những Gì KHÔNG Làm Trong Sprint Này)
*Thành phần quan trọng để tránh AI Scope Creep và AI tự ý thêm tính năng:*
- [ ] Tích hợp cổng thanh toán quốc tế (Stripe/PayPal) — Chưa làm trong sprint này.
- [ ] Hệ thống Affiliate / Tiếp thị liên kết — Dành cho phase sau.
- [ ] Đánh giá sao & bình luận công khai — Làm ở sprint sau.
