import { Product, Order, UserProfile } from "@/types";

export const INITIAL_USERS: UserProfile[] = [
  {
    id: "user-admin-01",
    email: "admin@codevault.io",
    full_name: "Quản Trị Viên (Admin Lead)",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "admin",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-cust-01",
    email: "tuan.se05@fpt.edu.vn",
    full_name: "Thanh Tuấn SE05",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "customer",
    created_at: "2026-02-15T08:30:00Z",
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- LAB211 CATEGORY ---
  {
    id: "prod-lab-01",
    category: "lab211",
    title: "LAB211 Trọn Bộ 74 Bài Java OOP (J1.S.P0001 - J1.S.P0074)",
    slug: "lab211-tron-bo-74-bai-java-oop",
    short_description: "Toàn bộ mã nguồn 74 bài Lab môn LAB211 viết chuẩn OOP, Clean Code, có unit test và giải thích chi tiết từng hàm.",
    detailed_description: `## Trọn bộ LAB211 Chuẩn 100% Điểm Tuyệt Đối
Bộ bài tập thực hành lập trình hướng đối tượng Java OOP chuẩn Đại học FPT. 
Mỗi bài đều được thiết kế theo đúng quy chuẩn:
- Tách biệt rõ ràng Model, View, Controller (MVC)
- Xử lý ngoại lệ (Validation) chặt chẽ bằng Regex và vòng lặp do-while
- Comment giải thích chi tiết thuật toán
- Kèm theo tài liệu hướng dẫn thuyết trình bảo vệ trước giảng viên.`,
    price: 299000,
    original_price: 499000,
    thumbnail_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    status: "published",
    deliverable_type: "download_file",
    storage_file_path: "lab211-full-74-exercises-v2.zip",
    git_repo_url: "https://github.com/codevault-studio/lab211-java-full-pack",
    access_instructions: "1. Tải file ZIP về máy.\n2. Giải nén vào thư mục NetBeans/IntelliJ IDEA.\n3. Mở project và chọn Run File (Shift + F6). Đọc file README.md trong từng thư mục bài tập để xem rubric chấm điểm.",
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-10T14:20:00Z",
    demo: {
      id: "demo-lab-01",
      product_id: "prod-lab-01",
      gallery_images: [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80"
      ],
      video_demo_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      code_preview_snippet: `// J1.S.P0001: Bubble Sort Algorithm Implementation with Validation
package lab211.p0001;

import java.util.Random;
import java.util.Scanner;

public class BubbleSort {
    public static int checkInputInt(Scanner in, String msg, int min, int max) {
        while (true) {
            System.out.print(msg);
            try {
                int result = Integer.parseInt(in.nextLine().trim());
                if (result >= min && result <= max) return result;
                System.out.println("Vui lòng nhập trong khoảng [" + min + ", " + max + "]");
            } catch (NumberFormatException e) {
                System.err.println("Giá trị nhập vào phải là số nguyên!");
            }
        }
    }

    public static void bubbleSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (a[j] > a[j + 1]) {
                    int temp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = temp;
                }
            }
        }
    }
}`,
      features_list: [
        "Đầy đủ 74 bài từ J1.S.P0001 đến J1.S.P0074",
        "Chuẩn cấu trúc MVC, tách class Validation riêng",
        "Kèm file script hỏi đáp thường gặp khi bảo vệ đồ án",
        "Tương thích NetBeans 8.2, 12.0, IntelliJ, VS Code",
      ],
      tech_stack_tags: ["Java Core", "OOP", "Data Structures", "Algorithms", "MVC"],
    },
  },
  {
    id: "prod-lab-02",
    category: "lab211",
    title: "LAB211 J1.S.P0021 — Student Management System OOP",
    slug: "lab211-j1-s-p0021-student-management-system",
    short_description: "Hệ thống quản lý sinh viên với nghiệp vụ CRUD, đếm môn học, sắp xếp theo tên và kiểm tra trùng lặp sinh viên nâng cao.",
    detailed_description: `## Chi tiết bài Lab J1.S.P0021
Một trong những bài Lab xuất hiện nhiều nhất trong các đợt thi kết thúc môn LAB211:
- Quản lý danh sách sinh viên: Thêm, Tìm kiếm & Sắp xếp, Cập nhật & Xóa, Báo cáo (Report)
- Quy tắc kiểm tra tính hợp lệ sinh viên và phân loại khoá học (.Net, C/C++, Java)
- Code tối ưu Collection (ArrayList) và cấu trúc đối tượng rõ ràng.`,
    price: 89000,
    original_price: 150000,
    thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    status: "published",
    deliverable_type: "download_file",
    storage_file_path: "lab211-p0021-student-management.zip",
    access_instructions: "Import project vào IDE Java bất kỳ, run class Main.java để khởi động console interactive menu.",
    created_at: "2026-03-05T09:00:00Z",
    updated_at: "2026-03-12T11:00:00Z",
    demo: {
      id: "demo-lab-02",
      product_id: "prod-lab-02",
      gallery_images: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"
      ],
      code_preview_snippet: `public class Manager {
    public static void report(ArrayList<Student> ls) {
        if (ls.isEmpty()) {
            System.err.println("Danh sách trống.");
            return;
        }
        ArrayList<Report> lr = new ArrayList<>();
        // Logic thống kê số lượng khoá học của từng sinh viên
        for (Student s : ls) {
            int total = 0;
            for (Student count : ls) {
                if (s.getId().equalsIgnoreCase(count.getId()) 
                    && s.getCourseName().equalsIgnoreCase(count.getCourseName())) {
                    total++;
                }
            }
            if (!Validation.checkReportExist(lr, s.getStudentName(), s.getCourseName(), total)) {
                lr.add(new Report(s.getStudentName(), s.getCourseName(), total));
            }
        }
        // In báo cáo chuẩn định dạng bảng
    }
}`,
      features_list: [
        "Menu 5 chức năng đầy đủ theo đề bài",
        "Tự động tính tổng số môn đăng ký trong report",
        "Bảo vệ chống crash với mọi input lỗi",
      ],
      tech_stack_tags: ["Java", "OOP", "ArrayList", "Regex Validation"],
    },
  },

  // --- PROJECTS CATEGORY ---
  {
    id: "prod-prj-01",
    category: "project",
    title: "Đồ Án Tốt Nghiệp: E-Commerce Microservices Platform",
    slug: "do-an-tot-nghiep-e-commerce-microservices",
    short_description: "Hệ thống sàn thương mại điện tử kiến trúc Microservices (Next.js 14, Spring Boot 3, Kafka, Docker, Kubernetes). Đầy đủ slide và báo cáo Word 120 trang.",
    detailed_description: `## Hệ Thống Sàn Thương Mại Điện Tử Microservices
Dự án Capstone Project đạt điểm xuất sắc A+ tại kỳ tốt nghiệp.
Bao gồm trọn gói:
- 5 Microservices độc lập: User Service, Catalog Service, Order Service, Payment (VietQR & Stripe), Notification Service (Kafka).
- Frontend Next.js App Router hiện đại, chuẩn Responsive và SEO.
- Hệ thống CI/CD pipeline với GitHub Actions và triển khai Docker Swarm / Kubernetes.
- Kèm theo file tài liệu báo cáo Software Architecture Document (SAD), Test Plan và Slide bảo vệ hoàn chỉnh.`,
    price: 890000,
    original_price: 1500000,
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    status: "published",
    deliverable_type: "git_access",
    git_repo_url: "https://github.com/codevault-studio/microservices-capstone-suite",
    access_instructions: "Sau khi duyệt đơn, bạn sẽ nhận được quyền truy cập GitHub Repo riêng tư và link Google Drive chứa file Word báo cáo (120 trang) cùng Slide thuyết trình Figma/PowerPoint.",
    created_at: "2026-02-20T08:00:00Z",
    updated_at: "2026-03-08T15:00:00Z",
    demo: {
      id: "demo-prj-01",
      product_id: "prod-prj-01",
      gallery_images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80"
      ],
      live_demo_url: "https://demo.codevault.io/ecommerce-showcase",
      video_demo_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      demo_credentials: "Tài khoản test: admin@demo.com / Pass: Demo@123456",
      code_preview_snippet: `@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;
    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody CheckoutRequest req) {
        log.info("Processing order checkout for user: {}", req.getUserId());
        OrderResponse order = orderService.processCheckout(req);
        kafkaTemplate.send("orders-topic", new OrderCreatedEvent(order.getId(), order.getTotal()));
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }
}`,
      features_list: [
        "Kiến trúc Microservices Spring Cloud + Kafka Event-Driven",
        "Thanh toán tự động VietQR Napas 247 và Stripe Checkout",
        "Báo cáo thuyết minh Word 120 trang chuẩn mẫu Bộ GD&ĐT",
        "Slide thuyết trình PowerPoint 45 trang thiết kế chuyên nghiệp",
      ],
      tech_stack_tags: ["Next.js 14", "Spring Boot 3", "Apache Kafka", "PostgreSQL", "Docker", "Kubernetes"],
    },
  },
  {
    id: "prod-prj-02",
    category: "project",
    title: "Smart Campus: Hệ Thống Điểm Danh & Phân Tích Sinh Viên AI",
    slug: "smart-campus-diem-danh-phan-tich-ai",
    short_description: "Đồ án môn học phân tích dữ liệu chuyên cần và nhận diện khuôn mặt sinh viên thời gian thực sử dụng FastAPI, OpenCV và React.",
    detailed_description: `## Smart Campus Attendance & Analytics
Đồ án ứng dụng trí tuệ nhân tạo và xử lý ảnh để tự động hóa điểm danh giảng đường:
- Nhận diện khuôn mặt sinh viên qua webcam với độ chính xác 98.6%
- Bảng điều khiển giảng viên theo dõi tỉ lệ vắng và cảnh báo sinh viên có nguy cơ cấm thi
- Xuất file báo cáo Excel tự động theo mẫu phòng đào tạo.`,
    price: 450000,
    original_price: 750000,
    thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    status: "published",
    deliverable_type: "download_file",
    storage_file_path: "smart-campus-ai-suite.zip",
    access_instructions: "Chạy file setup.bat để tự động cài đặt môi trường virtualenv Python và dependencies. Chi tiết xem trong INSTALL.md.",
    created_at: "2026-03-02T11:00:00Z",
    updated_at: "2026-03-11T09:00:00Z",
    demo: {
      id: "demo-prj-02",
      product_id: "prod-prj-02",
      gallery_images: [
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
      ],
      features_list: [
        "FastAPI Backend với face_recognition dlib",
        "Dashboard React thống kê tỉ lệ chuyên cần theo lớp",
        "Thông báo cảnh báo qua Telegram Bot",
      ],
      tech_stack_tags: ["Python", "FastAPI", "React", "OpenCV", "SQLite"],
    },
  },

  // --- TOOLS CATEGORY ---
  {
    id: "prod-tool-01",
    category: "tool",
    title: "CodeVault AutoSubmission & Code Linter Bot Pro",
    slug: "codevault-autosubmission-linter-bot",
    short_description: "Tool desktop tự động đóng gói bài tập, format code theo chuẩn Google Style, kiểm tra lỗi cú pháp và nộp bài hệ thống trường học chỉ với 1 click.",
    detailed_description: `## Tiện ích tự động hóa lập trình CodeVault Bot
Công cụ đắc lực dành cho sinh viên IT:
- Tự động quét toàn bộ thư mục project, phát hiện file thừa (.DS_Store, .git, target, bin)
- Format code theo tiêu chuẩn clean code quốc tế
- Đóng gói file zip đúng cú pháp đặt tên MSSV_TenMon_LabX.zip
- Hỗ trợ phím tắt tiện dụng trên Windows & macOS.`,
    price: 149000,
    original_price: 250000,
    thumbnail_url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
    status: "published",
    deliverable_type: "license_key",
    license_key_template: "CVBOT-XXXX-YYYY-ZZZZ",
    access_instructions: "Cài đặt file CodeVaultBot-Setup.exe. Khởi động ứng dụng và nhập License Key được cấp bên dưới để kích hoạt bản quyền trọn đời.",
    created_at: "2026-03-04T12:00:00Z",
    updated_at: "2026-03-14T16:00:00Z",
    demo: {
      id: "demo-tool-01",
      product_id: "prod-tool-01",
      gallery_images: [
        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80"
      ],
      video_demo_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      features_list: [
        "Nén ZIP đúng cú pháp nộp bài không bao giờ bị trừ điểm",
        "Loại bỏ file rác tự động giúp dung lượng giảm 90%",
        "Kích hoạt 1 lần, sử dụng vĩnh viễn trên mọi thiết bị",
      ],
      tech_stack_tags: ["Tauri", "Rust", "TypeScript", "Tailwind CSS"],
    },
  },
  {
    id: "prod-tool-02",
    category: "tool",
    title: "FPT Exam & Attendance Schedule Sync Extension",
    slug: "fpt-exam-schedule-sync-extension",
    short_description: "Tiện ích Chrome/Edge đồng bộ lịch học, lịch thi từ FAP trực tiếp vào Google Calendar & Apple Calendar, nhắc giờ học trước 30 phút.",
    detailed_description: `## Đồng Bộ Lịch Học & Lịch Thi Thông Minh
Không bao giờ lo ngủ quên hoặc quên phòng thi:
- 1-Click đồng bộ toàn bộ thời khóa biểu kỳ học vào Google Calendar
- Hiển thị phòng học, tên giảng viên, link Meet (nếu có)
- Tính toán tỉ lệ điểm danh và cảnh báo số buổi còn được nghỉ.`,
    price: 69000,
    original_price: 120000,
    thumbnail_url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80",
    status: "published",
    deliverable_type: "instructions_only",
    access_instructions: "Tải file zip extension, mở chrome://extensions, bật Developer Mode và chọn 'Load unpacked' trỏ vào thư mục đã giải nén.",
    created_at: "2026-03-08T07:30:00Z",
    updated_at: "2026-03-14T10:00:00Z",
    demo: {
      id: "demo-tool-02",
      product_id: "prod-tool-02",
      gallery_images: [
        "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&auto=format&fit=crop&q=80"
      ],
      features_list: [
        "Tích hợp sâu Google Calendar API",
        "Giao diện Popup trực quan với chế độ Dark Mode",
        "Bảo mật 100%, không lưu mật khẩu FAP của sinh viên",
      ],
      tech_stack_tags: ["Chrome Extension", "Manifest V3", "JavaScript", "Google Calendar API"],
    },
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "order-pending-01",
    order_code: "CV-2026-8942",
    user_id: "user-cust-01",
    user_email: "tuan.se05@fpt.edu.vn",
    user_name: "Thanh Tuấn SE05",
    total_amount: 299000,
    status: "pending_approval",
    payment_method: "vietqr",
    vietqr_content: "CV20268942",
    payment_proof_image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    transaction_ref: "MBVCB89342918",
    created_at: "2026-03-15T07:15:00Z",
    updated_at: "2026-03-15T07:20:00Z",
    items: [
      {
        id: "item-01",
        order_id: "order-pending-01",
        product_id: "prod-lab-01",
        product_title: "LAB211 Trọn Bộ 74 Bài Java OOP (J1.S.P0001 - J1.S.P0074)",
        product_category: "lab211",
        unit_price: 299000,
        product_thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&auto=format&fit=crop&q=80",
        created_at: "2026-03-15T07:15:00Z",
      }
    ]
  },
  {
    id: "order-completed-01",
    order_code: "CV-2026-7721",
    user_id: "user-cust-01",
    user_email: "tuan.se05@fpt.edu.vn",
    user_name: "Thanh Tuấn SE05",
    total_amount: 149000,
    status: "completed",
    payment_method: "vietqr",
    vietqr_content: "CV20267721",
    payment_proof_image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    transaction_ref: "MBVCB77219902",
    reviewed_by_admin_id: "user-admin-01",
    reviewed_at: "2026-03-14T11:05:00Z",
    admin_notes: "Đã nhận đúng số tiền qua tài khoản MBBank. Đơn hợp lệ.",
    created_at: "2026-03-14T10:45:00Z",
    updated_at: "2026-03-14T11:05:00Z",
    items: [
      {
        id: "item-02",
        order_id: "order-completed-01",
        product_id: "prod-tool-01",
        product_title: "CodeVault AutoSubmission & Code Linter Bot Pro",
        product_category: "tool",
        unit_price: 149000,
        product_thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=200&auto=format&fit=crop&q=80",
        created_at: "2026-03-14T10:45:00Z",
      }
    ]
  }
];
