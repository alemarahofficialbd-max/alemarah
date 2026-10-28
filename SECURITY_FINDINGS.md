# Security / Access Control Findings — 2026-10-28

Audit of role system (customer / director / office staff / super admin). Ordered by severity.

## 1. CRITICAL — `service_role` key hardcoded and shipped to the browser
- [src/lib/supabaseClient.js:5](src/lib/supabaseClient.js#L5) hardcodes the Supabase `service_role` key as a fallback and exports it via `supabaseAdmin`.
- `service_role` bypasses Row Level Security entirely. It must never run in a browser — only on a trusted server/edge function.
- Used from client-side code in:
  - [src/data/managementStore.js:1,293,313,662,716,730,798](src/data/managementStore.js#L1) — admin CRUD, job-application storage.
  - [src/components/CareerPage.jsx:311](src/components/CareerPage.jsx#L311) — resume upload.
- Anyone can open DevTools → Network/Sources, read this key out of the shipped JS bundle, and get full read/write/delete on every table (admins, directors, clients, client_payments, projects), with no login at all. This makes every RLS policy below irrelevant until it's fixed.
- **Fix:**
  1. Rotate/regenerate the `service_role` key in the Supabase dashboard now (kills the old one).
  2. Never put the new key in a `VITE_`-prefixed env var — those get bundled into the browser build. It belongs only in a backend / Supabase Edge Function.
  3. Move everything `supabaseAdmin` currently does (admin CRUD, resume upload, job-application permission checks) behind an Edge Function or small server route that holds the key server-side, or re-architect those operations to work under the `anon` key + RLS instead.
  4. Check git history (`git log -p -- src/lib/supabaseClient.js`) for every commit that ever contained a real key, since rotating stops future use but the old value stays in history.

## 2. CRITICAL — RLS policies allow public read/write on every table
- [supabase_schema.sql:110-115](supabase_schema.sql#L110) — `admins`, `directors`, `projects`, `project_expenses`, `clients`, `client_payments` all have `FOR ALL USING (true) WITH CHECK (true)`.
- [supabase_schema.sql:204-205](supabase_schema.sql#L204) (added in the recent `inquiries` table) — same pattern: `"Allow authenticated read/manage inquiries" ON public.inquiries FOR ALL USING (true)` — the name says "authenticated" but the policy has no actual `auth.uid()` check, so it's public too.
- With the `anon` key alone (ignoring finding #1), anyone can call the Supabase REST API directly and read/write all customer, director, and payment data, bypassing the app's login screen completely.
- **Fix:** once a real auth/session model is decided, replace these policies with ones scoped to `auth.uid()` (a customer only sees their own `customers`/`clients` rows, a director only their own `directors` row, staff writes gated by their `permissions` column, super admin unrestricted). This app currently has no Supabase Auth integration — logins are verified against local/synced tables — so real RLS needs either adopting Supabase Auth, or moving all writes behind a server layer that checks permissions itself (same direction as fix #1).

## 3. Already fixed in the latest pulled code (no action needed)
- Customer login previously accepted any input and silently fell back to a random account — now `findCustomerByIdentifier` + `verifyPassword` in [managementStore.js:43,200](src/data/managementStore.js#L43) actually reject wrong passwords.
- Passwords are now hashed with PBKDF2-SHA256 client-side and legacy plaintext values are upgraded to hashes on first successful login ([managementStore.js:33-51](src/data/managementStore.js#L33)).
- Directors can now log in and see only their own row (matched by phone/email/id/folio no in `LoginPage.jsx`) — previously there was no director login at all.
- Tab content is now gated by the same permission check as the sidebar (`managementNavItems.some(...) && activeTab === '...'` throughout [ManagementDashboard.jsx](src/components/ManagementDashboard.jsx)), not just hidden in the sidebar.

## 4. Remaining structural gap
- All of the above enforcement (login, password check, permission gating) runs in browser JavaScript only — there is still no backend. Real protection has to live in Supabase (RLS + no exposed service key), because client-side checks can always be bypassed by editing the page in DevTools or calling the API directly. Findings #1 and #2 are the actual fix; #3's improvements are good UX/defense-in-depth but not a substitute for them.
