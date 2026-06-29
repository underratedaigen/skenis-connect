create or replace function public.get_redirect_link_public(_token text)
returns table (
  id uuid,
  token text,
  status public.redirect_status,
  destination_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    redirect_links.id,
    redirect_links.token,
    redirect_links.status,
    redirect_links.destination_url
  from public.redirect_links
  where redirect_links.token = _token
  limit 1;
$$;

grant execute on function public.get_redirect_link_public(text) to anon, authenticated, service_role;
