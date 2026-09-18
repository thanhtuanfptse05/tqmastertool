"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import {
  generateVietQRUrl,
  DEFAULT_VIETQR_CONFIG,
  formatVND,
} from "@/lib/vietqr";
// Dynamic import confetti — chỉ load khi cần, không block initial bundle
import {
  X,
  QrCode,
  Copy,
  Check,
  UploadCloud,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Loader2,
  Mail,
  Key,
  Plus,
  Minus,
} from "lucide-react";
import {
  extractOrderLicenseInfo,
  CourseraLicenseItem,
} from "@/lib/coursera-keygen";

export default function CheckoutModal() {
  const {
    checkoutProduct,
    closeCheckout,
    createOrder,
    submitPaymentProof,
    activeOrderForPayment,
    currentUser,
    openAuthModal,
    checkoutQuantity,
  } = useStore();

  const [step, setStep] = useState<"qr" | "upload" | "success">("qr");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  // Không có ảnh mặc định — user phải tải ảnh thực
  const [billImage, setBillImage] = useState<string>("");
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingBill, setIsUploadingBill] = useState(false);
  const [billUploadError, setBillUploadError] = useState<string | null>(null);

  const isLicenseRequired =
    checkoutProduct?.deliverable_type === "license_key" ||
    checkoutProduct?.slug.toLowerCase().includes("coursera") ||
    checkoutProduct?.title.toLowerCase().includes("coursera");

  const [quantity, setQuantity] = useState<number>(1);
  const [customerEmails, setCustomerEmails] = useState<string[]>([""]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isAutoApproved, setIsAutoApproved] = useState(false);
  const [generatedLicenseKey, setGeneratedLicenseKey] = useState<string | null>(null);
  const [generatedLicenses, setGeneratedLicenses] = useState<CourseraLicenseItem[]>([]);
  const [copiedLicense, setCopiedLicense] = useState(false);
  const [copiedKeyIndex, setCopiedKeyIndex] = useState<number | null>(null);
  const [copiedAllKeys, setCopiedAllKeys] = useState(false);

  // CẤM TUYỆT ĐỐI TỰ ĐỘNG ĐIỀN EMAIL:
  // Luôn reset ô nhập email về rỗng khi mở sản phẩm, khách bắt buộc phải tự tay điền email Coursera
  React.useEffect(() => {
    const initQty = Math.max(1, Math.min(20, checkoutQuantity || 1));
    setQuantity(initQty);
    setCustomerEmails(Array.from({ length: initQty }).map(() => ""));
    setEmailError(null);
    setStep("qr");
    setBillImage("");
    setTransactionRef("");
    setBillUploadError(null);
    setGeneratedLicenseKey(null);
    setGeneratedLicenses([]);
  }, [checkoutProduct?.id, checkoutQuantity]);

  const handleBillFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBill(true);
    setBillUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/orders/upload-proof", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tải lên ảnh biên lai");
      }

      setBillImage(data.url);
    } catch (err: any) {
      setBillUploadError(err.message || "Lỗi tải ảnh lên");
    } finally {
      setIsUploadingBill(false);
      e.target.value = "";
    }
  };

  // If there's a checkout product and no active order yet, create one
  React.useEffect(() => {
    if (checkoutProduct && !activeOrderForPayment) {
      createOrder(checkoutProduct, quantity);
    }
  }, [checkoutProduct, activeOrderForPayment, quantity]);

  if (!checkoutProduct || !activeOrderForPayment) return null;

  const order = activeOrderForPayment;

  const qrUrl = generateVietQRUrl({
    amount: order.total_amount,
    memo: order.vietqr_content,
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuantityChange = (newQty: number) => {
    const clampedQty = Math.max(1, Math.min(20, newQty));
    setQuantity(clampedQty);
    setCustomerEmails((prev) => {
      const next = [...prev];
      while (next.length < clampedQty) next.push("");
      return next.slice(0, clampedQty);
    });
    if (checkoutProduct) {
      const cleanEmails = customerEmails.map((e) => e.trim().toLowerCase()).filter((e) => e.includes("@"));
      createOrder(checkoutProduct, clampedQty, cleanEmails);
    }
  };

  const handleEmailChange = (index: number, val: string) => {
    setCustomerEmails((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
    if (emailError) setEmailError(null);
  };

  const validateEmails = (): boolean => {
    if (!isLicenseRequired) return true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const trimmedList = customerEmails.map((e) => e.trim().toLowerCase());

    for (let i = 0; i < quantity; i++) {
      const em = trimmedList[i] || "";
      if (!em) {
        setEmailError(`Vui lòng nhập đầy đủ Email Coursera cho Tài khoản #${i + 1}`);
        return false;
      }
      if (!emailRegex.test(em) || em.startsWith("guest@") || em === "guest@codevault.io") {
        setEmailError(`Email "${em}" tại Tài khoản #${i + 1} không hợp lệ. Vui lòng nhập email thật dùng trên Coursera.`);
        return false;
      }
    }

    // Check duplicate emails
    const unique = new Set(trimmedList.slice(0, quantity));
    if (unique.size !== quantity) {
      setEmailError("Các Email Coursera không được trùng lặp nhau. Mỗi tài khoản cần 1 email riêng biệt để kích hoạt bản quyền.");
      return false;
    }

    setEmailError(null);
    return true;
  };

  const handleBillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billImage) {
      setBillUploadError("Vui lòng tải ảnh biên lai chuyển khoản trước khi xác nhận.");
      return;
    }

    if (isLicenseRequired) {
      if (!validateEmails()) {
        setStep("qr");
        return;
      }
    }

    setIsSubmitting(true);
    setBillUploadError(null);

    try {
      const ref = transactionRef || `MB${Date.now()}`;

      // 1. Cập nhật DB qua server-side API (supabaseAdmin) để tránh RLS block
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      } catch {}

      const cleanEmails = customerEmails.map((e) => e.trim().toLowerCase()).slice(0, quantity);
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          orderId: order.id,
          status: "pending_approval",
          payment_proof_image: billImage,
          transaction_ref: ref,
          customer_emails: isLicenseRequired ? cleanEmails : undefined,
          customer_email: isLicenseRequired ? cleanEmails[0] : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Không thể lưu thông tin thanh toán");
      }

      const resData = await res.json();
      const orderData = resData.data || {};
      const autoApproved = Boolean(resData.isAutoApproved || orderData.status === "completed");

      const combinedNotes = `${orderData.admin_notes || ""} ${activeOrderForPayment.admin_notes || ""}`;
      const licenseInfo = extractOrderLicenseInfo({
        ...orderData,
        admin_notes: combinedNotes,
        status: autoApproved ? "completed" : orderData.status,
      });

      if (licenseInfo.licenses.length > 0) {
        setGeneratedLicenses(licenseInfo.licenses);
        setGeneratedLicenseKey(licenseInfo.licenseKey || licenseInfo.licenses[0]?.key || null);
      }

      setIsAutoApproved(autoApproved);

      // 2. Cập nhật store local để UI phản ánh ngay
      submitPaymentProof(
        order.id,
        billImage,
        ref,
        isLicenseRequired ? cleanEmails[0] : undefined,
        autoApproved ? "completed" : "pending_approval",
        orderData.admin_notes,
        licenseInfo.licenseKey || licenseInfo.licenses[0]?.key,
        isLicenseRequired ? cleanEmails : undefined
      );

      setStep("success");

      // Celebrate with confetti — dynamic import to not block bundle
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: autoApproved ? 120 : 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error(err);
      }
    } catch (err: any) {
      setBillUploadError(err.message || "Lỗi khi gửi xác nhận thanh toán");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToUpload = () => {
    if (isLicenseRequired) {
      if (!validateEmails()) return;

      const cleanEmails = customerEmails.map((e) => e.trim().toLowerCase()).slice(0, quantity);
      // Lưu ngay Coursera Emails vào order phía server để SePay Webhook nhận diện được nếu quét QR thanh toán tức thì
      if (order?.id) {
        fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            customer_emails: cleanEmails,
            customer_email: cleanEmails[0],
          }),
        }).catch(() => {});
      }
    }
    setStep("upload");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-card shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Thanh Toán VietQR (Napas 247)
              </h3>
              <p className="text-[11px] text-slate-500">Mã đơn: {order.order_code}</p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="grid grid-cols-3 border-b border-slate-100 text-xs font-bold text-center py-2.5 bg-slate-50/40">
          <div className={`flex items-center justify-center gap-1.5 ${step === "qr" ? "text-blue-600" : "text-slate-400"}`}>
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
            <span>Quét Mã QR</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 ${step === "upload" ? "text-blue-600" : "text-slate-400"}`}>
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">2</span>
            <span>Gửi Bằng Chứng</span>
          </div>
          <div className={`flex items-center justify-center gap-1.5 ${step === "success" ? "text-emerald-600" : "text-slate-400"}`}>
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">3</span>
            <span>Chờ Duyệt Đơn</span>
          </div>
        </div>

        {/* Step 1: QR CODE & TRANSFER INFO */}
        {step === "qr" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* VietQR Code Image */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-inner">
                <img
                  src={qrUrl}
                  alt="VietQR Code"
                  className="w-56 h-auto rounded-xl shadow-md border border-white"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  Mở ứng dụng ngân hàng và quét mã để tự động điền
                </p>
              </div>

              {/* Transfer Details with 1-Click Copy */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Sản phẩm đặt mua:</span>
                  <p className="font-extrabold text-slate-900 line-clamp-1">{checkoutProduct.title}</p>
                </div>

                {/* Quantity Selector for Coursera / Products */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Số lượng tài khoản mua:</span>
                    <span className="text-xs font-black text-slate-900">
                      {quantity} tài khoản × {formatVND(checkoutProduct.price)} ={" "}
                      <span className="text-blue-600 font-extrabold">{formatVND(checkoutProduct.price * quantity)}</span>
                    </span>
                  </div>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1.5 px-2.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 font-black transition-colors"
                      title="Giảm số lượng"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 font-mono font-black text-xs text-blue-600">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 20}
                      className="p-1.5 px-2.5 text-slate-600 hover:bg-slate-100 disabled:opacity-30 font-black transition-colors"
                      title="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mandatory Coursera License Emails (One input per account) */}
                {isLicenseRequired && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        Email Coursera Kích Hoạt Key:
                        <span className="text-rose-500">* Bắt buộc ({quantity} email)</span>
                      </label>
                      <span className="text-[10px] text-indigo-800 font-extrabold bg-indigo-200/60 px-2.5 py-0.5 rounded-full border border-indigo-300">
                        Cấp {quantity} Key VIP (30 Ngày)
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {Array.from({ length: quantity }).map((_, idx) => (
                        <div key={idx} className="space-y-1 bg-white/70 p-2.5 rounded-xl border border-indigo-100">
                          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-950">
                            <span>Tài khoản #{idx + 1}:</span>
                            <span className="text-[10px] font-mono text-indigo-600">Gói 1 tháng (30 ngày)</span>
                          </div>
                          <input
                            type="email"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            value={customerEmails[idx] || ""}
                            onChange={(e) => handleEmailChange(idx, e.target.value)}
                            onBlur={() => {
                              const cleanEmails = customerEmails
                                .map((e) => e.trim().toLowerCase())
                                .filter((e) => e.includes("@"));
                              if (cleanEmails.length > 0 && order?.id) {
                                fetch("/api/orders", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    orderId: order.id,
                                    customer_emails: cleanEmails,
                                    customer_email: cleanEmails[0],
                                  }),
                                }).catch(() => {});
                              }
                            }}
                            placeholder={`Ví dụ: coursera.user${idx + 1}@gmail.com (Email đăng nhập Coursera #${idx + 1})`}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-indigo-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-mono font-bold text-slate-900 shadow-sm transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-indigo-900/80 leading-relaxed flex items-start gap-1">
                      <span className="font-bold shrink-0">⚠️ Lưu ý:</span>
                      <span>
                        Hệ thống sẽ mã hóa sinh <b>{quantity} mã License Key</b> gắn riêng biệt cho từng Email trên. Vui lòng nhập <b>chính xác email đăng nhập Coursera</b> cho mỗi tài khoản và không nhập trùng email.
                      </span>
                    </p>

                    {emailError && (
                      <p className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {emailError}
                      </p>
                    )}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Ngân hàng thụ hưởng:</span>
                      <span className="font-bold text-slate-800">{DEFAULT_VIETQR_CONFIG.bankId} (Ngân hàng Đầu tư &amp; PT Việt Nam)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Số tài khoản định danh (VA SePay):</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {DEFAULT_VIETQR_CONFIG.accountNo}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(DEFAULT_VIETQR_CONFIG.accountNo, "acc")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Chủ tài khoản:</span>
                      <span className="font-bold text-slate-800 uppercase">
                        {DEFAULT_VIETQR_CONFIG.accountName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Số tiền cần chuyển:</span>
                      <span className="font-extrabold text-blue-600 text-sm">
                        {formatVND(order.total_amount)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(String(order.total_amount), "amt")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Sao chép số tiền"
                    >
                      {copiedField === "amt" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Nội dung chuyển khoản (bắt buộc):</span>
                      <span className="font-mono font-black text-rose-600 text-sm">
                        {order.vietqr_content}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(order.vietqr_content, "memo")}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Sao chép nội dung chuyển tiền"
                    >
                      {copiedField === "memo" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Vui lòng chuyển chính xác nội dung <b>{order.vietqr_content}</b> để SePay đối soát và tự động duyệt đơn ngay lập tức.</span>
                </div>
              </div>
            </div>

            {/* CTA to Step 2 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={closeCheckout}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleProceedToUpload}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all active:scale-95"
              >
                <span>Tôi đã chuyển khoản — Tải ảnh bill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: BILL UPLOAD & TRANSACTION PROOF (Spec 005) */}
        {step === "upload" && (
          <form onSubmit={handleBillSubmit} className="p-6 space-y-5">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Gửi Bằng Chứng Chuyển Khoản
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tải lên ảnh chụp màn hình ứng dụng ngân hàng hoặc cung cấp mã giao dịch để Admin đối chiếu số dư.
              </p>
            </div>

            {isLicenseRequired && customerEmails.some((e) => e.trim()) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs gap-2">
                <div className="flex items-start gap-2">
                  <Key className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <span className="font-bold">{quantity} Email nhận License Key VIP:</span>{" "}
                    <span className="font-mono text-indigo-950 font-bold break-all">
                      {customerEmails.filter(Boolean).join(", ")}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("qr")}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline shrink-0"
                >
                  Sửa danh sách email
                </button>
              </div>
            )}

            {/* Bill Upload & Preview Area */}
            <div className={`space-y-3 p-4 rounded-2xl border-2 border-dashed ${!billImage ? 'border-rose-300 bg-rose-50/30' : 'border-blue-200 bg-blue-50/40'}`}>
              <label className="block text-xs font-bold text-slate-800">
                Ảnh biên lai chuyển khoản (Screenshot / Bill)
                <span className="text-rose-500 ml-1">* Bắt buộc</span>
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`w-28 h-28 rounded-xl overflow-hidden border bg-white flex items-center justify-center shrink-0 shadow-sm relative group ${billImage ? 'border-emerald-300' : 'border-dashed border-rose-300'}`}>
                  {billImage ? (
                    <img src={billImage} alt="Bill proof" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-rose-400">
                      <UploadCloud className="w-8 h-8" />
                      <span className="text-[9px] font-bold text-center px-1">Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95">
                      {isUploadingBill ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang Tải Ảnh...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Tải Ảnh Biên Lai Lên</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        disabled={isUploadingBill}
                        onChange={handleBillFileUpload}
                        className="hidden"
                      />
                    </label>

                    {billImage ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Đã tải ảnh biên lai thành công
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Chưa có ảnh — vui lòng tải lên
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Chụp màn hình chuyển khoản thành công từ App ngân hàng (Vietcombank, MB, Techcombank,...) rồi bấm nút để tải lên.
                  </p>

                  {billUploadError && (
                    <p className="text-xs text-red-600 font-semibold">{billUploadError}</p>
                  )}
                </div>
              </div>

              {/* Optional URL input fallback */}
              <div className="pt-2 border-t border-blue-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Hoặc dán URL ảnh biên lai:
                </span>
                <input
                  type="text"
                  value={billImage}
                  onChange={(e) => setBillImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                />
              </div>
            </div>

            {/* Transaction Ref Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã giao dịch ngân hàng (tùy chọn):
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="VD: FT26074918239..."
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep("qr")}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Quay lại mã QR
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !billImage}
                title={!billImage ? "Vui lòng tải ảnh biên lai trước" : ""}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang gửi xác nhận...</span></>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Xác Nhận Đã Chuyển Khoản</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: SUCCESS & AUTO-APPROVED / PENDING REVIEW NOTICE */}
        {step === "success" && (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {isAutoApproved ? (
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
            )}

            <div>
              {isAutoApproved ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  Trạng thái: Đã duyệt tự động qua SePay (completed)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 mb-2">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Trạng thái: Chờ Admin Duyệt (pending_approval)
                </span>
              )}

              <h3 className="text-xl font-black text-slate-900">
                {isAutoApproved
                  ? "Thanh Toán & Kích Hoạt Tự Động Thành Công!"
                  : "Đã Nhận Bằng Chứng Chuyển Khoản!"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                {isAutoApproved
                  ? `Giao dịch chuyển khoản đơn hàng ${order.order_code} đã được SePay ghi nhận và tự động phê duyệt thành công! Quyền tải tài nguyên đã được mở khóa ngay lập tức.`
                  : `Đơn hàng ${order.order_code} của bạn đã được tiếp nhận ảnh biên lai và đang chờ Admin đối soát duyệt đơn. Sau khi được duyệt, tài nguyên số sẽ tự động mở khóa trong kho của bạn.`}
              </p>
            </div>

            {/* If Coursera License Keys exist, display prominent key box(es) */}
            {generatedLicenses.length > 1 ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 max-w-md mx-auto text-left shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-xs">
                    <Key className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{generatedLicenses.length} License Keys Coursera (Gói 30 Ngày)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = generatedLicenses
                        .map((l, i) => `Tài khoản #${i + 1} (${l.email}): ${l.key}`)
                        .join("\n");
                      navigator.clipboard.writeText(text);
                      setCopiedAllKeys(true);
                      setTimeout(() => setCopiedAllKeys(false), 2000);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
                  >
                    {copiedAllKeys ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép tất cả!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép tất cả</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {generatedLicenses.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-sm space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-950">
                          TK #{idx + 1}: <span className="font-mono">{item.email}</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {item.durationLabel || "30 Ngày"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-xs text-indigo-700 break-all select-all">
                          {item.key}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.key);
                            setCopiedKeyIndex(idx);
                            setTimeout(() => setCopiedKeyIndex(null), 2000);
                          }}
                          className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                        >
                          {copiedKeyIndex === idx ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-indigo-600/80">
                  * Toàn bộ {generatedLicenses.length} Key cũng đã được lưu vĩnh viễn vào tài khoản của bạn tại mục Kho Quà Tặng (My Vault).
                </p>
              </div>
            ) : (generatedLicenseKey || generatedLicenses[0]?.key) ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 max-w-md mx-auto text-left shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-xs">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>License Key Coursera (Thời Hạn 30 Ngày)</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-indigo-100 shadow-inner">
                  <span className="font-mono font-bold text-xs text-indigo-700 break-all select-all">
                    {generatedLicenseKey || generatedLicenses[0]?.key}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const keyToCopy = generatedLicenseKey || generatedLicenses[0]?.key || "";
                      navigator.clipboard.writeText(keyToCopy);
                      setCopiedLicense(true);
                      setTimeout(() => setCopiedLicense(false), 2000);
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
                  >
                    {copiedLicense ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-indigo-600/80 mt-2">
                  * Key cũng đã được lưu vĩnh viễn vào tài khoản của bạn tại mục Kho Quà Tặng (My Vault).
                </p>
              </div>
            ) : null}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-slate-800">{order.order_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số tiền:</span>
                <span className="font-bold text-blue-600">{formatVND(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cổng thanh toán:</span>
                <span className="font-bold text-slate-800">VietQR Napas 247 (SePay)</span>
              </div>
              {!isAutoApproved && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian duyệt thủ công:</span>
                  <span className="font-bold text-emerald-600">3 - 10 phút</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {isAutoApproved ? (
                <>
                  <a
                    href="/customer/vault"
                    onClick={closeCheckout}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Vào Kho Quà Tặng (My Vault)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/customer/orders"
                    onClick={closeCheckout}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all text-center"
                  >
                    Xem Chi Tiết Đơn Hàng
                  </a>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={closeCheckout}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                  >
                    Đóng &amp; Tiếp Tục Xem Sản Phẩm
                  </button>
                  <a
                    href="/customer/orders"
                    onClick={closeCheckout}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all text-center"
                  >
                    Xem Lịch Sử Đơn Hàng
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
