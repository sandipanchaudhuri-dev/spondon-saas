create or replace function public.spondon_healthcheck()
returns table(ok boolean, event_count bigint, checked_at timestamptz)
language sql
security definer
set search_path = ''
as $$
  select
    true,
    count(*)::bigint,
    now()
  from spondon.events
  where is_published = true;
$$;

revoke all on function public.spondon_healthcheck() from public;
grant execute on function public.spondon_healthcheck() to anon, authenticated, service_role;
notify pgrst, 'reload schema';
