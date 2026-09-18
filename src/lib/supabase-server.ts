import { createClient, User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

// Server-only Supabase client with admin privileges (Service Role)
// NEVER expose this client to the browser/client-side components
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const ADMIN_WHITELIST_EMAILS = [
  "lequan12305@gmail.com",
  "caotuan01122005@gmail.com",
  "caothanhtuan576@gmail.com",
  "admin@gmail.com",
  "admin@codevault.io",
];

/**
 * Checks if an email is strictly an authorized administrator.
 * Checks against both hardcoded server list and server environment variable ADMIN_EMAILS.
 */
export function isStrictAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();

  // Check hardcoded secure server list
  if (ADMIN_WHITELIST_EMAILS.includes(clean)) return true;

  // Check server environment variable ADMIN_EMAILS (e.g. "admin1@domain.com,admin2@domain.com")
  const envAdmins = process.env.ADMIN_EMAILS || "";
  if (envAdmins) {
    const list = envAdmins
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (list.includes(clean)) return true;
  }

  return false;
}

/**
 * Extracts and verifies the authenticated user from a NextRequest.
 * Checks Authorization header: Bearer <token> or Supabase cookies.
 * 
 * SECURITY GATE:
 * A user is recognized as Admin if:
 * 1. Their email is in the Master Admin Whitelist (isStrictAdminEmail), OR
 * 2. Their profile has role === 'admin' in PostgreSQL.
 * If a master admin email is detected, the database role is automatically healed to 'admin'.
 */
export async function getAuthenticatedUser(
  req: NextRequest
): Promise<{ user: User | null; isAdmin: boolean }> {
  try {
    const authHeader = req.headers.get("authorization") || "";
    let token = "";

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    }

    // Fallback: check cookies if no Authorization header
    if (!token) {
      const allCookies = req.cookies.getAll();
      for (const cookie of allCookies) {
        if (
          cookie.name.includes("auth-token") ||
          cookie.name === "sb-access-token"
        ) {
          try {
            // Cookie may contain JSON or raw token
            const parsed = JSON.parse(cookie.value);
            if (Array.isArray(parsed) && parsed[0]) {
              token = parsed[0];
            } else if (parsed.access_token) {
              token = parsed.access_token;
            }
          } catch {
            token = cookie.value;
          }
          if (token) break;
        }
      }
    }

    // Fallback 2: check query parameter ?token= (useful for direct browser window.open downloads)
    if (!token) {
      try {
        const url = new URL(req.url);
        const queryToken = url.searchParams.get("token");
        if (queryToken) {
          token = queryToken.trim();
        }
      } catch {}
    }

    if (!token) {
      return { user: null, isAdmin: false };
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return { user: null, isAdmin: false };
    }

    // 1. Check Master Admin Whitelist
    const isEmailAdmin = isStrictAdminEmail(user.email);

    // 2. Check Database Profile role
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isRoleAdmin = profile?.role === "admin";
    const isAdmin = isEmailAdmin || isRoleAdmin;

    // Auto-heal: If user is in Master Admin Whitelist, ensure profile.role in DB is 'admin'
    if (isEmailAdmin && profile && profile.role !== "admin") {
      try {
        await supabaseAdmin
          .from("profiles")
          .update({ role: "admin", updated_at: new Date().toISOString() })
          .eq("id", user.id);
        console.log(`[Auth Helper] 🔄 Auto-promoted master admin ${user.email} to 'admin' in profiles table.`);
      } catch (syncErr) {
        console.warn("[Auth Helper] Could not auto-promote master admin:", syncErr);
      }
    }

    return { user, isAdmin };
  } catch (err) {
    console.error("[Auth Helper] Error verifying user:", err);
    return { user: null, isAdmin: false };
  }
}


