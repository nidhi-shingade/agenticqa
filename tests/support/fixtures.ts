import { test as base, expect } from '@playwright/test';

/**
 * Shared test entry point. Import `test` and `expect` from here, not from
 * '@playwright/test', so every spec gets the same behavior.
 *
 * - Attaches a full-page screenshot to every test after it finishes, pass or fail,
 *   so each acceptance criterion has evidence in the report.
 */
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);
    try {
      const shot = await page.screenshot({ fullPage: true });
      await testInfo.attach('screenshot', { body: shot, contentType: 'image/png' });
    } catch {
      // The page may already be closed if the test crashed. The report still records the failure.
    }
  },
});

export { expect };
