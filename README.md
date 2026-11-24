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

## Status

Skill definition and templates only. Test project scaffolding (Playwright config, page objects, axe helpers) is not included yet.
