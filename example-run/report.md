# AgenticQA report: EXAMPLE-101 Password reset from the sign-in page

> **SIMULATED EXAMPLE.** Every value below is invented to show the report format. It is not from a real system.

**Status:** Final report, internal QA use
**Ticket:** https://example.atlassian.net/browse/EXAMPLE-101 (placeholder)
**Branch:** qa/EXAMPLE-101-agenticqa
**Base commit:** 3f9c2ab
**Environment:** staging, https://staging.example.com
**Run time:** 2025-06-01T10:00:00Z
**Suites run:** smoke, regression, accessibility
**Platforms:** desktop (Chromium, 1440x900), mobile (390x844)

## Summary

Counts are per acceptance criterion, using the worst result across platforms.

| Verdict | Count |
|---|---|
| Pass | 0 |
| Fail | 2 |
| Flaky | 1 |
| Not able to verify | 1 |

Overall result: **Fail**. The reset email arrived after the 120-second limit on desktop, and the reset form has a serious colour-contrast violation on mobile.

## Per-acceptance-criterion verdicts

| AC | Restatement | Type | Desktop | Mobile | Evidence |
|---|---|---|---|---|---|
| AC-1 | "Forgot password" on sign-in opens the reset form | smoke | Pass | Flaky (passed on retry 1) | reports/EXAMPLE-101/screenshots/AC-1-desktop.png |
| AC-2 | Reset email is received within 120 seconds of submit | regression | Fail (164 s) | Not run | reports/EXAMPLE-101/screenshots/AC-2-desktop-fail.png |
| AC-3 | Reset form is keyboard operable | a11y | Pass | Fail (color-contrast) | reports/EXAMPLE-101/screenshots/AC-3-mobile-fail.png |
| AC-4 | Reset link expires after 24 hours | regression | Not able to verify | Not able to verify | Skipped: test mailbox access is not configured |

**Note on AC-2 mobile:** the regression suite ran on desktop only for this run, so mobile was not executed for AC-2. The report records it as Not run rather than Pass.

## Suite results

| Suite | Platform | Total | Passed | Failed | Flaky | Skipped |
|---|---|---|---|---|---|---|
| Smoke | Desktop | 2 | 2 | 0 | 0 | 0 |
| Smoke | Mobile | 2 | 1 | 0 | 1 | 0 |
| Regression | Desktop | 2 | 0 | 1 | 0 | 1 |
| Regression | Mobile | 1 | 0 | 0 | 0 | 1 |
| Accessibility (WCAG 2.2 AA) | Desktop | 1 | 1 | 0 | 0 | 0 |
| Accessibility (WCAG 2.2 AA) | Mobile | 1 | 0 | 1 | 0 | 0 |

Regression on mobile covers only AC-4 (skipped). AC-2 was scoped to desktop for this run. Smoke ran first and did not fail, so the regression and accessibility suites were executed.

## Accessibility findings

| AC | Rule (axe ID) | Impact | Element | Remediation |
|---|---|---|---|---|
| AC-3 (mobile) | color-contrast | serious | `button[type=submit]` on the reset form, contrast 3.2:1 against the 4.5:1 minimum | Darken the button label or background to reach at least 4.5:1 for normal text |

## Dynatrace correlation

| Signal | Baseline (24 h before run) | During run | Change |
|---|---|---|---|
| JavaScript exceptions | 2 per hour | 3 in 42 minutes | Within normal range |
| Failed requests (5xx) | 0.1% | 0.4% | Up. Concentrated on the mail-send endpoint |
| Median page load | 1.8 s | 2.0 s | +0.2 s |

Trace IDs for failing requests: `a1b2c3d4e5f60718` (mail-send endpoint, 503 at 10:17:42Z)

The 5xx spike on the mail-send endpoint lines up with the AC-2 timing failure. The likely cause is queue delay on the mail service, to be confirmed by the application team.

## Defects found

**Defect 1: reset email arrives late**
- **Linked AC:** AC-2
- **Steps to reproduce:** Sign in page, Forgot password, enter the test account email, submit. Record time until the email is received in the test mailbox.
- **Expected:** Email arrives within 120 seconds.
- **Actual:** Email arrived after 164 seconds. One mail-send request returned 503 during the window.
- **Evidence:** reports/EXAMPLE-101/screenshots/AC-2-desktop-fail.png, trace a1b2c3d4e5f60718
- **Severity (proposed):** Major

**Defect 2: reset form submit button fails colour contrast on mobile**
- **Linked AC:** AC-3
- **Steps to reproduce:** Open the reset form on a 390x844 viewport and run the axe scan.
- **Expected:** Contrast of at least 4.5:1 for normal text (WCAG 1.4.3).
- **Actual:** 3.2:1.
- **Evidence:** reports/EXAMPLE-101/screenshots/AC-3-mobile-fail.png
- **Severity (proposed):** Minor (accessibility, serious axe impact)

## Flaky tests

| Test | Run 1 | Run 2 | Run 3 | Note |
|---|---|---|---|---|
| AC-1 forgot-password link (mobile) | Failed (element not yet visible) | Passed | n/a | Investigate the animation wait before the link is clickable |

## Not verified and why

- **AC-4, reset link expires after 24 hours.** Requires read access to the test mailbox and the ability to advance or inspect link timestamps. Neither is configured for this environment. Needed: a test mailbox connector and a seeded reset token with a known issue time.
- **AC-2 on mobile.** Not run in this pass because the regression suite was scoped to desktop. Needed: rerun with `--platform both`.

## Open questions

- Is the 120-second limit a hard requirement or a target? The ticket does not say.
- Should AC-2 be run on mobile as part of the standard regression set?

## Artifacts

- Playwright HTML report: reports/EXAMPLE-101/playwright/index.html
- Screenshots: reports/EXAMPLE-101/screenshots/
- Traces: reports/EXAMPLE-101/playwright/test-results/
- Draft ticket comment: reports/EXAMPLE-101/jira-comment.md
