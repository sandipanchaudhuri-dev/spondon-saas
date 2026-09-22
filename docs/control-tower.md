# Control Tower webhook module

This is a server-only orchestration module hosted inside the Spondon Next.js deployment.

## Isolation guarantees

- No Spondon page imports this module.
- No navigation or public UI links point to it.
- No Spondon registration/admin tables are used.
- No PujoVerse production credentials are required.
- GitHub remains the canonical work-package/thread store.

## Endpoint

POST /api/control-tower/github

Accepted GitHub events: issue_comment.created for these first-line banners:

- ## CoS RESULT PACKET
- ## CoS STAGE2 ACTIVE
- ## CoS STAGE2 BLOCKED_SETUP
- ## CoS BLOCKED_OWNER

The route verifies X-Hub-Signature-256, restricts events to CONTROL_TOWER_TARGET_REPO, deduplicates by source comment id, asks the OpenAI Responses API for the CT decision, posts the CT response to the same GitHub issue, and updates the lifecycle label when applicable.

## Required Vercel environment variables

- CONTROL_TOWER_GITHUB_WEBHOOK_SECRET
- CONTROL_TOWER_GITHUB_TOKEN — fine-grained token with Issues read/write on the orchestration repository
- CONTROL_TOWER_OPENAI_API_KEY
- CONTROL_TOWER_TARGET_REPO — default: sandipanchaudhuri-dev/indian-festival-apps
- CONTROL_TOWER_MODEL — optional, default: gpt-5.6-terra

Never expose these values in GitHub comments, client-side code, or logs.

## Health

GET /api/control-tower/github reports only whether required secrets are configured. It never returns secret values.
