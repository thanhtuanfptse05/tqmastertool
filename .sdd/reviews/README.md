# .sdd/reviews/ — AI & Human Review Reports

Thư mục này lưu trữ các báo cáo thẩm định (Review Reports) được tạo ra trong quá trình phát triển:

## Phân Loại Báo Cáo:
1. **Spec Reviews (`spec-review-*.md`):** Đánh giá chất lượng của bản đặc tả tính năng trước khi bước vào triển khai code (Kiểm tra EARS notation, ranh giới Out of Scope, bảo mật, tính khả thi).
2. **Code & Security Reviews (`code-review-*.md`):** Đánh giá mã nguồn trước khi merge PR (Kiểm tra tuân thủ Constitution, kiểm tra RLS policy, memory leaks trong Three.js, xử lý lỗi).
3. **Consistency Gate Audits (`consistency-audit-*.md`):** Kiểm tra độ đồng nhất giữa Code thực tế và Shared Context / Spec.
