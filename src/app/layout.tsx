import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import TopNav from "@/components/common/TopNav";
import Footer from "@/components/common/Footer";
import AuthModal from "@/components/common/AuthModal";
import CheckoutModal from "@/components/store/CheckoutModal";

export const metadata: Metadata = {
  title: "CodeVault Studio — Kho Sản Phẩm Số & Mã Nguồn Lập Trình Chuyên Nghiệp",
  description:
    "Nền tảng thương mại điện tử chuyên cung cấp tiện ích tools, đồ án tốt nghiệp, và trọn bộ mã nguồn Java OOP LAB211. Thanh toán VietQR Napas 247, mở khóa kho tài nguyên an toàn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f4f7fc] text-slate-900 selection:bg-blue-600 selection:text-white">
        <StoreProvider>
          <TopNav />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
          <CheckoutModal />
        </StoreProvider>
      </body>
    </html>
  );
}
