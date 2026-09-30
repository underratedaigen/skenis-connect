-- Real reviews only. The 200 synthetic fixtures stay in the development bundle.
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  company text check (char_length(company) <= 160),
  role text check (char_length(role) <= 120),
  service text not null check (service in ('svetaines','e-komercija','registracijos','pardavimu-irankiai','skaiciuokles','verslo-sistemos','automatizacijos','ai-sprendimai','atsiliepimai','nfc-product')),
  rating integer not null check (rating between 1 and 5),
  quote text not null check (char_length(btrim(quote)) between 10 and 800),
  full_quote text check (char_length(full_quote) <= 4000),
  published_at date not null,
  source text not null check (source in ('google','direct','facebook')),
  source_url text check (source_url is null or source_url ~ '^https://'),
  verified boolean not null default false,
  featured boolean not null default false,
  synthetic boolean not null default false check (synthetic = false),
  consent boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_publish_gate check (status <> 'published' or (verified and consent and not synthetic))
);
alter table public.testimonials enable row level security;
create index if not exists testimonials_public_date on public.testimonials (published_at desc) where status = 'published' and verified and consent and not synthetic;
drop policy if exists "Public read approved testimonials" on public.testimonials;
create policy "Public read approved testimonials" on public.testimonials for select to anon, authenticated using (status = 'published' and verified and consent and not synthetic and source <> 'synthetic' and published_at <= current_date);
drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
grant select on public.testimonials to anon;
grant select, insert, update on public.testimonials to authenticated;
revoke delete on public.testimonials from anon, authenticated;
drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials for each row execute function public.update_updated_at();
