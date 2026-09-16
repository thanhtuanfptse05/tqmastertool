"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  Product,
  Order,
  OrderStatus,
  UserProfile,
  UserRole,
  CartItem,
  UnlockedDeliverable,
  ProductStatus,
} from "@/types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase";

interface StoreContextType {
  // Auth & Users
  currentUser: UserProfile | null;
  isAuthLoading: boolean;
  users: UserProfile[];
  login: (email: string, password?: string) => boolean;
  register: (email: string, fullName: string, password?: string) => boolean;
  logout: () => void;
  adminResetPassword: (userId: string) => boolean;
  adminUpdateRole: (userId: string, role: UserRole) => void;

  // Products
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  adminCreateProduct: (productData: Partial<Product>) => Product;
  adminUpdateProduct: (id: string, productData: Partial<Product>) => void;
  adminArchiveProduct: (id: string) => void;
  refreshProducts: () => Promise<void>;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (product: Product) => Order;
  submitPaymentProof: (orderId: string, proofUrl: string, transactionRef?: string) => void;

  // Admin Order Review & CRUD
  adminReviewOrder: (orderId: string, action: "approve" | "reject", adminNotes?: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<boolean>;
  adminBlockOrder: (orderId: string, reason?: string) => Promise<boolean>;
  adminUpdateOrder: (orderId: string, data: Partial<Order>) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  refreshOrders: () => Promise<void>;

  // Deliverables Vault
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

// Check if an email has administrative privileges
const checkIsAdminEmail = (email: string): boolean => {
  const clean = email.trim().toLowerCase();
  return (
    clean === "lequan12305@gmail.com" ||
    clean === "admin@codevault.io" ||
    clean.startsWith("admin@") ||
    clean.includes("+admin@")
  );
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [activeOrderForPayment, setActiveOrderForPayment] = useState<Order | null>(null);

  // Sync to localStorage
  const persist = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Storage save error:", e);
    }
  };

  // Fetch live products from Supabase database
  const fetchProductsFromDB = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_demos (*)
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not query products from Supabase:", error.message);
        return;
      }

      if (data) {
        const mappedProducts: Product[] = data.map((p: any) => {
          const demoRecord = Array.isArray(p.product_demos) ? p.product_demos[0] : p.product_demos;
          return {
            id: p.id,
            category: p.category,
            title: p.title,
            slug: p.slug,
            short_description: p.short_description,
            detailed_description: p.detailed_description || "",
            price: Number(p.price) || 0,
            original_price: p.original_price ? Number(p.original_price) : undefined,
            thumbnail_url: p.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
            status: p.status || "published",
            deliverable_type: p.deliverable_type || "download_file",
            storage_file_path: p.storage_file_path,
            git_repo_url: p.git_repo_url,
            access_instructions: p.access_instructions,
            created_at: p.created_at,
            updated_at: p.updated_at,
            demo: demoRecord
              ? {
                  id: demoRecord.id,
                  product_id: p.id,
                  gallery_images: Array.isArray(demoRecord.gallery_images) ? demoRecord.gallery_images : [],
                  live_demo_url: demoRecord.live_demo_url || undefined,
                  video_demo_url: demoRecord.video_demo_url || undefined,
                  demo_credentials: demoRecord.demo_credentials || undefined,
                  code_preview_snippet: demoRecord.code_preview_snippet || undefined,
                  features_list: Array.isArray(demoRecord.features_list) ? demoRecord.features_list : [],
                  tech_stack_tags: Array.isArray(demoRecord.tech_stack_tags) ? demoRecord.tech_stack_tags : [],
                }
              : undefined,
          };
        });
        setProducts(mappedProducts);
        persist(STORAGE_KEYS.PRODUCTS, mappedProducts);
      }
    } catch (e) {
      console.error("Error fetching products from database:", e);
    }
  }, []);

  // Fetch live orders from Supabase database
  const fetchOrdersFromDB = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not query orders from Supabase:", error.message);
        return;
      }

      if (data) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          order_code: o.order_code,
          user_id: o.user_id,
          user_email: o.user_email || "",
          user_name: o.user_name || "",
          items: (o.order_items || []).map((item: any) => ({
            id: item.id || `item-${item.product_id}`,
            order_id: o.id,
            product_id: item.product_id,
            product_title: item.product_title || "Sản phẩm CodeVault",
            product_category: item.product_category || "lab211",
            product_thumbnail: item.product_thumbnail || "",
            unit_price: Number(item.unit_price) || 0,
            created_at: item.created_at || o.created_at,
          })),
          total_amount: Number(o.total_amount),
          status: (o.status === "blocked" || (o.admin_notes && o.admin_notes.includes("[BLOCKED]"))) ? "blocked" : o.status,
          payment_method: o.payment_method,
          vietqr_content: o.vietqr_content,
          payment_proof_image: o.payment_proof_image,
          transaction_ref: o.transaction_ref,
          reviewed_by_admin_id: o.reviewed_by_admin_id,
          reviewed_at: o.reviewed_at,
          admin_notes: o.admin_notes,
          created_at: o.created_at,
          updated_at: o.updated_at,
        }));
        setOrders(mappedOrders);
        persist(STORAGE_KEYS.ORDERS, mappedOrders);
      }
    } catch (e) {
      console.error("Error fetching orders from database:", e);
    }
  }, []);

  // Hydrate from localStorage & Database
  useEffect(() => {
    let active = true;

    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        // Purge old hardcoded mock data so only real database data displays
        const hasMock = Array.isArray(parsed) && parsed.some((p: any) =>
          p.id === "prod-lab-01" ||
          p.id === "prod-cap-01" ||
          p.id === "prod-ai-01" ||
          p.id === "prod-bot-01" ||
          p.id?.startsWith("prod-lab211")
        );
        if (hasMock) {
          localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
          setProducts([]);
        } else {
          setProducts(parsed);
        }
      }

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        const hasMockOrders = Array.isArray(parsedOrders) && parsedOrders.some((o: any) =>
          o.id === "ord-01" || o.order_code === "ORD-2026-9021"
        );
        if (hasMockOrders) {
          localStorage.removeItem(STORAGE_KEYS.ORDERS);
          setOrders([]);
        } else {
          setOrders(parsedOrders);
        }
      }

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error("Hydration error:", e);
    }

    if (isSupabaseConfigured) {
      fetchProductsFromDB();
      fetchOrdersFromDB();

      // Check active Supabase Auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!active) return;
        if (session?.user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (!active) return;
              if (profile) {
                const isAdmin = profile.role === "admin" || checkIsAdminEmail(session.user.email || "");
                const userObj: UserProfile = {
                  id: session.user.id,
                  email: session.user.email || "",
                  full_name: profile.full_name || session.user.email?.split("@")[0].toUpperCase(),
                  avatar_url: profile.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
                  role: isAdmin ? "admin" : "customer",
                  created_at: profile.created_at || new Date().toISOString(),
                };
                setCurrentUser(userObj);
                persist(STORAGE_KEYS.USER, userObj);
              }
              setIsAuthLoading(false);
            });
        } else {
          setIsAuthLoading(false);
        }
      }).catch(() => {
        if (active) setIsAuthLoading(false);
      });

      // Listen for auth changes (sign in, sign out)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!active) return;
        if (session?.user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (!active) return;
              if (profile) {
                const isAdmin = profile.role === "admin" || checkIsAdminEmail(session.user.email || "");
                const userObj: UserProfile = {
                  id: session.user.id,
                  email: session.user.email || "",
                  full_name: profile.full_name || session.user.email?.split("@")[0].toUpperCase(),
                  avatar_url: profile.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
                  role: isAdmin ? "admin" : "customer",
                  created_at: profile.created_at || new Date().toISOString(),
                };
                setCurrentUser(userObj);
                persist(STORAGE_KEYS.USER, userObj);
              }
            });
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      });

      return () => {
        active = false;
        subscription?.unsubscribe();
      };
    } else {
      setIsAuthLoading(false);
    }
  }, [fetchProductsFromDB, fetchOrdersFromDB]);

  // Auth Operations: Normal Login
  const login = (email: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    const isAdmin = existing?.role === "admin" || checkIsAdminEmail(cleanEmail);
    const role: UserRole = isAdmin ? "admin" : (existing?.role || "customer");

    const userToSet: UserProfile = existing
      ? { ...existing, role: isAdmin ? "admin" : existing.role }
      : {
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
          email: cleanEmail,
          full_name: cleanEmail.split("@")[0].toUpperCase(),
          avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          role,
          created_at: new Date().toISOString(),
        };

    const newUsers = existing
      ? users.map((u) => (u.email.toLowerCase() === cleanEmail ? userToSet : u))
      : [userToSet, ...users];

    setUsers(newUsers);
    persist(STORAGE_KEYS.USERS, newUsers);

    setCurrentUser(userToSet);
    persist(STORAGE_KEYS.USER, userToSet);
    setIsAuthModalOpen(false);

    // Sync with Supabase Auth if configured
    if (isSupabaseConfigured && password) {
      supabase.auth.signInWithPassword({ email: cleanEmail, password }).then(({ data, error }) => {
        if (!error && data?.user) {
          supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                const dbIsAdmin = profile.role === "admin" || isAdmin;
                const updatedUser: UserProfile = {
                  ...userToSet,
                  id: data.user.id,
                  role: dbIsAdmin ? "admin" : "customer",
                  full_name: profile.full_name || userToSet.full_name,
                  avatar_url: profile.avatar_url || userToSet.avatar_url,
                };
                setCurrentUser(updatedUser);
                persist(STORAGE_KEYS.USER, updatedUser);
              }
            });
        }
      });
    }

    return true;
  };

  const register = (email: string, fullName: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return false;
    }

    const isAdmin = checkIsAdminEmail(cleanEmail);
    const newUser: UserProfile = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      email: cleanEmail,
      full_name: fullName.trim() || cleanEmail.split("@")[0],
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: isAdmin ? "admin" : "customer",
      created_at: new Date().toISOString(),
    };

    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    persist(STORAGE_KEYS.USERS, updatedUsers);

    setCurrentUser(newUser);
    persist(STORAGE_KEYS.USER, newUser);
    setIsAuthModalOpen(false);

    if (isSupabaseConfigured && password) {
      supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
    }

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
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
    if (isSupabaseConfigured) {
      supabase.from("profiles").update({ role }).eq("id", userId);
    }
  };

  // Products Operations
  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const adminCreateProduct = (productData: Partial<Product>): Product => {
    const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;
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
        id: customDemo.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `demo-${newId}`),
        product_id: newId,
        gallery_images: customDemo.gallery_images?.length ? customDemo.gallery_images : [productData.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"],
        features_list: customDemo.features_list || ["Tính năng bản quyền", "Hỗ trợ cài đặt 24/7"],
        tech_stack_tags: customDemo.tech_stack_tags || ["CodeVault", "Digital Asset"],
      } : {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `demo-${newId}`,
        product_id: newId,
        gallery_images: [
          productData.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
        ],
        features_list: ["Tính năng bản quyền", "Hỗ trợ cài đặt 24/7"],
        tech_stack_tags: ["CodeVault", "Digital Asset"],
      },
    };

    if (isSupabaseConfigured) {
      supabase.from("products").insert({
        id: newProduct.id,
        category: newProduct.category,
        title: newProduct.title,
        slug: newProduct.slug,
        short_description: newProduct.short_description,
        detailed_description: newProduct.detailed_description,
        price: newProduct.price,
        original_price: newProduct.original_price,
        thumbnail_url: newProduct.thumbnail_url,
        status: newProduct.status,
        deliverable_type: newProduct.deliverable_type,
        storage_file_path: newProduct.storage_file_path,
        git_repo_url: newProduct.git_repo_url,
        access_instructions: newProduct.access_instructions,
      }).then(({ error }) => {
        if (error) console.error("Error inserting product into Supabase:", error);
        else if (newProduct.demo) {
          supabase.from("product_demos").insert({
            id: newProduct.demo.id,
            product_id: newProduct.id,
            gallery_images: newProduct.demo.gallery_images,
            live_demo_url: newProduct.demo.live_demo_url,
            video_demo_url: newProduct.demo.video_demo_url,
            demo_credentials: newProduct.demo.demo_credentials,
            code_preview_snippet: newProduct.demo.code_preview_snippet,
            features_list: newProduct.demo.features_list,
            tech_stack_tags: newProduct.demo.tech_stack_tags,
          }).then(({ error: demoErr }) => {
            if (demoErr) console.error("Error inserting demo into Supabase:", demoErr);
          });
        }
      });
    }

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

    if (isSupabaseConfigured) {
      supabase.from("products").update({
        category: productData.category,
        title: productData.title,
        slug: productData.slug,
        short_description: productData.short_description,
        detailed_description: productData.detailed_description,
        price: productData.price,
        original_price: productData.original_price,
        thumbnail_url: productData.thumbnail_url,
        status: productData.status,
        deliverable_type: productData.deliverable_type,
        storage_file_path: productData.storage_file_path,
        git_repo_url: productData.git_repo_url,
        access_instructions: productData.access_instructions,
        updated_at: new Date().toISOString(),
      }).eq("id", id).then(({ error }) => {
        if (error) console.error("Error updating product in Supabase:", error);
        else if (productData.demo) {
          supabase.from("product_demos").upsert({
            product_id: id,
            gallery_images: productData.demo.gallery_images,
            live_demo_url: productData.demo.live_demo_url,
            video_demo_url: productData.demo.video_demo_url,
            demo_credentials: productData.demo.demo_credentials,
            code_preview_snippet: productData.demo.code_preview_snippet,
            features_list: productData.demo.features_list,
            tech_stack_tags: productData.demo.tech_stack_tags,
            updated_at: new Date().toISOString(),
          }, { onConflict: "product_id" }).then(({ error: demoErr }) => {
            if (demoErr) console.error("Error upserting demo in Supabase:", demoErr);
          });
        }
      });
    }
  };

  const adminArchiveProduct = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, status: "archived" as ProductStatus } : p));
    setProducts(updated);
    persist(STORAGE_KEYS.PRODUCTS, updated);

    if (isSupabaseConfigured) {
      supabase.from("products").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id);
    }
  };

  // Cart & Order Operations
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
    const orderId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}`;
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
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`,
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

    if (isSupabaseConfigured && currentUser?.id) {
      supabase.from("orders").insert({
        id: newOrder.id,
        order_code: newOrder.order_code,
        user_id: currentUser.id,
        total_amount: newOrder.total_amount,
        status: newOrder.status,
        payment_method: newOrder.payment_method,
        vietqr_content: newOrder.vietqr_content,
      }).then(({ error }) => {
        if (!error) {
          supabase.from("order_items").insert({
            order_id: newOrder.id,
            product_id: product.id,
            unit_price: product.price,
            product_title: product.title,
            product_category: product.category,
            product_thumbnail: product.thumbnail_url,
          });
        }
      });
    }

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

    if (isSupabaseConfigured) {
      supabase.from("orders").update({
        status: "pending_approval",
        payment_proof_image: proofUrl,
        transaction_ref: transactionRef,
        updated_at: new Date().toISOString(),
      }).eq("id", orderId);
    }
  };

  const adminReviewOrder = (orderId: string, action: "approve" | "reject", adminNotes?: string) => {
    const status = action === "approve" ? ("completed" as const) : ("rejected" as const);
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status,
        reviewed_by_admin_id: currentUser?.id || "admin-lead",
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes || (action === "approve" ? "Đã đối chiếu khớp số dư và nội dung chuyển khoản." : "Thông tin chuyển khoản không hợp lệ."),
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      supabase.from("orders").update({
        status,
        reviewed_by_admin_id: currentUser?.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      }).eq("id", orderId);
    }
  };

  const adminUpdateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string): Promise<boolean> => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status,
        reviewed_by_admin_id: currentUser?.id || "admin-lead",
        reviewed_at: new Date().toISOString(),
        admin_notes: notes !== undefined ? notes : o.admin_notes,
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      const payload: any = {
        status,
        reviewed_by_admin_id: currentUser?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (notes !== undefined) {
        payload.admin_notes = status === "blocked" && !notes.includes("[BLOCKED]") ? `[BLOCKED] ${notes}` : notes;
      } else if (status === "blocked") {
        payload.admin_notes = "[BLOCKED] Đơn hàng đã bị Quản Trị Viên thu hồi và chặn quyền truy cập do vi phạm quy định hoặc nghi vấn gian lận.";
      }

      const { error } = await supabase.from("orders").update(payload).eq("id", orderId);
      if (error && error.code === "23514" && status === "blocked") {
        // Fallback for DB check constraint
        payload.status = "rejected";
        await supabase.from("orders").update(payload).eq("id", orderId);
      }
    }
    return true;
  };

  const adminBlockOrder = async (orderId: string, reason?: string): Promise<boolean> => {
    const blockReason = reason || "🚨 Đơn hàng đã bị Quản Trị Viên thu hồi và chặn quyền truy cập do vi phạm quy định hoặc nghi vấn gian lận.";
    return adminUpdateOrderStatus(orderId, "blocked", blockReason);
  };

  const adminUpdateOrder = async (orderId: string, data: Partial<Order>): Promise<boolean> => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        ...data,
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      const dbPayload: any = { ...data, updated_at: new Date().toISOString() };
      delete dbPayload.items;
      if (dbPayload.status === "blocked") {
        if (!dbPayload.admin_notes?.includes("[BLOCKED]")) {
          dbPayload.admin_notes = `[BLOCKED] ${dbPayload.admin_notes || "Chặn quyền"}`;
        }
      }
      const { error } = await supabase.from("orders").update(dbPayload).eq("id", orderId);
      if (error && error.code === "23514" && dbPayload.status === "blocked") {
        dbPayload.status = "rejected";
        await supabase.from("orders").update(dbPayload).eq("id", orderId);
      }
    }
    return true;
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;

    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: "cancelled" as const, updated_at: new Date().toISOString() } : o
    );
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      await supabase.from("orders").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", orderId);
    }
    return true;
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      await supabase.from("order_items").delete().eq("order_id", orderId);
      await supabase.from("orders").delete().eq("id", orderId);
    }
    return true;
  };

  const refreshOrders = async () => {
    await fetchOrdersFromDB();
  };

  // Deliverables Vault
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
        isAuthLoading,
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
        refreshProducts: fetchProductsFromDB,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        orders,
        createOrder,
        submitPaymentProof,
        adminReviewOrder,
        adminUpdateOrderStatus,
        adminBlockOrder,
        adminUpdateOrder,
        cancelOrder,
        deleteOrder,
        refreshOrders,
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
