# Skenis.lt

**Skenis.lt** is a Lithuanian digital solutions studio: websites, booking systems, sales tools, calculators, internal systems, automations, AI integrations and e-commerce. The existing NFC/QR review product remains available at `/google-atsiliepimai` with its original ordering and administration flows.

## Studio website

- `/paslaugos` and nine useful category pages; eight primary categories and a separate reputation offering.
- `/sprendimai` contains clearly labelled internal concepts and interactive booking/calculator demonstrations.
- `/apie`, `/kontaktai`, `/privatumo-politika` and `/taisykles` use the shared studio layout.
- Service content is in `src/data/services.ts`; all 80 requested capabilities are represented. Project content and the future case-study contract are in `src/data/projects.ts`.
- Shared visual tokens and layouts are in `src/studio.css`, `src/studio-pages.css`, and `src/studio-responsive.css`.
- Old homepage product anchors redirect to the same section of `/google-atsiliepimai`. All `/r/:token` and `/admin/*` routes are unchanged.

Studio enquiries use the existing Supabase `leads` table without a database migration. The intent, service, optional website and full message are stored in `message`; the admin inbox can expand the entire enquiry. Phone-only contact uses the existing `phone` field and an empty `email`; optional company uses an empty `company_name`. Both are valid under the existing schema.

The form validates input and consent, includes a basic honeypot, prevents duplicate in-flight submissions, handles timeouts, preserves input on failure and reports success only after the database acknowledges the insert. The existing public insert policy has no server-side rate limiting; the honeypot does not replace backend abuse controls.

Conversion hooks dispatch `skenis:conversion` DOM events for CTA, service selection, email, telephone and successful form actions. They send no personal data and add no analytics service or cookies. Existing QR scan analytics remain intact.

## Production build and hosting

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run build` builds Vite assets and prerenders all 17 sitemap pages with their own metadata, canonical URL, structured data and complete HTML. It also writes `dist/404.html` and `dist/spa.html`. `build:dev` remains the original client-only preview build.

Publish `dist/` using the existing hosting provider. Serve generated files first (for example `/paslaugos/svetaines/index.html` at `/paslaugos/svetaines`). Route `/admin/*` and `/r/*` to `spa.html`; serve unknown public URLs using `404.html` with HTTP 404 status. If the provider retains a universal `index.html` SPA fallback, routing still works in JavaScript, but route-specific crawler metadata and correct HTTP status require the host rules above. Canonicals use the existing `https://skenis.lt` domain.

No deployment or database changes are performed by the build. Keep the existing production environment values and Supabase configuration. The studio form was browser-tested against a local simulated endpoint; no synthetic lead was sent to the production database.

## Existing NFC/QR product

Every physical QR code points to a permanent Skenis short URL:

```text
https://skenis.lt/r/8fK29xQp
```

The admin can assign or change the final Google review destination later.

## Stack

- Vite 5
- React 18
- React Router DOM
- Tailwind CSS 3 + PostCSS
- Supabase/Lovable Cloud
- Supabase Auth for admin login
- Zod validation
- JSZip XLSX/QR ZIP generation
- QR SVG generation
- Vitest focused tests

This intentionally follows the standard Lovable Vite app structure:

```text
index.html
src/main.tsx
src/App.tsx
src/index.css
vite.config.ts
```

## Scripts

```bash
bun install
bun run dev
bun run build
bun run preview
bun test
```

Lovable preview serves the Vite dev server on `http://localhost:8080`.

## Environment

```env
VITE_PUBLIC_APP_URL="https://skenis.lt"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

No service-role key is used in the frontend app. Admin access uses Supabase Auth plus `public.user_roles`.

## Database

Run Supabase migrations in `supabase/migrations`.

To grant an authenticated user admin rights:

```sql
insert into public.user_roles (user_id, role)
values ('USER_UUID_FROM_AUTH_USERS', 'admin');
```

The public QR redirect flow uses the `get_redirect_link_public(token)` security-definer RPC so anonymous visitors can resolve only the fields required for redirect behavior.

## Features

- Public Lithuanian landing and contact/order form
- Supabase lead storage
- Supabase Auth admin login
- Admin dashboard metrics
- QR batch generator
- Manufacturer XLSX export
- QR SVG ZIP export
- Individual QR redirect programming
- Scan analytics
- Audit logs for admin changes
- Safe Google review/Maps URL validation
- Branded QR status pages

## Notes

- Keep `VITE_PUBLIC_APP_URL` stable before generating real production QR batches.
- QR short URLs remain permanent; only the final destination URL changes.
