"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { formatVND } from "@/lib/vietqr";
import { Product, ProductCategory, ProductStatus } from "@/types";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Layers,
  Code2,
  Wrench,
  Sparkles,
  FileCode,
  Play,
  Upload,
} from "lucide-react";

export default function AdminProductsPage() {
  const { products, adminCreateProduct, adminUpdateProduct, adminArchiveProduct } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<ProductCategory>("lab211");
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPrice, setFormPrice] = useState<number>(199000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(299000);
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDetailedDesc, setFormDetailedDesc] = useState("");
  const [formStatus, setFormStatus] = useState<ProductStatus>("published");
  const [formLiveDemo, setFormLiveDemo] = useState("");
  const [formVideoDemo, setFormVideoDemo] = useState("");
  const [formCodeSnippet, setFormCodeSnippet] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formTechStack, setFormTechStack] = useState("");
  const [formDeliverableType, setFormDeliverableType] = useState<any>("download_file");
  const [formStoragePath, setFormStoragePath] = useState("");
  const [formGitRepo, setFormGitRepo] = useState("");
  const [formInstructions, setFormInstructions] = useState("");

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormCategory("lab211");
    setFormTitle("");
    setFormSlug("");
    setFormPrice(199000);
    setFormOriginalPrice(299000);
    setFormThumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800");
    setFormShortDesc("");
    setFormDetailedDesc("");
    setFormStatus("published");
    setFormLiveDemo("");
    setFormVideoDemo("");
    setFormCodeSnippet("");
    setFormFeatures("Mã nguồn sạch chuẩn OOP\nHỗ trợ cài đặt trọn đời");
    setFormTechStack("Java, Spring, Next.js");
    setFormDeliverableType("download_file");
    setFormStoragePath("source-code-v1.zip");
    setFormGitRepo("");
    setFormInstructions("Giải nén và import vào IDE.");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormCategory(prod.category);
    setFormTitle(prod.title);
    setFormSlug(prod.slug);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.original_price || prod.price);
    setFormThumbnail(prod.thumbnail_url);
    setFormShortDesc(prod.short_description);
    setFormDetailedDesc(prod.detailed_description);
    setFormStatus(prod.status);
    setFormLiveDemo(prod.demo?.live_demo_url || "");
    setFormVideoDemo(prod.demo?.video_demo_url || "");
    setFormCodeSnippet(prod.demo?.code_preview_snippet || "");
    setFormFeatures(prod.demo?.features_list?.join("\n") || "");
    setFormTechStack(prod.demo?.tech_stack_tags?.join(", ") || "");
    setFormDeliverableType(prod.deliverable_type);
    setFormStoragePath(prod.storage_file_path || "");
    setFormGitRepo(prod.git_repo_url || "");
    setFormInstructions(prod.access_instructions || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const featuresList = formFeatures
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const techStackList = formTechStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<Product> = {
      category: formCategory,
      title: formTitle,
      slug: formSlug || formTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      price: Number(formPrice),
      original_price: Number(formOriginalPrice),
      thumbnail_url: formThumbnail,
      short_description: formShortDesc,
      detailed_description: formDetailedDesc,
      status: formStatus,
      deliverable_type: formDeliverableType,
      storage_file_path: formStoragePath,
      git_repo_url: formGitRepo,
      access_instructions: formInstructions,
      demo: {
        id: editingProduct?.demo?.id || `demo-${Date.now()}`,
        product_id: editingProduct?.id || `prod-${Date.now()}`,
        gallery_images: [formThumbnail],
        live_demo_url: formLiveDemo,
        video_demo_url: formVideoDemo,
        code_preview_snippet: formCodeSnippet,
        features_list: featuresList,
        tech_stack_tags: techStackList,
      },
    };

    if (editingProduct) {
      adminUpdateProduct(editingProduct.id, payload);
    } else {
      adminCreateProduct(payload);
    }

    setIsModalOpen(false);
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Kho Sản Phẩm Quản Trị</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Sản Phẩm &amp; Cấu Hình Demo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thêm mới, chỉnh sửa thông tin đa phương tiện và file bàn giao bảo mật.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-card p-4 border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "all" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tất cả ({products.length})
          </button>
          <button
            onClick={() => setSelectedCategory("lab211")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "lab211" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            LAB211 ({products.filter((p) => p.category === "lab211").length})
          </button>
          <button
            onClick={() => setSelectedCategory("project")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "project" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Projects ({products.filter((p) => p.category === "project").length})
          </button>
          <button
            onClick={() => setSelectedCategory("tool")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "tool" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tools ({products.filter((p) => p.category === "tool").length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm sản phẩm theo tên..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-card border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Sản Phẩm</th>
                <th className="py-3.5 px-4">Danh Mục</th>
                <th className="py-3.5 px-4">Giá Bán</th>
                <th className="py-3.5 px-4">Demo Features</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <img
                      src={p.thumbnail_url}
                      alt={p.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 max-w-xs">
                      <p className="font-extrabold text-slate-900 truncate">{p.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{p.slug}</p>
                    </div>
                  </td>

                  <td className="py-4 px-4 uppercase text-[10px] font-extrabold text-slate-600">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-slate-900">
                    {formatVND(p.price)}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      {p.demo?.code_preview_snippet && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                          Code
                        </span>
                      )}
                      {p.demo?.video_demo_url && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                          Video
                        </span>
                      )}
                      {p.demo?.live_demo_url && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                          Live
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        p.status === "published"
                          ? "bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]"
                          : p.status === "draft"
                          ? "bg-[#fef3c7] text-[#b45309] border-[#fde68a]"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {p.status === "published"
                        ? "Đang bán"
                        : p.status === "draft"
                        ? "Bản nháp"
                        : "Đã lưu trữ"}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => adminArchiveProduct(p.id)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                        title="Lưu trữ / Xóa mềm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL (Spec 008) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-card shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                {editingProduct ? "Chỉnh Sửa Sản Phẩm & Demo" : "Thêm Sản Phẩm Mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh Mục *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="lab211">LAB211 OOP Java</option>
                    <option value="project">Đồ Án Project</option>
                    <option value="tool">Tiện Ích &amp; Tool</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá Bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá Gốc Niêm Yết</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng Thái *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                  >
                    <option value="published">Đang Bán (Published)</option>
                    <option value="draft">Bản Nháp (Draft)</option>
                    <option value="archived">Lưu Trữ (Archived)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Ảnh Thumbnail</label>
                <input
                  type="text"
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô Tả Ngắn</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô Tả Chi Tiết (Markdown)</label>
                <textarea
                  rows={4}
                  value={formDetailedDesc}
                  onChange={(e) => setFormDetailedDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-mono text-[11px]"
                />
              </div>

              {/* Demo Fields */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <h4 className="font-extrabold text-blue-900 uppercase text-[10px]">Cấu hình Rich Demo (Spec 003)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Live Demo URL</label>
                    <input
                      type="text"
                      value={formLiveDemo}
                      onChange={(e) => setFormLiveDemo(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Video Review URL (YouTube)</label>
                    <input
                      type="text"
                      value={formVideoDemo}
                      onChange={(e) => setFormVideoDemo(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Đoạn Code Mẫu (Java OOP / Preview)</label>
                  <textarea
                    rows={3}
                    value={formCodeSnippet}
                    onChange={(e) => setFormCodeSnippet(e.target.value)}
                    placeholder="// public class Demo {...}"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Tính Năng Bao Gồm (mỗi dòng 1 tính năng)</label>
                    <textarea
                      rows={2}
                      value={formFeatures}
                      onChange={(e) => setFormFeatures(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Tags Công Nghệ (cách nhau bằng dấu phẩy)</label>
                    <textarea
                      rows={2}
                      value={formTechStack}
                      onChange={(e) => setFormTechStack(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Deliverable Settings */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <h4 className="font-extrabold text-emerald-900 uppercase text-[10px]">Tài Nguyên Bàn Giao (Deliverable Vault - Spec 007)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Tên File ZIP Trong Storage</label>
                    <input
                      type="text"
                      value={formStoragePath}
                      onChange={(e) => setFormStoragePath(e.target.value)}
                      placeholder="package-source-v1.zip"
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Private GitHub Repo URL (nếu có)</label>
                    <input
                      type="text"
                      value={formGitRepo}
                      onChange={(e) => setFormGitRepo(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Hướng Dẫn Cài Đặt Cho Khách Hàng</label>
                  <textarea
                    rows={2}
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                >
                  {editingProduct ? "Lưu Thay Đổi" : "Tạo Sản Phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
