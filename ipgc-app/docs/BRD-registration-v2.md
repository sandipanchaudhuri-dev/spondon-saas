# Business Requirements Document — Indian Festival Events Registration (IPGC Shyama Samman 2026)
Version: 2.0 | 21 October 2026 | Scope: registration MVP only
Status: implementation baseline; no assumption that untested additions are production verified.

## 1. Ownership and purpose
Indian Festival is the event registration, photography, judging and publication operator. IPGC independently owns its website and business operations and co-presents the Kolkata Shyama Samman 2026 event. IPGC requires a branded public registration page and access to authorised registration reports; it does not need a separate judging stack or database.
The Indian Festival Pujo Quest Supabase project is the canonical system for event participation, judging and public approved media. IPGC website routes, branding and domain remain independent. Backend ownership and infrastructure URLs must not appear unnecessarily in public IPGC UI, but accurate privacy and processor disclosures are mandatory.

## 2. Event model
Year: 2026; festival: Kali Pujo; event: IPGC Shyama Samman; chapter: Kolkata; canonical event key: `ipgc-shyama-samman-2026-kolkata`.
This must coexist with existing Durga Pujo / Sera Pujo chapter workflows and permit future distinct Kali Pujo awards and separately branded Indian Festival Kartik Pujo event(s).
No modification to existing Sera Pujo registration, jury, scoring, field-visit, award or media production tables is part of this feature. Event-specific records may later be matched to `public.pujos` without automatically rewriting canonical entries.

## 3. Public experience
Own Vercel project; exact approved IPGC Shyama Samman hero and branding. Registration entry on current `/register`, eventual public `https://ipgc.in/shyama-samman/2026/register` after domain coordination, without disrupting current ipgc.in website.
Required: committee/club name, locality, city/district, full venue address, valid email, primary contact name and unique Indian mobile/WhatsApp number, secondary contact name and distinct Indian mobile/WhatsApp number, and acceptance of the published rules/privacy policy.
Optional: Puja name, establishment year (1800–2026), postal code, HTTPS map link, theme, theme artist, idol artist, and third name + Indian mobile/WhatsApp (both required if third contact is added). No designation field. Mobile-friendly short form; no mandatory photo upload; confirmation with stable registration reference; duplicate check flags review rather than silently rejecting valid submissions.

## 4. Backend and security
Dedicated event-linked registration and private contact storage within Pujo Quest; strict direct-table restrictions and RLS; one validated transactional server/RPC submission; idempotency token; server-side field validation; honeypot and meaningful rate-limiting before opening for general public.
Write accepted rules version, SHA-256 hash, privacy version and acceptance timestamp. Store official event policy as versioned text. Never expose contact details through public event, listing, media or result APIs. Admin reads only under explicitly authorised event-scoped permission; audited export; no blanket access inherited from unrelated PujoVerse roles.
Use least privilege: avoid service-role keys in the browser. Permit integration into existing canonical Puja and judging structure in Phase 2 only after event-specific review and verification.

## 5. Rules and privacy
Adopt IPGC-adapted Sera Pujo policy for Kali Pujo with no expired Durga Pujo dates and correct organiser. Draft retention: 24 months for operational contacts/private submissions after results and 7 years for scoring/audit records; require event-owner approval before publishing. Privacy must accurately disclose Indian Festival/PujoVerse event administration and relevant processing; do not state that client is completely unaware of material data processing.
Registration stays closed until an approved policy and its hash are published.

## 6. Reporting
Indian Festival manages event data and can give IPGC event-only CSV/reporting without unrelated private entries. Future publication of approved results, galleries and photographs on both websites is explicitly out of scope of this registration MVP.

## 7. Acceptance criteria
- Same IPGC site layout/hero and two mandatory WhatsApp-labelled contacts; third optional; email mandatory; designation absent.
- Valid entries create exactly one registration per idempotency token and store contacts/consent/audit atomically; duplicate candidates flagged.
- Invalid email, invalid/duplicate mobile, missing mandatory fields, invalid consent or closed event are rejected without partial writes.
- Event isolation: cannot browse records for other award programmes.
- Admin authorised event-only export; unauthorised attempts denied; production data and other modules unaffected.
- End-to-end tested on the deployed host before enabling public submission; verified Vercel build, HTTPS and approved final URL.

## 8. Non-goals and constraints
No destructive change to Pujo Quest or Sandipan SaaS. No changes to Sera Pujo 2026 production workflows. Do not turn on future event judging/publishing prematurely. `ipgc.in` DNS is owned separately and must not be switched without inspecting existing records and explicit release scheduling.
Infrastructure choices and multi-event extensions must not lengthen the registration form.
