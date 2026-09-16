-- ==========================================================
-- CODEVAULT STUDIO: SAMPLE SEED DATA
-- Chạy script này trong Supabase SQL Editor sau khi đã chạy 001_initial_schema.sql
-- ==========================================================

DO $$
DECLARE
  prod1_id UUID := gen_random_uuid();
  prod2_id UUID := gen_random_uuid();
  prod3_id UUID := gen_random_uuid();
  prod4_id UUID := gen_random_uuid();
  prod5_id UUID := gen_random_uuid();
  prod6_id UUID := gen_random_uuid();
BEGIN

  -- 1. Xoá dữ liệu cũ nếu muốn làm sạch (tuỳ chọn)
  -- TRUNCATE public.order_items, public.orders, public.product_demos, public.products CASCADE;

  -- --------------------------------------------------------
  -- SẢN PHẨM 1: TOOL - Shopee Affiliate Auto Bot Pro
  -- --------------------------------------------------------
  INSERT INTO public.products (
    id, category, title, slug, short_description, detailed_description,
    price, original_price, thumbnail_url, status, deliverable_type,
    storage_file_path, git_repo_url, access_instructions
  ) VALUES (
    prod1_id,
    'tool',
    'Shopee & TikTok Affiliate Automation Bot Pro',
    'shopee-tiktok-affiliate-automation-bot-pro',
    'Bot tự động quét top trending sản phẩm hoa hồng cao, reup video TikTok tự động gắn link Affiliate và đẩy thông báo Telegram.',
    '### Tính năng vượt trội:
- **Tự động quét sản phẩm**: Quét các sản phẩm có tỉ lệ chuyển đổi cao và hoa hồng >15% trên Shopee.
- **Auto Render Video**: Tự động tải video Douyin/TikTok, xóa watermark, lồng phụ đề AI giọng đọc tiếng Việt và xuất chuẩn 1080p 60fps.
- **Đồng bộ đa kênh**: Hỗ trợ đăng tải lên TikTok, Facebook Reels, YouTube Shorts tự động 24/7.
- **Telegram Notification**: Nhận báo cáo đơn hàng và hoa hồng theo thời gian thực.

### Yêu cầu hệ thống:
- Node.js 18+ hoặc Docker
- RAM tối thiểu 2GB (Khuyến nghị VPS 2 Core 4GB RAM)',
    350000,
    590000,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    'published',
    'download_file',
    'digital-deliverables/shopee_affiliate_bot_v2.zip',
    'https://github.com/codevault-private/shopee-affiliate-bot',
    '1. Tải file ZIP giải nén\n2. Chạy `npm install`\n3. Điền API Key trong file .env theo hướng dẫn đính kèm\n4. Chạy `npm start` để khởi động bot'
  );

  INSERT INTO public.product_demos (
    product_id, gallery_images, live_demo_url, video_demo_url,
    demo_credentials, code_preview_snippet, features_list, tech_stack_tags
  ) VALUES (
    prod1_id,
    '["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"]'::jsonb,
    'https://demo-bot.codevault.dev',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'User test: demo / Pass: 123456',
    '// Khởi động bot worker
const bot = new AffiliateBotWorker({
  cronSchedule: "*/15 * * * *",
  minCommissionRate: 0.15,
  telegramAlert: true
});
await bot.runScheduleSync();',
    '["Tự động quét sản phẩm hoa hồng cao", "Xóa watermark video tự động", "Lồng tiếng AI tiếng Việt", "Báo cáo Telegram Realtime"]'::jsonb,
    '["Node.js", "Puppeteer", "Telegram API", "FFmpeg", "Docker"]'::jsonb
  );

  -- --------------------------------------------------------
  -- SẢN PHẨM 2: TOOL - Crypto Arbitrage Trading Bot
  -- --------------------------------------------------------
  INSERT INTO public.products (
    id, category, title, slug, short_description, detailed_description,
    price, original_price, thumbnail_url, status, deliverable_type,
    storage_file_path, git_repo_url, access_instructions
  ) VALUES (
    prod2_id,
    'tool',
    'Crypto Cross-Exchange Arbitrage Bot',
    'crypto-cross-exchange-arbitrage-bot',
    'Hệ thống phát hiện chênh lệch giá giữa Binance, Bybit và OKX với độ trễ thấp (low latency websocket), khớp lệnh chốt lời tự động.',
    '### Tổng quan công cụ:
Bot phân tích chênh lệch giá (Spread) tức thì giữa các sàn lớn thông qua WebSocket, tính toán phí gas và phí sàn để đưa ra quyết định vào lệnh Flash Arbitrage an toàn.

### Các module chính:
1. High-frequency WebSocket Orderbook Stream
2. Tri-Asset Triangulation Engine
3. Risk Manager & Circuit Breaker chống trượt giá',
    690000,
    1200000,
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80',
    'published',
    'git_access',
    NULL,
    'https://github.com/codevault-private/crypto-arbitrage-bot',
    'Sau khi đơn hàng được duyệt, tài khoản GitHub của bạn sẽ được cấp quyền truy cập repository private và hướng dẫn cấu hình API sàn.'
  );

  INSERT INTO public.product_demos (
    product_id, gallery_images, live_demo_url, video_demo_url,
    demo_credentials, code_preview_snippet, features_list, tech_stack_tags
  ) VALUES (
    prod2_id,
    '["https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80"]'::jsonb,
    'https://trading-view-demo.codevault.dev',
    NULL,
    NULL,
    'async function checkArbitrageSpread(pair: string) {
  const [binancePrice, bybitPrice] = await Promise.all([
    binanceWs.getBestAsk(pair),
    bybitWs.getBestBid(pair),
  ]);
  const spread = (bybitPrice - binancePrice) / binancePrice;
  if (spread > 0.008) triggerOrderExecution(pair, spread);
}',
    '["Websocket Low Latency", "Hỗ trợ Binance/Bybit/OKX", "Tự động tính phí sàn và trượt giá", "Giao diện Web Monitor"]'::jsonb,
    '["Go", "TypeScript", "Redis", "WebSocket", "Docker"]'::jsonb
  );

  -- --------------------------------------------------------
  -- SẢN PHẨM 3: PROJECT - Nha Khoa & Đặt Lịch Khám Fullstack
  -- --------------------------------------------------------
  INSERT INTO public.products (
    id, category, title, slug, short_description, detailed_description,
    price, original_price, thumbnail_url, status, deliverable_type,
    storage_file_path, git_repo_url, access_instructions
  ) VALUES (
    prod3_id,
    'project',
    'Đồ Án Capstone: Hệ Thống Quản Lý Phòng Khám Nha Khoa Thông Minh',
    'do-an-capstone-he-thong-phong-kham-nha-khoa-thong-minh',
    'Trọn bộ đồ án Capstone điểm A+: Next.js 14 App Router, NestJS Backend, PostgreSQL, quản lý bệnh án điện tử, đặt lịch hẹn và tích hợp SMS Brandname.',
    '### Đồ án tốt nghiệp / Capstone Project hoàn chỉnh:
- **Tài liệu đầy đủ**: Báo cáo Word 120 trang chuẩn mẫu trường (ĐH FPT, Bách Khoa, KHTN), Slide thuyết trình Canva/PPT, sơ đồ ERD, Use Case, Activity Diagram.
- **Frontend**: Next.js 14 Tailwind CSS, Shadcn UI, giao diện thân thiện với bệnh nhân và bác sĩ.
- **Backend**: NestJS, TypeORM, kiến trúc Clean Architecture modulized.
- **Chức năng**: Đặt lịch online, phân ca bác sĩ, quản lý kho thuốc, hóa đơn điện tử VietQR, gửi nhắc lịch hẹn qua SMS/Zalo.',
    890000,
    1500000,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'published',
    'download_file',
    'digital-deliverables/capstone_dental_clinic_fullstack.zip',
    'https://github.com/codevault-private/dental-clinic-capstone',
    'File ZIP bao gồm:\n- /frontend (Next.js 14)\n- /backend (NestJS API)\n- /docs (Báo cáo Word 120 trang, Slide bảo vệ, sơ đồ kiến trúc)\n- /database (Database export .sql có sẵn dữ liệu demo)'
  );

  INSERT INTO public.product_demos (
    product_id, gallery_images, live_demo_url, video_demo_url,
    demo_credentials, code_preview_snippet, features_list, tech_stack_tags
  ) VALUES (
    prod3_id,
    '["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80", "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80"]'::jsonb,
    'https://dental-clinic.codevault.dev',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'Admin: admin@clinic.com / Matkhau: Admin@123\nBác sĩ: doctor@clinic.com / Matkhau: Doc@123',
    '@Injectable()
export class AppointmentService {
  async bookSlot(patientId: string, slotId: string) {
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.timeSlot.findUnique({ where: { id: slotId } });
      if (!slot.isAvailable) throw new ConflictException("Slot đã có người đặt");
      return tx.appointment.create({ data: { patientId, slotId } });
    });
  }
}',
    '["Báo cáo đồ án 120 trang điểm A+", "Next.js 14 App Router", "NestJS RESTful API", "Tích hợp thanh toán VietQR", "Phân quyền 4 vai trò"]'::jsonb,
    '["Next.js", "NestJS", "PostgreSQL", "Tailwind CSS", "Prisma", "Docker"]'::jsonb
  );

  -- --------------------------------------------------------
  -- SẢN PHẨM 4: PROJECT - E-Commerce Microservices
  -- --------------------------------------------------------
  INSERT INTO public.products (
    id, category, title, slug, short_description, detailed_description,
    price, original_price, thumbnail_url, status, deliverable_type,
    storage_file_path, git_repo_url, access_instructions
  ) VALUES (
    prod4_id,
    'project',
    'Hệ Thống E-Commerce Kiến Trúc Microservices (Spring Boot & Kafka)',
    'he-thong-ecommerce-microservices-spring-boot-kafka',
    'Project môn Kiến trúc phần mềm & Phân tán: Hệ thống bán hàng chịu tải cao với Spring Cloud, Apache Kafka, Redis Caching và Keycloak Auth.',
    '### Cấu trúc Microservices:
- **Auth Service**: Keycloak OAuth2 / OpenID Connect
- **Product Catalog Service**: Spring Boot + Elasticsearch cho full-text search
- **Order & Payment Service**: SAGA Pattern điều phối phân tán
- **Notification Service**: Kafka consumer gửi email & push notification
- **API Gateway**: Spring Cloud Gateway định tuyến và rate-limiting',
    750000,
    1100000,
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    'published',
    'download_file',
    'digital-deliverables/ecommerce_microservices_spring_kafka.zip',
    NULL,
    'Chạy `docker-compose up -d` tại thư mục gốc để khởi chạy toàn bộ 6 service, Kafka broker, Redis và cơ sở dữ liệu MySQL.'
  );

  INSERT INTO public.product_demos (
    product_id, gallery_images, live_demo_url, video_demo_url,
    demo_credentials, code_preview_snippet, features_list, tech_stack_tags
  ) VALUES (
    prod4_id,
    '["https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80"]'::jsonb,
    NULL,
    NULL,
    NULL,
    '@KafkaListener(topics = "order-created-events", groupId = "notification-group")
public void handleOrderCreated(OrderEvent event) {
    log.info("Processing order notification: {}", event.getOrderId());
    emailService.sendReceipt(event.getCustomerEmail(), event.getTotal());
}',
    '["Kiến trúc Microservices chuẩn", "SAGA Pattern phân tán", "Message Queue Kafka", "Docker-compose one-click run"]'::jsonb,
    '["Java", "Spring Boot", "Apache Kafka", "Docker", "Redis", "Elasticsearch"]'::jsonb
  );

  -- --------------------------------------------------------

  -- ========================================================
  -- DANH SÁCH 18 SẢN PHẨM LAB211 THEO GIẢNG VIÊN (FPT)
  -- ========================================================
  -- --------------------------------------------------------
  -- LAB211: HIENNM23
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN HIENNM23',
      'source-code-lab211-giang-vien-hiennm23',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HIENNM23 (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên HIENNM23
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Chấm cực kỳ kỹ về mô hình MVC chuẩn và cấu trúc packages rành mạch. Đặt biệt chú trọng giải thích data flow giữa Controller và View.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// J1.L.P0023 - Validation chuẩn phong cách HIENNM23\npublic static int checkIntLimit(String msg, int min, int max) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV HIENNM23", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: TAMNT
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN TAMNT',
      'source-code-lab211-giang-vien-tamnt',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TAMNT (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên TAMNT
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Yêu cầu tuyệt đối không để crash chương trình khi nhập sai dữ liệu. Bắt buộc toàn bộ validation phải nằm trong package controller.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// InputValidator chuẩn TAMNT - Không bao giờ crash\npublic class InputValidator {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV TAMNT", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: ANHLT
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN ANHLT',
      'source-code-lab211-giang-vien-anhlt',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên ANHLT (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên ANHLT
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Rất thích hỏi sâu về 4 tính chất OOP (Kế thừa, Đa hình, Đóng gói, Trừu tượng). Code phân tách POJO Entity cực sạch.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Tính đa hình & trừu tượng chuẩn phong cách ANHLT\npublic abstract class Shape {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV ANHLT", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: HUYNM
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN HUYNM',
      'source-code-lab211-giang-vien-huynm',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HUYNM (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên HUYNM
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Tập trung vào tối ưu thuật toán tìm kiếm và sắp xếp. Hỏi cách vận hành của Binary Search và phân tích độ phức tạp O(log n).
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Binary Search đệ quy & vòng lặp chuẩn HUYNM\npublic static int binarySearch(...) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV HUYNM", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: VANTTN
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN VANTTN',
      'source-code-lab211-giang-vien-vanttn',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên VANTTN (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên VANTTN
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Yêu cầu giao diện Console hiển thị menu gọn gàng, in hóa đơn căn lề chuẩn theo bảng cột (%-15s %-10d).
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// In bảng hóa đơn căn lề đẹp chuẩn VANTTN\nSystem.out.printf(...);',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV VANTTN", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: HOAIBM
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN HOAIBM',
      'source-code-lab211-giang-vien-hoaibm',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HOAIBM (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên HOAIBM
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Đặc biệt chú trọng Clean Code, đặt tên biến camelCase chuẩn tiếng Anh, tuân thủ DRY và comment theo chuẩn Javadoc.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '/**\n * Quản lý lương nhân viên chuẩn HOAIBM\n */',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV HOAIBM", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: THANHDT
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN THANHDT',
      'source-code-lab211-giang-vien-thanhdt',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên THANHDT (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên THANHDT
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Quan tâm đến cách xử lý cấu trúc dữ liệu Collections (ArrayList, HashMap, Hashtable). Hỏi kỹ về equals() và hashCode().
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Sử dụng Hashtable lưu đơn hàng chuẩn THANHDT\nHashtable<String, ArrayList<OrderItem>> orders = new Hashtable<>();',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV THANHDT", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: THANGPD
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN THANGPD',
      'source-code-lab211-giang-vien-thangpd',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên THANGPD (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên THANGPD
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Thường yêu cầu sinh viên live coding sửa 1 method nhỏ tại chỗ để kiểm tra xem có tự hiểu code hay không. Kèm hướng dẫn chi tiết từng dòng.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Code modular cực kỳ dễ sửa tại chỗ khi thầy THANGPD yêu cầu\npublic boolean checkExistId(...) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV THANGPD", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: TRUNGNT
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN TRUNGNT',
      'source-code-lab211-giang-vien-trungnt',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TRUNGNT (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên TRUNGNT
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Hỏi bản chất Java SE 8, kiểm tra kiến thức về Garbage Collection, bộ nhớ Heap/Stack và tại sao phải đóng Scanner.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Đóng tài nguyên an toàn chuẩn TRUNGNT\ntry (Scanner scanner = new Scanner(System.in)) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV TRUNGNT", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: DONGLM
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN DONGLM',
      'source-code-lab211-giang-vien-donglm',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên DONGLM (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên DONGLM
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Yêu cầu cao về tính toàn vẹn của dữ liệu: Mã sinh viên, Số điện thoại, Email phải validate Regex chặt chẽ không có kẽ hở.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Regex chặt chẽ cho Account & Phone chuẩn DONGLM\npublic static final String PHONE_REGEX = ...',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV DONGLM", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: TUANVM
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN TUANVM',
      'source-code-lab211-giang-vien-tuanvm',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TUANVM (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên TUANVM
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Thích sinh viên có tư duy tổ chức code khoa học, chia nhỏ hàm < 30 dòng và viết test case bao phủ toàn bộ luồng biên.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Hàm ngắn gọn, tách nhỏ đúng Single Responsibility chuẩn TUANVM\npublic void processOrder() {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV TUANVM", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: YNT4
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN YNT4',
      'source-code-lab211-giang-vien-ynt4',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên YNT4 (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên YNT4
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Hỏi sâu về xử lý mảng 2 chiều (Matrix calculation) và cách xử lý chuỗi chuẩn hóa văn bản (Normalize text).
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Phép nhân 2 ma trận chuẩn thuật toán YNT4\npublic int[][] multiplyMatrix(...) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV YNT4", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: ANNV22
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN ANNV22',
      'source-code-lab211-giang-vien-annv22',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên ANNV22 (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên ANNV22
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Đề cao sự trung thực và hiểu rõ code: Bắt buộc giải thích được cơ chế Captcha trong bài EBank (P0070) và cách sinh số ngẫu nhiên.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Sinh Captcha ngẫu nhiên an toàn chuẩn ANNV22\npublic static String generateCaptcha(int len) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV ANNV22", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: TRITD
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN TRITD',
      'source-code-lab211-giang-vien-tritd',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TRITD (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên TRITD
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Quan tâm đến việc kiểm thử bài làm với số lượng lớn dữ liệu đầu vào. Tặng kèm bộ 50 câu hỏi vấn đáp thực chiến của thầy.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Kiểm tra dữ liệu danh sách lớn chuẩn TRITD\npublic boolean validateCapacity(...) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV TRITD", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: NUINX
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN NUINX',
      'source-code-lab211-giang-vien-nuinx',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên NUINX (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên NUINX
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Chấm tỉ mỉ từng chi tiết, yêu cầu menu quay vòng chuẩn xác, phím thoát rõ ràng, thông báo lỗi bằng tiếng Anh chuẩn mực.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Menu thân thiện, thông báo lỗi tiếng Anh chuẩn mực NUINX\npublic void showMenu() {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV NUINX", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: DIEUNT
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN DIEUNT',
      'source-code-lab211-giang-vien-dieunt',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên DIEUNT (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên DIEUNT
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Hỏi cặn kẽ về tư duy giải quyết bài toán và cách tổ chức package MVC. Code sạch, comment giải thích từng dòng.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Quản lý Doctor Management chuẩn DIEUNT\npublic void addDoctor(...) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV DIEUNT", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: HANHNT84
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN HANHNT84',
      'source-code-lab211-giang-vien-hanhnt84',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HANHNT84 (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên HANHNT84
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Kiểm tra kỹ việc xử lý ngày tháng (Date format dd/MM/yyyy) và tính toán khoảng thời gian (Plan time từ 8.0 đến 17.5 trong P0071).
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Validate thời gian làm việc chuẩn HANHNT84\npublic static double checkTime(...) {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV HANHNT84", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

  -- --------------------------------------------------------
  -- LAB211: NANGNTH
  -- --------------------------------------------------------
  DECLARE
    lab_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      lab_id,
      'lab211',
      'SOURCE CODE LAB211 GIẢNG VIÊN NANGNTH',
      'source-code-lab211-giang-vien-nangnth',
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên NANGNTH (Đại học FPT). Code sạch, mô hình MVC, test case 10/10 không crash kèm bộ câu hỏi vấn đáp khi bảo vệ.',
      '### Bộ Source Code LAB211 Chuẩn Giảng Viên NANGNTH
- Đầy đủ 12 bài Lab chuẩn FPT.
- Bám sát phong cách chấm: Đặc biệt chú trọng phong thái tự tin khi bảo vệ lab: Hướng dẫn mẹo trả lời trúng trọng tâm câu hỏi của cô, lấy trọn điểm 10/10.
- 100% JDK 8, Apache NetBeans 17, Java with Ant, mô hình MVC.',
      100000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      'Sau khi đơn hàng được duyệt, truy cập Kho Tài Nguyên Số (Vault) để xem trực tiếp đề bài Word và mã nguồn Java, hoặc tải về file ZIP.'
    );

    INSERT INTO public.product_demos (
      product_id, gallery_images, code_preview_snippet, features_list, tech_stack_tags
    ) VALUES (
      lab_id,
      '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
      '// Code mẫu chuẩn phong cách cô NANGNTH\npublic class TaskController {...}',
      '["Trọn bộ 12 bài Lab Java OOP", "Chuẩn form chấm GV NANGNTH", "Test case 10/10 không crash", "Kèm câu hỏi vấn đáp"]'::jsonb,
      '["Java 8", "OOP", "NetBeans 17", "MVC Pattern", "Clean Code"]'::jsonb
    );
  END;

END $$;
