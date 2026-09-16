import { createClient, User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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
 * Checks if an email is strictly an authorized administrator
 */
export function isStrictAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_WHITELIST_EMAILS.includes(clean);
}

/**
 * Extracts and verifies the authenticated user from a NextRequest.
 * Checks Authorization header: Bearer <token> or Supabase cookies.
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

    // Check if user has admin role
    const isEmailAdmin = isStrictAdminEmail(user.email);
    if (isEmailAdmin) {
      return { user, isAdmin: true };
    }

    // Check database profiles table
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isRoleAdmin = profile?.role === "admin";

    return { user, isAdmin: isRoleAdmin };
  } catch (err) {
    console.error("[Auth Helper] Error verifying user:", err);
    return { user: null, isAdmin: false };
  }
}

