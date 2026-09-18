// ==========================================================
// VIETQR NAPAS 247 UTILITY & GENERATOR
// ==========================================================

export interface VietQRParams {
  bankId?: string;
  accountNo?: string;
  accountName?: string;
  template?: string;
  amount: number;
  memo: string;
}

export const DEFAULT_VIETQR_CONFIG = {
  bankId: process.env.NEXT_PUBLIC_VIETQR_BANK_ID || "BIDV",
  accountNo: process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NO || "96247TQMASTER",
  accountName: process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NAME || "TQMASTER",
  template: process.env.NEXT_PUBLIC_VIETQR_TEMPLATE || "compact2",
};

/**
 * Sinh URL hình ảnh mã QR VietQR Napas 247 hợp chuẩn
 */
export function generateVietQRUrl(params: VietQRParams): string {
  const bankId = params.bankId || DEFAULT_VIETQR_CONFIG.bankId;
  const accountNo = params.accountNo || DEFAULT_VIETQR_CONFIG.accountNo;
  const accountName = encodeURIComponent(params.accountName || DEFAULT_VIETQR_CONFIG.accountName);
  const template = params.template || DEFAULT_VIETQR_CONFIG.template;
  const amount = Math.max(0, Math.round(params.amount));
  const memo = encodeURIComponent(params.memo);

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;
}

/**
 * Format số tiền sang định dạng tiền Việt Nam (VNĐ)
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ngày tháng thân thiện Việt Nam
 */
export function formatDateVN(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return dateString;
  }
}
