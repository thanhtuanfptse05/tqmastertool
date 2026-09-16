"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

interface LabConsoleDemo {
  id: string;
  code: string;
  title: string;
  projectName: string;
  actions: {
    label: string;
    outputLines: string[];
  }[];
}

const LAB_DEMOS: LabConsoleDemo[] = [
  {
    id: "fruit",
    code: "J1.L.P0023",
    title: "Fruit Shop Management",
    projectName: "FruitShop_MVC_Java8",
    actions: [
      {
        label: "Menu Chính & Chạy [3] Mua Sắm",
        outputLines: [
          "run:",
          "================ FRUIT SHOP SYSTEM (MVC) ================",
          "1. Create Fruit",
          "2. View orders",
          "3. Shopping (for buyer)",
          "4. Exit",
          "---------------------------------------------------------",
          "Please choose an option [1-4]: 3",
          "",
          "List of Available Fruits:",
          "| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |",
          "      1             Apple Fuji          Japan         2.50$",
          "      2             Mango Cat Chu       Vietnam       1.80$",
          "      3             Grape Muscat        Korea         6.20$",
          "",
          ">> Select item number: 1",
          "You selected: Apple Fuji (Price: 2.50$ | Available: 45)",
          ">> Please input quantity: -5",
          "[VALIDATION ERROR]: Quantity must be a positive integer > 0!",
          ">> Please input quantity: 4",
          "Added 4 Apple Fuji to your cart.",
          "",
          ">> Do you want to order now (Y/N)? Y",
          "",
          "Product       | Quantity | Price | Amount",
          "----------------------------------------------",
          "Apple Fuji           4      2.50$   10.00$",
          "----------------------------------------------",
          "Total Order Value: 10.00$",
          ">> Input Customer Name: Nguyen Van An (SE170123)",
          "",
          "[SUCCESS] Order #ORD-8921 created successfully! Stored to OrderManager.",
          "BUILD SUCCESSFUL (total time: 4.821 seconds)",
        ],
      },
      {
        label: "[1] Tạo Mới Trái Cây & Validate",
        outputLines: [
          "run:",
          "================ FRUIT SHOP SYSTEM (MVC) ================",
          "1. Create Fruit",
          "2. View orders",
          "3. Shopping (for buyer)",
          "4. Exit",
          "---------------------------------------------------------",
          "Please choose an option [1-4]: 1",
          "",
          ">> Enter Fruit Id: F01",
          "[VALIDATION ERROR]: Id 'F01' already exists in inventory! Please input another:",
          ">> Enter Fruit Id: F04",
          ">> Enter Fruit Name: Durian Musang King",
          ">> Enter Price ($): abc",
          "[VALIDATION ERROR]: Price must be a valid positive float number!",
          ">> Enter Price ($): 15.50",
          ">> Enter Quantity: 30",
          ">> Enter Origin: Malaysia",
          "[SUCCESS] New Fruit 'Durian Musang King' added to inventory list.",
          "",
          ">> Do you want to continue creating fruit (Y/N)? N",
          "Returning to Main Menu...",
          "BUILD SUCCESSFUL (total time: 3.120 seconds)",
        ],
      },
      {
        label: "[2] Xem Đơn Hàng (View Orders)",
        outputLines: [
          "run:",
          "================ FRUIT SHOP SYSTEM (MVC) ================",
          "Please choose an option [1-4]: 2",
          "",
          "Customer: Nguyen Van An (SE170123)",
          "Product       | Quantity | Price | Amount",
          "----------------------------------------------",
          "Apple Fuji           4      2.50$   10.00$",
          "Durian Musang King   1     15.50$   15.50$",
          "----------------------------------------------",
          "Total Invoice: 25.50$",
          "",
          "Customer: Tran Thi Mai (SE180456)",
          "Product       | Quantity | Price | Amount",
          "----------------------------------------------",
          "Grape Muscat         2      6.20$   12.40$",
          "----------------------------------------------",
          "Total Invoice: 12.40$",
          "",
          "[INFO] All active orders displayed. Returning to menu.",
          "BUILD SUCCESSFUL (total time: 1.050 seconds)",
        ],
      },
    ],
  },
  {
    id: "tpbank",
    code: "J1.S.P0070",
    title: "TPBank Login & Captcha",
    projectName: "TPBank_EBank_System",
    actions: [
      {
        label: "[1] Đăng Nhập Tiếng Việt & Xác Thực Captcha",
        outputLines: [
          "run:",
          "------- Login Program (TPBank Ebank) -------",
          "1. Vietnamese",
          "2. English",
          "3. Exit",
          "Please choice one option: 1",
          "",
          "So tai khoan: 09876543",
          "So tai khoan phai la 1 day 10 chu so!",
          "So tai khoan: 0123456789",
          "",
          "Mat khau: 123456",
          "Mat khau phai tu 8-31 ky tu va gom ca chu va so!",
          "Mat khau: BankPass2026",
          "",
          "Ma Captcha he thong sinh ngau nhien: [ 7 B X 9 K ]",
          "Nhap ma Captcha: 7bx9k",
          "Dang nhap thanh cong! Xin chao khach hang Nguyen Van An.",
          "BUILD SUCCESSFUL (total time: 5.210 seconds)",
        ],
      },
      {
        label: "[2] English Login & Captcha Error Check",
        outputLines: [
          "run:",
          "------- Login Program (TPBank EBank) -------",
          "1. Vietnamese",
          "2. English",
          "3. Exit",
          "Please choice one option: 2",
          "",
          "Account number: 1234567890",
          "Password: Password2026",
          "System Generated Captcha: [ W 4 R 2 M ]",
          "Enter Captcha: W4R2X",
          "Captcha is incorrect! Authentication failed.",
          "Enter Captcha again: W4R2M",
          "Login successful! Welcome to TPBank Digital Banking.",
          "BUILD SUCCESSFUL (total time: 3.840 seconds)",
        ],
      },
    ],
  },
  {
    id: "matrix",
    code: "J1.S.P0074",
    title: "Matrix Calculation Program",
    projectName: "Matrix_Calculation_Console",
    actions: [
      {
        label: "[1] Phép Cộng 2 Ma Trận (Addition)",
        outputLines: [
          "run:",
          "======= Calculator Program =======",
          "1. Addition Matrix",
          "2. Subtraction Matrix",
          "3. Multiplication Matrix",
          "4. Quit",
          "Your choice: 1",
          "-------- Addition --------",
          "Enter Row Matrix 1: 2",
          "Enter Column Matrix 1: 3",
          "Enter Matrix1[1][1]: 1",
          "Enter Matrix1[1][2]: 2",
          "Enter Matrix1[1][3]: 3",
          "Enter Matrix1[2][1]: 4",
          "Enter Matrix1[2][2]: 5",
          "Enter Matrix1[2][3]: 6",
          "Enter Row Matrix 2: 2",
          "Enter Column Matrix 2: 3",
          "Enter Matrix2[1][1]: 7",
          "Enter Matrix2[1][2]: 8",
          "Enter Matrix2[1][3]: 9",
          "Enter Matrix2[2][1]: 1",
          "Enter Matrix2[2][2]: 2",
          "Enter Matrix2[2][3]: 3",
          "-------- Result --------",
          "[1][2][3]   +   [7][8][9]   =   [8][10][12]",
          "[4][5][6]       [1][2][3]       [5][ 7][ 9]",
          "BUILD SUCCESSFUL (total time: 4.100 seconds)",
        ],
      },
      {
        label: "[3] Phép Nhân 2 Ma Trận (Multiplication)",
        outputLines: [
          "run:",
          "======= Calculator Program =======",
          "Your choice: 3",
          "-------- Multiplication --------",
          "Enter Row Matrix 1: 2",
          "Enter Column Matrix 1: 2",
          "Enter Matrix1[1][1]: 1",
          "Enter Matrix1[1][2]: 2",
          "Enter Matrix1[2][1]: 3",
          "Enter Matrix1[2][2]: 4",
          "Enter Row Matrix 2: 3",
          "[VALIDATION ERROR]: Row of Matrix 2 must equal Column of Matrix 1 (2)! Please re-enter:",
          "Enter Row Matrix 2: 2",
          "Enter Column Matrix 2: 2",
          "Enter Matrix2[1][1]: 5",
          "Enter Matrix2[1][2]: 6",
          "Enter Matrix2[2][1]: 7",
          "Enter Matrix2[2][2]: 8",
          "-------- Result --------",
          "[1][2]   *   [5][6]   =   [19][22]",
          "[3][4]       [7][8]       [43][50]",
          "BUILD SUCCESSFUL (total time: 3.510 seconds)",
        ],
      },
    ],
  },
  {
    id: "worker",
    code: "J1.S.P0056",
    title: "Worker Management Program",
    projectName: "WorkerManagement_OOP",
    actions: [
      {
        label: "[1] & [2] Thêm Công Nhân & Tăng Lương",
        outputLines: [
          "run:",
          "======== Worker Management ========",
          "1. Add Worker",
          "2. Up salary",
          "3. Down salary",
          "4. Display Information salary",
          "5. Exit",
          "Please choose an option: 1",
          "--------- Add Worker ----------",
          "Enter Code: W01",
          "Enter Name: Tran Van Tuan",
          "Enter Age: 25",
          "Enter Salary: 1200",
          "Enter work location: Da Nang",
          "[SUCCESS] Worker W01 registered.",
          "",
          "Please choose an option: 2",
          "--------- Up/Down Salary --------",
          "Enter Code: W01",
          "Enter Salary Adjustment: 300",
          "[SUCCESS] Salary adjusted. New Salary: 1500$",
          "Recorded salary history at 16/09/2026 with status 'UP'.",
          "BUILD SUCCESSFUL (total time: 2.980 seconds)",
        ],
      },
      {
        label: "[4] Xem Lịch Sử Biến Động Lương",
        outputLines: [
          "run:",
          "======== Worker Management ========",
          "Please choose an option: 4",
          "-------------------- Display Information Salary --------------------",
          "Code      Name                  Age       Salary    Status    Date",
          "W01       Tran Van Tuan         25        1500$     UP        16/09/2026",
          "W02       Le Thi Hoa            28        1800$     UP        15/09/2026",
          "W03       Dang Minh Quan        32        1400$     DOWN      14/09/2026",
          "--------------------------------------------------------------------",
          "BUILD SUCCESSFUL (total time: 1.120 seconds)",
        ],
      },
    ],
  },
];

export default function NetBeansConsoleSimulator() {
  const [selectedLabId, setSelectedLabId] = useState<string>("fruit");
  const currentLab = LAB_DEMOS.find((l) => l.id === selectedLabId) || LAB_DEMOS[0];
  const [activeActionIdx, setActiveActionIdx] = useState<number>(0);

  const activeAction = currentLab.actions[activeActionIdx] || currentLab.actions[0];

  const handleSelectLab = (labId: string) => {
    setSelectedLabId(labId);
    setActiveActionIdx(0);
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP CONTROLS & LAB SWITCHER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-blue-600" />
            Mô Phỏng Console Chạy Thực Tế (NetBeans IDE 17)
          </h4>
          <p className="text-[11px] text-slate-500">
            Xem trực tiếp kết quả chạy chương trình thực tế của từng bài lab (Bảo vệ 100% bản quyền code)
          </p>
        </div>

        {/* Lab selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {LAB_DEMOS.map((lab) => (
            <button
              key={lab.id}
              onClick={() => handleSelectLab(lab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                selectedLabId === lab.id
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              <span>{lab.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTION SIMULATION BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-slate-500 shrink-0">Chọn kịch bản chạy:</span>
        {currentLab.actions.map((act, idx) => (
          <button
            key={idx}
            onClick={() => setActiveActionIdx(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeActionIdx === idx
                ? "bg-slate-900 text-white shadow-sm ring-2 ring-blue-500/50"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Play className={`w-3 h-3 ${activeActionIdx === idx ? "text-cyan-400 fill-cyan-400" : ""}`} />
            <span>{act.label}</span>
          </button>
        ))}
      </div>

      {/* 3. REALISTIC NETBEANS IDE 17 TERMINAL WINDOW */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="bg-[#161b22] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-px bg-slate-700 mx-1.5" />
            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-sans">
              <span className="font-extrabold text-white flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                NetBeans IDE 17
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono text-[10px]">
                Output - {currentLab.projectName} (run)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              ● JDK 1.8.0_381
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800 font-bold hidden sm:inline">
              Java with Ant (MVC)
            </span>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-4 overflow-x-auto max-h-[360px] space-y-1 text-slate-300 select-text leading-relaxed">
          {activeAction.outputLines.map((line, idx) => {
            // Highlighting based on NetBeans console patterns
            if (line.startsWith("run:")) {
              return (
                <div key={idx} className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span>{line}</span>
                </div>
              );
            }
            if (line.startsWith("BUILD SUCCESSFUL")) {
              return (
                <div
                  key={idx}
                  className="mt-3 pt-2 border-t border-slate-800/80 text-emerald-400 font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{line}</span>
                </div>
              );
            }
            if (line.includes("[VALIDATION ERROR]")) {
              return (
                <div key={idx} className="text-rose-400 font-bold bg-rose-950/30 px-1 rounded">
                  {line}
                </div>
              );
            }
            if (line.includes("[SUCCESS]")) {
              return (
                <div key={idx} className="text-emerald-300 font-bold bg-emerald-950/30 px-1 rounded">
                  {line}
                </div>
              );
            }
            if (line.startsWith("==") || line.startsWith("--")) {
              return (
                <div key={idx} className="text-blue-400 font-bold">
                  {line}
                </div>
              );
            }
            if (line.startsWith(">>") || line.startsWith("Please choice") || line.startsWith("Your choice")) {
              return (
                <div key={idx} className="text-amber-300 font-semibold">
                  {line}
                </div>
              );
            }
            return (
              <div key={idx} className="text-slate-200">
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SECURITY & IP PROTECTION DISCLAIMER */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs text-blue-950">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-extrabold text-blue-900 block mb-0.5">
            🛡️ Chế Độ Console Demo Khách Hàng (Bảo Mật 100% Bản Quyền Mã Nguồn):
          </strong>
          Giao diện console trên mô phỏng trực tiếp kết quả chạy thực tế của chương trình khi biên dịch trên Apache NetBeans 17 và JDK 8. 
          Toàn bộ <strong>mã nguồn Java MVC hoàn chỉnh (.java)</strong>, <strong>file đề bài Word gốc (.docx)</strong>, và <strong>file nén .zip</strong> chuẩn hóa sẽ được mở khóa trực tiếp trong <strong>Kho Lưu Trữ (Deliverables Vault)</strong> ngay sau khi đơn hàng được duyệt!
        </div>
      </div>
    </div>
  );
}
