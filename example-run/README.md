# Example run: what AgenticQA output looks like

This folder shows the outputs of one simulated `/agenticqa` run so you know what to expect. The ticket (EXAMPLE-101), application, URLs, timings, and Dynatrace numbers are all invented. No real system was called, and no screenshots are included.

Use this folder as a reference when you review a real run. The three suites were run separately, as the skill does (smoke first, then regression and accessibility). Real output lands in `reports/<TICKET-ID>/`, which is git-ignored.

## Files

| File | What it is | Where it appears in a real run |
|---|---|---|
| [console-output.txt](console-output.txt) | Terminal output from the Playwright list reporter during Step 3 | Printed to your terminal |
| [report.md](report.md) | Full QA report with per-AC verdicts, evidence, and Dynatrace correlation | `reports/<TICKET-ID>/report.md` |
| [jira-comment.md](jira-comment.md) | Draft ticket comment for a person to review and post | `reports/<TICKET-ID>/jira-comment.md` |

Real runs also produce `reports/<TICKET-ID>/playwright/index.html` (the interactive Playwright HTML report), `results.json`, screenshots, and traces. Those are binary or large and are not included here.

## How to read a verdict

- **Pass:** the executed test met the criterion, with a screenshot as evidence.
- **Fail:** the test ran and observed behavior did not match the criterion. The report gives the observed value and the evidence path.
- **Flaky:** the test failed, then passed on a retry. This is a risk to investigate, never a Pass.
- **Not able to verify:** the test could not run or check the criterion. The report states the blocker.

The overall result is Fail if any criterion failed, Blocked if smoke failed and stopped the run, and Pass otherwise.
