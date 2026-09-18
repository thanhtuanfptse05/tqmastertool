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
import {
  generateCourseraLicenseKey,
  extractOrderLicenseInfo,
  formatOrderNotesWithLicense,
  formatOrderNotesWithMultipleLicenses,
  formatOrderNotesWithEmails,
  CourseraLicenseItem,
  findActiveLicenseForEmail,
} from "./coursera-keygen";

interface StoreContextType {
  // Auth & Users
  currentUser: UserProfile | null;
  isAuthLoading: boolean;
  users: UserProfile[];
  login: (email: string, password?: string) => Promise<boolean>;
  register: (
    email: string,
    fullName: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  adminResetPassword: (userId: string, newPassword?: string) => Promise<boolean>;
  adminUpdateRole: (userId: string, role: UserRole) => Promise<boolean>;
  adminDeleteUser: (userId: string) => Promise<boolean>;
  refreshUsers: () => Promise<void>;

  // Products
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  adminCreateProduct: (productData: Partial<Product>) => Product;
  adminUpdateProduct: (id: string, productData: Partial<Product>) => void;
  adminArchiveProduct: (id: string) => void;
  adminDeleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (product: Product, quantity?: number, customerEmails?: string[]) => Order;
  submitPaymentProof: (
    orderId: string,
    proofUrl: string,
    transactionRef?: string,
    customerEmail?: string,
    overrideStatus?: OrderStatus,
    adminNotes?: string,
    licenseKey?: string,
    customerEmails?: string[]
  ) => void;

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
  checkoutQuantity: number;
  setCheckoutQuantity: (qty: number) => void;
  openCheckout: (product: Product, quantity?: number) => void;
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

// Admin role is strictly governed server-side and checked via profile.role / session token

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
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
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
          id, category, title, slug, short_description, detailed_description,
          price, original_price, thumbnail_url, status, deliverable_type,
          created_at, updated_at,
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
            // SENSITIVE DELIVERABLES (Anti-Leak): Keep undefined in public catalog
            storage_file_path: undefined,
            git_repo_url: undefined,
            access_instructions: undefined,
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
        .select(`*, order_items (*)`)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not query orders from Supabase:", error.message);
        return;
      }

      if (data) {
        let ordersData = data;

        // Tier-2: standalone client query for orders with empty items
        const orderIdsWithNoItems = data
          .filter((o: any) => !o.order_items || o.order_items.length === 0)
          .map((o: any) => o.id);

        let standaloneItems: any[] = [];
        if (orderIdsWithNoItems.length > 0) {
          const { data: itemsData } = await supabase
            .from("order_items")
            .select("*")
            .in("order_id", orderIdsWithNoItems);
          standaloneItems = itemsData || [];
        }

        // Tier-3: if STILL no items after client query, call server API (supabaseAdmin bypasses RLS)
        const stillNoItems = orderIdsWithNoItems.filter(
          (id: string) => standaloneItems.filter((i: any) => i.order_id === id).length === 0
        );
        let serverItems: any[] = [];
        if (stillNoItems.length > 0) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const res = await fetch(
              `/api/orders?orderIds=${stillNoItems.join(",")}`,
              token ? { headers: { Authorization: `Bearer ${token}` } } : {}
            );
            if (res.ok) {
              const json = await res.json();
              (json.data || []).forEach((ord: any) => {
                (ord.order_items || []).forEach((item: any) => {
                  serverItems.push({ ...item, order_id: ord.id });
                });
              });
            }
          } catch (apiErr) {
            console.warn("[fetchOrdersFromDB] Server API items fetch failed:", apiErr);
          }
        }
        const allFallbackItems = [...standaloneItems, ...serverItems];

        // 4. Lấy link Google Drive & hướng dẫn từ bảng products trong database cho các đơn đã hoàn thành (Spec 015)
        const completedProductIds = Array.from(
          new Set(
            ordersData
              .filter((o: any) => o.status === "completed")
              .flatMap((o: any) => {
                const items = o.order_items && o.order_items.length > 0
                  ? o.order_items
                  : allFallbackItems.filter((i: any) => i.order_id === o.id);
                return items.map((i: any) => i.product_id);
              })
              .filter(Boolean)
          )
        );

        const deliverableMap = new Map<string, { git_repo_url?: string; access_instructions?: string }>();
        if (completedProductIds.length > 0) {
          try {
            const { data: prodDeliverables } = await supabase
              .from("products")
              .select("id, git_repo_url, access_instructions")
              .in("id", completedProductIds);

            if (prodDeliverables) {
              prodDeliverables.forEach((p: any) => {
                deliverableMap.set(p.id, {
                  git_repo_url: p.git_repo_url || undefined,
                  access_instructions: p.access_instructions || undefined,
                });
              });
            }
          } catch (e) {
            console.warn("[fetchOrdersFromDB] Could not query deliverables from DB:", e);
          }
        }

        const mappedOrders: Order[] = ordersData.map((o: any) => {
          const rawItems =
            o.order_items && o.order_items.length > 0
              ? o.order_items
              : allFallbackItems.filter((i: any) => i.order_id === o.id);

          let resolvedItems = rawItems.map((item: any) => {
            const deliv = deliverableMap.get(item.product_id);
            return {
              id: item.id || `item-${item.product_id}`,
              order_id: o.id,
              product_id: item.product_id,
              product_title: item.product_title || "Sản phẩm CodeVault",
              product_category: item.product_category || "lab211",
              product_thumbnail: item.product_thumbnail || "",
              unit_price: Number(item.unit_price) || 0,
              git_repo_url: deliv?.git_repo_url,
              access_instructions: deliv?.access_instructions,
              created_at: item.created_at || o.created_at,
            };
          });

          // Robust Fallback: If DB join returned no items, match product by total_amount
          if (resolvedItems.length === 0) {
            try {
              const savedProds = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.PRODUCTS) : null;
              const prodList: any[] = savedProds ? JSON.parse(savedProds) : [];
              const matched = prodList.find((p: any) => Number(p.price) === Number(o.total_amount));
              if (matched) {
                resolvedItems = [
                  {
                    id: `item-${matched.id}`,
                    order_id: o.id,
                    product_id: matched.id,
                    product_title: matched.title,
                    product_category: matched.category,
                    product_thumbnail: matched.thumbnail_url || "",
                    unit_price: Number(matched.price),
                    created_at: o.created_at,
                  },
                ];
              }
            } catch (err) {
              console.warn("[fetchOrdersFromDB] Dynamic fallback match failed:", err);
            }
          }

          const { licenseKey, courseraEmail } = extractOrderLicenseInfo(o);

          return {
            id: o.id,
            order_code: o.order_code,
            user_id: o.user_id,
            user_email: courseraEmail || o.user_email || "",
            user_name: o.user_name || "",
            items: resolvedItems,
            total_amount: Number(o.total_amount),
            status: (o.status === "blocked" || (o.admin_notes && o.admin_notes.includes("[BLOCKED]"))) ? "blocked" : o.status,
            payment_method: o.payment_method,
            vietqr_content: o.vietqr_content,
            payment_proof_image: o.payment_proof_image,
            transaction_ref: o.transaction_ref,
            reviewed_by_admin_id: o.reviewed_by_admin_id,
            reviewed_at: o.reviewed_at,
            admin_notes: o.admin_notes,
            license_key: licenseKey || o.license_key,
            created_at: o.created_at,
            updated_at: o.updated_at,
          };
        });

        setOrders(mappedOrders);
        persist(STORAGE_KEYS.ORDERS, mappedOrders);
      }
    } catch (e) {
      console.error("Error fetching orders from database:", e);
    }
  }, []);

  // Fetch live users from Supabase database (Admin only)
  const fetchUsersFromDB = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          persist(STORAGE_KEYS.USERS, data.users);
          console.log(`[fetchUsersFromDB] Loaded ${data.users.length} live users from database.`);
        }
      }
    } catch (e: any) {
      if (e?.name === "AbortError") {
        console.warn("[fetchUsersFromDB] Request timed out after 6s. Keeping existing users in view.");
      } else {
        console.warn("Could not query users from Supabase API:", e);
      }
    }
  }, []);

  // Hydrate from localStorage & Database
  useEffect(() => {
    let active = true;

    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id && !parsed.id.startsWith("user-") && !parsed.id.startsWith("usr-")) {
          setCurrentUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER);
          setCurrentUser(null);
        }
      }

      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // Purge mock users
        const hasMock = Array.isArray(parsedUsers) && parsedUsers.some((u: any) => u.id?.startsWith("user-") || u.id?.startsWith("usr-"));
        if (!hasMock) {
          setUsers(parsedUsers);
        } else {
          localStorage.removeItem(STORAGE_KEYS.USERS);
          setUsers([]);
        }
      }

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
      // Chạy song song 3 request thay vì tuần tự → giảm waterfall
      Promise.all([
        fetchProductsFromDB(),
        fetchOrdersFromDB(),
        supabase.auth.getSession(),
      ]).then(([, , { data: { session } }]) => {
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
                const isAdmin = profile.role === "admin";
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
                if (isAdmin) {
                  fetchUsersFromDB();
                }
              }
              setIsAuthLoading(false);
            });
        } else {
          // KHÔNG CÓ PHIÊN SUPABASE AUTH HỢP LỆ => DỌN SẠCH GHOST USER TRONG LOCALSTORAGE!
          setCurrentUser(null);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setIsAuthLoading(false);
        }
      }).catch(() => {
        if (active) {
          setCurrentUser(null);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setIsAuthLoading(false);
        }
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
                const isAdmin = profile.role === "admin";
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

                if (isAdmin) {
                  fetchUsersFromDB();
                }
              }
              fetchOrdersFromDB();
            });
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          setOrders([]);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.ORDERS);
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

  // Auth Operations: Strict Supabase Authentication (Zero Mock Fallback)
  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      throw new Error("Vui lòng nhập địa chỉ email.");
    }
    if (!password || password.length < 6) {
      throw new Error("Mật khẩu phải có tối thiểu 6 ký tự.");
    }

    if (!isSupabaseConfigured) {
      throw new Error("Hệ thống xác thực Supabase chưa được cấu hình.");
    }

    // 1. Authenticate strictly against Supabase Auth
    let { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    // Auto-heal: If user account was created earlier without confirmed email, auto-confirm and retry
    if (error && (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed"))) {
      console.log("[Auth] Detected unconfirmed email on Supabase. Auto-confirming via backend...");
      try {
        const autoRes = await fetch("/api/auth/auto-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        });
        if (autoRes.ok) {
          const retry = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
          data = retry.data;
          error = retry.error;
        }
      } catch (e) {
        console.warn("[Auth] Auto-confirm retry failed:", e);
      }
    }

    // 2. STRICT VALIDATION: If Supabase reports invalid credentials or user not found, BLOCK COMPLETELY!
    if (error || !data?.user) {
      const errMsg = error?.message || "";
      if (
        errMsg.includes("Invalid login credentials") ||
        errMsg.includes("invalid_credentials") ||
        errMsg.includes("User not found")
      ) {
        throw new Error(
          "Tài khoản chưa được đăng ký hoặc mật khẩu không chính xác. Nếu bạn chưa có tài khoản, vui lòng bấm 'Đăng ký ngay'."
        );
      }
      throw new Error(errMsg || "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
    }

    // 3. SUCCESSFUL AUTH: Fetch official role & profile from PostgreSQL
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    const dbRole: UserRole = profile?.role === "admin" ? "admin" : "customer";
    const userToSet: UserProfile = {
      id: data.user.id,
      email: data.user.email || cleanEmail,
      full_name: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail.split("@")[0].toUpperCase(),
      avatar_url: profile?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: dbRole,
      created_at: profile?.created_at || data.user.created_at || new Date().toISOString(),
    };

    setCurrentUser(userToSet);
    persist(STORAGE_KEYS.USER, userToSet);
    setIsAuthModalOpen(false);

    // Sync user's real orders and database data
    fetchOrdersFromDB();
    if (dbRole === "admin") {
      fetchUsersFromDB();
    }

    return true;
  };

  const register = async (
    email: string,
    fullName: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (fullName || cleanEmail.split("@")[0]).trim();

    if (!cleanEmail) {
      return { success: false, error: "Vui lòng nhập địa chỉ email hợp lệ." };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "Mật khẩu phải có tối thiểu 6 ký tự." };
    }

    // 1. Call server-side register API (creates user with email_confirm: true via service role)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password, fullName: cleanName }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          success: false,
          error: json.error || "Không thể đăng ký tài khoản. Vui lòng thử lại.",
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Lỗi kết nối máy chủ khi đăng ký tài khoản.",
      };
    }

    // 2. Establish active JWT session via signInWithPassword immediately
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error || !data?.user) {
      return {
        success: false,
        error: "Đăng ký thành công! Vui lòng chuyển sang tab Đăng Nhập để đăng nhập vào tài khoản.",
      };
    }

    // 3. Retrieve registered profile and set active user
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    const dbRole: UserRole = profile?.role === "admin" ? "admin" : "customer";
    const userToSet: UserProfile = {
      id: data.user.id,
      email: data.user.email || cleanEmail,
      full_name: profile?.full_name || cleanName,
      avatar_url: profile?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: dbRole,
      created_at: profile?.created_at || new Date().toISOString(),
    };

    setCurrentUser(userToSet);
    persist(STORAGE_KEYS.USER, userToSet);
    setIsAuthModalOpen(false);

    fetchOrdersFromDB();
    if (dbRole === "admin") {
      fetchUsersFromDB();
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
  };

  const adminResetPassword = async (userId: string, newPassword?: string): Promise<boolean> => {
    if (!newPassword || newPassword.length < 6) return false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: "reset_password", userId, newPassword }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Không thể đặt lại mật khẩu");
      }
      return true;
    } catch (err: any) {
      console.error("[adminResetPassword] Error:", err);
      throw err;
    }
  };

  const adminUpdateRole = async (userId: string, role: UserRole): Promise<boolean> => {
    // 1. Optimistic UI update
    const updated = users.map((u) => (u.id === userId ? { ...u, role } : u));
    setUsers(updated);
    persist(STORAGE_KEYS.USERS, updated);
    if (currentUser?.id === userId) {
      const updatedCurrent = { ...currentUser, role };
      setCurrentUser(updatedCurrent);
      persist(STORAGE_KEYS.USER, updatedCurrent);
    }

    // 2. Call Server API
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ action: "update_role", userId, role }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("[adminUpdateRole] API error:", err);
          return false;
        }
        await fetchUsersFromDB();
        return true;
      } catch (err) {
        console.error("[adminUpdateRole] Error:", err);
        return false;
      }
    }
    return true;
  };

  const adminDeleteUser = async (userId: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: "delete_user", userId }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        persist(STORAGE_KEYS.USERS, users.filter((u) => u.id !== userId));
        return true;
      }
      return false;
    } catch (err) {
      console.error("[adminDeleteUser] Error:", err);
      return false;
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

  const adminDeleteProduct = async (id: string): Promise<boolean> => {
    // 1. Cập nhật state bộ nhớ và LocalStorage ngay lập tức để UI mượt mà
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    persist(STORAGE_KEYS.PRODUCTS, updated);

    // 2. Gỡ khỏi giỏ hàng nếu đang có
    setCart((prevCart) => {
      const filtered = prevCart.filter((item) => item.product.id !== id);
      persist(STORAGE_KEYS.CART, filtered);
      return filtered;
    });

    // 3. Xóa vĩnh viễn trong Supabase trực tiếp (siêu nhanh ~50ms, có timeout bảo vệ không bao giờ bị treo)
    if (isSupabaseConfigured) {
      try {
        const deleteOps = (async () => {
          // Gỡ liên kết order_items nếu có
          try {
            await supabase.from("order_items").update({ product_id: null }).eq("product_id", id);
          } catch {}

          // Xóa demos liên quan
          try {
            await supabase.from("product_demos").delete().eq("product_id", id);
          } catch {}

          // Xóa sản phẩm khỏi bảng products
          const { error } = await supabase.from("products").delete().eq("id", id);
          if (error) {
            console.warn("[adminDeleteProduct] Supabase delete warning:", error);
          }
        })();

        // Đặt timeout 2 giây để đảm bảo UI không bao giờ bị quay vô tận
        const timeout = new Promise((resolve) => setTimeout(resolve, 2000));
        await Promise.race([deleteOps, timeout]);
      } catch (err) {
        console.error("[adminDeleteProduct] Lỗi xóa sản phẩm từ Supabase:", err);
      }
    }
    return true;
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

  const createOrder = (product: Product, quantity: number = 1, customerEmails: string[] = []): Order => {
    const qty = Math.max(1, Math.min(20, Math.floor(Number(quantity) || 1)));
    const totalAmount = product.price * qty;
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `TQ-2026-${orderNum}`;
    const orderId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `order-${Date.now()}`;
    const cleanMemo = `TQ2026${orderNum}`;

    const cleanEmails = (customerEmails || [])
      .map((e) => (e || "").trim().toLowerCase())
      .filter((e) => e.includes("@") && !e.startsWith("guest@") && e !== "guest@codevault.io");

    const isCoursera =
      product.title.toLowerCase().includes("coursera") ||
      (product.slug && product.slug.toLowerCase().includes("coursera"));

    let initialNotes: string | undefined = undefined;
    if (isCoursera && cleanEmails.length > 0) {
      initialNotes = formatOrderNotesWithEmails("", cleanEmails);
    }

    const newOrder: Order = {
      id: orderId,
      order_code: orderCode,
      user_id: currentUser?.id || "user-guest",
      user_email: (currentUser?.email && currentUser.email !== "guest@codevault.io")
        ? currentUser.email
        : (cleanEmails[0] || ""),
      user_name: currentUser?.full_name || "Khách Hàng",
      total_amount: totalAmount,
      status: "pending_payment",
      payment_method: "vietqr",
      vietqr_content: cleanMemo,
      admin_notes: initialNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: Array.from({ length: qty }).map((_, index) => ({
        id: typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `item-${Date.now()}-${index}`,
        order_id: orderId,
        product_id: product.id,
        unit_price: product.price,
        product_title: product.title,
        product_category: product.category,
        product_thumbnail: product.thumbnail_url,
        created_at: new Date().toISOString(),
      })),
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);
    setActiveOrderForPayment(newOrder);

    // Call Secure Server API to guarantee immutable DB price & secure persistence (Spec 015 & Spec 016)
    if (isSupabaseConfigured) {
      (async () => {
        try {
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }

          const res = await fetch("/api/orders", {
            method: "POST",
            headers,
            body: JSON.stringify({
              productId: product.id,
              quantity: qty,
              customerEmails: cleanEmails.length > 0 ? cleanEmails : undefined,
              customerName: currentUser?.full_name || undefined,
            }),
          });

          if (res.ok) {
            const resData = await res.json();
            if (resData.success && resData.order) {
              const serverOrder: Order = resData.order;
              // Synchronize local active order with verified server data
              setActiveOrderForPayment(serverOrder);
              setOrders((prev) => {
                const filtered = prev.filter((o) => o.id !== newOrder.id && o.id !== serverOrder.id);
                const nextList = [serverOrder, ...filtered];
                persist(STORAGE_KEYS.ORDERS, nextList);
                return nextList;
              });
              console.log(`[createOrder] Server verified order ${serverOrder.order_code} registered. Price: ${serverOrder.total_amount}`);
            }
          } else {
            console.warn("[createOrder] Server order creation returned non-200:", await res.text());
          }
        } catch (apiErr) {
          console.error("[createOrder] Server API call failed:", apiErr);
        }
      })();
    }

    return newOrder;
  };

  const submitPaymentProof = (
    orderId: string,
    proofUrl: string,
    transactionRef?: string,
    customerEmail?: string,
    overrideStatus?: OrderStatus,
    adminNotes?: string,
    licenseKey?: string,
    customerEmails?: string[]
  ) => {
    const cleanEmail = customerEmail?.trim().toLowerCase();
    const finalStatus = overrideStatus || ("pending_approval" as const);
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      let updatedNotes = adminNotes || o.admin_notes;
      const isCourseraOrder =
        o.items?.some((i) => i.product_title.toLowerCase().includes("coursera")) ||
        (o.total_amount && o.total_amount % 40000 === 0 && o.total_amount >= 40000) ||
        o.total_amount === 149000;

      if (isCourseraOrder) {
        const emailsToFormat = customerEmails && customerEmails.length > 0
          ? customerEmails
          : (cleanEmail && cleanEmail !== "guest@codevault.io" && !cleanEmail.startsWith("guest@") ? [cleanEmail] : []);
        if (emailsToFormat.length > 0 && (!updatedNotes || !updatedNotes.includes("[COURSERA_EMAILS:"))) {
          updatedNotes = formatOrderNotesWithEmails(updatedNotes, emailsToFormat);
        }
      }

      return {
        ...o,
        status: finalStatus,
        payment_proof_image: proofUrl,
        transaction_ref: transactionRef || o.transaction_ref || `MB${Date.now()}`,
        user_email: isCourseraOrder && cleanEmail ? cleanEmail : o.user_email,
        admin_notes: updatedNotes,
        license_key: licenseKey || o.license_key,
        reviewed_at: finalStatus === "completed" ? (o.reviewed_at || new Date().toISOString()) : o.reviewed_at,
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);
    if (activeOrderForPayment?.id === orderId) {
      setActiveOrderForPayment({
        ...activeOrderForPayment,
        status: finalStatus,
        payment_proof_image: proofUrl,
        transaction_ref: transactionRef || activeOrderForPayment.transaction_ref,
        user_email: cleanEmail || activeOrderForPayment.user_email,
        admin_notes: adminNotes || activeOrderForPayment.admin_notes,
        license_key: licenseKey || activeOrderForPayment.license_key,
      });
    }
    // NOTE: DB update is handled by the caller (CheckoutModal) via /api/orders PATCH
    // using supabaseAdmin to bypass RLS. Do NOT use anon client here.
  };

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      } catch (e) {
        console.warn("Could not retrieve session token:", e);
      }
    }
    return headers;
  };

  const adminReviewOrder = (orderId: string, action: "approve" | "reject", adminNotes?: string) => {
    const status = action === "approve" ? ("completed" as const) : ("rejected" as const);
    const targetOrder = orders.find((o) => o.id === orderId);
    let finalNotes = adminNotes || (action === "approve" ? "Đã đối chiếu khớp số dư và nội dung chuyển khoản." : "Thông tin chuyển khoản không hợp lệ.");
    let generatedKey: string | undefined = undefined;

    if (action === "approve" && targetOrder) {
      const licenseInfo = extractOrderLicenseInfo(targetOrder);
      const isCoursera =
        targetOrder.items?.some((i) => i.product_title?.toLowerCase().includes("coursera")) ||
        (targetOrder.total_amount && targetOrder.total_amount % 40000 === 0 && targetOrder.total_amount >= 40000) ||
        targetOrder.total_amount === 149000;

      if (isCoursera && licenseInfo.emails.length > 0) {
        try {
          const licensesToSave = licenseInfo.emails.map((email) => {
            const existing = licenseInfo.licenses.find((l) => l.email === email);
            const key = existing?.key || generateCourseraLicenseKey(email, 30);
            return { email, key };
          });
          generatedKey = licensesToSave[0]?.key;
          finalNotes = formatOrderNotesWithMultipleLicenses(finalNotes, licensesToSave);
        } catch (e) {
          console.warn("adminReviewOrder keygen failed:", e);
        }
      }
    }

    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status,
        reviewed_by_admin_id: currentUser?.id || "admin-lead",
        reviewed_at: new Date().toISOString(),
        admin_notes: finalNotes,
        license_key: generatedKey || o.license_key,
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      getAuthHeaders().then((headers) => {
        fetch("/api/orders", {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            orderId,
            status,
            reviewed_by_admin_id: currentUser?.id,
            reviewed_at: new Date().toISOString(),
            admin_notes: finalNotes,
          }),
        }).catch((e) => console.warn("Failed to call /api/orders in adminReviewOrder:", e));
      });
    }
  };

  const adminUpdateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string): Promise<boolean> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    let finalNotes = notes !== undefined ? notes : targetOrder?.admin_notes;
    let generatedKey: string | undefined = undefined;

    if (status === "completed" && targetOrder) {
      const licenseInfo = extractOrderLicenseInfo(targetOrder);
      const isCoursera =
        targetOrder.items?.some((i) => i.product_title?.toLowerCase().includes("coursera")) ||
        (targetOrder.total_amount && targetOrder.total_amount % 40000 === 0 && targetOrder.total_amount >= 40000) ||
        targetOrder.total_amount === 149000;

      if (isCoursera && licenseInfo.emails.length > 0) {
        try {
          const otherCompleted = orders.filter((o) => o.status === "completed" && o.id !== orderId);
          const reusedInfoList: string[] = [];
          const licensesToSave = licenseInfo.emails.map((email) => {
            const existingInThisOrder = licenseInfo.licenses.find((l) => l.email === email);
            if (existingInThisOrder?.key) {
              return { email, key: existingInThisOrder.key };
            }

            const activeCheck = findActiveLicenseForEmail(email, otherCompleted);
            if (activeCheck.hasActive && activeCheck.key) {
              reusedInfoList.push(`${email}: Còn ${activeCheck.daysRemaining} ngày (đến ${activeCheck.formattedExpDate})`);
              return { email, key: activeCheck.key };
            }

            const key = generateCourseraLicenseKey(email, 30);
            return { email, key };
          });
          generatedKey = licensesToSave[0]?.key;
          finalNotes = formatOrderNotesWithMultipleLicenses(finalNotes, licensesToSave);
          if (reusedInfoList.length > 0) {
            finalNotes += ` [GHI CHÚ HẠN DÙNG: Giữ nguyên key đang còn hạn cho ${reusedInfoList.join("; ")}]`;
          }
        } catch (e) {
          console.warn("adminUpdateOrderStatus keygen failed:", e);
        }
      }
    }

    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status,
        reviewed_by_admin_id: currentUser?.id || "admin-lead",
        reviewed_at: new Date().toISOString(),
        admin_notes: finalNotes,
        license_key: generatedKey || o.license_key,
        updated_at: new Date().toISOString(),
      };
    });
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      try {
        const headers = await getAuthHeaders();
        await fetch("/api/orders", {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            orderId,
            status,
            admin_notes: finalNotes,
            reviewed_by_admin_id: currentUser?.id,
            reviewed_at: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.warn("Failed to call /api/orders PATCH:", e);
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
      try {
        const headers = await getAuthHeaders();
        await fetch("/api/orders", {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            orderId,
            ...data,
          }),
        });
      } catch (e) {
        console.warn("Failed to call /api/orders PATCH in adminUpdateOrder:", e);
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
      try {
        const headers = await getAuthHeaders();
        await fetch("/api/orders", {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            orderId,
            status: "cancelled",
          }),
        });
      } catch (e) {
        console.warn("Failed to call /api/orders cancel:", e);
      }
    }
    return true;
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    persist(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured) {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, {
          method: "DELETE",
          headers,
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("Failed to delete order from database:", errData);
          return false;
        }
      } catch (e) {
        console.error("Exception calling /api/orders DELETE:", e);
        return false;
      }
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

    const userEmail = currentUser?.email?.toLowerCase();
    const completedOrders = orders.filter(
      (o) =>
        o.status === "completed" &&
        // Match by Supabase user_id OR by email (handles local UUID ↔ Supabase UUID mismatch)
        (o.user_id === targetId ||
          (userEmail && o.user_email?.toLowerCase() === userEmail))
    );
    const deliverables: UnlockedDeliverable[] = [];

    completedOrders.forEach((order) => {
      order.items?.forEach((item) => {
        // Try to find full product info from store, but DON'T require it.
        // Order items already carry enough info (title, category, price).
        const product = products.find((p) => p.id === item.product_id);

        const { licenseKey } = extractOrderLicenseInfo(order);
        const isCoursera = item.product_title?.toLowerCase().includes("coursera") || product?.slug?.includes("coursera");

        deliverables.push({
          order_id: order.id,
          product_id: item.product_id,
          product_title: product?.title || item.product_title || "Sản phẩm CodeVault",
          product_category: product?.category || item.product_category || "lab211",
          signed_download_url: product?.storage_file_path
            ? `https://storage.codevault.io/deliverables/${product.storage_file_path}?token=sig_${Date.now()}`
            : undefined,
          git_repo_url: product?.git_repo_url,
          license_key: (isCoursera ? (licenseKey || order.license_key) : undefined) || order.license_key || (product?.license_key_template
            ? `CV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
            : undefined),
          instructions:
            product?.access_instructions ||
            "Bấm nút 'Xem Đề & Code' hoặc 'Vào Vault' bên dưới để truy cập mã nguồn và đề bài.",
        });
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

  const openCheckout = (product: Product, quantity: number = 1) => {
    setActiveOrderForPayment(null);
    setCheckoutQuantity(Math.max(1, Math.min(20, Math.floor(Number(quantity) || 1))));
    setCheckoutProduct(product);
  };

  const closeCheckout = () => {
    setCheckoutProduct(null);
    setActiveOrderForPayment(null);
    setCheckoutQuantity(1);
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
        adminDeleteUser,
        refreshUsers: fetchUsersFromDB,
        products,
        getProductBySlug,
        getProductById,
        adminCreateProduct,
        adminUpdateProduct,
        adminArchiveProduct,
        adminDeleteProduct,
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
        checkoutQuantity,
        setCheckoutQuantity,
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
