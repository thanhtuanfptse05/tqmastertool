# SPEC-014: Vercel Deployment Hardening & Build-time Resiliency

## 1. Context & Problem Statement
When deploying the application to Vercel without pre-configured environment variables (or during initial repository import), the build step (`next build`) evaluates server API routes.
At line 9 of `src/lib/supabase-server.ts`:
```ts
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, ...);
```
`@supabase/supabase-js` throws an unhandled exception: `Error: supabaseKey is required.` whenever `serviceRoleKey` is an empty string `""`. This causes Next.js to fail page data collection on routes importing `supabaseAdmin` (e.g. `/api/admin/upload/asset`, `/api/admin/upload/deliverable`, `/api/admin/products`, etc.) with:
`Error: Failed to collect page data for /api/admin/upload/asset`.

## 2. Objectives & Acceptance Criteria
- [x] **AC-1:** Top-level Supabase client in `src/lib/supabase-server.ts` must use a safe fallback placeholder key (`"placeholder-service-role-key"`) when `SUPABASE_SERVICE_ROLE_KEY` is not present in the build environment, preventing build crash.
- [x] **AC-2:** Runtime execution that requires `supabaseAdmin` must continue to validate that the actual `SUPABASE_SERVICE_ROLE_KEY` is configured and not a placeholder before executing administrative operations.
- [x] **AC-3:** Export `dynamic = "force-dynamic"` explicitly on server upload and deliverable API routes to ensure Next.js treats them as dynamic request handlers rather than evaluating them statically during build.
- [x] **AC-4:** Pass `npx tsc --noEmit` and `npm run build` cleanly even when `SUPABASE_SERVICE_ROLE_KEY` is not provided.
