# Spondon architecture and status

Spondon is a standalone Next.js application backed by project `muejwgnmxqvcwuadubpz` (`Sandipan SaaS`). Only infrastructure and `auth.users` are shared. All Spondon business data, memberships, RLS policies, functions, and storage buckets are app-specific.

- Data API schemas: `public`, `graphql_public`, `spondon`
- Deliberately unexposed: `spondon_private`, `explore_bijoy`
- Public API: constrained `spondon.submit_pujo_registration` RPC
- Tenant authorization: `spondon.organisation_memberships`
- Storage: `spondon-public-assets`, `spondon-private-media`
- No cross-application foreign keys
- Pujo Quest project `rcfdlnbvnidlxwptcoky` is not referenced by the app or its migrations

The MVP includes public registration, authenticated registration administration, status management, banner stock/allocation tracking, distribution counts, and responsive layouts. Model, photoshoot, and verification tables remain future-ready without being exposed in the MVP UI.

The Spondon organisation and Sharod Somman 2026 event are seeded and public registration is open through 10 October 2026. Security advisor reports no findings. Performance advisor reports only expected unused-index informational notices on newly provisioned empty tables.
