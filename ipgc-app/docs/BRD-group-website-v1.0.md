# IPGC Website — Business Requirements Document

Version 1.0 | Draft for approval | 18 November 2026

## 1. Purpose
Reposition ipgc.in as the unified website for Inclusion Portfolios Glamour Consortium (IPGC), led by Founder & Group President Mr. Sourav Mukherjee. Preserve the existing Shyama Samman operation while supporting the wider group.

## 2. Group structure
IPGC parent brand provides photography and workshops/masterclasses. Its four units are INCLUSÉA® Magazine, IPGC Festival Excellence Awards, IPGC প্রদর্শনী® — The Exhibition, and IPGC Welfare Volunteers’ Committee. The supplied organisational artwork is the authority for brand names and hierarchy, not a mandatory page design.

## 3. Navigation
Home; About IPGC; Photography; Academy; INCLUSÉA; Festival Awards; প্রদর্শনী; Welfare; Contact. Each unit has a distinct landing page and identity under the parent domain. Mobile navigation must retain all destinations.

## 4. Functional requirements
| ID | Requirement | Priority |
|---|---|---|
| BR-01 | Corporate homepage, founder profile, group units, featured work, announcements, active registrations | P0 |
| BR-02 | Fashion, portrait, boudoir, fine arts, lifestyle, bridal, corporate and events photography portfolios and enquiries | P0 |
| BR-03 | Workshops and masterclasses, mentor profiles, schedules, registration and past galleries | P1 |
| BR-04 | INCLUSÉA magazine editions, archive, editorials, contributor submissions and advertising enquiries | P0 landing; P1 submissions |
| BR-05 | Festival Excellence Awards landing covering IPGC Sharod Samman, IPGC Sharod Shringaar, IPGC Shyama Samman, IPGC Bidyang Dehi and IPGC Basanta Utsav | P0 |
| BR-06 | Reusable year-wise competition management: registration, verification, participant identity, photo submission, field visits, shortlisting, jury scoring, decision console, results, communications, archives, sponsors | P0 preserve existing; P1 expand |
| BR-07 | International photography and painting exhibitions accepting all genres: exhibition listings, artwork submissions, artist profiles, rules, jury, selection, gallery, awards and certificates | P0 landing; P1 workflow |
| BR-08 | Welfare committee, initiatives, volunteer registration, activity reports, galleries, partnership enquiries | P0 landing; P1 workflow |
| BR-09 | Shared content management for pages, media, events, announcements, partners and publication status | P0 |
| BR-10 | Scoped administrative roles, audit history and access control by unit and programme | P0 |
| BR-11 | Shared enquiry routing, transactional emails, configurable contacts and templates | P0 |
| BR-12 | Public search, event archive, SEO metadata, social sharing | P1 |

## 5. Shared platform model
Group → Unit → Programme/service → Edition/event → Content, participants, submissions, awards. Identity, content, media, notifications and roles are shared platform capabilities, while festival judging, editorial publishing, exhibition selection and welfare volunteering retain distinct workflows. The same person may hold multiple scoped roles. Past editions remain accessible after closure. Avoid duplicating registration systems per programme.

## 6. Users and governance
Public visitor, registered participant, artist/contributor, volunteer, group administrator, unit administrator, content editor, programme administrator, field contributor and jury (where applicable). Group administrators oversee group-level settings; lower roles access only assigned scopes. Draft, review, publish, archive states apply to public content. Results and private judging scores must have separate visibility. Audit all privileged changes.

## 7. Experience and brand requirements
Premium editorial visual language suitable for a photography-led group; use authorised brand assets without redraw. Each unit retains its identity within a consistent navigation and design system. Prioritise photography, readable typography, responsive layouts, accessibility, meaningful alt text, and optimised media. The red-and-silver organisational artwork is a brand reference, not a requirement to reproduce ornamental borders on every page.

## 8. Non-functional requirements
Responsive mobile-first site; secure authentication and least-privilege authorization; HTTPS; input validation; spam protection; private storage for non-public submissions; documented consent and retention policies; backups and tested recovery; monitoring; accessible forms; SEO-friendly URLs; performance budgets and image optimisation. Confirm measurable service targets during technical design.

## 9. Migration and transition
Inventory current IPGC pages, routes, registrations, participants, media, jury roles, scores, results and communication history before implementation. Preserve existing records, operational access and historical results. Maintain existing URLs or provide redirects. Test on staging and obtain sign-off before production cutover. No database deletion or replacement is authorised by this document.

## 10. Delivery phases
**Phase 1:** Group homepage, navigation, four unit landing pages, services, about, contact, shared CMS and existing Shyama Samman continuity. **Phase 2:** Extend common competition framework to other awards; exhibition submission and selection; magazine archive and editorial workflows; volunteer and academy registration. **Phase 3:** Approved monetisation, analytics, automation, digital certificates and subscriptions. Payments, donations, paid memberships and subscriptions require separate business approval.

## 11. Acceptance criteria
- All four units have correct brand names, landing pages and navigation.
- Existing Shyama Samman public and administrative functions continue without data loss.
- Visitors can discover services, programmes, editions and the correct contact channel.
- Administrators can manage approved content without code changes and cannot access unauthorized scopes.
- Forms validate inputs, show clear errors and issue confirmation without duplicate submissions.
- Public pages work on mobile and desktop; private submissions and scores are not exposed.
- Production rollout follows documented verification and business-owner approval.

## 12. Decisions required
Confirm final menu labels; approved logos and visual direction; unit owners and publishing approvals; existing technology and integration inventory; exact competition rules per programme; magazine distribution model; workshop and exhibition fee policies; volunteer and donation policies; privacy and retention requirements; domain/URL conventions and implementation priorities.

## 13. Approval
Business owner: Mr. Sourav Mukherjee (proposed approver). Technical owner: to be confirmed. This BRD is a scope baseline for review, not authorization to implement or deploy.
