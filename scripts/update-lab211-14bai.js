const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const lines = env.split('\n');
const config = {};
lines.forEach((l) => {
  const [k, ...v] = l.split('=');
  if (k && v.length) config[k.trim()] = v.join('=').trim();
});

const supabaseUrl = config['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = config['SUPABASE_SERVICE_ROLE_KEY'];
const sb = createClient(supabaseUrl, serviceRoleKey);

const LAB_LIST_14 = [
  { num: 1, code: 'J1.L.P0021', title: 'Student Management System', desc: 'Quan ly sinh vien: them, xoa, sua, tim kiem, sap xep va hien thi danh sach (Long Assignment).' },
  { num: 2, code: 'J1.L.P0022', title: 'Candidate Management System', desc: 'Quan ly ung vien phan loai Experience, Fresher, Intern - ap dung Ke thua & Da hinh OOP (Long Assignment).' },
  { num: 3, code: 'J1.L.P0023', title: 'Fruit Shop Management System', desc: 'Quan ly cua hang trai cay & gio hang shopping - dung ArrayList + HashTable (Long Assignment 175 LOC).' },
  { num: 4, code: 'J1.S.P0006', title: 'Binary Search Algorithm', desc: 'Thuat toan tim kiem nhi phan & sap xep mang.' },
  { num: 5, code: 'J1.S.P0009', title: 'Fibonacci Sequence Generator', desc: 'Day so Fibonacci de quy & vong lap toi uu.' },
  { num: 6, code: 'J1.S.P0010', title: 'Linear Search Algorithm', desc: 'Tim kiem tuyen tinh & phat hien phan tu trung lap.' },
  { num: 7, code: 'J1.S.P0011', title: 'Convert Base Number System', desc: 'Chuyen doi co so nhi phan, thap phan, thap luc phan (2, 10, 16).' },
  { num: 8, code: 'J1.S.P0051', title: 'BMI Calculator & Matrix Computer', desc: 'Tinh chi so the trong & tinh toan ma tran co ban.' },
  { num: 9, code: 'J1.S.P0056', title: 'Worker Management & Salary History', desc: 'Quan ly ho so cong nhan & bien dong tang/giam luong.' },
  { num: 10, code: 'J1.S.P0057', title: 'User Management System', desc: 'Quan ly tai khoan, ma hoa mat khau & kiem tra dang nhap.' },
  { num: 11, code: 'J1.S.P0061', title: 'Calculate Perimeters & Areas (Shape)', desc: 'Tinh chu vi & dien tich hinh Tam giac, Chu nhat, Tron.' },
  { num: 12, code: 'J1.S.P0070', title: 'TPBank Login & Captcha System (EBank)', desc: 'He thong dang nhap ngan hang Ebank & xac thuc Captcha.' },
  { num: 13, code: 'J1.S.P0071', title: 'Task Management Program', desc: 'Quan ly tien do cong viec theo Task Type & khoang thoi gian.' },
  { num: 14, code: 'J1.S.P0074', title: 'Matrix Calculation Program', desc: 'Cong, tru, nhan 2 ma tran hai chieu chuan toan hoc.' },
];

function buildLabList() {
  return LAB_LIST_14.map(l => l.num + '. **' + l.code + '**: ' + l.title + ' (' + l.desc + ')').join('\n');
}

function buildDetailedDesc(gv) {
  return '### TONG QUAN GOI BAI LAB211 - GIANG VIEN ' + gv + '\n\nBo source code hoan chinh mon LAB211 (Java Core & OOP) duoc toi uu hoa theo phong cach giang day cua Giang vien ' + gv + '.\n\n---\n\n### TANG KEM DAC QUYEN:\n- Tron bo Website ly thuyet OOP & Lap trinh huong doi tuong chuyen sau (PRO192 & LAB211): https://thanhtuanfptse05.github.io/PRO192-21392-theory/\n\n---\n\n### 4 DAU RA HOAN CHINH:\n1. **File De Bai Word (.docx)**: Day du 14 de bai goc, quy chuan LOC, slot hoc, dac ta chi tiet ham & test cases chuan FPT.\n2. **Tron Bo Source Code Java MVC (.java & .zip)**: 100% chuan Java 8 (JDK 1.8), du an Apache NetBeans 17, Ant, khong dung thu vien ngoai.\n3. **Ban Ghi Ket Qua Chay Mau (Console Run Output)**: Mau chay thu nghiem tung chuc nang menu.\n4. **Website Full Ly Thuyet OOP**: Truy cap vinh vien kho ly thuyet OOP: https://thanhtuanfptse05.github.io/PRO192-21392-theory/\n\n---\n\n### DANH SACH 14 BAI LAB HOAN CHINH:\n' + buildLabList() + '\n\n---\n\n### DAC DIEM BAO KE DIEM 10 VOI THAY/CO ' + gv + ':\n- 100% code tuong thich JDK 8 va Apache NetBeans 17.\n- Du an chuan Java with Ant.\n- Thiet ke chuan MVC.\n- Toan bo class validation (InputValidator.java) dat chuan o tang Controller.\n- Thuoc tinh private dong goi chat che, method comment Javadoc chi tiet.';
}

function buildShortDesc(gv) {
  return 'Tron bo 14 bai Lab Java OOP chuan form cham thi cua Giang vien ' + gv + ' (Dai hoc FPT). Day du 4 dau ra: De Word, Code MVC, Console Output, TANG KEM Web Ly Thuyet OOP nen tang bao ve diem 10.';
}

async function uploadZip() {
  const zipPath = path.resolve(__dirname, 'LAB211.zip');
  if (!fs.existsSync(zipPath)) { console.error('LAB211.zip not found'); return; }
  const buf = fs.readFileSync(zipPath);
  console.log('Uploading LAB211.zip (' + (buf.length/1024).toFixed(1) + ' KB)...');
  const { error } = await sb.storage.from('digital-deliverables').upload('lab211/LAB211.zip', buf, { contentType: 'application/zip', upsert: true });
  if (error) console.error('Storage upload error:', error.message);
  else console.log('Uploaded to digital-deliverables/lab211/LAB211.zip');
}

async function updateProducts() {
  const { data: products, error } = await sb.from('products').select('id, title, slug').eq('category', 'lab211').not('slug', 'eq', 'source-code-lab211-campus-hcm');
  if (error) { console.error('Error fetching products:', error); return; }
  console.log('Found ' + products.length + ' products to update');
  for (const p of products) {
    const parts = p.slug.split('-');
    const gv = parts[parts.length - 1].toUpperCase();
    const { error: e } = await sb.from('products').update({ short_description: buildShortDesc(gv), detailed_description: buildDetailedDesc(gv), updated_at: new Date().toISOString() }).eq('id', p.id);
    if (e) console.error('Failed ' + p.title + ':', e.message);
    else console.log('Updated: ' + p.title);
  }
}

async function main() {
  console.log('=== LAB211 Update: 12 bai -> 14 bai ===');
  await uploadZip();
  await updateProducts();
  console.log('=== DONE ===');
}
main().catch(e => { console.error(e); process.exit(1); });
