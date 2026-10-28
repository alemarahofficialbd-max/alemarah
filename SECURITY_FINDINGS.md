# Security / Access Control Findings — 2026-10-28 (updated same day)

Audit of role system (customer / director / office staff / super admin). Ordered by severity.

## 1. FIXED (code side) — `service_role` key hardcoded and shipped to the browser
- **What was wrong:** [src/lib/supabaseClient.js:5](src/lib/supabaseClient.js#L5) hardcoded the Supabase `service_role` key as a fallback and exported it via `supabaseAdmin`, used from [managementStore.js](src/data/managementStore.js) (admin CRUD, job-application storage) and [CareerPage.jsx](src/components/CareerPage.jsx) (resume upload). `service_role` bypasses Row Level Security entirely — anyone could read it out of the shipped JS bundle and get full read/write/delete on every table with no login.
- **What changed:** `supabaseAdmin` and the hardcoded service key are removed from `supabaseClient.js`. Every call site now uses the `anon` client (`supabase`) instead. The `resumes` storage bucket got two narrow policies (insert + read only, see section 10 of `supabase_schema.sql`) so anonymous CV uploads keep working without a master key. Confirmed the string is no longer present anywhere in a production build (`npm run build`, grepped `dist/`).
- **DONE (2026-10-28):** the project switched to Supabase's new key format (`sb_publishable_...` in `supabaseClient.js`), then the legacy JWT-based `anon`+`service_role` key pair was disabled from the dashboard (API → "Disable JWT-based API keys"). The old leaked `service_role` value is now dead — it cannot be used even though it still appears in old git history/commits.

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
