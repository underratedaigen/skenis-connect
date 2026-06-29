# Skenis.lt

Production foundation for **Skenis.lt**, a Lithuanian B2B platform for programmable Google review QR acrylic cards and table stands.

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
