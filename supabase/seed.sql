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
  -- SẢN PHẨM 5: LAB211 - Full 15 Bài Java OOP (Điểm 10/10)
  -- --------------------------------------------------------
  INSERT INTO public.products (
    id, category, title, slug, short_description, detailed_description,
    price, original_price, thumbnail_url, status, deliverable_type,
    storage_file_path, git_repo_url, access_instructions
  ) VALUES (
    prod5_id,
    'lab211',
    'LAB211 Trọn Bộ 15 Bài Lab Java Core & OOP (Chuẩn PE & Test Case 10/10)',
    'lab211-tron-bo-15-bai-lab-java-core-oop-diem-10',
    'Trọn bộ source code giải chi tiết 15 bài Lab môn LAB211 (Đại học FPT): Code sạch, comment giải thích từng dòng, kèm bộ test case và câu hỏi vấn đáp bảo vệ.',
    '### Danh sách các bài LAB211 có trong gói:
1. **J1.S.P0001**: Bubble sort algorithm
2. **J1.S.P0011**: Change base number system (Binary, Decimal, Hex)
3. **J1.S.P0021**: Student Management (Create, Find, Sort, Update, Delete)
4. **J1.S.P0052**: Manage Geographic Country Information
5. **J1.S.P0055**: Doctor Management Program
6. **J1.S.P0070**: TPBank Login System (Ebank with Captcha validation)
7. **J1.S.P0071**: Task Management program (Task Type, Time plan)
8. **J1.S.P0074**: Matrix calculation (Addition, Subtraction, Multiplication)
9. *Và 7 bài Lab phổ biến khác trong ngân hàng đề thi...*

### Điểm nổi bật:
- Tuân thủ 100% Coding Convention của giảng viên FPT.
- Xử lý triệt để ngoại lệ `InputMismatchException`, validate dữ liệu đầu vào không bị crash.
- Tặng kèm file tổng hợp 50 câu hỏi vấn đáp thường gặp khi bảo vệ Lab.',
    150000,
    250000,
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    'published',
    'download_file',
    'digital-deliverables/lab211_full_15_labs_java.zip',
    NULL,
    'Mở project bằng NetBeans 8.2 hoặc Apache NetBeans 12+ / IntelliJ IDEA. Chạy từng package tương ứng với mã đề bài lab.'
  );

  INSERT INTO public.product_demos (
    product_id, gallery_images, live_demo_url, video_demo_url,
    demo_credentials, code_preview_snippet, features_list, tech_stack_tags
  ) VALUES (
    prod5_id,
    '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]'::jsonb,
    NULL,
    NULL,
    NULL,
    '// J1.S.P0070: Ebank Captcha & Account Verification
public class TPBankManager {
    private static final String ACCOUNT_REGEX = "^\\d{10}$";
    
    public boolean checkAccount(String account) {
        if (!account.matches(ACCOUNT_REGEX)) {
            System.err.println("Account number must be 10 digits!");
            return false;
        }
        return true;
    }
}',
    '["Đầy đủ 15 bài Lab chuẩn đề", "Test case kiểm tra kỹ lưỡng", "Code comment chi tiết", "Bộ tài liệu vấn đáp bảo vệ môn"]'::jsonb,
    '["Java", "OOP", "NetBeans", "Clean Code", "Unit Testing"]'::jsonb
  );

  -- --------------------------------------------------------
  -- SẢN PHẨM 6: LAB211 - Candidate & Fruit Management
  -- --------------------------------------------------------
  INSERT INTO public.products (
    id, category, title, slug, short_description, detailed_description,
    price, original_price, thumbnail_url, status, deliverable_type,
    storage_file_path, git_repo_url, access_instructions
  ) VALUES (
    prod6_id,
    'lab211',
    'LAB211 Bộ 3 Bài Lab Nâng Cao: Candidate, Fruit Shop & Contact Management',
    'lab211-bo-3-bai-lab-nang-cao-candidate-fruit-contact',
    'Chuyên sâu 3 bài Lab có độ khó cao nhất trong LAB211 (J1.S.P0022, J1.S.P0023, J1.S.P0025). Tối ưu hóa cấu trúc dữ liệu Collections.',
    '### Gói bao gồm:
1. **J1.S.P0022**: Candidates Management (Experience, Fresher, Intern Candidates với kế thừa và đa hình chuẩn OOP).
2. **J1.S.P0023**: Fruit Shop System (Quản lý giỏ hàng mua sắm trái cây và xuất hóa đơn Order).
3. **J1.S.P0025**: Normalize Text (Xử lý chuỗi, dấu câu, khoảng trắng tự động chuẩn văn bản).',
    89000,
    150000,
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    'published',
    'download_file',
    'digital-deliverables/lab211_advanced_3_labs.zip',
    NULL,
    'Giải nén file ZIP, import project vào NetBeans và chạy trực tiếp file Main.java.'
  );

  INSERT INTO public.product_demos (
    product_id, gallery_images, live_demo_url, video_demo_url,
    demo_credentials, code_preview_snippet, features_list, tech_stack_tags
  ) VALUES (
    prod6_id,
    '["https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"]'::jsonb,
    NULL,
    NULL,
    NULL,
    '// OOP Polymorphism Demonstration: Candidate
public abstract class Candidate {
    protected String id, firstName, lastName, phone, email;
    protected int birthDate, type;
    public abstract void printInfo();
}',
    '["Kế thừa & Đa hình sâu sắc", "Xử lý ArrayList & HashMap linh hoạt", "Regex Validation chống nhập sai", "Hỗ trợ 1-1 nếu cần sửa code"]'::jsonb,
    '["Java", "OOP", "Data Structures", "Collections"]'::jsonb
  );

END $$;
