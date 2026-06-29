# Skenis.lt

TanStack Start + Vite implementation for **Skenis.lt**, a Lithuanian B2B platform for programmable Google review QR acrylic cards and table stands.

Every physical QR code points to a permanent Skenis short URL:

```text
https://skenis.lt/r/8fK29xQp
```

The admin can assign or change the final Google review destination later.

## Stack

- TanStack Start v1
- TanStack Router file routes
- Vite 7 on port 8080
- React 19
- Tailwind CSS v4
- Supabase/Lovable Cloud
- Zod validation
- JSZip XLSX/QR ZIP generation
- QR SVG generation
- Vitest focused tests

## Scripts

```bash
bun install
bun run dev
bun run build
bun run start
bun test
```

Lovable preview expects:

```bash
bun run dev
```

which serves on `http://localhost:8080`.

## Environment

```env
VITE_PUBLIC_APP_URL="https://skenis.lt"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
IP_HASH_SECRET="replace-with-a-random-secret"
```

## Database

Run Supabase migrations in `supabase/migrations`.

Admin access uses Supabase Auth plus `public.user_roles`; roles are not stored on profiles.

To grant an authenticated user admin rights:

```sql
insert into public.user_roles (user_id, role)
values ('USER_UUID_FROM_AUTH_USERS', 'admin');
```

## Features

- Public Lithuanian landing and contact/order form
- Supabase lead storage
- Supabase Auth admin login
- Admin dashboard metrics
- QR batch generator
- Manufacturer XLSX export
- QR SVG ZIP export
- Individual QR redirect programming
- Scan analytics with hashed IP values
- Audit logs for admin changes
- Safe Google review/Maps URL validation
- Branded QR status pages

## Notes

- QR ZIP exports use SVG files for Worker compatibility.
- XLSX export is generated as OpenXML with JSZip, avoiding Node-only Excel libraries.
- The redirect page runs through TanStack Start and records scans before redirecting.
- Keep `VITE_PUBLIC_APP_URL` stable before generating real production QR batches.
