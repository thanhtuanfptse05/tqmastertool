"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Product,
  Order,
  UserProfile,
  UserRole,
  CartItem,
  UnlockedDeliverable,
} from "@/types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from "./mock-data";

interface StoreContextType {
  // Auth & Users (Spec 001)
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (email: string, role?: UserRole) => boolean;
  register: (email: string, fullName: string) => boolean;
  logout: () => void;
  adminResetPassword: (userId: string) => boolean;
  adminUpdateRole: (userId: string, role: UserRole) => void;

  // Products (Spec 002, 003, 008)
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  adminCreateProduct: (productData: Partial<Product>) => Product;
  adminUpdateProduct: (id: string, productData: Partial<Product>) => void;
  adminArchiveProduct: (id: string) => void;

  // Cart & Checkout (Spec 004, 005)
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (product: Product) => Order;
  submitPaymentProof: (orderId: string, proofUrl: string, transactionRef?: string) => void;

  // Admin Order Review (Spec 006, 009)
  adminReviewOrder: (orderId: string, action: "approve" | "reject", adminNotes?: string) => void;

  // Deliverables Vault (Spec 007)
  getCustomerOrders: (userId?: string) => Order[];
  getUnlockedDeliverables: (userId?: string) => UnlockedDeliverable[];

  // Modals & UI Controls
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  checkoutProduct: Product | null;
  openCheckout: (product: Product) => void;
  closeCheckout: () => void;
  activeOrderForPayment: Order | null;
  setActiveOrderForPayment: (order: Order | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "cv_current_user",
  USERS: "cv_users",
  PRODUCTS: "cv_products",
  ORDERS: "cv_orders",
  CART: "cv_cart",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [activeOrderForPayment, setActiveOrderForPayment] = useState<Order | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error("Hydration error:", e);
    }
  }, []);

  // Sync to localStorage
  const persist = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Storage save error:", e);
    }
  };

  // Auth Operations (Spec 001)
  const login = (email: string, forcedRole?: UserRole): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    let userToSet: UserProfile;
    if (existing) {
      userToSet = existing;
    } else {
      const role: UserRole = forcedRole || (cleanEmail.includes("admin") ? "admin" : "customer");
      userToSet = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        full_name: cleanEmail.split("@")[0].toUpperCase(),
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        role,
        created_at: new Date().toISOString(),
      };
      const newUsers = [userToSet, ...users];
      setUsers(newUsers);
      persist(STORAGE_KEYS.USERS, newUsers);
    }

    setCurrentUser(userToSet);
    persist(STORAGE_KEYS.USER, userToSet);
    setIsAuthModalOpen(false);
    return true;
  };

  const register = (email: string, fullName: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return false; // Email already registered
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      full_name: fullName.trim() || cleanEmail.split("@")[0],
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: "customer",
      created_at: new Date().toISOString(),
    };

    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    persist(STORAGE_KEYS.USERS, updatedUsers);

    setCurrentUser(newUser);
    persist(STORAGE_KEYS.USER, newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const adminResetPassword = (userId: string): boolean => {
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    return true;
  };

  const adminUpdateRole = (userId: string, role: UserRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role } : u));
    setUsers(updated);
    persist(STORAGE_KEYS.USERS, updated);
    if (currentUser?.id === userId) {
      const updatedCurrent = { ...currentUser, role };
      setCurrentUser(updatedCurrent);
      persist(STORAGE_KEYS.USER, updatedCurrent);
    }
  };

  // Products Operations (Spec 002, 003, 008)
  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const adminCreateProduct = (productData: Partial<Product>): Product => {
    const newId = `prod-${Date.now()}`;
    const slug = (productData.title || "san-pham-moi")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const customDemo = productData.demo;
    const newProduct: Product = {
      id: newId,
      category: productData.category || "tool",
      title: productData.title || "Sản phẩm mới",
      slug: productData.slug || slug,
      short_description: productData.short_description || "Mô tả ngắn sản phẩm",
      detailed_description: productData.detailed_description || "## Chi tiết sản phẩm",
      price: productData.price || 99000,
      original_price: productData.original_price,
      thumbnail_url: productData.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      status: productData.status || "published",
      deliverable_type: productData.deliverable_type || "download_file",
      storage_file_path: productData.storage_file_path,
      git_repo_url: productData.git_repo_url,
      access_instructions: productData.access_instructions || "Sau khi thanh toán, tải file tại Kho tài nguyên số.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      demo: customDemo ? {
        ...customDemo,
        id: customDemo.id || `demo-${newId}`,
        product_id: newId,
        gallery_images: customDemo.gallery_images?.length ? customDemo.gallery_images : [productData.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"],
        features_list: customDemo.features_list || ["Tính năng bản quyền", "Hỗ trợ cài đặt 24/7"],
        tech_stack_tags: customDemo.tech_stack_tags || ["CodeVault", "Digital Asset"],
      } : {
        id: `demo-${newId}`,
        product_id: newId,
        gallery_images: [
          productData.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
        ],
        features_list: ["Tính năng bản quyền", "Hỗ trợ cài đặt 24/7"],
        tech_stack_tags: ["CodeVault", "Digital Asset"],
      },
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    persist(STORAGE_KEYS.PRODUCTS, updated);
    return newProduct;
  };

  const adminUpdateProduct = (id: string, productData: Partial<Product>) => {
    const updated = products.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...productData,
        updated_at: new Date().toISOString(),
        demo: {
          ...p.demo,
          ...(productData.demo || {}),
          id: p.demo?.id || `demo-${id}`,
          product_id: id,
          gallery_images: productData.demo?.gallery_images || p.demo?.gallery_images || [p.thumbnail_url],
          features_list: productData.demo?.features_list || p.demo?.features_list || [],
          tech_stack_tags: productData.demo?.tech_stack_tags || p.demo?.tech_stack_tags || [],
        },
      };
    });
    setProducts(updated);
    persist(STORAGE_KEYS.PRODUCTS, updated);
  };

  const adminArchiveProduct = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, status: "archived" as const } : p));
    setProducts(updated);
    persist(STORAGE_KEYS.PRODUCTS, updated);
  };

  // Cart & Order Operations (Spec 004, 005)
  const addToCart = (product: Product) => {
    if (!cart.some((item) => item.product.id === product.id)) {
      const newCart = [...cart, { product, added_at: new Date().toISOString() }];
      setCart(newCart);
      persist(STORAGE_KEYS.CART, newCart);
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    setCart(newCart);
    persist(STORAGE_KEYS.CART, newCart);
  };

  const clearCart = () => {
    setCart([]);
    persist(STORAGE_KEYS.CART, []);
  };

  const createOrder = (product: Product): Order => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `CV-2026-${orderNum}`;
    const orderId = `order-${Date.now()}`;
    const cleanMemo = `CV2026${orderNum}`;

    const newOrder: Order = {
      id: orderId,
      order_code: orderCode,
      user_id: currentUser?.id || "user-guest",
      user_email: currentUser?.email || "guest@codevault.io",
      user_name: currentUser?.full_name || "Khách Hàng",
      total_amount: product.price,
      status: "pending_payment",
      payment_method: "vietqr",
      vietqr_content: cleanMemo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: `item-${Date.now()}`,
          order_id: orderId,
          product_id: product.id,
          unit_price: product.price,
          product_title: product.title,
          product_category: product.category,
          product_thumbnail: product.thumbnail_url,
          created_at: new Date().toISOString(),
        },
      ],
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);
    setActiveOrderForPayment(newOrder);
    return newOrder;
  };

  const submitPaymentProof = (orderId: string, proofUrl: string, transactionRef?: string) => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: "pending_approval" as const,
        payment_proof_image: proofUrl,
        transaction_ref: transactionRef || `MB${Date.now()}`,
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);
    if (activeOrderForPayment?.id === orderId) {
      setActiveOrderForPayment({
        ...activeOrderForPayment,
        status: "pending_approval",
        payment_proof_image: proofUrl,
        transaction_ref: transactionRef,
      });
    }
  };

  // Admin Order Review (Spec 006)
  const adminReviewOrder = (orderId: string, action: "approve" | "reject", adminNotes?: string) => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: action === "approve" ? ("completed" as const) : ("rejected" as const),
        reviewed_by_admin_id: currentUser?.id || "admin-lead",
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes || (action === "approve" ? "Đã đối chiếu khớp số dư và nội dung chuyển khoản." : "Thông tin chuyển khoản không hợp lệ."),
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);
  };

  // Deliverables Vault (Spec 007)
  const getCustomerOrders = (userId?: string): Order[] => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return [];
    return orders.filter((o) => o.user_id === targetId);
  };

  const getUnlockedDeliverables = (userId?: string): UnlockedDeliverable[] => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return [];

    const completedOrders = orders.filter((o) => o.user_id === targetId && o.status === "completed");
    const deliverables: UnlockedDeliverable[] = [];

    completedOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (product) {
          deliverables.push({
            order_id: order.id,
            product_id: product.id,
            product_title: product.title,
            product_category: product.category,
            signed_download_url: product.storage_file_path
              ? `https://storage.codevault.io/deliverables/${product.storage_file_path}?token=sig_${Date.now()}`
              : undefined,
            git_repo_url: product.git_repo_url,
            license_key: product.license_key_template
              ? `CV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
              : undefined,
            instructions: product.access_instructions || "Liên hệ hỗ trợ kỹ thuật qua Zalo/Discord nếu cần hướng dẫn thêm.",
          });
        }
      });
    });

    return deliverables;
  };

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openCheckout = (product: Product) => {
    setCheckoutProduct(product);
  };

  const closeCheckout = () => {
    setCheckoutProduct(null);
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        adminResetPassword,
        adminUpdateRole,
        products,
        getProductBySlug,
        getProductById,
        adminCreateProduct,
        adminUpdateProduct,
        adminArchiveProduct,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        orders,
        createOrder,
        submitPaymentProof,
        adminReviewOrder,
        getCustomerOrders,
        getUnlockedDeliverables,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        checkoutProduct,
        openCheckout,
        closeCheckout,
        activeOrderForPayment,
        setActiveOrderForPayment,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
