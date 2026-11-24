/**
 * Template for one acceptance criterion. Copy to tests/agenticqa/<TICKET-ID>/AC-<n>.<slug>.spec.ts
 * and replace the placeholders. This file lives under templates/ and is never executed.
 *
 * Tags: @smoke for critical path, @regression for behavior that must not change,
 * @a11y for accessibility checks. A criterion can carry more than one tag.
 */
import { test, expect } from '../support/fixtures';
import { checkAccessibility } from '../support/a11y';

test.describe('AC-1: <restatement of the criterion>', () => {
  test('@smoke @regression AC-1 <observable behavior>', async ({ page }) => {
    await page.goto('/<path-under-test>');

    // Locate by role or label first, then data-testid. Avoid CSS chains and XPath.
    await page.getByRole('button', { name: '<button name>' }).click();

    await expect(page.getByRole('heading', { name: '<expected heading>' })).toBeVisible();
  });

  test('@a11y AC-1 accessibility of <page or control>', async ({ page }, testInfo) => {
    await page.goto('/<path-under-test>');
    await checkAccessibility(page, testInfo);
  });
});
