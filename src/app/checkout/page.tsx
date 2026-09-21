"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function CheckoutPageRoute() {
  const router = useRouter();
  const { checkoutProduct, currentUser, openAuthModal } = useStore();

  useEffect(() => {
    if (!currentUser) {
      openAuthModal("login", "Vui lòng đăng nhập tài khoản để tiến hành đặt mua sản phẩm.");
      router.push("/#catalog");
      return;
    }
    if (!checkoutProduct) {
      router.push("/#catalog");
    }
  }, [checkoutProduct, currentUser, openAuthModal, router]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-xs text-slate-500 font-bold">Đang tải luồng thanh toán VietQR...</p>
    </div>
  );
}
