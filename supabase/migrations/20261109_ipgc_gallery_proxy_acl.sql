-- Keep private field/jury media private; this permission is service_role only.
CREATE OR REPLACE FUNCTION public.ipgc_gallery_photo_allowed(p_photo_id uuid, p_source_kind text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
 select case
 when p_source_kind='field' then exists (
   select 1
   from public.sera_field_media m
   join public.sera_field_visits v on v.id=m.visit_id
   join public.sera_judgment_pujos j on j.id=v.judgment_pujo_id
   join public.sera_judgment_runs run on run.id=j.judgment_run_id
   join public.sera_final_round_entries fr on fr.judgment_pujo_id=j.id
    and fr.judgment_run_id=run.id and fr.status='active'
   join public.pujos p on p.id=j.pujo_id and p.active=true
   join ipgc.registrations r on r.id::text=j.source_row_id
   where m.id=p_photo_id
    and run.code='ipgc-shyama-samman-2026-kolkata'
    and j.pool_status='active'
    and v.status='complete'
    and m.purpose='visit' and m.saved_at is not null
    and m.review_status is distinct from 'rejected'
    and m.mime_type in ('image/jpeg','image/png','image/webp')
    and not exists (select 1 from public.competition_gallery_exclusions x
       where x.judgment_run_id=run.id and x.source_kind='field' and x.source_id=m.id)
 )
 when p_source_kind='jury' then exists (
   select 1
   from public.sera_jury_visit_media m
   join public.sera_jury_visits v on v.id=m.visit_id
   join public.sera_judgment_pujos j on j.id=v.judgment_pujo_id
    and j.judgment_run_id=v.judgment_run_id
   join public.sera_judgment_runs run on run.id=j.judgment_run_id
   join public.sera_final_round_entries fr on fr.judgment_pujo_id=j.id
    and fr.judgment_run_id=run.id and fr.status='active'
   join public.pujos p on p.id=j.pujo_id and p.active=true
   join ipgc.registrations r on r.id::text=j.source_row_id
   where m.id=p_photo_id
    and run.code='ipgc-shyama-samman-2026-kolkata'
    and j.pool_status='active'
    and m.storage_path is not null
    and m.media_type in ('photo','image/jpeg','image/png','image/webp')
    and coalesce(m.status,'') not in ('rejected','failed','deleted','removed')
    and not exists (select 1 from public.competition_gallery_exclusions x
       where x.judgment_run_id=run.id and x.source_kind='jury' and x.source_id=m.id)
 )
 else false end;
$function$
;
revoke all on function public.ipgc_gallery_photo_allowed(uuid,text) from public,anon,authenticated;
grant execute on function public.ipgc_gallery_photo_allowed(uuid,text) to service_role;
