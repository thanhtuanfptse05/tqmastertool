-- ==========================================================
-- CODEVAULT STUDIO: SAMPLE SEED DATA
-- Chạy script này trong Supabase SQL Editor sau khi đã chạy 001_initial_schema.sql
-- ==========================================================

DO $$
DECLARE
  prod_edx_id UUID := 'e0a102ed-ed01-4b02-9a03-ed0000010200';
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
  -- SẢN PHẨM TOOL EDX IOT102 - FPTU BONUS (Spec 012)
  -- --------------------------------------------------------
  INSERT INTO public.products (
    id, category, title, slug, short_description, detailed_description,
    price, original_price, thumbnail_url, status, deliverable_type,
    storage_file_path, git_repo_url, access_instructions
  ) VALUES (
    prod_edx_id,
    'tool',
    'TOOL TỰ ĐỘNG EDX IOT102 – 1 CLICK LẤY FULL BONUS FPTU',
    'tool-tu-dong-edx-iot102-fptu-bonus',
    'Bộ tool tự động hóa hoàn thành toàn bộ khóa học, video, bài đọc và quiz edX môn IOT102 Đại học FPT siêu tốc. Giúp bạn lấy trọn vẹn điểm thưởng/bonus mà không tốn hàng chục giờ cày cuốc nhàm chán.',
    '### 🎯 GIẢI PHÁP TỐI ƯU CHO SINH VIÊN ĐẠI HỌC FPT MÔN IOT102

Khóa học **IOT102 (Internet of Things)** trên nền tảng **edX** là một trong những học phần quan trọng và có phần điểm thưởng (Bonus Points) cực kỳ giá trị để nâng cao GPA môn học. Tuy nhiên:
- Số lượng video bài giảng và tài liệu đọc kéo dài hàng chục tuần, tốn từ **30 - 50 tiếng** ngồi canh máy tính thủ công.
- Các checkpoint yêu cầu phải xem hết từng giây video, không được tua nhanh bừa bãi nếu không sẽ không nhận điểm.
- Việc bấm click thủ công từng bài cực kỳ nhàm chán và lãng phí thời gian quý báu của sinh viên.

---

### ⚡ TÍNH NĂNG ĐỘT PHÁ CỦA TOOL EDX IOT102

1. **Auto Play & Đồng Bộ Video An Toàn**: Tự động phát và đồng bộ tiến độ video lên máy chủ edX với tốc độ tối ưu, đảm bảo hệ thống edX ghi nhận 100% thời lượng hoàn thành.
2. **Auto Next Module & Mark Completed**: Tự động chuyển tiếp giữa các bài học, modules và kích hoạt dấu tích xanh (Green Checkmark) toàn khóa học.
3. **Checkpoint & Reading Solver**: Tự động đánh dấu hoàn tất các bài đọc bắt buộc và hỗ trợ vượt qua các câu hỏi checkpoint trong quá trình học.
4. **Anti-Detection & Smart Delay**: Cơ chế giả lập thao tác người dùng thật với độ trễ ngẫu nhiên an toàn, tuyệt đối không gây nghẽn mạng hay bị đánh dấu bất thường.
5. **1 Click Duy Nhất**: Giao diện trực quan tích hợp ngay trên trình duyệt, chỉ cần 1 nút bấm là tool tự động chạy từ A đến Z.

---

### 📦 TÀI NGUYÊN BÀN GIAO KHI MUA HÀNG (DELIVERABLES)

- **Link Thư Mục Google Drive Độc Quyền**: Chứa toàn bộ file script bản mới nhất, hướng dẫn cấu hình và file backup.
- **Video Hướng Dẫn Tận Tình**: Video full HD từ kênh **Tuấn và Quân FPT UNIVERSITY** chỉ dẫn chi tiết từ lúc tải về đến lúc ăn trọn điểm thưởng.
- **Hỗ Trợ Cập Nhật Miễn Phí**: Cam kết update script nếu edX có bất kỳ đợt cập nhật giao diện hoặc thuật toán mới nào.
- **Hỗ Trợ 1-1**: Giải đáp thắc mắc nếu gặp khó khăn khi cài đặt hoặc vận hành.',
    99000,
    199000,
    'https://i.ytimg.com/vi/OxmUL2i8BX4/maxresdefault.jpg',
    'published',
    'download_file',
    NULL,
    'https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing',
    '### 🚀 Hướng Dẫn Kích Hoạt & Vận Hành Tool edX IOT102:

1. **Bước 1 — Tải Tool**: Nhấn nút **"Mở Thư Mục Google Drive"** bên trên để tải bộ mã nguồn script tool và các file hỗ trợ về máy tính của bạn.
2. **Bước 2 — Xem Video Chi Tiết**: Nhấn nút **"Xem Video Hướng Dẫn"** từ kênh chính chủ **Tuấn và Quân FPT UNIVERSITY** (link YouTube đính kèm) để nắm bắt từng bước thao tác thực tế.
3. **Bước 3 — Cài Đặt Tampermonkey / Script Runner**: Cài tiện ích mở rộng (Extension) **Tampermonkey** hoặc **Violentmonkey** trên trình duyệt (Chrome, Edge, Cốc Cốc, Brave). Sau đó import file script `.js` trong thư mục Drive vào tiện ích.
4. **Bước 4 — Chạy Tool Trên edX**: Mở trang khóa học IOT102 của bạn trên edX, đăng nhập tài khoản. Giao diện điều khiển của Tool sẽ tự động xuất hiện ở góc màn hình.
5. **Bước 5 — Bấm 1-Click & Nhận Điểm**: Nhấn **"Start Automation"**, tool sẽ tự động học các video, hoàn thành các phần reading và đánh dấu hoàn thành (dấu tích xanh) toàn bộ học phần.
6. **Bước 6 — Kiểm Tra Điểm Thưởng**: Vào mục **Progress** trên edX để kiểm tra điểm số đạt 100% bonus cho môn IOT102.'
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    detailed_description = EXCLUDED.detailed_description,
    git_repo_url = EXCLUDED.git_repo_url,
    access_instructions = EXCLUDED.access_instructions;

  INSERT INTO public.product_demos (
    product_id, gallery_images, live_demo_url, video_demo_url,
    demo_credentials, code_preview_snippet, features_list, tech_stack_tags
  ) VALUES (
    prod_edx_id,
    '["https://i.ytimg.com/vi/OxmUL2i8BX4/maxresdefault.jpg", "https://i.ytimg.com/vi/OxmUL2i8BX4/hqdefault.jpg"]'::jsonb,
    'https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing',
    'https://youtu.be/OxmUL2i8BX4?si=VKICEGOE39cqulVt',
    'Kênh hướng dẫn chính chủ: Tuấn và Quân FPT UNIVERSITY',
    '// [CodeVault Studio] edX IOT102 Automated Bonus Bot Runner
const bot = new EdxAutoWorker({
  courseId: "course-v1:FPTU+IOT102x+2026",
  autoPlayVideo: true,
  smartDelayMs: 1500,
  bypassCheckpoints: true,
  targetBonusScore: 100
});
console.log("🚀 Bắt đầu chuỗi tự động hóa edX IOT102...");
await bot.runScheduleSync();',
    '["Tự động xem toàn bộ video bài giảng edX không cần canh giờ", "Tự động chuyển bài & đánh dấu hoàn thành (Green Checkmark)", "Hỗ trợ vượt qua các checkpoint reading & quiz module IOT102", "1 Click lấy trọn vẹn 100% điểm Bonus môn IOT102 FPTU", "An toàn tuyệt đối, cơ chế delay thông minh mô phỏng thao tác người dùng", "Kèm video hướng dẫn cài đặt & vận hành chi tiết từ A-Z"]'::jsonb,
    '["edX Automation", "IOT102", "FPT University", "JavaScript", "Tampermonkey / Extension", "Auto Bot"]'::jsonb
  ) ON CONFLICT (product_id) DO UPDATE SET
    gallery_images = EXCLUDED.gallery_images,
    live_demo_url = EXCLUDED.live_demo_url,
    video_demo_url = EXCLUDED.video_demo_url,
    features_list = EXCLUDED.features_list,
    tech_stack_tags = EXCLUDED.tech_stack_tags;

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
    180000,
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

-- DANH SÁCH 18 SẢN PHẨM LAB211 THEO GIẢNG VIÊN (FPT - ĐỒNG GIÁ 100,000đ)
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HIENNM23 (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN HIENNM23
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên HIENNM23.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ HIENNM23:
- **Phong cách chấm đặc thù:** Chấm cực kỳ kỹ về mô hình MVC chuẩn và cấu trúc packages rành mạch. Đặt biệt chú trọng giải thích data flow giữa Controller và View.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// J1.L.P0023 - Validation chuẩn phong cách HIENNM23\npublic static int checkIntLimit(String msg, int min, int max) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV HIENNM23', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TAMNT (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN TAMNT
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên TAMNT.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ TAMNT:
- **Phong cách chấm đặc thù:** Yêu cầu tuyệt đối không để crash chương trình khi nhập sai dữ liệu. Bắt buộc toàn bộ validation phải nằm trong package controller.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// InputValidator chuẩn TAMNT - Không bao giờ crash\npublic class InputValidator {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV TAMNT', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên ANHLT (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN ANHLT
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên ANHLT.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ ANHLT:
- **Phong cách chấm đặc thù:** Rất thích hỏi sâu về 4 tính chất OOP (Kế thừa, Đa hình, Đóng gói, Trừu tượng). Code phân tách POJO Entity cực sạch.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Tính đa hình & trừu tượng chuẩn phong cách ANHLT\npublic abstract class Shape {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV ANHLT', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HUYNM (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN HUYNM
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên HUYNM.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ HUYNM:
- **Phong cách chấm đặc thù:** Tập trung vào tối ưu thuật toán tìm kiếm và sắp xếp. Hỏi cách vận hành của Binary Search và phân tích độ phức tạp O(log n).
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Binary Search đệ quy & vòng lặp chuẩn HUYNM\npublic static int binarySearch(...) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV HUYNM', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên VANTTN (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN VANTTN
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên VANTTN.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ VANTTN:
- **Phong cách chấm đặc thù:** Yêu cầu giao diện Console hiển thị menu gọn gàng, in hóa đơn căn lề chuẩn theo bảng cột (%-15s %-10d).
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// In bảng hóa đơn căn lề đẹp chuẩn VANTTN\nSystem.out.printf(...);',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV VANTTN', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HOAIBM (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN HOAIBM
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên HOAIBM.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ HOAIBM:
- **Phong cách chấm đặc thù:** Đặc biệt chú trọng Clean Code, đặt tên biến camelCase chuẩn tiếng Anh, tuân thủ DRY và comment theo chuẩn Javadoc.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '/**\n * Quản lý lương nhân viên chuẩn HOAIBM\n */',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV HOAIBM', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên THANHDT (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN THANHDT
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên THANHDT.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ THANHDT:
- **Phong cách chấm đặc thù:** Quan tâm đến cách xử lý cấu trúc dữ liệu Collections (ArrayList, HashMap, Hashtable). Hỏi kỹ về equals() và hashCode().
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Sử dụng Hashtable lưu đơn hàng chuẩn THANHDT\nHashtable<String, ArrayList<OrderItem>> orders = new Hashtable<>();',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV THANHDT', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên THANGPD (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN THANGPD
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên THANGPD.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ THANGPD:
- **Phong cách chấm đặc thù:** Thường yêu cầu sinh viên live coding sửa 1 method nhỏ tại chỗ để kiểm tra xem có tự hiểu code hay không. Kèm hướng dẫn chi tiết từng dòng.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Code modular cực kỳ dễ sửa tại chỗ khi thầy THANGPD yêu cầu\npublic boolean checkExistId(...) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV THANGPD', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TRUNGNT (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN TRUNGNT
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên TRUNGNT.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ TRUNGNT:
- **Phong cách chấm đặc thù:** Hỏi bản chất Java SE 8, kiểm tra kiến thức về Garbage Collection, bộ nhớ Heap/Stack và tại sao phải đóng Scanner.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Đóng tài nguyên an toàn chuẩn TRUNGNT\ntry (Scanner scanner = new Scanner(System.in)) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV TRUNGNT', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên DONGLM (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN DONGLM
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên DONGLM.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ DONGLM:
- **Phong cách chấm đặc thù:** Yêu cầu cao về tính toàn vẹn của dữ liệu: Mã sinh viên, Số điện thoại, Email phải validate Regex chặt chẽ không có kẽ hở.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Regex chặt chẽ cho Account & Phone chuẩn DONGLM\npublic static final String PHONE_REGEX = ...',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV DONGLM', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TUANVM (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN TUANVM
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên TUANVM.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ TUANVM:
- **Phong cách chấm đặc thù:** Thích sinh viên có tư duy tổ chức code khoa học, chia nhỏ hàm < 30 dòng và viết test case bao phủ toàn bộ luồng biên.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Hàm ngắn gọn, tách nhỏ đúng Single Responsibility chuẩn TUANVM\npublic void processOrder() {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV TUANVM', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên YNT4 (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN YNT4
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên YNT4.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ YNT4:
- **Phong cách chấm đặc thù:** Hỏi sâu về xử lý mảng 2 chiều (Matrix calculation) và cách xử lý chuỗi chuẩn hóa văn bản (Normalize text).
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Phép nhân 2 ma trận chuẩn thuật toán YNT4\npublic int[][] multiplyMatrix(...) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV YNT4', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên ANNV22 (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN ANNV22
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên ANNV22.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ ANNV22:
- **Phong cách chấm đặc thù:** Đề cao sự trung thực và hiểu rõ code: Bắt buộc giải thích được cơ chế Captcha trong bài EBank (P0070) và cách sinh số ngẫu nhiên.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Sinh Captcha ngẫu nhiên an toàn chuẩn ANNV22\npublic static String generateCaptcha(int len) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV ANNV22', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên TRITD (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN TRITD
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên TRITD.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ TRITD:
- **Phong cách chấm đặc thù:** Quan tâm đến việc kiểm thử bài làm với số lượng lớn dữ liệu đầu vào. Tặng kèm web lý thuyết OOP củng cố kiến thức vững chắc.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Kiểm tra dữ liệu danh sách lớn chuẩn TRITD\npublic boolean validateCapacity(...) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV TRITD', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên NUINX (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN NUINX
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên NUINX.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ NUINX:
- **Phong cách chấm đặc thù:** Chấm tỉ mỉ từng chi tiết, yêu cầu menu quay vòng chuẩn xác, phím thoát rõ ràng, thông báo lỗi bằng tiếng Anh chuẩn mực.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Menu thân thiện, thông báo lỗi tiếng Anh chuẩn mực NUINX\npublic void showMenu() {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV NUINX', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên DIEUNT (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN DIEUNT
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên DIEUNT.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ DIEUNT:
- **Phong cách chấm đặc thù:** Hỏi cặn kẽ về tư duy giải quyết bài toán và cách tổ chức package MVC. Code sạch, comment giải thích từng dòng.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Quản lý Doctor Management chuẩn DIEUNT\npublic void addDoctor(...) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV DIEUNT', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên HANHNT84 (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN HANHNT84
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên HANHNT84.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ HANHNT84:
- **Phong cách chấm đặc thù:** Kiểm tra kỹ việc xử lý ngày tháng (Date format dd/MM/yyyy) và tính toán khoảng thời gian (Plan time từ 8.0 đến 17.5 trong P0071).
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Validate thời gian làm việc chuẩn HANHNT84\npublic static double checkTime(...) {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV HANHNT84', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
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
      'Trọn bộ 12 bài Lab Java OOP chuẩn form chấm thi của Giảng viên NANGNTH (Đại học FPT). Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, TẶNG KÈM Web Lý Thuyết OOP nền tảng bảo vệ điểm 10.',
      '### 🌟 TỔNG QUAN GÓI BÀI LAB211 — GIẢNG VIÊN NANGNTH
Bộ source code hoàn chỉnh môn LAB211 (Java Core & Lập trình hướng đối tượng OOP) được tối ưu hóa đặc thù theo phong cách giảng dạy và barem chấm điểm của Giảng viên NANGNTH.

---

### 🎁 TẶNG KÈM ĐẶC QUYỀN NỀN TẢNG:
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📦 4 ĐẦU RA HOÀN CHỈNH BÀN GIAO CHO SINH VIÊN:
1. **File Đề Bài Word Gốc (.docx)**: Đầy đủ 12 đề bài gốc, quy chuẩn LOC, slot học, đặc tả chi tiết hàm & test cases chuẩn FPT.
2. **Trọn Bộ Source Code Java MVC (.java & .zip)**: 100% chuẩn Java 8 (JDK 1.8), dự án Apache NetBeans 17, Ant, không dùng thư viện ngoài, không crash.
3. **Bản Ghi Kết QuẢ Chạy Mẫu (Console Run Output)**: Mẫu chạy thử nghiệm từng chức năng menu, validation dữ liệu biên, bảng hóa đơn căn lề chuẩn.
4. **Website Full Lý Thuyết OOP Nền Tảng**: Truy cập vĩnh viễn kho lý thuyết 4 tính chất OOP, Class, Object, Exception, Collection thi PE/Final: https://thanhtuanfptse05.github.io/PRO192-21392-theory/

---

### 📚 DANH SÁCH 12 BÀI LAB HOÀN CHỈNH TRONG GÓI:
1. **J1.L.P0023**: Fruit Shop Management System (Quản lý cửa hàng trái cây & giỏ hàng shopping - Long Assignment 175 LOC).
2. **J1.S.P0006**: Binary Search Algorithm (Thuật toán tìm kiếm nhị phân & sắp xếp mảng).
3. **J1.S.P0009**: Fibonacci Sequence Generator (Dãy số Fibonacci đệ quy & vòng lặp tối ưu).
4. **J1.S.P0010**: Linear Search Algorithm (Tìm kiếm tuyến tính & phát hiện phần tử trùng lặp).
5. **J1.S.P0011**: Convert Base Number System (Chuyển đổi cơ số nhị phân, thập phân, thập lục phân 2, 10, 16).
6. **J1.S.P0051**: BMI Calculator & Matrix Computer (Tính chỉ số thể trọng & tính toán ma trận cơ bản).
7. **J1.S.P0056**: Worker Management & Salary History (Quản lý hồ sơ công nhân & biến động tăng/giảm lương).
8. **J1.S.P0057**: User Management System (Quản lý tài khoản, mã hóa mật khẩu & kiểm tra đăng nhập).
9. **J1.S.P0061**: Calculate Perimeters & Areas (Tính chu vi & diện tích hình Tam giác, Chữ nhật, Tròn).
10. **J1.S.P0070**: TPBank Login & Captcha System (Hệ thống đăng nhập ngân hàng Ebank & xác thực Captcha).
11. **J1.S.P0071**: Task Management Program (Quản lý tiến độ công việc theo Task Type & khoảng thời gian).
12. **J1.S.P0074**: Matrix Calculation Program (Cộng, trừ, nhân 2 ma trận hai chiều chuẩn toán học).

---

### 🎯 ĐẶC ĐIỂM BẢO KÊ ĐIỂM 10 BẢO VỆ VỚI THẦY/CÔ NANGNTH:
- **Phong cách chấm đặc thù:** Đặc biệt chú trọng phong thái tự tin khi bảo vệ lab: Hướng dẫn mẹo trả lời trúng trọng tâm câu hỏi của cô, lấy trọn điểm 10/10.
- **Tuân thủ triệt để rule.md:**
  - 100% code tương thích **JDK 8 (Java SE 1.8)** và **Apache NetBeans 17**.
  - Dự án chuẩn **Java with Ant**, tuyệt đối không dùng thư viện ngoài.
  - Thiết kế chuẩn **MVC (Model - View - Controller)**.
  - Toàn bộ class validation (`InputValidator.java`) đặt chuẩn ở tầng **Controller**.
  - Thuộc tính private đóng gói chặt chẽ, method comment Javadoc chi tiết.
- **Tặng kèm đặc quyền:** Trọn bộ Website lý thuyết OOP & Lập trình hướng đối tượng chuyên sâu (PRO192 & LAB211) chuẩn bị kiến thức nền tảng vững chắc bảo vệ điểm 10: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      80000,
      200000,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      'published',
      'download_file',
      'digital-deliverables/lab211/LAB211.zip',
      NULL,
      '1. Sau khi đơn hàng được Admin duyệt, truy cập Kho Lưu Trữ (Deliverables Vault).
2. Bạn có thể xem trực tiếp Đề bài Word (.docx) và duyệt mã nguồn Java IDE có highlight cú pháp.
3. Tải về file Word gốc hoặc tải trọn bộ project NetBeans .ZIP để nộp bài hoặc ôn thi.
4. Truy cập ngay Web Lý Thuyết OOP nền tảng được tặng kèm: https://thanhtuanfptse05.github.io/PRO192-21392-theory/'
    );

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      lab_id,
      NULL,
      NULL,
      'Tặng kèm Web lý thuyết OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/',
      '// Code mẫu chuẩn phong cách cô NANGNTH\npublic class TaskController {...}',
      ARRAY['Trọn bộ 12 bài lab chuẩn đề thi FPT', 'Tối ưu hóa theo phong cách chấm của GV NANGNTH', 'Tặng Kèm: Web Lý Thuyết OOP Nền Tảng (PRO192/LAB211) Bảo Vệ Điểm 10', 'Đầy đủ 4 đầu ra: Đề Word, Code MVC, Console Output, Web OOP', 'Xử lý ngoại lệ triệt để 100% không crash', 'Bảo hành sửa code 1-1 trước kỳ thi'],
      ARRAY['Java 8', 'OOP', 'NetBeans 17', 'MVC Pattern', 'Clean Code'],
      ARRAY['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80']
    );

    -- --------------------------------------------------------
    -- SẢN PHẨM: TOOL TỰ ĐỘNG COURSERA SKIP & QUIZ SOLVER
    -- --------------------------------------------------------
    INSERT INTO public.products (
      id, category, title, slug, short_description, detailed_description,
      price, original_price, thumbnail_url, status, deliverable_type,
      storage_file_path, git_repo_url, access_instructions
    ) VALUES (
      'c0015e1a-c001-4c02-9a03-c00000010200'::uuid,
      'tool',
      'TOOL TỰ ĐỘNG COURSERA – AUTO SKIP VIDEO, READING & AI QUIZ (40K/THÁNG)',
      'tool-tu-dong-coursera-auto-skip-quiz',
      'Tiện ích Chrome tự động hóa học Coursera đỉnh cao: Auto Skip Video, đánh dấu hoàn thành Reading và Tự động giải Quiz hỗ trợ AI thông minh. Gói bản quyền 1 tháng (30 ngày) cho 1 tài khoản Coursera chỉ 40.000đ.',
      '### 🎯 GIẢI PHÁP TỰ ĐỘNG HÓA COURSERA HOÀN HẢO CHO SINH VIÊN & NGƯỜI ĐI LÀM
- Auto Skip Video và đồng bộ tiến độ 100%.
- Auto Reading & Auto Next module.
- AI Quiz Solver giải trắc nghiệm thông minh.
- Cấp License Key 30 ngày (1 tháng) gắn theo email đăng ký.',
      40000,
      80000,
      'https://i.ytimg.com/vi/qld1bT_U8AQ/maxresdefault.jpg',
      'published',
      'license_key',
      NULL,
      NULL,
      'Sau khi thanh toán thành công và được Admin duyệt, truy cập Kho Tài Nguyên (Deliverables Vault) để lấy mã License Key kích hoạt và tải thư mục tiện ích từ Google Drive.'
    ) ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      price = EXCLUDED.price,
      git_repo_url = EXCLUDED.git_repo_url;

    INSERT INTO public.product_demos (
      product_id, live_demo_url, video_demo_url, demo_credentials,
      code_preview_snippet, features_list, tech_stack_tags, gallery_images
    ) VALUES (
      'c0015e1a-c001-4c02-9a03-c00000010200'::uuid,
      NULL,
      'https://youtu.be/qld1bT_U8AQ?si=NjOoWFUhGmwrwc9U',
      'Kênh hướng dẫn chính chủ: Tuấn và Quân FPT UNIVERSITY',
      '// [CodeVault Studio] Coursera VIP Automation Engine (Gói 40k/tháng)\nconst license = "CSR-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX";',
      ARRAY['Gói bản quyền 1 tháng (30 ngày) cho 1 tài khoản Coursera giá chỉ 40.000 VNĐ', 'Tự động tua và hoàn thành 100% video bài giảng Coursera', 'Tự động lướt và đánh dấu hoàn thành Reading', 'Hỗ trợ tự động giải bài kiểm tra trắc nghiệm (AI Quiz)', 'Tự động cấp key 30 ngày gắn theo email Coursera', 'Tiện ích Chrome cài đặt trực quan dạng Load Unpacked', 'Kèm video YouTube hướng dẫn chi tiết từ kênh Tuấn và Quân FPT'],
      ARRAY['Coursera Automation', 'Chrome Extension', 'Auto Skip Video', 'AI Quiz Solver', 'JavaScript', 'Tuấn và Quân FPT'],
      ARRAY['https://i.ytimg.com/vi/qld1bT_U8AQ/maxresdefault.jpg', 'https://i.ytimg.com/vi/qld1bT_U8AQ/hqdefault.jpg']
    ) ON CONFLICT (product_id) DO UPDATE SET
      video_demo_url = EXCLUDED.video_demo_url,
      live_demo_url = EXCLUDED.live_demo_url;

  END;


END $$;
