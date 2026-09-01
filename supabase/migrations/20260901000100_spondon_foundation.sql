-- Shared small-app backend: Spondon foundation
-- Target project: muejwgnmxqvcwuadubpz (formerly PujoVerse Test)

drop table if exists public.season_config;

create schema if not exists spondon;
create schema if not exists spondon_private;
create schema if not exists explore_bijoy;

revoke all on schema spondon from public, anon, authenticated;
revoke all on schema spondon_private from public, anon, authenticated;
revoke all on schema explore_bijoy from public, anon, authenticated;
grant usage on schema spondon to anon, authenticated, service_role;
grant usage on schema spondon_private to service_role;
grant usage on schema explore_bijoy to service_role;

alter default privileges for role postgres in schema spondon revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema spondon revoke all on sequences from public, anon, authenticated;
alter default privileges for role postgres in schema spondon revoke execute on functions from public, anon, authenticated;
alter default privileges for role postgres in schema spondon_private revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema spondon_private revoke execute on functions from public, anon, authenticated;
alter default privileges for role postgres in schema explore_bijoy revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema explore_bijoy revoke execute on functions from public, anon, authenticated;

create table spondon.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  contact_email text,
  contact_phone text,
  logo_path text,
  is_active boolean not null default true,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spondon.events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  name text not null,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, slug),
  check (ends_at is null or starts_at is null or ends_at >= starts_at),
  check (registration_closes_at is null or registration_opens_at is null or registration_closes_at >= registration_opens_at)
);

create table spondon.organisation_memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','operator','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organisation_id, user_id)
);

create table spondon.pujo_registrations (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  event_id uuid not null references spondon.events(id) on delete cascade,
  applicant_name text not null,
  email text not null,
  phone text,
  pujo_name text not null,
  address text,
  notes text,
  status text not null default 'submitted' check (status in ('submitted','under_review','approved','rejected','withdrawn')),
  submitted_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spondon.models (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  date_of_birth date,
  gender text,
  city text,
  profile_photo_path text,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (organisation_id, auth_user_id)
);

create table spondon.model_event_participations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  event_id uuid not null references spondon.events(id) on delete cascade,
  model_id uuid not null references spondon.models(id) on delete cascade,
  status text not null default 'invited' check (status in ('invited','confirmed','declined','completed','cancelled')),
  call_time timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, model_id)
);

create table spondon.model_payments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  model_id uuid not null references spondon.models(id) on delete cascade,
  event_id uuid references spondon.events(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'INR' check (currency ~ '^[A-Z]{3}$'),
  method text not null default 'manual' check (method in ('manual','bank_transfer','cash','upi','external')),
  external_provider text,
  external_reference text,
  status text not null default 'pending' check (status in ('pending','processing','paid','failed','cancelled','refunded')),
  paid_at timestamptz,
  notes text,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spondon.photoshoots (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  event_id uuid references spondon.events(id) on delete set null,
  name text not null,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'planned' check (status in ('planned','confirmed','completed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create table spondon.photoshoot_assets (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  photoshoot_id uuid not null references spondon.photoshoots(id) on delete cascade,
  model_id uuid references spondon.models(id) on delete set null,
  bucket_id text not null default 'spondon-private-media',
  object_path text not null,
  media_type text not null check (media_type in ('image','video','document')),
  caption text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);

create table spondon.banners (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  event_id uuid references spondon.events(id) on delete set null,
  name text not null,
  asset_path text,
  width_mm integer check (width_mm is null or width_mm > 0),
  height_mm integer check (height_mm is null or height_mm > 0),
  quantity integer not null default 1 check (quantity > 0),
  status text not null default 'draft' check (status in ('draft','approved','in_production','ready','distributed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spondon.banner_allocations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  banner_id uuid not null references spondon.banners(id) on delete cascade,
  pujo_registration_id uuid references spondon.pujo_registrations(id) on delete set null,
  allocated_quantity integer not null default 1 check (allocated_quantity > 0),
  status text not null default 'allocated' check (status in ('allocated','prepared','dispatched','received','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spondon.banner_distributions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  allocation_id uuid not null references spondon.banner_allocations(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  distributed_at timestamptz not null default now(),
  distributed_by_user_id uuid references auth.users(id) on delete set null,
  recipient_name text,
  recipient_phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table spondon.model_pujo_assignments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  event_id uuid not null references spondon.events(id) on delete cascade,
  model_id uuid not null references spondon.models(id) on delete cascade,
  pujo_registration_id uuid not null references spondon.pujo_registrations(id) on delete cascade,
  assignment_role text,
  status text not null default 'assigned' check (status in ('assigned','accepted','declined','completed','cancelled')),
  assigned_at timestamptz not null default now(),
  assigned_by_user_id uuid references auth.users(id) on delete set null,
  notes text,
  unique (event_id, model_id, pujo_registration_id)
);

create table spondon.banner_verifications (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  allocation_id uuid not null references spondon.banner_allocations(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','submitted','verified','rejected')),
  submitted_at timestamptz,
  submitted_by_user_id uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  verified_by_user_id uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spondon.verification_media (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references spondon.organisations(id) on delete cascade,
  banner_verification_id uuid not null references spondon.banner_verifications(id) on delete cascade,
  bucket_id text not null default 'spondon-private-media',
  object_path text not null,
  media_type text not null check (media_type in ('image','video','document')),
  captured_at timestamptz,
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_at timestamptz not null default now(),
  unique (bucket_id, object_path),
  check (latitude is null or latitude between -90 and 90),
  check (longitude is null or longitude between -180 and 180)
);

create index on spondon.events (organisation_id);
create index on spondon.organisation_memberships (user_id, organisation_id);
create index on spondon.pujo_registrations (organisation_id, event_id, status);
create index on spondon.models (organisation_id, status);
create index on spondon.model_event_participations (organisation_id, model_id);
create index on spondon.model_payments (organisation_id, model_id, status);
create index on spondon.photoshoots (organisation_id, event_id);
create index on spondon.photoshoot_assets (organisation_id, photoshoot_id);
create index on spondon.banners (organisation_id, event_id);
create index on spondon.banner_allocations (organisation_id, banner_id);
create index on spondon.banner_distributions (organisation_id, allocation_id);
create index on spondon.model_pujo_assignments (organisation_id, event_id, model_id);
create index on spondon.banner_verifications (organisation_id, allocation_id, status);
create index on spondon.verification_media (organisation_id, banner_verification_id);

create or replace function spondon_private.has_org_role(target_org uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1 from spondon.organisation_memberships m
    where m.organisation_id = target_org
      and m.user_id = (select auth.uid())
      and m.role = any(allowed_roles)
  );
$$;
revoke all on function spondon_private.has_org_role(uuid, text[]) from public, anon, authenticated;
grant execute on function spondon_private.has_org_role(uuid, text[]) to authenticated, service_role;

create or replace function spondon.submit_pujo_registration(
  p_organisation_id uuid,
  p_event_id uuid,
  p_applicant_name text,
  p_email text,
  p_phone text,
  p_pujo_name text,
  p_address text default null,
  p_notes text default null
)
returns table (id uuid, public_reference text, created_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if length(trim(p_applicant_name)) < 2 or length(trim(p_pujo_name)) < 2
     or p_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'Invalid registration details' using errcode = '22023';
  end if;
  if not exists (
    select 1 from spondon.events e join spondon.organisations o on o.id = e.organisation_id
    where e.id = p_event_id and e.organisation_id = p_organisation_id
      and e.is_published and o.is_active and o.is_public
      and (e.registration_opens_at is null or e.registration_opens_at <= now())
      and (e.registration_closes_at is null or e.registration_closes_at >= now())
  ) then
    raise exception 'Registration is not open' using errcode = '22023';
  end if;
  return query
    insert into spondon.pujo_registrations (
      organisation_id, event_id, applicant_name, email, phone, pujo_name, address, notes, submitted_by_user_id
    ) values (
      p_organisation_id, p_event_id, trim(p_applicant_name), lower(trim(p_email)), nullif(trim(p_phone), ''),
      trim(p_pujo_name), nullif(trim(p_address), ''), nullif(trim(p_notes), ''), (select auth.uid())
    ) returning pujo_registrations.id, pujo_registrations.public_reference, pujo_registrations.created_at;
end;
$$;
revoke all on function spondon.submit_pujo_registration(uuid,uuid,text,text,text,text,text,text) from public;
grant execute on function spondon.submit_pujo_registration(uuid,uuid,text,text,text,text,text,text) to anon, authenticated, service_role;

do $$
declare t text;
begin
  foreach t in array array[
    'organisations','events','organisation_memberships','pujo_registrations','models',
    'model_event_participations','model_payments','photoshoots','photoshoot_assets','banners',
    'banner_allocations','banner_distributions','model_pujo_assignments','banner_verifications','verification_media'
  ] loop
    execute format('alter table spondon.%I enable row level security', t);
  end loop;
end $$;

create policy organisations_public_read on spondon.organisations for select to anon, authenticated
using (is_active and is_public or spondon_private.has_org_role(id, array['owner','admin','operator','viewer']));
create policy organisations_admin_all on spondon.organisations for all to authenticated
using (spondon_private.has_org_role(id, array['owner','admin']))
with check (spondon_private.has_org_role(id, array['owner','admin']));

create policy events_public_read on spondon.events for select to anon, authenticated
using (is_published and exists (select 1 from spondon.organisations o where o.id = organisation_id and o.is_active and o.is_public)
       or spondon_private.has_org_role(organisation_id, array['owner','admin','operator','viewer']));
create policy events_staff_write on spondon.events for all to authenticated
using (spondon_private.has_org_role(organisation_id, array['owner','admin','operator']))
with check (spondon_private.has_org_role(organisation_id, array['owner','admin','operator']));

create policy memberships_member_read on spondon.organisation_memberships for select to authenticated
using (user_id = (select auth.uid()) or spondon_private.has_org_role(organisation_id, array['owner','admin']));
create policy memberships_admin_write on spondon.organisation_memberships for all to authenticated
using (spondon_private.has_org_role(organisation_id, array['owner','admin']))
with check (spondon_private.has_org_role(organisation_id, array['owner','admin']));

do $$
declare t text;
begin
  foreach t in array array[
    'pujo_registrations','models','model_event_participations','model_payments','photoshoots','photoshoot_assets',
    'banners','banner_allocations','banner_distributions','model_pujo_assignments','banner_verifications','verification_media'
  ] loop
    execute format(
      'create policy %I on spondon.%I for select to authenticated using (spondon_private.has_org_role(organisation_id, array[''owner'',''admin'',''operator'',''viewer'']))',
      t || '_staff_read', t
    );
    execute format(
      'create policy %I on spondon.%I for all to authenticated using (spondon_private.has_org_role(organisation_id, array[''owner'',''admin'',''operator''])) with check (spondon_private.has_org_role(organisation_id, array[''owner'',''admin'',''operator'']))',
      t || '_staff_write', t
    );
  end loop;
end $$;

grant select on spondon.organisations, spondon.events to anon, authenticated;
grant select, insert, update, delete on all tables in schema spondon to authenticated;
grant all on all tables in schema spondon to service_role;
grant usage, select on all sequences in schema spondon to authenticated, service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('spondon-public-assets', 'spondon-public-assets', true, 10485760, array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('spondon-private-media', 'spondon-private-media', false, 52428800, array['image/jpeg','image/png','image/webp','video/mp4','application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy spondon_storage_staff_read on storage.objects for select to authenticated
using (bucket_id in ('spondon-public-assets','spondon-private-media') and exists (
  select 1 from spondon.organisation_memberships m
  where m.user_id = (select auth.uid()) and (storage.foldername(name))[1] = m.organisation_id::text
));
create policy spondon_storage_staff_insert on storage.objects for insert to authenticated
with check (bucket_id in ('spondon-public-assets','spondon-private-media') and exists (
  select 1 from spondon.organisation_memberships m
  where m.user_id = (select auth.uid()) and m.role in ('owner','admin','operator')
    and (storage.foldername(name))[1] = m.organisation_id::text
));
create policy spondon_storage_staff_update on storage.objects for update to authenticated
using (bucket_id in ('spondon-public-assets','spondon-private-media') and exists (
  select 1 from spondon.organisation_memberships m
  where m.user_id = (select auth.uid()) and m.role in ('owner','admin','operator')
    and (storage.foldername(name))[1] = m.organisation_id::text
)) with check (bucket_id in ('spondon-public-assets','spondon-private-media') and exists (
  select 1 from spondon.organisation_memberships m
  where m.user_id = (select auth.uid()) and m.role in ('owner','admin','operator')
    and (storage.foldername(name))[1] = m.organisation_id::text
));
create policy spondon_storage_admin_delete on storage.objects for delete to authenticated
using (bucket_id in ('spondon-public-assets','spondon-private-media') and exists (
  select 1 from spondon.organisation_memberships m
  where m.user_id = (select auth.uid()) and m.role in ('owner','admin')
    and (storage.foldername(name))[1] = m.organisation_id::text
));

comment on schema spondon is 'Spondon app-owned objects only; no cross-app foreign keys.';
comment on schema explore_bijoy is 'Reserved for Explore With Bijoy app-owned objects; keep migrations and dependencies app-local.';
comment on function spondon.submit_pujo_registration is 'Narrow public registration API. Returns only tracking reference; operational records remain private.';
