const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read environment variables
const envPath = path.resolve(__dirname, '..', '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const lines = env.split('\n');
const config = {};
lines.forEach((l) => {
  const [k, ...v] = l.split('=');
  if (k && v.length) config[k.trim()] = v.join('=').trim();
});

const supabaseUrl = config['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = config['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const sb = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  const productId = 'e0a102ed-ed01-4b02-9a03-ed0000010200';
  const demoId = 'e0a102ed-ed01-4b02-9a03-ed0000010201';

  const detailedDesc = [
    '### 🎯 GIẢI PHÁP TỐI ƯU CHO SINH VIÊN ĐẠI HỌC FPT MÔN IOT102',
    '',
    'Khóa học **IOT102 (Internet of Things)** trên nền tảng **edX** là một trong những học phần quan trọng và có phần điểm thưởng (Bonus Points) cực kỳ giá trị để nâng cao GPA môn học. Tuy nhiên:',
    '- Số lượng video bài giảng và tài liệu đọc kéo dài hàng chục tuần, tốn từ **30 - 50 tiếng** ngồi canh máy tính thủ công.',
    '- Các checkpoint yêu cầu phải xem hết từng giây video, không được tua nhanh bừa bãi nếu không sẽ không nhận điểm.',
    '- Việc bấm click thủ công từng bài cực kỳ nhàm chán và lãng phí thời gian quý báu của sinh viên.',
    '',
    '---',
    '',
    '### ⚡ TÍNH NĂNG ĐỘT PHÁ CỦA TOOL EDX IOT102',
    '',
    '1. **Auto Play & Đồng Bộ Video An Toàn**: Tự động phát và đồng bộ tiến độ video lên máy chủ edX với tốc độ tối ưu, đảm bảo hệ thống edX ghi nhận 100% thời lượng hoàn thành.',
    '2. **Auto Next Module & Mark Completed**: Tự động chuyển tiếp giữa các bài học, modules và kích hoạt dấu tích xanh (Green Checkmark) toàn khóa học.',
    '3. **Checkpoint & Reading Solver**: Tự động đánh dấu hoàn tất các bài đọc bắt buộc và hỗ trợ vượt qua các câu hỏi checkpoint trong quá trình học.',
    '4. **Anti-Detection & Smart Delay**: Cơ chế giả lập thao tác người dùng thật với độ trễ ngẫu nhiên an toàn, tuyệt đối không gây nghẽn mạng hay bị đánh dấu bất thường.',
    '5. **1 Click Duy Nhất**: Giao diện trực quan tích hợp ngay trên trình duyệt, chỉ cần 1 nút bấm là tool tự động chạy từ A đến Z.',
    '',
    '---',
    '',
    '### 📦 TÀI NGUYÊN BÀN GIAO KHI MUA HÀNG (DELIVERABLES)',
    '',
    '- **Link Thư Mục Google Drive Độc Quyền**: Chứa toàn bộ file script bản mới nhất, hướng dẫn cấu hình và file backup.',
    '- **Video Hướng Dẫn Tận Tình**: Video full HD từ kênh **Tuấn và Quân FPT UNIVERSITY** chỉ dẫn chi tiết từ lúc tải về đến lúc ăn trọn điểm thưởng.',
    '- **Hỗ Trợ Cập Nhật Miễn Phí**: Cam kết update script nếu edX có bất kỳ đợt cập nhật giao diện hoặc thuật toán mới nào.',
    '- **Hỗ Trợ 1-1**: Giải đáp thắc mắc nếu gặp khó khăn khi cài đặt hoặc vận hành.'
  ].join('\n');

  const accessInstructions = [
    '### 🚀 Hướng Dẫn Kích Hoạt & Vận Hành Tool edX IOT102:',
    '',
    '1. **Bước 1 — Tải Tool**: Nhấn nút **"Mở Thư Mục Google Drive"** bên trên để tải bộ mã nguồn script tool và các file hỗ trợ về máy tính của bạn.',
    '2. **Bước 2 — Xem Video Chi Tiết**: Nhấn nút **"Xem Video Hướng Dẫn"** từ kênh chính chủ **Tuấn và Quân FPT UNIVERSITY** (link YouTube đính kèm) để nắm bắt từng bước thao tác thực tế.',
    '3. **Bước 3 — Cài Đặt Tampermonkey / Script Runner**: Cài tiện ích mở rộng (Extension) **Tampermonkey** hoặc **Violentmonkey** trên trình duyệt (Chrome, Edge, Cốc Cốc, Brave). Sau đó import file script `.js` trong thư mục Drive vào tiện ích.',
    '4. **Bước 4 — Chạy Tool Trên edX**: Mở trang khóa học IOT102 của bạn trên edX, đăng nhập tài khoản. Giao diện điều khiển của Tool sẽ tự động xuất hiện ở góc màn hình.',
    '5. **Bước 5 — Bấm 1-Click & Nhận Điểm**: Nhấn **"Start Automation"**, tool sẽ tự động học các video, hoàn thành các phần reading và đánh dấu hoàn thành (dấu tích xanh) toàn bộ học phần.',
    '6. **Bước 6 — Kiểm Tra Điểm Thưởng**: Vào mục **Progress** trên edX để kiểm tra điểm số đạt 100% bonus cho môn IOT102.'
  ].join('\n');

  const productPayload = {
    id: productId,
    category: 'tool',
    title: 'TOOL TỰ ĐỘNG EDX IOT102 – 1 CLICK LẤY FULL BONUS FPTU',
    slug: 'tool-tu-dong-edx-iot102-fptu-bonus',
    short_description: 'Bộ tool tự động hóa hoàn thành toàn bộ khóa học, video, bài đọc và quiz edX môn IOT102 Đại học FPT siêu tốc. Giúp bạn lấy trọn vẹn điểm thưởng/bonus mà không tốn hàng chục giờ cày cuốc nhàm chán.',
    detailed_description: detailedDesc,
    price: 99000,
    original_price: 199000,
    thumbnail_url: 'https://i.ytimg.com/vi/OxmUL2i8BX4/maxresdefault.jpg',
    status: 'published',
    deliverable_type: 'download_file',
    storage_file_path: null,
    git_repo_url: 'https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing',
    access_instructions: accessInstructions,
  };

  const demoPayload = {
    id: demoId,
    product_id: productId,
    gallery_images: [
      'https://i.ytimg.com/vi/OxmUL2i8BX4/maxresdefault.jpg',
      'https://i.ytimg.com/vi/OxmUL2i8BX4/hqdefault.jpg',
    ],
    live_demo_url: 'https://drive.google.com/drive/folders/1TypYY2ty9Sw0wMOGPSthKu4s7U9Col4F?usp=sharing',
    video_demo_url: 'https://youtu.be/OxmUL2i8BX4?si=VKICEGOE39cqulVt',
    demo_credentials: 'Kênh hướng dẫn chính chủ: Tuấn và Quân FPT UNIVERSITY',
    code_preview_snippet: [
      '// [CodeVault Studio] edX IOT102 Automated Bonus Bot Runner',
      '// Tác giả: Tuấn và Quân FPT UNIVERSITY',
      'const bot = new EdxAutoWorker({',
      '  courseId: "course-v1:FPTU+IOT102x+2026",',
      '  autoPlayVideo: true,',
      '  smartDelayMs: 1500,',
      '  bypassCheckpoints: true,',
      '  targetBonusScore: 100,',
      '  onProgress: (status) => console.log(`[edX Runner] ${status.module}: 100% Done ✅`)',
      '});',
      '',
      'console.log("🚀 Bắt đầu chuỗi tự động hóa edX IOT102...");',
      'await bot.runScheduleSync();'
    ].join('\n'),
    features_list: [
      'Tự động xem toàn bộ video bài giảng edX không cần canh giờ',
      'Tự động chuyển bài & đánh dấu hoàn thành (Green Checkmark)',
      'Hỗ trợ vượt qua các checkpoint reading & quiz module IOT102',
      '1 Click lấy trọn vẹn 100% điểm Bonus môn IOT102 FPTU',
      'An toàn tuyệt đối, cơ chế delay thông minh mô phỏng thao tác người dùng',
      'Kèm video hướng dẫn cài đặt & vận hành chi tiết từ A-Z'
    ],
    tech_stack_tags: [
      'edX Automation',
      'IOT102',
      'FPT University',
      'JavaScript',
      'Tampermonkey / Extension',
      'Auto Bot'
    ]
  };

  console.log('Upserting product into Supabase...');
  const { data: prodData, error: prodErr } = await sb
    .from('products')
    .upsert(productPayload, { onConflict: 'slug' })
    .select();

  if (prodErr) {
    console.error('Failed to upsert product:', prodErr);
    process.exit(1);
  }

  const savedProductId = prodData[0].id;
  console.log('✅ Product upserted successfully: ID =', savedProductId, '| Title =', prodData[0].title);

  demoPayload.product_id = savedProductId;
  console.log('Upserting product_demos into Supabase...');
  const { data: demoData, error: demoErr } = await sb
    .from('product_demos')
    .upsert(demoPayload, { onConflict: 'product_id' })
    .select();

  if (demoErr) {
    console.error('Failed to upsert product_demos:', demoErr);
    process.exit(1);
  }

  console.log('✅ Product demo upserted successfully: ID =', demoData[0].id);
  console.log('\n🎉 ALL DATA PUSHED TO SUPABASE LIVE SUCCESSFULLY!');
}

seed().catch((err) => {
  console.error('Exception during seed:', err);
  process.exit(1);
});
