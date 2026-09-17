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
  Loader2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileArchive,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminProductsPage() {
  const { products, adminCreateProduct, adminUpdateProduct, adminArchiveProduct, adminDeleteProduct } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

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

  // Upload States
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<string | null>(null);

  const [isUploadingDeliverable, setIsUploadingDeliverable] = useState(false);
  const [deliverableUploadError, setDeliverableUploadError] = useState<string | null>(null);
  const [uploadedDeliverableInfo, setUploadedDeliverableInfo] = useState<{ name: string; size: number } | null>(null);
  const [isUploadingLabZip, setIsUploadingLabZip] = useState(false);
  const [labUploadFeedback, setLabUploadFeedback] = useState<string | null>(null);

  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);


  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    setThumbnailUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "thumbnails");

      const res = await fetch("/api/admin/upload/asset", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tải ảnh lên Supabase Storage");
      }

      setFormThumbnail(data.url);
    } catch (err: any) {
      setThumbnailUploadError(err.message || "Lỗi tải ảnh lên");
    } finally {
      setIsUploadingThumbnail(false);
      e.target.value = "";
    }
  };

  const handleDeliverableUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDeliverable(true);
    setDeliverableUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload/deliverable", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể tải file lên Private Bucket");
      }

      setFormStoragePath(data.storagePath);
      setUploadedDeliverableInfo({ name: data.fileName, size: data.size });
    } catch (err: any) {
      setDeliverableUploadError(err.message || "Lỗi tải file giao hàng lên");
    } finally {
      setIsUploadingDeliverable(false);
      e.target.value = "";
    }
  };

  const handleLabPackageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLabZip(true);
    setLabUploadFeedback(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload/lab-package", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể xử lý gói LAB ZIP");
      }

      setLabUploadFeedback(data.message || `Đã nhận diện thành công ${data.totalLabs} bài lab!`);
      setFormStoragePath(`digital-deliverables/lab211/${file.name}`);
      setUploadedDeliverableInfo({ name: file.name, size: file.size });
    } catch (err: any) {
      setDeliverableUploadError(err.message || "Lỗi tải gói LAB ZIP lên");
    } finally {
      setIsUploadingLabZip(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "gallery");

        const res = await fetch("/api/admin/upload/asset", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormGalleryImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormCategory("lab211");
    setFormTitle("");
    setFormSlug("");
    setFormPrice(199000);
    setFormOriginalPrice(299000);
    setFormThumbnail("");
    setFormShortDesc("");
    setFormDetailedDesc("");
    setFormStatus("published");
    setFormLiveDemo("");
    setFormVideoDemo("");
    setFormCodeSnippet("");
    setFormFeatures("Mã nguồn sạch chuẩn OOP\nHỗ trợ cài đặt trọn đời");
    setFormTechStack("Java, Spring, Next.js");
    setFormDeliverableType("download_file");
    setFormStoragePath("");
    setFormGitRepo("");
    setFormInstructions("Giải nén và import vào IDE.");
    setFormGalleryImages([]);
    setThumbnailUploadError(null);
    setDeliverableUploadError(null);
    setUploadedDeliverableInfo(null);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const success = await adminDeleteProduct(deletingProduct.id);
      if (success) {
        setActionFeedback(`Đã xóa vĩnh viễn sản phẩm "${deletingProduct.title}" thành công!`);
        setTimeout(() => setActionFeedback(null), 4000);
        setDeletingProduct(null);
      } else {
        setDeleteError("Không thể xóa sản phẩm khỏi cơ sở dữ liệu. Vui lòng kiểm tra lại kết nối.");
      }
    } catch (err: any) {
      setDeleteError(err.message || "Đã xảy ra lỗi khi xóa sản phẩm.");
    } finally {
      setIsDeleting(false);
    }
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
    setFormGalleryImages(prod.demo?.gallery_images || (prod.thumbnail_url ? [prod.thumbnail_url] : []));
    setThumbnailUploadError(null);
    setDeliverableUploadError(null);
    setUploadedDeliverableInfo(null);
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
      thumbnail_url: formThumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
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
        gallery_images: formGalleryImages.length > 0 ? formGalleryImages : [formThumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"],
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

      {/* Action Feedback Notification */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">Chưa có sản phẩm nào trong hệ thống</p>
                    <p className="text-xs text-slate-400 mt-1">Bấm &quot;+ Thêm Sản Phẩm Mới&quot; để tạo sản phẩm hoặc nạp trực tiếp vào Supabase.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img
                        src={p.thumbnail_url}
                        alt={p.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">slug: {p.slug}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="capitalize px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{formatVND(p.price)}</p>
                      {p.original_price && (
                        <p className="text-[10px] text-slate-400 line-through">
                          {formatVND(p.original_price)}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-500 text-[11px]">
                        {p.demo?.features_list?.length || 0} tính năng
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : p.status === "draft"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
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
                          onClick={() => {
                            setDeleteError(null);
                            setDeletingProduct(p);
                          }}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Xóa vĩnh viễn sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL (Hard Delete) */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Xác Nhận Xóa Vĩnh Viễn</h3>
                <p className="text-xs text-slate-500 font-medium">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-rose-800 mb-4 space-y-2">
              <p className="font-bold">
                Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này?
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-rose-200/80 flex items-center gap-2.5">
                <img
                  src={deletingProduct.thumbnail_url}
                  alt={deletingProduct.title}
                  className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{deletingProduct.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono">slug: {deletingProduct.slug}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Sản phẩm này cùng toàn bộ cấu hình demo, hình ảnh liên quan sẽ bị xóa sạch khỏi cơ sở dữ liệu và Storefront.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 mb-4 rounded-xl bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeletingProduct(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 disabled:opacity-50"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Vĩnh Viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <option value="project">Project &amp; Assignment</option>
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

              {/* Thumbnail Image Upload Section */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ảnh Đại Diện Sản Phẩm (Thumbnail) *
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Image Preview Box */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-sm group">
                      {formThumbnail ? (
                        <>
                          <img
                            src={formThumbnail}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormThumbnail("")}
                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                            title="Gỡ ảnh này"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                            <span>Gỡ</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                          <ImageIcon className="w-7 h-7 mb-1 text-blue-400" />
                          <span className="text-[10px] font-semibold">Chưa có ảnh</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Buttons & Status */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95">
                          {isUploadingThumbnail ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang Tải Lên Supabase...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span>Tải Ảnh Lên Từ Máy</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/gif"
                            disabled={isUploadingThumbnail}
                            onChange={handleThumbnailUpload}
                            className="hidden"
                          />
                        </label>

                        {formThumbnail && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Đã tải lên Supabase Storage
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500">
                        Chấp nhận định dạng JPG, PNG, WEBP tối đa 10MB. File sẽ được lưu trữ tại Bucket <code className="text-blue-600 font-mono font-semibold">product-assets</code>.
                      </p>

                      {thumbnailUploadError && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {thumbnailUploadError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fallback URL Input */}
                  <div className="pt-2 border-t border-blue-100/60">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Hoặc dán trực tiếp đường dẫn URL ảnh:
                    </span>
                    <input
                      type="text"
                      value={formThumbnail}
                      onChange={(e) => setFormThumbnail(e.target.value)}
                      placeholder="https://images.unsplash.com/... hoặc link ảnh công khai"
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>
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
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4">
                <h4 className="font-extrabold text-blue-900 uppercase text-[10px]">Cấu hình Rich Demo (Spec 003)</h4>
                
                {/* Gallery Images Upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-bold text-slate-700 text-xs">
                      Gallery Ảnh Demo ({formGalleryImages.length} ảnh)
                    </label>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all active:scale-95">
                      {isUploadingGallery ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang Tải...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Tải Thêm Ảnh Demo</span>
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp, image/gif"
                        disabled={isUploadingGallery}
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formGalleryImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                      {formGalleryImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-sm">
                          <img src={imgUrl} alt={`Demo ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormGalleryImages(formGalleryImages.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Xóa ảnh này"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Chưa có ảnh gallery. Bấm "Tải Thêm Ảnh Demo" để đăng tải nhiều ảnh chụp màn hình tính năng cho sản phẩm.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Live Demo URL</label>
                    <input
                      type="text"
                      value={formLiveDemo}
                      onChange={(e) => setFormLiveDemo(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Video Review URL (YouTube)</label>
                    <input
                      type="text"
                      value={formVideoDemo}
                      onChange={(e) => setFormVideoDemo(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
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
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Tags Công Nghệ (cách nhau bằng dấu phẩy)</label>
                    <textarea
                      rows={2}
                      value={formTechStack}
                      onChange={(e) => setFormTechStack(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Deliverable Settings */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-emerald-900 uppercase text-[10px] flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                    Tài Nguyên Bàn Giao (Deliverable Vault - Spec 007)
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Bảo mật Private Bucket
                  </span>
                </div>

                {/* SPECIAL LAB211 AUTO-EXTRACT BOX */}
                {formCategory === "lab211" && (
                  <div className="p-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        Chế Độ Bóc Tách Tự Động LAB211 (Spec 010)
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Word .docx + Java MVC
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Chỉ cần tải lên file ZIP bài lab (ví dụ: <code className="font-mono font-bold text-blue-700">LAB211.zip</code>), hệ thống sẽ tự động bóc tách đề bài Word, từng file Java theo package, và cấu hình quyền tải chuẩn tên file gốc cho khách hàng.
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95">
                        {isUploadingLabZip ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang Bóc Tách File ZIP...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Tải Lên File ZIP LAB211 (Tự Động Bóc Tách)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".zip"
                          disabled={isUploadingLabZip}
                          onChange={handleLabPackageUpload}
                          className="hidden"
                        />
                      </label>

                      {labUploadFeedback && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          {labUploadFeedback}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* File ZIP Upload Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-white space-y-3 shadow-sm">
                  <label className="block font-bold text-slate-800 text-xs">
                    Tải Lên File Mã Nguồn / Tài Liệu Bàn Giao (.ZIP, .RAR, .PDF) *
                  </label>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95">
                      {isUploadingDeliverable ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang Đẩy Lên Supabase Storage...</span>
                        </>
                      ) : (
                        <>
                          <FileArchive className="w-4 h-4" />
                          <span>Chọn File Từ Máy Để Tải Lên</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".zip,.rar,.7z,.tar,.gz,.pdf,.doc,.docx"
                        disabled={isUploadingDeliverable}
                        onChange={handleDeliverableUpload}
                        className="hidden"
                      />
                    </label>

                    {formStoragePath && (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-800 font-mono max-w-full overflow-hidden">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{formStoragePath}</span>
                        {uploadedDeliverableInfo && (
                          <span className="text-[10px] text-emerald-600 font-sans shrink-0">
                            ({(uploadedDeliverableInfo.size / (1024 * 1024)).toFixed(1)} MB)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {deliverableUploadError && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {deliverableUploadError}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-500">
                    File tải lên được lưu an toàn trong Private Bucket <code className="text-emerald-700 font-bold font-mono">digital-deliverables</code>. Khách hàng chỉ tải được sau khi đơn hàng được Admin duyệt (hệ thống sinh Signed URL có hiệu lực 60 phút).
                  </p>

                  {/* Fallback Storage Path Input */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      Hoặc nhập đường dẫn file trong Storage:
                    </span>
                    <input
                      type="text"
                      value={formStoragePath}
                      onChange={(e) => setFormStoragePath(e.target.value)}
                      placeholder="packages/1789531228305_shopee_bot_v2.zip"
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Hình Thức Bàn Giao</label>
                    <select
                      value={formDeliverableType}
                      onChange={(e) => setFormDeliverableType(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                    >
                      <option value="download_file">Tải File Mã Nguồn (.ZIP / PDF)</option>
                      <option value="git_access">Cấp Quyền GitHub Repository</option>
                      <option value="license_key">Mã Bản Quyền (License Key)</option>
                      <option value="instructions_only">Chỉ Hướng Dẫn Kích Hoạt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Private GitHub Repo URL (nếu có)</label>
                    <input
                      type="text"
                      value={formGitRepo}
                      onChange={(e) => setFormGitRepo(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Hướng Dẫn Cài Đặt / Chạy Đồ Án Cho Khách Hàng</label>
                  <textarea
                    rows={2}
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    placeholder="1. Giải nén file\n2. Mở terminal gõ npm install\n3. Chạy npm start"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
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
