import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import TopNav from "@/components/common/TopNav";
import Footer from "@/components/common/Footer";
import AuthModal from "@/components/common/AuthModal";
import CheckoutModal from "@/components/store/CheckoutModal";

// Dùng next/font thay CDN link → font được bundle vào build, không có request riêng
// → loại bỏ render-blocking, không bị FOUT (Flash of Unstyled Text)
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: false, // chỉ dùng ở một số chỗ, không cần preload
});

export const metadata: Metadata = {
  title: "CodeVault Studio — Kho Sản Phẩm Số & Mã Nguồn Lập Trình Chuyên Nghiệp",
  description:
    "Nền tảng thương mại điện tử chuyên cung cấp tiện ích tools, đồ án tốt nghiệp, và trọn bộ mã nguồn Java OOP LAB211. Thanh toán VietQR Napas 247, mở khóa kho tài nguyên an toàn.",
  // SEO basics
  keywords: ["LAB211", "mã nguồn Java", "đồ án tốt nghiệp", "CodeVault", "OOP", "FPT"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "CodeVault Studio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Preconnect to Supabase for faster API calls */}
        <link rel="preconnect" href="https://jdivhxoasnvonxqvwlmu.supabase.co" />
        {/* Preload hero banner to improve LCP */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-banner.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f4f7fc] text-slate-900 selection:bg-blue-600 selection:text-white font-[var(--font-inter)]">
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
