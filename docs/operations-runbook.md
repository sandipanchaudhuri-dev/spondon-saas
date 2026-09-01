# Spondon Operations Runbook

## Registration

Share `/register`. The form creates a submitted record and returns a unique public reference. Public users cannot list, update, or retrieve registrations.

## Review

Admins sign in at `/admin/login`, search or filter the directory, and move a record through submitted, accepted, rejected, withdrawn, or draft.

## Banner workflow

Create a banner, create its allocation to a Pujo, then create/update a distribution record. Do not mark an allocation as delivery: allocation describes intent; distribution records the physical handover.

## Future field verification

Create a seasonal model participation, assign it to the Pujo, then create a banner verification. Media belongs in the private `spondon-private-media` bucket under `<organisation_id>/...`.

## Incident safety

If access looks incorrect, stop operational updates and inspect organisation membership plus RLS policies. Never work around RLS with a browser-side secret or service-role key.
