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
  const productId = 'c0015e1a-c001-4c02-9a03-c00000010200';
  const demoId = 'c0015e1a-c001-4c02-9a03-c00000010201';

  const detailedDesc = [
    '### 🎯 GIẢI PHÁP TỰ ĐỘNG HÓA COURSERA HOÀN HẢO CHO SINH VIÊN & NGƯỜI ĐI LÀM',
    '',
    'Học tập trên **Coursera** là yêu cầu bắt buộc của nhiều trường đại học (như FPT University) cũng như các chứng chỉ quốc tế từ Google, IBM, Meta. Tuy nhiên:',
    '- Số lượng video và bài đọc kéo dài từ **40 - 100 tiếng**, ngốn rất nhiều thời gian quý báu.',
    '- Phải ngồi bấm từng video, không thể tua quá nhanh do Coursera giám sát tiến độ theo thời gian thực.',
    '- Các bài Quiz trắc nghiệm đánh giá kiến thức dày đặc đòi hỏi phải tra cứu mất công.',
    '',
    '---',
    '',
    '### ⚡ TÍNH NĂNG VƯỢT TRỘI CỦA TOOL EXTENSION COURSERA SKIP & QUIZ',
    '',
    '1. **Auto Skip Video An Toàn**: Tự động phát video và đồng bộ tiến độ hoàn thành lên máy chủ Coursera, đảm bảo 100% xanh dấu kiểm tra.',
    '2. **Auto Reading & Auto Next**: Tự động lướt tài liệu đọc (Reading articles) và chuyển tiếp ngay sang bài kế tiếp mà không cần click chuột thủ công.',
    '3. **AI Quiz Solver Hỗ Trợ**: Hỗ trợ giải bài trắc nghiệm thông minh, tiết kiệm thời gian vượt qua các tuần học khó nhằn.',
    '4. **Tiện Ích Chrome Extension Tiện Lợi**: Cài đặt trực tiếp vào Chrome / Edge / Cốc Cốc qua chế độ Developer Mode, giao diện popup trực quan.',
    '5. **Bản Quyền Tự Động Kích Hoạt Vĩnh Viễn**: Sau khi thanh toán thành công, hệ thống tự động cấp mã License Key (CSR-PERM) gắn liền với email Coursera của bạn.',
    '',
    '---',
    '',
    '### 📦 TÀI NGUYÊN BÀN GIAO KHI MUA HÀNG (DELIVERABLES)',
    '',
    '- **Thư Mục Google Drive Độc Quyền**: Chứa trọn bộ mã nguồn tiện ích mở rộng Chrome Extension đã build sẵn.',
    '- **Mã Bản Quyền Vĩnh Viễn (License Key)**: Mã key định dạng `CSR-PERM-...` hiển thị ngay tại Kho Tài Nguyên sau khi thanh toán được duyệt.',
    '- **Video Hướng Dẫn Chi Tiết**: Video Full HD từ kênh chính chủ **Tuấn và Quân FPT UNIVERSITY** chỉ dẫn từ A đến Z.',
    '- **Hỗ Trợ Kỹ Thuật 1-1**: Hỗ trợ kích hoạt và xử lý lỗi cài đặt qua Ultraviewer / Anydesk hoàn toàn miễn phí.'
  ].join('\n');

  const accessInstructions = [
    '### 🚀 Hướng Dẫn Cài Đặt & Kích Hoạt Bản Quyền Tool Coursera:',
    '',
    '1. **Bước 1 — Tải Bộ Cài Extension**: Bấm nút **"Mở Google Drive"** để tải toàn bộ thư mục tiện ích về máy tính, sau đó giải nén (Unzip) ra một thư mục.',
    '2. **Bước 2 — Mở Trang Quản Lý Tiện Ích Chrome**: Mở trình duyệt Chrome/Edge/Cốc Cốc, truy cập đường dẫn `chrome://extensions` trên thanh địa chỉ.',
    '3. **Bước 3 — Bật Developer Mode & Tải Tiện Ích**: Bật công tắc **Developer mode (Chế độ dành cho nhà phát triển)** ở góc trên bên phải, nhấn nút **Load unpacked (Tải tiện ích đã giải nén)** và chọn thư mục vừa giải nén ở Bước 1.',
    '4. **Bước 4 — Đăng Nhập Coursera**: Truy cập Coursera.org và đăng nhập đúng tài khoản email mà bạn đã đăng ký khi đặt mua.',
    '5. **Bước 5 — Kích Hoạt License Key**: Mở popup tiện ích hoặc vào một khóa học bất kỳ, dán mã **License Key** nhận được trong Kho Tài Nguyên vào ô kích hoạt và xác nhận. Tiện ích sẽ mở khóa toàn bộ tính năng Auto Skip & Quiz vĩnh viễn!'
  ].join('\n');

  const productPayload = {
    id: productId,
    category: 'tool',
    title: 'TOOL TỰ ĐỘNG COURSERA – AUTO SKIP VIDEO, READING & AI QUIZ (40K/THÁNG)',
    slug: 'tool-tu-dong-coursera-auto-skip-quiz',
    short_description: 'Tiện ích Chrome tự động hóa học Coursera đỉnh cao: Auto Skip Video, đánh dấu hoàn thành Reading và Tự động giải Quiz hỗ trợ AI thông minh. Gói bản quyền 1 tháng (30 ngày) cho 1 tài khoản Coursera chỉ 40.000đ.',
    detailed_description: detailedDesc,
    price: 40000,
    original_price: 80000,
    thumbnail_url: 'https://i.ytimg.com/vi/qld1bT_U8AQ/maxresdefault.jpg',
    status: 'published',
    deliverable_type: 'license_key',
    storage_file_path: null,
    git_repo_url: null,
    access_instructions: accessInstructions,
  };

  const demoPayload = {
    id: demoId,
    product_id: productId,
    gallery_images: [
      'https://i.ytimg.com/vi/qld1bT_U8AQ/maxresdefault.jpg',
      'https://i.ytimg.com/vi/qld1bT_U8AQ/hqdefault.jpg',
    ],
    live_demo_url: null,
    video_demo_url: 'https://youtu.be/qld1bT_U8AQ?si=NjOoWFUhGmwrwc9U',
    demo_credentials: 'Kênh hướng dẫn chính chủ: Tuấn và Quân FPT UNIVERSITY',
    code_preview_snippet: [
      '// [CodeVault Studio] Coursera Automation Extension Engine',
      '// Bản quyền chính chủ: Tuấn và Quân FPT UNIVERSITY (Gói 40k/tháng)',
      'class CourseraAutomationCore {',
      '  constructor(licenseKey, registeredEmail) {',
      '    this.license = licenseKey; // Key 30 ngày (1 tháng)',
      '    this.email = registeredEmail.trim().toLowerCase();',
      '    this.isActive = false;',
      '  }',
      '',
      '  async activateVIP() {',
      '    const isValid = await verifyLicenseSignature(this.license, this.email);',
      '    if (!isValid) throw new Error("License không hợp lệ hoặc đã hết hạn!");',
      '    this.isActive = true;',
      '    console.log("🚀 Coursera Skip VIP Activated: 30 Days License.");',
      '    this.startAutoLearningLoop();',
      '  }',
      '}'
    ].join('\n'),
    features_list: [
      'Gói bản quyền 1 tháng (30 ngày) cho 1 tài khoản Coursera giá chỉ 40.000 VNĐ',
      'Tự động tua và hoàn thành 100% video bài giảng Coursera',
      'Tự động lướt và đánh dấu hoàn thành toàn bộ tài liệu Reading',
      'Hỗ trợ tự động giải bài kiểm tra trắc nghiệm (AI Quiz Solver)',
      'Tự động kích hoạt bản quyền 30 ngày gắn theo email Coursera',
      'Tiện ích Chrome Extension cài đặt trực quan dạng Load Unpacked',
      'Kèm video YouTube hướng dẫn chi tiết từ kênh Tuấn và Quân FPT'
    ],
    tech_stack_tags: [
      'Coursera Automation',
      'Chrome Extension',
      'Auto Skip Video',
      'AI Quiz Solver',
      'JavaScript',
      'Tuấn và Quân FPT'
    ]
  };

  console.log('Upserting Coursera product into Supabase...');
  const { data: prodData, error: prodErr } = await sb
    .from('products')
    .upsert(productPayload, { onConflict: 'slug' })
    .select();

  if (prodErr) {
    console.error('Failed to upsert product:', prodErr);
    process.exit(1);
  }

  const savedProductId = prodData[0].id;
  console.log('✅ Coursera Product upserted successfully: ID =', savedProductId, '| Title =', prodData[0].title);

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

  console.log('✅ Coursera Product demo upserted successfully: ID =', demoData[0].id);
  console.log('\n🎉 ALL COURSERA TOOL DATA PUSHED TO SUPABASE LIVE SUCCESSFULLY!');
}

seed().catch((err) => {
  console.error('Exception during Coursera seed:', err);
  process.exit(1);
});
