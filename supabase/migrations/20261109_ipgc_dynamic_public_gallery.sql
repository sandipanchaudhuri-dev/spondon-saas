-- IPGC galleries: a live, competition-gated read model over canonical media sources.
-- Authenticated jury and field evidence stays in private storage; only eligible photos are proxied.
create table if not exists public.competition_gallery_curated_assets (
  id uuid primary key default gen_random_uuid(),
  judgment_run_id uuid not null references public.sera_judgment_runs(id) on delete cascade,
  pujo_id uuid not null references public.pujos(id) on delete cascade,
  image_url text not null check (image_url ~ '^https://[^ ]+$'),
  alt_text text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  unique(judgment_run_id,pujo_id,image_url)
);
alter table public.competition_gallery_curated_assets enable row level security;
revoke all on public.competition_gallery_curated_assets from anon, authenticated;
create table if not exists public.competition_gallery_exclusions (
 judgment_run_id uuid not null references public.sera_judgment_runs(id) on delete cascade,
 source_kind text not null check (source_kind in ('official','field','jury','curated')),
 source_id uuid not null,
 reason text not null default 'Excluded from public gallery',
 excluded_at timestamptz not null default now(),
 primary key(judgment_run_id,source_kind,source_id)
);
alter table public.competition_gallery_exclusions enable row level security;
revoke all on public.competition_gallery_exclusions from anon, authenticated;
insert into public.competition_gallery_curated_assets
 (judgment_run_id,pujo_id,image_url,alt_text)
select j.judgment_run_id,j.pujo_id,
'https://rcfdlnbvnidlxwptcoky.supabase.co/storage/v1/object/public/ipgc-public-photos/narayantala-yubak-sangha/2026/idol.jpg',
'Narayantala Yubak Sangha — Kali idol, 2026'
from public.sera_judgment_pujos j join public.sera_judgment_runs r on r.id=j.judgment_run_id
where r.code='ipgc-shyama-samman-2026-kolkata'
and j.source_row_id=(select id::text from ipgc.registrations where reference='IPGC-SS-2026-00046' limit 1)
on conflict do nothing;
insert into public.competition_gallery_curated_assets
 (judgment_run_id,pujo_id,image_url,alt_text)
select j.judgment_run_id,j.pujo_id,
'https://rcfdlnbvnidlxwptcoky.supabase.co/storage/v1/object/public/ipgc-public-photos/narayantala-yubak-sangha/2026/entrance.jpg',
'Narayantala Yubak Sangha — pandal entrance, 2026'
from public.sera_judgment_pujos j join public.sera_judgment_runs r on r.id=j.judgment_run_id
where r.code='ipgc-shyama-samman-2026-kolkata'
and j.source_row_id=(select id::text from ipgc.registrations where reference='IPGC-SS-2026-00046' limit 1)
on conflict do nothing;

CREATE OR REPLACE FUNCTION public.ipgc_public_gallery()
 RETURNS TABLE(registration_ref text, source_kind text, source_id uuid, src text, alt text, uploaded_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
 with finalists as (
   select distinct j.id judgment_pujo_id, j.judgment_run_id, j.pujo_id,
          reg.reference registration_ref, j.display_name
   from public.sera_judgment_runs run
   join public.sera_judgment_pujos j on j.judgment_run_id=run.id
   join public.sera_final_round_entries fr on fr.judgment_pujo_id=j.id
      and fr.judgment_run_id=run.id and fr.status='active'
   join ipgc.registrations reg on j.source_row_id=reg.id::text
   join public.pujos p on p.id=j.pujo_id and p.active=true
   where run.code='ipgc-shyama-samman-2026-kolkata'
     and j.pool_status='active'
 ),
 all_photos as (
   select f.registration_ref, 'official'::text source_kind, m.id source_id,
      m.external_url src,
      f.display_name||' — field photograph' alt,
      m.created_at uploaded_at
   from finalists f
   join public.official_media m on m.pujo_id=f.pujo_id
   where m.visibility='public' and m.competition_year=2026
     and m.year=2026
     and m.media_type='photo' and m.asset_kind='photo'
     and m.purpose='coverage'
     and m.storage_path like f.pujo_id::text||'/field-coverage/%'
     and m.external_url like
       'https://rcfdlnbvnidlxwptcoky.supabase.co/storage/v1/object/public/pujo-media/'||f.pujo_id::text||'/field-coverage/%'
     and coalesce(m.caption,'') !~* '(qr[ -]?code|route[ -]?map|google[ -]?map|screenshot)'
   union all
   select f.registration_ref, 'field'::text, m.id,
      'https://rcfdlnbvnidlxwptcoky.supabase.co/functions/v1/ipgc-finalist-photo?photo_id='||m.id::text,
      f.display_name||' — field visit photograph',
      m.saved_at
   from finalists f
   join public.sera_field_visits v on v.judgment_pujo_id=f.judgment_pujo_id
   join public.sera_field_media m on m.visit_id=v.id
   where v.status='complete' and m.saved_at is not null
     and m.purpose='visit' and m.review_status is distinct from 'rejected'
     and m.mime_type in ('image/jpeg','image/png','image/webp')
   union all
   select f.registration_ref, 'jury'::text, m.id,
      'https://rcfdlnbvnidlxwptcoky.supabase.co/functions/v1/ipgc-finalist-photo?source=jury&photo_id='||m.id::text,
      f.display_name||' — jury visit photograph',
      coalesce(m.uploaded_at,m.created_at)
   from finalists f
   join public.sera_jury_visits v on v.judgment_pujo_id=f.judgment_pujo_id
   join public.sera_jury_visit_media m on m.visit_id=v.id
   where v.judgment_run_id=f.judgment_run_id
     and m.storage_path is not null
     and m.media_type in ('photo','image/jpeg','image/png','image/webp')
     and coalesce(m.status,'') not in ('rejected','failed','deleted','removed')
   union all
   select f.registration_ref, 'curated'::text, c.id, c.image_url, c.alt_text, c.created_at
   from finalists f join public.competition_gallery_curated_assets c
     on c.judgment_run_id=f.judgment_run_id and c.pujo_id=f.pujo_id
   where c.is_published=true
 )
 select a.registration_ref,a.source_kind,a.source_id,a.src,a.alt,a.uploaded_at
 from all_photos a
 where not exists(
   select 1 from public.competition_gallery_exclusions x
   join public.sera_judgment_runs run on run.id=x.judgment_run_id
   where run.code='ipgc-shyama-samman-2026-kolkata'
     and x.source_kind=a.source_kind and x.source_id=a.source_id
 )
 order by a.registration_ref, a.uploaded_at desc nulls last, a.source_kind, a.source_id;
$function$
;
revoke all on function public.ipgc_public_gallery() from public;
grant execute on function public.ipgc_public_gallery() to anon, authenticated, service_role;
