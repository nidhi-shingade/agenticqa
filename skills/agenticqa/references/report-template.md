# AgenticQA report: <TICKET-ID> <ticket title>

**Status:** Final report, internal QA use
**Ticket:** <link to Jira or Azure DevOps item>
**Branch:** qa/<TICKET-ID>-agenticqa
**Base commit:** <SHA>
**Environment:** <name and base URL>
**Run time:** <ISO 8601 timestamp>
**Suites run:** smoke, regression, accessibility
**Platforms:** desktop (Chromium, 1440x900), mobile (390x844)

## Summary

| Verdict | Count |
|---|---|
| Pass | 0 |
| Fail | 0 |
| Flaky | 0 |
| Not able to verify | 0 |

Overall result: <Pass | Fail | Blocked>. One sentence on the main finding.

## Per-acceptance-criterion verdicts

| AC | Restatement | Type | Desktop | Mobile | Evidence |
|---|---|---|---|---|---|
| AC-1 | | smoke | | | |
| AC-2 | | regression | | | |
| AC-3 | | a11y | | | |

## Suite results

| Suite | Platform | Total | Passed | Failed | Flaky | Skipped |
|---|---|---|---|---|---|---|
| Smoke | Desktop | | | | | |
| Smoke | Mobile | | | | | |
| Regression | Desktop | | | | | |
| Regression | Mobile | | | | | |
| Accessibility (WCAG 2.2 AA) | Desktop | | | | | |
| Accessibility (WCAG 2.2 AA) | Mobile | | | | | |

## Accessibility findings

| AC | Rule (axe ID) | Impact | Element | Remediation |
|---|---|---|---|---|

## Dynatrace correlation

| Signal | Baseline (24 h before run) | During run | Change |
|---|---|---|---|
| JavaScript exceptions | | | |
| Failed requests (5xx) | | | |
| Median page load | | | |

Trace IDs for failing requests: <list or "none">

## Defects found

For each defect:

- **Title:**
- **Linked AC:**
- **Steps to reproduce:**
- **Expected:**
- **Actual:**
- **Evidence:** screenshot path, trace path
- **Severity (proposed):**

## Flaky tests

| Test | Run 1 | Run 2 | Run 3 | Note |
|---|---|---|---|---|

## Not verified and why

- <item, reason, what is needed to verify>

## Open questions

- <question for the ticket owner or product owner>

## Artifacts

- Playwright HTML report: reports/<TICKET-ID>/playwright/index.html
- Screenshots: reports/<TICKET-ID>/screenshots/
- Traces: reports/<TICKET-ID>/playwright/traces/
- Draft ticket comment: reports/<TICKET-ID>/jira-comment.md
