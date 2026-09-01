-- Follow-up hardening for advisor-clean policy evaluation and FK operations.

drop policy if exists organisations_admin_all on spondon.organisations;
create policy organisations_admin_insert on spondon.organisations for insert to authenticated
with check (spondon_private.has_org_role(id, array['owner','admin']));
create policy organisations_admin_update on spondon.organisations for update to authenticated
using (spondon_private.has_org_role(id, array['owner','admin']))
with check (spondon_private.has_org_role(id, array['owner','admin']));
create policy organisations_admin_delete on spondon.organisations for delete to authenticated
using (spondon_private.has_org_role(id, array['owner','admin']));

drop policy if exists events_staff_write on spondon.events;
create policy events_staff_insert on spondon.events for insert to authenticated
with check (spondon_private.has_org_role(organisation_id, array['owner','admin','operator']));
create policy events_staff_update on spondon.events for update to authenticated
using (spondon_private.has_org_role(organisation_id, array['owner','admin','operator']))
with check (spondon_private.has_org_role(organisation_id, array['owner','admin','operator']));
create policy events_staff_delete on spondon.events for delete to authenticated
using (spondon_private.has_org_role(organisation_id, array['owner','admin','operator']));

drop policy if exists memberships_admin_write on spondon.organisation_memberships;
create policy memberships_admin_insert on spondon.organisation_memberships for insert to authenticated
with check (spondon_private.has_org_role(organisation_id, array['owner','admin']));
create policy memberships_admin_update on spondon.organisation_memberships for update to authenticated
using (spondon_private.has_org_role(organisation_id, array['owner','admin']))
with check (spondon_private.has_org_role(organisation_id, array['owner','admin']));
create policy memberships_admin_delete on spondon.organisation_memberships for delete to authenticated
using (spondon_private.has_org_role(organisation_id, array['owner','admin']));

do $$
declare t text;
begin
  foreach t in array array[
    'pujo_registrations','models','model_event_participations','model_payments','photoshoots','photoshoot_assets',
    'banners','banner_allocations','banner_distributions','model_pujo_assignments','banner_verifications','verification_media'
  ] loop
    execute format('drop policy if exists %I on spondon.%I', t || '_staff_write', t);
    execute format(
      'create policy %I on spondon.%I for insert to authenticated with check (spondon_private.has_org_role(organisation_id, array[''owner'',''admin'',''operator'']))',
      t || '_staff_insert', t);
    execute format(
      'create policy %I on spondon.%I for update to authenticated using (spondon_private.has_org_role(organisation_id, array[''owner'',''admin'',''operator''])) with check (spondon_private.has_org_role(organisation_id, array[''owner'',''admin'',''operator'']))',
      t || '_staff_update', t);
    execute format(
      'create policy %I on spondon.%I for delete to authenticated using (spondon_private.has_org_role(organisation_id, array[''owner'',''admin'',''operator'']))',
      t || '_staff_delete', t);
  end loop;
end $$;

create index if not exists banner_allocations_banner_id_idx on spondon.banner_allocations(banner_id);
create index if not exists banner_allocations_pujo_registration_id_idx on spondon.banner_allocations(pujo_registration_id);
create index if not exists banner_distributions_allocation_id_idx on spondon.banner_distributions(allocation_id);
create index if not exists banner_distributions_distributed_by_user_id_idx on spondon.banner_distributions(distributed_by_user_id);
create index if not exists banner_verifications_allocation_id_idx on spondon.banner_verifications(allocation_id);
create index if not exists banner_verifications_submitted_by_user_id_idx on spondon.banner_verifications(submitted_by_user_id);
create index if not exists banner_verifications_verified_by_user_id_idx on spondon.banner_verifications(verified_by_user_id);
create index if not exists banners_event_id_idx on spondon.banners(event_id);
create index if not exists model_event_participations_model_id_idx on spondon.model_event_participations(model_id);
create index if not exists model_payments_created_by_user_id_idx on spondon.model_payments(created_by_user_id);
create index if not exists model_payments_event_id_idx on spondon.model_payments(event_id);
create index if not exists model_payments_model_id_idx on spondon.model_payments(model_id);
create index if not exists model_pujo_assignments_assigned_by_user_id_idx on spondon.model_pujo_assignments(assigned_by_user_id);
create index if not exists model_pujo_assignments_model_id_idx on spondon.model_pujo_assignments(model_id);
create index if not exists model_pujo_assignments_pujo_registration_id_idx on spondon.model_pujo_assignments(pujo_registration_id);
create index if not exists models_auth_user_id_idx on spondon.models(auth_user_id);
create index if not exists photoshoot_assets_model_id_idx on spondon.photoshoot_assets(model_id);
create index if not exists photoshoot_assets_photoshoot_id_idx on spondon.photoshoot_assets(photoshoot_id);
create index if not exists photoshoots_event_id_idx on spondon.photoshoots(event_id);
create index if not exists pujo_registrations_event_id_idx on spondon.pujo_registrations(event_id);
create index if not exists pujo_registrations_reviewed_by_user_id_idx on spondon.pujo_registrations(reviewed_by_user_id);
create index if not exists pujo_registrations_submitted_by_user_id_idx on spondon.pujo_registrations(submitted_by_user_id);
create index if not exists verification_media_banner_verification_id_idx on spondon.verification_media(banner_verification_id);
