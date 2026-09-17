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

/**
 * Trích xuất License Key và Coursera Email từ thông tin đơn hàng
 */
export function extractOrderLicenseInfo(order: {
  admin_notes?: string | null;
  license_key?: string | null;
  user_email?: string | null;
  status?: string | null;
}): { licenseKey?: string; courseraEmail?: string } {
  let licenseKey = (order.license_key || "").trim() || undefined;
  let courseraEmail: string | undefined = undefined;

  const notes = order.admin_notes || "";

  // 1. Trích xuất Coursera Email từ ghi chú (nếu có tag [COURSERA_EMAIL: ...])
  const emailMatch = notes.match(/\[(?:COURSERA_EMAIL|EMAIL_COURSERA):\s*([^\]\s]+@[^\]\s]+)\]/i);
  if (emailMatch && emailMatch[1]) {
    courseraEmail = emailMatch[1].trim().toLowerCase();
  } else if (order.user_email && order.user_email.includes("@")) {
    courseraEmail = order.user_email.trim().toLowerCase();
  }

  // 2. Trích xuất License Key từ ghi chú (nếu có tag [KEY: CSR-...])
  if (!licenseKey) {
    const keyMatch = notes.match(/\[(?:KEY|LICENSE_KEY):\s*(CSR-[A-Z0-9-]+)\]/i);
    if (keyMatch && keyMatch[1]) {
      licenseKey = keyMatch[1].trim().toUpperCase();
    }
  }

  // 3. Fallback: Nếu đơn hàng đã hoàn thành (completed) và có email hợp lệ
  // tự động sinh key chuẩn xác theo thuật toán (gói 30 ngày)
  if (!licenseKey && order.status === "completed" && courseraEmail) {
    try {
      licenseKey = generateCourseraLicenseKey(courseraEmail, 30);
    } catch (e) {
      console.warn("Could not auto-generate license key from email:", e);
    }
  }

  return { licenseKey, courseraEmail };
}

/**
 * Đọc thông tin thời hạn từ License Key để hiển thị trực quan cho người dùng
 */
export function parseLicenseKeyDuration(key?: string | null): {
  isPermanent: boolean;
  isExpired: boolean;
  expirationDate?: Date;
  label: string;
} {
  const cleanKey = (key || "").trim();
  if (!cleanKey) {
    return { isPermanent: false, isExpired: false, label: "Gói 1 Tháng (30 Ngày)" };
  }

  const parts = cleanKey.split("-");
  if (parts.length === 5) {
    return { isPermanent: true, isExpired: false, label: "Vĩnh Viễn" };
  }

  if (parts.length === 7) {
    const expFormatted = parts[1] + parts[2];
    if (expFormatted === "PERM0000") {
      return { isPermanent: true, isExpired: false, label: "Vĩnh Viễn" };
    }

    const expTimestampStr = expFormatted.replace(/^0+/, "") || "0";
    const expTimestamp = parseInt(expTimestampStr, 36) * 1000;
    if (!isNaN(expTimestamp)) {
      const expDate = new Date(expTimestamp);
      const isExpired = Date.now() > expTimestamp;
      return {
        isPermanent: false,
        isExpired,
        expirationDate: expDate,
        label: isExpired
          ? `Đã hết hạn (${expDate.toLocaleDateString("vi-VN")})`
          : `Hết hạn: ${expDate.toLocaleDateString("vi-VN")}`,
      };
    }
  }

  return { isPermanent: false, isExpired: false, label: "Gói 1 Tháng (30 Ngày)" };
}

/**
 * Gắn tag [KEY: ...] và [COURSERA_EMAIL: ...] vào chuỗi ghi chú của đơn hàng
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

