# Spondon SaaS

Lean, multi-tenant Pujo registration and banner-operations MVP built with Next.js, TypeScript and Supabase.

## Architecture

- Next.js App Router on Vercel
- Shared Supabase Auth infrastructure with app-owned `spondon` Postgres schema, RLS and dedicated Storage buckets
- `organisation_id` on every tenant-owned operational record
- Public registration through a constrained database function; no public table read access
- Future-ready Model → Spondon → Pujo entities without model-facing MVP UI

See [Scope & Requirements v0.1](docs/scope-requirements-v0.1.md) and [Operations Runbook](docs/operations-runbook.md).

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` and add the Sandipan SaaS publishable key. Never use a secret/service-role key.
3. Apply the migrations in `supabase/migrations` to project `muejwgnmxqvcwuadubpz` if provisioning a fresh environment. The live foundation is already applied.
4. Run `pnpm dev`.

Never use keys or project references belonging to another product. Do not commit `.env.local`.

## First admin

Create an Auth user in the shared Sandipan SaaS project, then insert its ID into `spondon.organisation_memberships` for the Spondon organisation. Use role `owner`, `admin`, or `operator`. Membership is app-specific and grants no access to other schemas.

## Checks

`pnpm lint`, `pnpm typecheck`, and `pnpm build` must pass before deployment.
