create or replace function public.submit_spondon_pujo_registration(
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
) returns table(id uuid, public_reference text, created_at timestamptz)
language sql
security definer
set search_path = ''
as $$
  select * from spondon.submit_pujo_registration(
    p_organisation_id,
    p_event_id,
    p_pujo_name,
    p_address,
    p_primary_contact_number,
    p_theme,
    p_artist_name,
    p_contact_person_name,
    p_email,
    p_whatsapp_number
  );
$$;

revoke all on function public.submit_spondon_pujo_registration(uuid,uuid,text,text,text,text,text,text,text,text) from public;
grant execute on function public.submit_spondon_pujo_registration(uuid,uuid,text,text,text,text,text,text,text,text) to anon, authenticated, service_role;

alter role authenticator set pgrst.db_schemas = 'public, graphql_public, spondon';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
