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
 * SECURITY GATE (DUAL-FACTOR ADMIN CHECK):
 * A user is ONLY recognized as an Admin if:
 * 1. Their email is strictly validated in the Server Admin Whitelist (isStrictAdminEmail).
 * 2. Any arbitrary database modifications made to profiles.role by unauthorized users
 *    will NEVER grant administrative privileges.
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

    // 1. Mandatory Pre-Check: Is the user's email authorized in Admin Whitelist?
    const isEmailAdmin = isStrictAdminEmail(user.email);
    if (!isEmailAdmin) {
      // User is authenticated, but STRICTLY NOT an admin.
      // Even if profiles.role was tampered with in Postgres, access is DENIED.
      return { user, isAdmin: false };
    }

    // 2. Secondary check: verify database profile record exists
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    // If profile has role admin, or if email is verified whitelist admin
    const isAdmin = profile?.role === "admin" || isEmailAdmin;

    return { user, isAdmin };
  } catch (err) {
    console.error("[Auth Helper] Error verifying user:", err);
    return { user: null, isAdmin: false };
  }
}

