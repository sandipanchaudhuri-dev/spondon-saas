# IPGC Business Requirements Document — Amendment BR-09
Version 1.1 | 19 November 2026 | Implementation scope: Workshop Management and Publishing Engine

## Business outcome
Authorised IPGC administrators can upload an official workshop poster, produce a structured workshop record, publish, edit or archive it without coding or deploying a new website release. The public site lists upcoming and past workshops and creates detail pages dynamically from database content.

## Business workflow
1. Administrator signs in using the existing email OTP and authorised user allowlist.
2. Administrator uploads JPG, PNG or WebP poster (10 MB limit).
3. Server confirms file signature and uploads to the dedicated Supabase Storage bucket using the authenticated user session.
4. Where an AI API credential is configured, vision extraction returns title, date, time, venue, model, mentor, fee, contact numbers and a factual description. AI cannot invent missing facts.
5. Admin can correct extracted fields and preview their record. Publishing requires title, URL slug, description, date, venue, contact phone and image.
6. Admin selects Publish. Optional auto-publish mode publishes only when mandatory information passes validation; auto-publish is off by default during initial rollout.
7. Website renders /workshops and /workshops/[slug] from published database records, including the approved icon treatment for WhatsApp and phone calls.
8. The admin can revise and archive records without a code deployment.

## Roles and security
Group Administrators and existing authorised IPGC administrators may manage workshops. All write APIs re-check the authenticated Supabase JWT against ipgc.admin_users. Direct table access is revoked; security-definer RPCs enforce authorised access. Images are published via a dedicated public poster bucket with authorised upload policies. The project needs OPENAI_API_KEY in Vercel for AI poster analysis; the absence of this secret must not block manual workshop publishing.

## Data and audit
Tables: ipgc.workshops, ipgc.workshop_ai_extractions (reserved for extraction history), ipgc.workshop_publication_history. Audit the actor, action and snapshot for every save or status transition. Do not modify Shyama Samman data or permissions.

## Acceptance
- Workshop Manager accessible to authorised users only
- Existing Naughty Santa poster and data migrated
- Public workshop listing and slug pages dynamically populated
- Drafts invisible to public
- Safe edit/publish/archive operations
- Upload validation and type/size limits
- AI analysis reports explicit configuration error when unavailable
- No new code deployment needed for each workshop
- Existing website routes and Shyama Samman unaffected

## Deferred
Payments, attendance, participant registration, mentor directory, email broadcasts, multi-admin approval workflow and robust AI extraction audit persistence.
