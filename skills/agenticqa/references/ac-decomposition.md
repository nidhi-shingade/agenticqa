# Acceptance criteria decomposition

Use this when converting a ticket into the atomic checklist in Step 1.

## Rules

1. One behavior per item. "User can log in and see the dashboard" becomes two items.
2. One pass/fail condition per item. If the criterion has "and", "or", or "within", split it unless the condition is a single measurable outcome.
3. Give each item an ID in the form `AC-<n>`, numbered in the order the ticket states them. Keep IDs stable across re-runs.
4. Keep the ticket's wording in the item and add a one-line testable restatement beneath it.
5. Mark the test type: `smoke`, `regression`, or `a11y`. A criterion can carry more than one.
6. Record preconditions (role, data, feature flag) and the environment needed.
7. If a criterion is ambiguous, record the ambiguity as an open question. Do not guess the expected behavior and mark it Pass.

## Example

Ticket text: "Customers can reset their password from the sign-in page. The reset email arrives within 2 minutes. The form is operable by keyboard."

| ID | Source text | Testable restatement | Type |
|---|---|---|---|
| AC-1 | Customers can reset their password from the sign-in page | Clicking "Forgot password" on sign-in opens the reset form | smoke |
| AC-2 | The reset email arrives within 2 minutes | Reset email is received within 120 seconds of submit (test mailbox) | regression |
| AC-3 | The form is operable by keyboard | Tab order reaches every field and the submit button; Enter submits | a11y |

## Coverage check

Before generating tests, confirm that every AC has at least one spec and that every spec maps to an AC. Any orphan spec is removed or justified in the report.
