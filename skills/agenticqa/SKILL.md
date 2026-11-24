---
name: agenticqa
description: End-to-end QA pipeline for an existing test or bug ticket from Jira or Azure DevOps. Cuts an isolated branch, decomposes acceptance criteria, generates and runs Playwright tests (smoke, regression, accessibility), correlates failures with Dynatrace, and drafts a per-AC report and ticket comment. Never pushes, merges, or posts to any system. Use when the user runs /agenticqa or asks to QA, test, or verify a ticket.
---

# AgenticQA

Run a full QA pass for one ticket: read the ticket, turn its acceptance criteria into tests, run them on desktop and mobile, check Dynatrace for runtime errors, and produce a report plus a draft comment for the ticket. A human reviews and posts the comment.

## Invocation

```
/agenticqa <TICKET-ID> [--suite smoke|regression|a11y|all] [--target <base-url>] [--platform desktop|mobile|both]
```

Defaults: `--suite all`, `--platform both`. `--target` falls back to `QA_BASE_URL` from the project's `.env.example` values. Ticket source is detected from the ID: Jira keys look like `PROJ-123`, Azure DevOps IDs are numeric or given as `ado:<id>`.

## Guardrails (apply at every step)

- Ticket reads are read-only. Never create, update, transition, or comment on a Jira or Azure DevOps item from this skill.
- Never push, commit to a shared branch, or merge. Work only on the isolated `qa/<TICKET-ID>-agenticqa` branch. Local commits on that branch are allowed; pushing is not.
- Never write the Jira or Azure DevOps comment. Save it to `reports/<TICKET-ID>/jira-comment.md` for the reviewer to post.
- Never put credentials, API keys, tokens, or connection strings in specs, reports, or logs. Read secrets from environment variables or the team vault.
- Before sending ticket text, logs, or page content to any connector, check for PII, PHI, personnel records, or client Confidential data. If found, stop and ask for removal or anonymization. Do not proceed on client Confidential data without written client consent for AI-assisted processing.
- Evidence must be real: a screenshot per acceptance criterion from an actual run. Do not mark a criterion Pass without executed evidence.

## Step 0: Branch

1. Confirm the working tree is a git repository and the base branch (default `development`, override with `AGENTICQA_BASE_BRANCH`) exists on `origin`.
2. Run `git fetch origin` and create the branch from the latest base: `git switch -c qa/<TICKET-ID>-agenticqa origin/<base>`.
3. If the branch already exists, switch to it and rebase onto the latest base only after confirming with the user.
4. Record the base commit SHA in the report header.

## Step 1: Analyze

1. Read the ticket through the Jira or Azure DevOps connector (see `references/connectors.md`). Capture title, type (test or bug), steps to reproduce, expected and actual results, linked items, attachments, and acceptance criteria.
2. Decompose acceptance criteria into an atomic checklist using `references/ac-decomposition.md`. Each item must be one observable behavior with one pass/fail condition.
3. Build a coverage map: AC ID to test type (smoke, regression, accessibility), target page or flow, and the spec file that will hold it.
4. For a bug ticket, also write a reproduction test that fails on the current build before any fix is considered.
5. Query Dynatrace for the affected application over the last 24 hours: error rate, JavaScript exceptions, and failing requests for the pages in scope. Store the aggregates as a baseline. Do not store raw user data.

## Step 2: Generate

1. Write one Playwright spec per acceptance criterion under `tests/agenticqa/<TICKET-ID>/`. File name pattern: `AC-<n>.<slug>.spec.ts`.
2. Tag each test: `@smoke` for critical-path checks, `@regression` for behavior that must not change, `@a11y` for accessibility checks.
3. Locate elements by role, label, or stable `data-testid`, in that order. Avoid CSS chains and XPath.
4. Reuse existing page objects and fixtures in `tests/` before creating new ones. Put new shared helpers in `tests/support/`.
5. Accessibility checks run `@axe-core/playwright` against WCAG 2.2 AA, plus keyboard-only navigation and focus visibility for the criterion's controls.
6. Read credentials from environment variables only.

## Step 3: Run

1. Run smoke first. If smoke fails, stop the regression run and report the failure with evidence. Mark the blocked criteria as Not able to verify, with the reason.
2. Run each selected suite on the platforms requested:
   - Desktop: headed Chromium (`--headed`), 1440x900.
   - Mobile: the Playwright mobile device profile, 390x844, touch enabled.
3. Take a screenshot for every AC, pass or fail, and attach it to the report.
4. Flake check: re-run each failing test up to two times. A test that passes on a retry is marked Flaky with both run results, not Pass.
5. Save the Playwright HTML report and traces under `reports/<TICKET-ID>/playwright/`.

## Step 4: Report

Write `reports/<TICKET-ID>/report.md` using `references/report-template.md`. It must include:

- Summary: ticket ID, title, base SHA, branch, environment, run time, and counts by verdict.
- Per-AC verdict: Pass, Fail, or Not able to verify, with evidence links and the screenshot path.
- Suite results: smoke, regression, and accessibility, desktop and mobile.
- Dynatrace correlation: errors and failing requests during the run compared with the baseline, with trace IDs where available.
- Defects found, with reproduction steps.
- Open questions and anything not tested, with the reason.

Verdict rules: Fail requires an observed failure. Not able to verify requires a stated blocker, such as environment down, missing test data, or missing access. Flaky counts as a risk, never a Pass.

## Step 5: Draft the ticket comment

Write `reports/<TICKET-ID>/jira-comment.md` (or the Azure DevOps equivalent) using `references/jira-ado-comment-template.md`. Keep it short: overall result, per-AC verdict list, links to the report and evidence, and any blockers. Mark the file as DRAFT at the top. Tell the user to review and post it themselves. Never post it.

## Final message to the user

State the overall result, the count of each verdict, the report path, the draft comment path, and the branch name. List anything not verified and why.
