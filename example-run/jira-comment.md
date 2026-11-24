DRAFT: review and post manually. AgenticQA does not post to Jira or Azure DevOps.
SIMULATED EXAMPLE: values are invented to show the format.

Subject: QA pass for EXAMPLE-101: Fail

QA pass completed on branch qa/EXAMPLE-101-agenticqa against staging (base commit 3f9c2ab).

Results by acceptance criterion:
- AC-1 (forgot-password link opens reset form): Pass on desktop. Flaky on mobile (passed on retry 1).
- AC-2 (reset email within 120 seconds): Fail on desktop. Email arrived after 164 seconds, and one mail-send request returned 503 during that window. Evidence: reports/EXAMPLE-101/screenshots/AC-2-desktop-fail.png
- AC-3 (reset form keyboard operable): Pass on desktop. Fail on mobile: submit button contrast is 3.2:1 against the 4.5:1 minimum (WCAG 1.4.3, serious). Evidence: reports/EXAMPLE-101/screenshots/AC-3-mobile-fail.png
- AC-4 (reset link expires after 24 hours): Not able to verify. The test mailbox is not configured for this environment.

Suites: smoke 4 of 4 passed (1 flaky, mobile AC-1), regression 0 of 1 run passed (AC-2 failed on desktop, AC-4 not able to verify), accessibility 1 of 2 passed (serious contrast issue on mobile).

Defects raised: none yet. Reviewer to decide whether to create a defect for AC-2 (timing) and AC-3 (contrast).

Full report: reports/EXAMPLE-101/report.md
