# AgenticQA

A Claude Code skill, `/agenticqa`, that runs an end-to-end QA pass for one existing test or bug ticket from Jira or Azure DevOps.

One command runs the full pass on an isolated branch: it reads the ticket, decomposes acceptance criteria, generates and runs Playwright tests for smoke, regression, and accessibility (WCAG 2.2 AA) on desktop and mobile, correlates failures with Dynatrace, and writes a per-AC report plus a draft ticket comment.

## Pipeline

| Step | What happens |
|---|---|
| 0. Branch | Cuts `qa/<TICKET-ID>-agenticqa` from the latest base branch. Never pushes or merges. |
| 1. Analyze | Reads the ticket (read-only), decomposes acceptance criteria, builds a coverage map, and takes a Dynatrace baseline. |
| 2. Generate | One Playwright spec per acceptance criterion, tagged `@smoke`, `@regression`, or `@a11y`. |
| 3. Run | Smoke first, then the selected suites, headed desktop and mobile. Screenshot per AC, flake re-check. |
| 4. Report | Per-AC verdict (Pass, Fail, Not able to verify) with evidence and Dynatrace correlation. |
| 5. Draft comment | Writes a DRAFT Jira or Azure DevOps comment. A person reviews and posts it. |

## Repository layout

```
skills/agenticqa/
  SKILL.md                              the skill definition
  references/
    ac-decomposition.md                 how acceptance criteria become atomic checks
    report-template.md                  full test report template
    jira-ado-comment-template.md        draft ticket comment template
    connectors.md                       Jira, Azure DevOps, GitHub, Dynatrace setup (read-only)
```

## Install

Copy the skill into your Claude Code skills folder:

```bash
mkdir -p ~/.claude/skills && cp -R skills/agenticqa ~/.claude/skills/
```

Then configure the connectors in `references/connectors.md` and run:

```bash
/agenticqa PROJ-123 --suite all --platform both
```

## Guardrails

- Ticket reads are read-only. Nothing is written to Jira, Azure DevOps, or Dynatrace.
- Nothing is pushed, committed to a shared branch, or merged.
- Comments are drafts only.
- Credentials are never stored in the repository.
- Client Confidential data and PII are not processed without a confirmed data processing agreement or written client consent.

## Test project

Playwright scaffolding lives at the repo root:

```
playwright.config.ts          desktop (1440x900) and mobile (390x844) projects, screenshots on every test
tests/support/fixtures.ts     shared test/expect entry point, attaches a screenshot per test
tests/support/a11y.ts         axe checks for WCAG 2.2 AA with violations attached to the report
tests/support/env.ts          fails fast when required environment variables are missing
tests/templates/              AC spec template (never executed)
.env.example                  required variables; copy to .env and fill in from the team vault
```

Setup:

```bash
npm install
npm run install:browsers
cp .env.example .env
```

Run:

```bash
AGENTICQA_TICKET=PROJ-123 npm run test:smoke
AGENTICQA_TICKET=PROJ-123 npm run test:regression
AGENTICQA_TICKET=PROJ-123 npm run test:a11y
```

Reports are written to `reports/<TICKET>/playwright/`. The `reports/` folder is git-ignored.

## Status

Skill definition, templates, and Playwright scaffolding are in place. Ticket-specific specs are generated per run by the skill.
