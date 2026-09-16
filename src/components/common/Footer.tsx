import React from "react";
import { Code2, ShieldCheck, Zap, Headphones, CheckCircle2, Facebook, Mail, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Bảo Mật & Bản Quyền</p>
              <p className="text-xs text-slate-400">Admin duyệt đơn thủ công, kiểm tra code sạch 100%</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Thanh Toán VietQR 24/7</p>
              <p className="text-xs text-slate-400">Chuyển khoản Napas nhanh chóng, mở khóa tức thì</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">Hỗ Trợ Kỹ Thuật</p>
              <p className="text-xs text-slate-400">Hỗ trợ cài đặt, giải đáp qua Facebook, Email & YouTube</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                CodeVault Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Nền tảng thương mại điện tử chuyên cung cấp giải pháp lập trình, đồ án tốt nghiệp, công cụ automation và mã nguồn Java LAB211 chất lượng cao.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Phương thức thanh toán: VietQR (Napas 247)</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#catalog" className="hover:text-blue-400 transition-colors">
                  Java OOP LAB211 (Full 74 bài)
                </a>
              </li>
              <li>
                <a href="/#catalog" className="hover:text-blue-400 transition-colors">
                  Project & Assignment
                </a>
              </li>
              <li>
                <a href="/#catalog" className="hover:text-blue-400 transition-colors">
                  Tiện Ích & Automation Bots
                </a>
              </li>
              <li>
                <a href="/customer/vault" className="hover:text-blue-400 transition-colors">
                  Tài nguyên của bạn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Liên Hệ & Hỗ Trợ
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61594039319453"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Facebook: Tuấn & Quân FPTU</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:lequan12305@gmail.com"
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Email: lequan12305@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@tuanvaquanfptu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-rose-400 transition-colors"
                >
                  <Youtube className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>YouTube: @tuanvaquanfptu</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CodeVault Studio. Spec-Driven & Three.js 3D Powered.</p>
          <div className="flex items-center gap-4">
            <span>Bảo mật dữ liệu</span>
            <span>Điều khoản dịch vụ</span>
            <span>Chính sách hoàn tiền</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
