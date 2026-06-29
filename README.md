# Skenis.lt

Production foundation for **Skenis.lt**, a Lithuanian B2B platform for programmable Google review QR acrylic cards and table stands.

Every physical QR code points to a permanent Skenis short URL such as:

```text
https://skenis.lt/r/8fK29xQp
```

The final Google review destination can be assigned or changed later in the admin dashboard.

## Features

- Public Lithuanian marketing and order page
- Lead/order capture stored in PostgreSQL
- Protected `/admin` dashboard
- Batch QR short-link generator
- XLSX export for manufacturers
- QR PNG ZIP export for batches
- Individual redirect programming
- `/r/[token]` scan endpoint with branded fallback pages
- Scan analytics with IP hashing instead of raw IP storage
- Google review/Maps URL validation
- Audit logs for admin changes
- Seeded demo admin and demo data
- Vitest coverage for token generation, URL validation, and redirect policy

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Signed HTTP-only admin session cookie
- Zod validation
- ExcelJS
- qrcode
- JSZip
- Vitest

## Setup

1. Install dependencies:

```bash
npm install
```

1. Copy environment variables:

```bash
cp .env.example .env
```

1. Update `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skenis?schema=public"
NEXT_PUBLIC_APP_URL="https://skenis.lt"
SESSION_SECRET="replace-with-at-least-32-random-characters"
IP_HASH_SECRET="replace-with-a-different-random-secret"
SEED_ADMIN_EMAIL="admin@skenis.lt"
SEED_ADMIN_PASSWORD="SkenisDemo2026!"
```

1. Run the database migration:

```bash
npm run db:migrate
```

1. Seed demo data:

```bash
npm run db:seed
```

1. Start development:

```bash
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

Default seeded admin:

```text
admin@skenis.lt / SkenisDemo2026!
```

Change this before production.

## Production Notes

- Set `NEXT_PUBLIC_APP_URL=https://skenis.lt` before generating production QR batches.
- Use long random values for `SESSION_SECRET` and `IP_HASH_SECRET`.
- Run migrations with `npm run db:deploy`.
- Put the app behind HTTPS.
- Keep the database backed up; QR tokens are permanent production assets.
- Restrict database and admin access to trusted operators.

## Admin Workflow

1. Go to `/admin/batches/new`.
1. Enter quantity, batch name, product type, and manufacturer notes.
1. Generate the batch.
1. Download XLSX and optional QR PNG ZIP.
1. Send manufacturing files to the producer.
1. Open a QR link record and assign the company plus Google review URL.
1. Future scans keep using the same short URL but redirect to the updated destination.

## Testing

```bash
npm run typecheck
npm run lint
npm test
```

## Known Limitations

- Admin auth is intentionally simple: email/password with a signed session cookie. For multiple teams, add password reset, MFA, and stricter role permissions.
- QR ZIP generation is in-memory. For very large production runs, move ZIP generation to a background job or object storage.
- Geolocation is intentionally skipped to avoid unnecessary tracking.
- Pricing is hardcoded placeholder copy in the public page; connect it to a product/pricing table when commercial pricing is finalized.
