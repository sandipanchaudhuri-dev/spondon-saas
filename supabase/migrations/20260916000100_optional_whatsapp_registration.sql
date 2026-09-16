create or replace function spondon.submit_pujo_registration(
  p_organisation_id uuid,
  p_event_id uuid,
  p_pujo_name text,
  p_address text,
  p_primary_contact_number text,
  p_theme text,
  p_artist_name text,
  p_contact_person_name text,
  p_email text,
  p_whatsapp_number text
) returns table(id uuid,public_reference text,created_at timestamptz)
language plpgsql
security definer
set search_path=''
as $$
begin
  if length(trim(coalesce(p_pujo_name,'')))<2
    or length(trim(coalesce(p_address,'')))<8
    or length(trim(coalesce(p_primary_contact_number,'')))<8
    or length(trim(coalesce(p_contact_person_name,'')))<2
    or p_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  then
    raise exception 'Invalid registration details' using errcode='22023';
  end if;

  if not exists(
    select 1
    from spondon.events e
    join spondon.organisations o on o.id=e.organisation_id
    where e.id=p_event_id
      and e.organisation_id=p_organisation_id
      and e.is_published
      and o.is_active
      and o.is_public
      and (e.registration_opens_at is null or e.registration_opens_at<=now())
      and (e.registration_closes_at is null or e.registration_closes_at>=now())
  ) then
    raise exception 'Registration is not open' using errcode='22023';
  end if;

  return query
  insert into spondon.pujo_registrations(
    organisation_id,event_id,applicant_name,email,phone,pujo_name,address,theme,artist_name,whatsapp_number,submitted_by_user_id
  ) values(
    p_organisation_id,
    p_event_id,
    trim(p_contact_person_name),
    lower(trim(p_email)),
    trim(p_primary_contact_number),
    trim(p_pujo_name),
    trim(p_address),
    nullif(trim(coalesce(p_theme,'')),''),
    nullif(trim(coalesce(p_artist_name,'')),''),
    nullif(trim(coalesce(p_whatsapp_number,'')),''),
    (select auth.uid())
  )
  returning pujo_registrations.id,pujo_registrations.public_reference,pujo_registrations.created_at;
end
$$;

revoke all on function spondon.submit_pujo_registration(uuid,uuid,text,text,text,text,text,text,text,text) from public;
grant execute on function spondon.submit_pujo_registration(uuid,uuid,text,text,text,text,text,text,text,text) to anon,authenticated,service_role;
