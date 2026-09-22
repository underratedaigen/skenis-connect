# Skenis studio rebrand

Implemented on 22 September 2026 from repository revision `d6ce7bc`.

## Audit and design decisions

The original app is React 18, React Router 6, Vite 5, TypeScript, Tailwind 3, Framer Motion, Lucide and Supabase. Its public site consisted of the NFC/QR landing page, contacts, legal pages and QR redirects. Administration already provided lead storage, QR batches, programmable destinations, scan analytics and exports. There was no general website checkout to replace: the product uses an enquiry flow.

The retained visual foundation is the original Skenis logo, Plus Jakarta Sans, dark ink, teal, rounded controls, fine borders and Lucide icons. The studio site consolidates these into restrained typography, soft off-white backgrounds, an orderly spacing system and a small interface-led visual language. Google colours remain in the original logo and a small footer accent. The public shell uses a standard pointer instead of the old pointer-hiding custom cursor.

The original 989 KB logo is preserved. A cropped, resized 75 KB derivative is used in navigation and footer; no replacement brand mark was introduced. Product photographs remain original assets.

## Implemented

- Lithuanian homepage positioned around websites, systems and business automation.
- Eight primary service categories; a separate reputation category retains NFC/QR visibility.
- All 80 requested capabilities in structured data, with descriptions, problems, approaches, examples and FAQs.
- Useful overview and detail pages, plus an about page and a gallery of explicitly labelled internal concepts.
- Interactive need and industry selectors, booking-time demo and price-calculator demo. Demo values are expressly illustrative.
- Typed case-study architecture for future verified work, screenshots, services, URLs and sourced results.
- Free initial concept proposition with conditional scope; no promise of a complete free project.
- Studio enquiry form reusing the existing Supabase lead table; service preselection, email or phone, optional company and website, consent, validation, honeypot, loading, timeout, error, retry and success.
- Full enquiry expansion in the admin inbox, including readable phone-only and optional-company submissions.
- Responsive navigation with keyboard focus management and Escape support; skip link, visible focus, semantic headings and reduced-motion styles.
- First-party conversion event hooks with no new third-party tracker or personal form data.
- Canonicals, page descriptions, Open Graph, Twitter, Organization/Service/Breadcrumb structured data, robots, sitemap and static HTML for 17 public pages.

## Preserved

The original NFC product page is at `/google-atsiliepimai`. Existing homepage product anchors (`kaip-veikia`, `produktas`, `privalumai`, `kam-tinka`, `kaina`, `duk`, `uzsakymas`, `produktai`) redirect to their corresponding product sections. Quantity selection, original pricing tiers, form prefill, images and ordering remain.

All `/r/:token` and `/admin/*` routes, Supabase configuration, migrations, destination resolution, scan tracking, authentication and export logic remain in place. No live lead was created, destination changed or database migrated as part of this work. Existing legal routes and contact details remain.

One stale redirect-policy test expected Google-only destinations while both the current implementation and URL-validation tests explicitly allow HTTP(S) destinations. The stale expectation now checks an unsafe `javascript:` URL and explicitly verifies existing custom HTTP(S) destinations. Runtime destination policy was not changed.

## Verification

- `npm run lint` (the repository's TypeScript lint command): passed.
- `npm run typecheck`: passed.
- `npm test`: 20 tests passed across six test files.
- `npm run build`: Vite production and SSR prerender builds passed; 17 public pages, a 404 document and a private-route SPA document generated.
- 51 browser route/viewport combinations: all 17 public pages at 320, 768 and 1440 px. One H1, one main region, correct canonical and no page-level horizontal overflow.
- Visual inspection of homepage, service overview/detail, demos, about, contact and product experiences on desktop and mobile.
- Local simulated Supabase endpoint: validation, disabled loading state, server failure, preserved draft, retry and acknowledged success verified, including phone-only submission.
- Booking selection and calculator recalculation verified in browser.
- Product quantity 2 yields the original 39.98 EUR total and carries quantity 2 into the order form. Modal keyboard trapping and Escape handling checked; mobile drawer retained.
- Production prerender hydration checked on homepage, service detail, contact, contact with intent/service query and mobile product page; no console errors or warnings.
- Missing-page and admin login metadata correctly use noindex.

No numerical Lighthouse score is claimed. Production build output is approximately 90.5 KB gzip for the main JavaScript entry and 17.8 KB gzip for styles. Supabase, order forms, product content, administration and exports are separate chunks; the studio form loads the Supabase integration on submission.

## Release and editing

See README for environment values and host routing. Deploy the generated `dist/` with static files first, private routes falling back to `spa.html`, and unknown public paths returning `404.html` with status 404. The app retains SPA compatibility if the existing host still uses an index fallback, but complete crawler metadata requires the static routing configuration.

No production deployment has been made. Real database delivery and host-specific HTTP rules should be checked when releasing with the existing production configuration. The form honeypot is basic client-side protection; the pre-existing public Supabase insert policy has no server-side rate limiter.

Service content: `src/data/services.ts`. Future project content: `src/data/projects.ts`. Homepage and reusable previews: `src/components/public/studio-landing.tsx`. Shared design tokens: `src/studio.css`. Form and secondary layouts: `src/studio-pages.css`. Breakpoints: `src/studio-responsive.css`.
