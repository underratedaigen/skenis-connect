create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.product_type as enum ('CARD', 'STAND', 'NFC_CARD', 'OTHER');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.redirect_status as enum ('UNASSIGNED', 'ACTIVE', 'DISABLED', 'ARCHIVED');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.lead_status as enum ('NEW', 'CONTACTED', 'PAID', 'IN_PRODUCTION', 'SHIPPED', 'COMPLETED', 'CANCELLED');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.qr_batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_type public.product_type not null,
  quantity integer not null check (quantity > 0 and quantity <= 1000),
  token_prefix text,
  note text,
  manufacturer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.redirect_links (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  batch_id uuid references public.qr_batches(id) on delete set null,
  short_url text not null,
  status public.redirect_status not null default 'UNASSIGNED',
  product_type public.product_type not null,
  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  destination_url text,
  notes text,
  scan_count integer not null default 0,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.increment_redirect_scan(
  _redirect_link_id uuid,
  _last_scanned_at timestamptz
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.redirect_links
  set scan_count = scan_count + 1,
      last_scanned_at = _last_scanned_at
  where id = _redirect_link_id;
$$;

create table if not exists public.scan_events (
  id uuid primary key default gen_random_uuid(),
  redirect_link_id uuid not null references public.redirect_links(id) on delete cascade,
  user_agent text,
  ip_hash text,
  referrer text,
  device_type text,
  country text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text not null,
  email text not null,
  phone text,
  quantity integer not null check (quantity > 0 and quantity <= 10000),
  product_type public.product_type not null,
  google_review_url text,
  message text,
  status public.lead_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists qr_batches_updated_at on public.qr_batches;
create trigger qr_batches_updated_at
before update on public.qr_batches
for each row execute function public.update_updated_at();

drop trigger if exists redirect_links_updated_at on public.redirect_links;
create trigger redirect_links_updated_at
before update on public.redirect_links
for each row execute function public.update_updated_at();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
before update on public.leads
for each row execute function public.update_updated_at();

create index if not exists qr_batches_created_at_idx on public.qr_batches(created_at);
create index if not exists qr_batches_product_type_idx on public.qr_batches(product_type);
create index if not exists redirect_links_status_idx on public.redirect_links(status);
create index if not exists redirect_links_product_type_idx on public.redirect_links(product_type);
create index if not exists redirect_links_company_name_idx on public.redirect_links(company_name);
create index if not exists redirect_links_batch_id_idx on public.redirect_links(batch_id);
create index if not exists redirect_links_last_scanned_at_idx on public.redirect_links(last_scanned_at);
create index if not exists redirect_links_created_at_idx on public.redirect_links(created_at);
create index if not exists scan_events_redirect_link_created_idx on public.scan_events(redirect_link_id, created_at);
create index if not exists scan_events_created_at_idx on public.scan_events(created_at);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at);
create index if not exists leads_company_name_idx on public.leads(company_name);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at);

alter table public.user_roles enable row level security;
alter table public.qr_batches enable row level security;
alter table public.redirect_links enable row level security;
alter table public.scan_events enable row level security;
alter table public.leads enable row level security;
alter table public.audit_logs enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant usage on type public.app_role to anon, authenticated, service_role;
grant usage on type public.product_type to anon, authenticated, service_role;
grant usage on type public.redirect_status to anon, authenticated, service_role;
grant usage on type public.lead_status to anon, authenticated, service_role;
grant select, insert, update, delete on public.user_roles to authenticated, service_role;
grant select, insert, update, delete on public.qr_batches to authenticated, service_role;
grant select, insert, update, delete on public.redirect_links to authenticated, service_role;
grant select, insert on public.scan_events to anon, authenticated, service_role;
grant select, insert, update, delete on public.leads to anon, authenticated, service_role;
grant select, insert on public.audit_logs to authenticated, service_role;
grant execute on function public.increment_redirect_scan(uuid, timestamptz) to anon, authenticated, service_role;

drop policy if exists "Admins can read roles" on public.user_roles;
create policy "Admins can read roles"
on public.user_roles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage batches" on public.qr_batches;
create policy "Admins manage batches"
on public.qr_batches for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage redirect links" on public.redirect_links;
create policy "Admins manage redirect links"
on public.redirect_links for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can insert scans" on public.scan_events;
create policy "Public can insert scans"
on public.scan_events for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins read scans" on public.scan_events;
create policy "Admins read scans"
on public.scan_events for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Public can create leads" on public.leads;
create policy "Public can create leads"
on public.leads for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins manage leads" on public.leads;
create policy "Admins manage leads"
on public.leads for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins read audit logs" on public.audit_logs;
create policy "Admins read audit logs"
on public.audit_logs for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins create audit logs" on public.audit_logs;
create policy "Admins create audit logs"
on public.audit_logs for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));
