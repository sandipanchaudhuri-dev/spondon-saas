-- Public registration-derived fields for the confirmed, active IPGC Top 15.
-- Never expose contacts, email, budget or unrelated registration records.
CREATE OR REPLACE FUNCTION public.ipgc_public_finalist_details()
 RETURNS TABLE(registration_ref text, club_name text, puja_name text, locality text, district text, venue_address text, established_year integer, theme text, theme_artist text, idol_artist text, maps_url text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select r.reference,
         nullif(btrim(r.committee_name),'') as club_name,
         nullif(btrim(r.puja_name),'') as puja_name,
         nullif(btrim(r.locality),'') as locality,
         nullif(btrim(r.district),'') as district,
         nullif(btrim(r.venue_address),'') as venue_address,
         r.established_year,
         nullif(btrim(r.theme),'') as theme,
         nullif(btrim(r.theme_artist),'') as theme_artist,
         nullif(btrim(r.idol_artist),'') as idol_artist,
         nullif(btrim(r.maps_url),'') as maps_url
  from public.sera_judgment_runs run
  join public.sera_judgment_pujos j on j.judgment_run_id=run.id and j.pool_status='active'
  join public.sera_final_round_entries fr on fr.judgment_pujo_id=j.id
       and fr.judgment_run_id=run.id and fr.status='active'
  join public.pujos p on p.id=j.pujo_id and p.active=true
  join ipgc.registrations r on r.id::text=j.source_row_id
  where run.code='ipgc-shyama-samman-2026-kolkata'
    and r.status='confirmed';
$function$
;
revoke all on function public.ipgc_public_finalist_details() from public;
grant execute on function public.ipgc_public_finalist_details() to anon, authenticated, service_role;
