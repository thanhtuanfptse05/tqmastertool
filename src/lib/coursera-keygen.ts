import crypto from "crypto";

export const COURSERA_SECRET_SALT = "Coursera_Skip_VIP_2024_@XyZ_Secret_Key_999";

/**
 * Sinh License Key chuẩn Coursera Auto Skipper VIP
 * @param email Email tài khoản Coursera của khách hàng
 * @param duration "perm" (vĩnh viễn) hoặc số ngày hợp lệ (mặc định 30 ngày / 1 tháng)
 * @returns Chuỗi License Key chuẩn 7 part: CSR-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
 */
export function generateCourseraLicenseKey(
  email: string,
  duration: "perm" | number = 30
): string {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error("Email không được để trống khi tạo License Key.");
  }

  let expStr = "PERM0000";
  if (duration !== "perm" && typeof duration === "number" && duration > 0) {
    const addMs = duration * 24 * 60 * 60 * 1000;
    const expDate = new Date(Date.now() + addMs);
    expStr = Math.floor(expDate.getTime() / 1000)
      .toString(36)
      .toUpperCase()
      .padStart(8, "0");
  }

  // SHA256 (cleanEmail + expStr + SECRET_SALT)
  const hash = crypto
    .createHash("sha256")
    .update(cleanEmail + expStr + COURSERA_SECRET_SALT)
    .digest("hex");

  const rawKeyPart = hash.substring(0, 16).toUpperCase();
  const keyPart = rawKeyPart.match(/.{1,4}/g)?.join("-") || rawKeyPart;
  const expFormatted = expStr.match(/.{1,4}/g)?.join("-") || expStr;

  return `CSR-${expFormatted}-${keyPart}`;
}

/**
 * Kiểm tra tính hợp lệ của License Key theo cơ chế xác thực của content.js
 */
export function verifyCourseraLicenseKey(
  key: string,
  email: string
): { valid: boolean; error?: string } {
  const cleanKey = (key || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanKey) return { valid: false, error: "License Key không được để trống." };
  if (!cleanEmail) return { valid: false, error: "Email không được để trống." };

  const parts = cleanKey.split("-");
  if (parts[0] !== "CSR") {
    return { valid: false, error: "Định dạng Key không hợp lệ (thiếu tiền tố CSR)." };
  }

  // Tương thích key cũ (5 parts không có Exp)
  if (parts.length === 5) {
    const hash = crypto
      .createHash("sha256")
      .update(cleanEmail + COURSERA_SECRET_SALT)
      .digest("hex");
    let expectedKeyPart = hash.substring(0, 16).toUpperCase();
    expectedKeyPart = expectedKeyPart.match(/.{1,4}/g)?.join("-") || expectedKeyPart;
    const expectedKey = `CSR-${expectedKeyPart}`;
    return cleanKey === expectedKey
      ? { valid: true }
      : { valid: false, error: `License Key không hợp lệ cho email: ${cleanEmail}` };
  }

  // Key mới có Exp (7 parts)
  if (parts.length !== 7) {
    return { valid: false, error: "Định dạng Key không hợp lệ (yêu cầu cấu trúc 7 phần)." };
  }

  const expFormatted = parts[1] + parts[2];
  const hashPart = parts.slice(3).join("-");

  // Kiểm tra thời hạn
  if (expFormatted !== "PERM0000") {
    const expTimestampStr = expFormatted.replace(/^0+/, "") || "0";
    const expTimestamp = parseInt(expTimestampStr, 36) * 1000;
    if (isNaN(expTimestamp)) {
      return { valid: false, error: "Định dạng Key không hợp lệ (lỗi thời gian)." };
    }
    if (Date.now() > expTimestamp) {
      const expDate = new Date(expTimestamp);
      return {
        valid: false,
        error: `Key của bạn đã hết hạn vào ngày ${expDate.toLocaleDateString("vi-VN")}`,
      };
    }
  }

  // Xác thực chữ ký Hash
  const hash = crypto
    .createHash("sha256")
    .update(cleanEmail + expFormatted + COURSERA_SECRET_SALT)
    .digest("hex");
  let expectedKeyPart = hash.substring(0, 16).toUpperCase();
  expectedKeyPart = expectedKeyPart.match(/.{1,4}/g)?.join("-") || expectedKeyPart;

  if (hashPart === expectedKeyPart) {
    return { valid: true };
  }
  return { valid: false, error: "License Key không hợp lệ hoặc không khớp với email này." };
}

export interface CourseraLicenseItem {
  email: string;
  key: string;
  durationLabel: string;
  isExpired: boolean;
  daysRemaining?: number;
  expirationDate?: Date;
  formattedExpDate?: string;
  isReused?: boolean;
}

export interface LicenseDurationInfo {
  isPermanent: boolean;
  isExpired: boolean;
  daysRemaining: number;
  expirationDate?: Date;
  formattedExpDate: string;
  label: string;
  status: "active" | "expired" | "permanent";
  badgeClass: string;
}

/**
 * Sinh danh sách nhiều License Key cho nhiều Email Coursera
 */
export function generateMultipleCourseraKeys(
  emails: string[],
  duration: "perm" | number = 30
): CourseraLicenseItem[] {
  return emails
    .map((e) => (e || "").trim().toLowerCase())
    .filter(Boolean)
    .map((cleanEmail) => {
      const key = generateCourseraLicenseKey(cleanEmail, duration);
      const dur = parseLicenseKeyDuration(key);
      return {
        email: cleanEmail,
        key,
        durationLabel: dur.label,
        isExpired: dur.isExpired,
        daysRemaining: dur.daysRemaining,
        expirationDate: dur.expirationDate,
        formattedExpDate: dur.formattedExpDate,
      };
    });
}

/**
 * Trích xuất danh sách License Keys và Coursera Emails từ thông tin đơn hàng
 * Tương thích ngược 100% với các đơn hàng chỉ có 1 key hoặc 1 email
 */
export function extractOrderLicenseInfo(order: {
  admin_notes?: string | null;
  license_key?: string | null;
  user_email?: string | null;
  status?: string | null;
  items?: any[];
}): {
  licenseKey?: string;
  courseraEmail?: string;
  licenses: CourseraLicenseItem[];
  emails: string[];
} {
  let fallbackKey = (order.license_key || "").trim() || undefined;
  let fallbackEmail: string | undefined = undefined;
  const licenses: CourseraLicenseItem[] = [];
  const emailsSet = new Set<string>();

  const notes = order.admin_notes || "";

  // 1. Phân tích danh sách [LICENSES: email1:key1 | email2:key2 | ...]
  const licensesMatch = notes.match(/\[(?:LICENSES|COURSERA_LICENSES):\s*([^\]]+)\]/i);
  if (licensesMatch && licensesMatch[1]) {
    const rawPairs = licensesMatch[1].split(/[|]/).map((p) => p.trim()).filter(Boolean);
    for (const pair of rawPairs) {
      const separatorIdx = pair.indexOf(":");
      if (separatorIdx > 0) {
        const email = pair.substring(0, separatorIdx).trim().toLowerCase();
        const key = pair.substring(separatorIdx + 1).trim().toUpperCase();
        if (email && key.startsWith("CSR-")) {
          emailsSet.add(email);
          const dur = parseLicenseKeyDuration(key);
          licenses.push({
            email,
            key,
            durationLabel: dur.label,
            isExpired: dur.isExpired,
            daysRemaining: dur.daysRemaining,
            expirationDate: dur.expirationDate,
            formattedExpDate: dur.formattedExpDate,
          });
        }
      }
    }
  }

  // 2. Phân tích danh sách [COURSERA_EMAILS: email1, email2, ...]
  const emailsMatch = notes.match(/\[(?:COURSERA_EMAILS|EMAILS_COURSERA):\s*([^\]]+)\]/i);
  if (emailsMatch && emailsMatch[1]) {
    const parsedEmails = emailsMatch[1]
      .split(/[,;|]/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@") && !e.startsWith("guest@") && e !== "guest@codevault.io");
    parsedEmails.forEach((e) => emailsSet.add(e));
  }

  // 3. Phân tích email đơn lẻ [COURSERA_EMAIL: ...]
  const singleEmailMatch = notes.match(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):\s*([^\]\s]+@[^\]\s]+)\]/i);
  if (singleEmailMatch && singleEmailMatch[1]) {
    const em = singleEmailMatch[1].trim().toLowerCase();
    fallbackEmail = em;
    emailsSet.add(em);
  } else if (order.user_email && order.user_email.includes("@") && !order.user_email.startsWith("guest@")) {
    fallbackEmail = order.user_email.trim().toLowerCase();
    emailsSet.add(fallbackEmail);
  }

  // 4. Phân tích key đơn lẻ [KEY: CSR-...]
  if (!fallbackKey) {
    const keyMatch = notes.match(/\[(?:KEY|LICENSE_KEY):\s*(CSR-[A-Z0-9-]+)\]/i);
    if (keyMatch && keyMatch[1]) {
      fallbackKey = keyMatch[1].trim().toUpperCase();
    }
  }

  // 5. Nếu đơn hàng đã hoàn tất (status === 'completed'):
  // Đảm bảo mỗi email trong danh sách emailsSet đều có 1 license key tương ứng
  const allEmails = Array.from(emailsSet);
  if (order.status === "completed" && allEmails.length > 0) {
    for (const email of allEmails) {
      const existing = licenses.find((l) => l.email === email);
      if (!existing) {
        try {
          const generatedKey = (allEmails.length === 1 && fallbackKey)
            ? fallbackKey
            : generateCourseraLicenseKey(email, 30);
          const dur = parseLicenseKeyDuration(generatedKey);
          licenses.push({
            email,
            key: generatedKey,
            durationLabel: dur.label,
            isExpired: dur.isExpired,
            daysRemaining: dur.daysRemaining,
            expirationDate: dur.expirationDate,
            formattedExpDate: dur.formattedExpDate,
          });
        } catch (err) {
          console.warn(`[extractOrderLicenseInfo] Could not generate key for ${email}:`, err);
        }
      }
    }
  }

  // Fallback đơn lẻ nếu licenses vẫn rỗng nhưng có fallbackKey & fallbackEmail
  if (licenses.length === 0 && fallbackKey) {
    const dur = parseLicenseKeyDuration(fallbackKey);
    licenses.push({
      email: fallbackEmail || "user@coursera.org",
      key: fallbackKey,
      durationLabel: dur.label,
      isExpired: dur.isExpired,
      daysRemaining: dur.daysRemaining,
      expirationDate: dur.expirationDate,
      formattedExpDate: dur.formattedExpDate,
    });
  }

  return {
    licenseKey: licenses[0]?.key || fallbackKey,
    courseraEmail: licenses[0]?.email || fallbackEmail,
    licenses,
    emails: allEmails.length > 0 ? allEmails : (fallbackEmail ? [fallbackEmail] : []),
  };
}

/**
 * Đọc thông tin thời hạn từ License Key để hiển thị trực quan cho người dùng
 */
export function parseLicenseKeyDuration(key?: string | null): LicenseDurationInfo {
  const cleanKey = (key || "").trim();
  if (!cleanKey) {
    return {
      isPermanent: false,
      isExpired: false,
      daysRemaining: 30,
      formattedExpDate: "",
      label: "Gói 1 Tháng (30 Ngày)",
      status: "active",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }

  const parts = cleanKey.split("-");
  if (parts.length === 5) {
    return {
      isPermanent: true,
      isExpired: false,
      daysRemaining: 99999,
      formattedExpDate: "Vĩnh Viễn",
      label: "Vĩnh Viễn",
      status: "permanent",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    };
  }

  if (parts.length === 7) {
    const expFormatted = parts[1] + parts[2];
    if (expFormatted === "PERM0000") {
      return {
        isPermanent: true,
        isExpired: false,
        daysRemaining: 99999,
        formattedExpDate: "Vĩnh Viễn",
        label: "Vĩnh Viễn",
        status: "permanent",
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
      };
    }

    const expTimestampStr = expFormatted.replace(/^0+/, "") || "0";
    const expTimestamp = parseInt(expTimestampStr, 36) * 1000;
    if (!isNaN(expTimestamp)) {
      const expDate = new Date(expTimestamp);
      const isExpired = Date.now() > expTimestamp;
      const daysRemaining = isExpired
        ? 0
        : Math.max(0, Math.ceil((expTimestamp - Date.now()) / (1000 * 60 * 60 * 24)));
      const formattedExpDate = expDate.toLocaleDateString("vi-VN");

      if (isExpired) {
        return {
          isPermanent: false,
          isExpired: true,
          daysRemaining: 0,
          expirationDate: expDate,
          formattedExpDate,
          label: `🚨 Đã hết hạn (${formattedExpDate})`,
          status: "expired",
          badgeClass: "bg-rose-50 text-rose-700 border-rose-300 font-extrabold",
        };
      }

      return {
        isPermanent: false,
        isExpired: false,
        daysRemaining,
        expirationDate: expDate,
        formattedExpDate,
        label: `Còn ${daysRemaining} ngày (Hết hạn: ${formattedExpDate})`,
        status: "active",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold",
      };
    }
  }

  return {
    isPermanent: false,
    isExpired: false,
    daysRemaining: 30,
    formattedExpDate: "",
    label: "Gói 1 Tháng (30 Ngày)",
    status: "active",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  };
}

/**
 * Gắn tag [KEY: ...] và [COURSERA_EMAIL: ...] vào chuỗi ghi chú của đơn hàng (Đơn lẻ)
 */
export function formatOrderNotesWithLicense(
  existingNotes: string | null | undefined,
  licenseKey: string,
  courseraEmail: string
): string {
  let notes = (existingNotes || "").trim();

  // Xóa các tag cũ nếu có
  notes = notes
    .replace(/\[(?:KEY|LICENSE_KEY):[^\]]+\]/gi, "")
    .replace(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):[^\]]+\]/gi, "")
    .trim();

  const keyTag = `[KEY: ${licenseKey.trim().toUpperCase()}]`;
  const emailTag = `[COURSERA_EMAIL: ${courseraEmail.trim().toLowerCase()}]`;

  return notes ? `${notes} ${keyTag} ${emailTag}` : `${keyTag} ${emailTag}`;
}

/**
 * Gắn tag danh sách nhiều License Key & Email vào chuỗi ghi chú của đơn hàng
 */
export function formatOrderNotesWithMultipleLicenses(
  existingNotes: string | null | undefined,
  licenses: Array<{ email: string; key: string }>
): string {
  let notes = (existingNotes || "").trim();

  // Xóa các tag cũ
  notes = notes
    .replace(/\[(?:LICENSES|COURSERA_LICENSES):[^\]]+\]/gi, "")
    .replace(/\[(?:KEY|LICENSE_KEY):[^\]]+\]/gi, "")
    .replace(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):[^\]]+\]/gi, "")
    .replace(/\[(?:COURSERA_EMAILS|EMAILS_COURSERA):[^\]]+\]/gi, "")
    .trim();

  if (!licenses || licenses.length === 0) return notes;

  const cleanLicenses = licenses
    .map((l) => ({
      email: (l.email || "").trim().toLowerCase(),
      key: (l.key || "").trim().toUpperCase(),
    }))
    .filter((l) => l.email && l.key);

  if (cleanLicenses.length === 0) return notes;

  const pairsStr = cleanLicenses.map((l) => `${l.email}:${l.key}`).join(" | ");
  const emailsStr = cleanLicenses.map((l) => l.email).join(", ");
  const firstKey = cleanLicenses[0].key;
  const firstEmail = cleanLicenses[0].email;

  const licensesTag = `[LICENSES: ${pairsStr}]`;
  const emailsTag = `[COURSERA_EMAILS: ${emailsStr}]`;
  const legacyKeyTag = `[KEY: ${firstKey}]`;
  const legacyEmailTag = `[COURSERA_EMAIL: ${firstEmail}]`;

  const newTags = `${licensesTag} ${emailsTag} ${legacyKeyTag} ${legacyEmailTag}`;
  return notes ? `${notes} ${newTags}` : newTags;
}

/**
 * Gắn tag danh sách email khi khách tạo đơn hoặc lưu trước khi thanh toán
 */
export function formatOrderNotesWithEmails(
  existingNotes: string | null | undefined,
  emails: string[]
): string {
  let notes = (existingNotes || "").trim();
  const cleanEmails = emails
    .map((e) => (e || "").trim().toLowerCase())
    .filter((e) => e.includes("@") && !e.startsWith("guest@") && e !== "guest@codevault.io");

  if (cleanEmails.length === 0) return notes;

  notes = notes
    .replace(/\[(?:COURSERA_EMAILS|EMAILS_COURSERA):[^\]]+\]/gi, "")
    .replace(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):[^\]]+\]/gi, "")
    .trim();

  const emailsTag = `[COURSERA_EMAILS: ${cleanEmails.join(", ")}]`;
  const legacyEmailTag = `[COURSERA_EMAIL: ${cleanEmails[0]}]`;

  const newTags = `${emailsTag} ${legacyEmailTag}`;
  return notes ? `${notes} ${newTags}` : newTags;
}

/**
 * Tra cứu xem email Coursera này có đang sở hữu License Key nào CÒN HẠN trong danh sách đơn hàng không.
 * Nghiệp vụ Spec 019: Nếu còn hạn thì giữ nguyên key cũ, nếu hết hạn thì sinh key mới.
 */
export function findActiveLicenseForEmail(
  email: string,
  completedOrders: Array<{
    admin_notes?: string | null;
    license_key?: string | null;
    status?: string | null;
    created_at?: string | null;
  }>
): {
  hasActive: boolean;
  key?: string;
  daysRemaining?: number;
  expirationDate?: Date;
  formattedExpDate?: string;
  isExpired?: boolean;
  lastOrderDate?: string;
} {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) return { hasActive: false };

  // Sắp xếp các đơn hàng completed theo thời gian mới nhất trước
  const sortedOrders = [...completedOrders]
    .filter((o) => o.status === "completed")
    .sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });

  let latestFoundKey: string | undefined = undefined;
  let latestDuration: LicenseDurationInfo | undefined = undefined;

  for (const order of sortedOrders) {
    const info = extractOrderLicenseInfo(order);
    const targetLicense = info.licenses.find((l) => l.email === cleanEmail);
    if (targetLicense && targetLicense.key) {
      const dur = parseLicenseKeyDuration(targetLicense.key);
      if (!dur.isExpired && (dur.isPermanent || dur.daysRemaining > 0)) {
        // Tìm thấy key đang còn hạn!
        return {
          hasActive: true,
          key: targetLicense.key,
          daysRemaining: dur.daysRemaining,
          expirationDate: dur.expirationDate,
          formattedExpDate: dur.formattedExpDate,
          isExpired: false,
          lastOrderDate: order.created_at || undefined,
        };
      }

      if (!latestFoundKey) {
        latestFoundKey = targetLicense.key;
        latestDuration = dur;
      }
    }
  }

  // Không có key nào còn hạn
  return {
    hasActive: false,
    key: latestFoundKey,
    isExpired: latestDuration?.isExpired ?? false,
    formattedExpDate: latestDuration?.formattedExpDate,
    daysRemaining: 0,
  };
}


