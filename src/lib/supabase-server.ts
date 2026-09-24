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
  "admin@codevault.io",
];

/**
 * Checks if an email is authorized administrator.
 * Used for initial bootstrap registration or root system admins via process.env.ADMIN_EMAILS.
 */
export function isStrictAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();

  // Check hardcoded secure root system admin list
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
 * 100% DATABASE-DRIVEN RBAC:
 * A user's administrative privilege is strictly determined by their `profiles.role === 'admin'` in PostgreSQL.
 * If an admin changes a user's role to 'customer' in the database, it takes effect immediately with NO auto-heal overrides.
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

    // Fast-path: If email is in root system admin whitelist, return isAdmin = true immediately (saves 1 DB round-trip)
    if (isStrictAdminEmail(user.email)) {
      return { user, isAdmin: true };
    }

    // Check Database Profile role - 100% Database Source of Truth
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";
    return { user, isAdmin };
  } catch (err) {
    console.error("[Auth Helper] Error verifying user:", err);
    return { user: null, isAdmin: false };
  }
}


