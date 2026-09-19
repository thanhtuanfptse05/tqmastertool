"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { LabExerciseItem, LabSourceFile } from "@/types";
import {
  Code2,
  FileCode,
  Download,
  Copy,
  Check,
  Folder,
  FolderOpen,
  Terminal,
  PackageCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface LabCodeViewerProps {
  lab: LabExerciseItem;
  orderId: string;
}

export default function LabCodeViewer({ lab, orderId }: LabCodeViewerProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDownloadingJava, setIsDownloadingJava] = useState(false);

  const activeFile: LabSourceFile | undefined = lab.sourceFiles[selectedFileIndex] || lab.sourceFiles[0];

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJavaFile = async () => {
    if (!activeFile) return;
    setIsDownloadingJava(true);

    try {
      let token = "";
      try {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || "";
      } catch {}

      const downloadUrl = `/api/deliverables/lab/download?orderId=${encodeURIComponent(orderId)}&labId=${encodeURIComponent(lab.id)}&type=java&filePath=${encodeURIComponent(activeFile.path)}${token ? `&token=${encodeURIComponent(token)}` : ""}`;
      const res = await fetch(downloadUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Lỗi tải mã nguồn Java" }));
        alert(err.error || `Không thể tải file (Mã lỗi ${res.status}).`);
        return;
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = activeFile.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err: any) {
      console.error("Java download error:", err);
      alert(err?.message || "Không thể tải file Java. Vui lòng thử lại.");
    } finally {
      setIsDownloadingJava(false);
    }
  };

  const handleDownloadFullZip = async () => {
    setIsDownloadingZip(true);

    try {
      let token = "";
      try {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || "";
      } catch {}

      const downloadUrl = `/api/deliverables/lab/download?orderId=${encodeURIComponent(orderId)}&labId=${encodeURIComponent(lab.id)}&type=zip${token ? `&token=${encodeURIComponent(token)}` : ""}`;
      const res = await fetch(downloadUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Lỗi tải file nén bài lab" }));
        alert(err.error || `Không thể tải file nén (Mã lỗi ${res.status}).`);
        return;
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = lab.zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err: any) {
      console.error("Lab zip download error:", err);
      alert(err?.message || "Không thể tải file nén bài lab. Vui lòng thử lại.");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Group files by package
  const packagesMap: { [key: string]: { file: LabSourceFile; index: number }[] } = {};
  lab.sourceFiles.forEach((f, idx) => {
    const pkg = f.packageName || "default";
    if (!packagesMap[pkg]) packagesMap[pkg] = [];
    packagesMap[pkg].push({ file: f, index: idx });
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1117] text-slate-200 shadow-2xl overflow-hidden">
      {/* IDE Top Bar */}
      <div className="bg-[#161b22] px-5 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              Trình Xem Mã Nguồn Java (NetBeans 17 / JDK 8)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              MVC Standard
            </span>
          </div>
        </div>

        {/* Global Download Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadFullZip}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50"
            title={`Tải trọn bộ NetBeans Project: ${lab.zipFileName}`}
          >
            {isDownloadingZip ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Tải Trọn Gói Code (.zip)</span>
          </button>
        </div>
      </div>

      {/* Main IDE Workspace (Split Sidebar & Editor) */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        {/* Left Sidebar: File Tree */}
        <div className="md:col-span-4 bg-[#11151c] border-b md:border-b-0 md:border-r border-slate-800/80 p-3 space-y-4 max-h-[520px] overflow-y-auto">
          <div className="flex items-center justify-between px-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span>Cây Thư Mục Packages</span>
            <span className="text-emerald-400 font-mono">{lab.sourceFiles.length} files</span>
          </div>

          <div className="space-y-3">
            {Object.keys(packagesMap).map((pkgName) => (
              <div key={pkgName} className="space-y-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-400">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono">{pkgName}</span>
                </div>

                <div className="pl-4 space-y-0.5 border-l border-slate-800/80 ml-3">
                  {packagesMap[pkgName].map(({ file, index }) => {
                    const isSelected = index === selectedFileIndex;
                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFileIndex(index)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-mono transition-all ${
                          isSelected
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? "text-blue-400" : "text-slate-500"
                            }`}
                          />
                          <span className="truncate">{file.fileName}</span>
                        </div>
                        <span className="text-[10px] text-slate-600">
                          {Math.round(file.size / 1024 * 10) / 10}KB
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Code Editor Panel */}
        <div className="md:col-span-8 flex flex-col bg-[#0d1117]">
          {/* Active File Tab & Code Tools */}
          {activeFile && (
            <div className="bg-[#161b22] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs text-blue-400">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-slate-100">{activeFile.fileName}</span>
                <span className="text-[11px] text-slate-500">
                  ({activeFile.packageName})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all active:scale-95"
                  title="Sao chép toàn bộ mã nguồn"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadJavaFile}
                  disabled={isDownloadingJava}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-blue-300 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                  title={`Tải file ${activeFile.fileName}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file này (.java)</span>
                </button>
              </div>
            </div>
          )}

          {/* Code Viewer with Line Numbers */}
          <div className="p-4 max-h-[480px] overflow-y-auto overflow-x-auto font-mono text-xs leading-relaxed">
            {activeFile ? (
              <table className="w-full border-collapse">
                <tbody>
                  {activeFile.content.split("\n").map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 group">
                      <td className="w-10 pr-4 text-right select-none text-slate-600 font-mono text-[11px] align-top">
                        {idx + 1}
                      </td>
                      <td className="whitespace-pre text-slate-300 font-mono text-xs">
                        <HighlightJavaLine line={line} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Chưa có file nào được chọn
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight syntax highlighter for Java code
 */
function HighlightJavaLine({ line }: { line: string }) {
  if (!line.trim()) return <span>&nbsp;</span>;

  // Comment line
  if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Tokenize and highlight keywords
  const keywords = new Set([
    "package",
    "import",
    "public",
    "private",
    "protected",
    "class",
    "interface",
    "extends",
    "implements",
    "void",
    "int",
    "double",
    "float",
    "boolean",
    "char",
    "long",
    "new",
    "return",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "break",
    "continue",
    "static",
    "final",
    "try",
    "catch",
    "throw",
    "throws",
    "true",
    "false",
    "null",
    "this",
    "super",
  ]);

  const parts = line.split(/(\b[a-zA-Z_][a-zA-Z0-9_]*\b|".*?"|'.*?')/);

  return (
    <span>
      {parts.map((part, i) => {
        if (keywords.has(part)) {
          return (
            <span key={i} className="text-purple-400 font-bold">
              {part}
            </span>
          );
        }
        if (part.startsWith('"') || part.startsWith("'")) {
          return (
            <span key={i} className="text-emerald-300">
              {part}
            </span>
          );
        }
        if (/^[A-Z][a-zA-Z0-9_]*$/.test(part)) {
          // Class name
          return (
            <span key={i} className="text-amber-300">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
