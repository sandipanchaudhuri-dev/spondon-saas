# Spondon SaaS — Scope & Requirements v0.1

## Product purpose

Spondon is a separate multi-tenant SaaS for seasonal Pujo registration and the operational chain **Model → Spondon → Pujo**. The first tenant is Spondon; the product must not depend on PujoVerse, Sera Pujo, Indian Festival, Durga Online, or Explore With Bijoy.

## MVP outcomes

- Public, mobile-first Pujo registration with a generated reference ID.
- Internal registration directory with search, filtering, review, editing and status changes.
- Separate tracking for banner allocation and physical distribution.
- Dashboard counts for registrations and operational progress.
- Organisation-based tenant isolation in every owned record, enforced by Supabase RLS.

## Hierarchy and roles

`Platform → Organisation → Event → Pujo Registration`

Roles are platform admin, organisation owner/admin, operations user, future model/field user, and public registrant. Public registrants are not tenant members and receive no general read access.

## Registration information

Organisation/Pujo name, address, primary contact number, event season, theme, artist name, contact person name, email, WhatsApp number, generated reference ID, status, and audit timestamps. Programme rules and terms are informational—not stored as Pujo attributes.

Status lifecycle: `draft → submitted → accepted/rejected`, with `withdrawn` available where required.

## Future-ready operational model

The schema provisions models, annual model participation, payments, photoshoots and assets, banners, allocation, distribution, model–Pujo assignments, verification and verification media. Model participation is seasonal; assignments are bridge records, not `model_id` columns on a Pujo. Allocation, physical distribution and verification are separate events to preserve responsibility and history.

## Security and quality

- RLS on every public table; tenant access comes from authenticated memberships.
- Public registration uses one constrained RPC and exposes no registration directory or internal operational data.
- Private media bucket with organisation-prefixed paths and storage policies.
- Publishable keys may be exposed to the browser; secret/service-role keys must never be client-side or committed.
- Responsive layouts, validation, accessible labels, clear loading/error/success states.

## Explicitly out of MVP

Payment gateway, subscriptions, custom domains, certificates, judging/scoring, configurable drag/drop forms, model portal UI, and GPS verification.

## Delivery acceptance

Source, migration and documentation are committed to a dedicated repository; the isolated `spondon` schema in the shared Sandipan SaaS project is security-reviewed; a separate Vercel project is configured; public submission and authenticated tenant administration are smoke-tested in production.
