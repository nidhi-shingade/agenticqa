import { Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';

/** WCAG 2.2 Level AA rule set, per the AgenticQA accessibility standard. */
const WCAG_22_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export interface A11yOptions {
  /** CSS selectors to leave out of the scan, for example third-party widgets. Use sparingly and note why. */
  exclude?: string[];
  /** Restrict the scan to these selectors. Omit to scan the full page. */
  include?: string[];
}

/**
 * Runs axe against the current page for WCAG 2.2 AA and fails the test if any
 * violation is found. The full violation list is attached to the test report.
 */
export async function checkAccessibility(page: Page, testInfo: TestInfo, options: A11yOptions = {}) {
  let builder = new AxeBuilder({ page }).withTags(WCAG_22_AA_TAGS);
  for (const selector of options.include ?? []) builder = builder.include(selector);
  for (const selector of options.exclude ?? []) builder = builder.exclude(selector);

  const results = await builder.analyze();
  const summary = formatViolations(results.violations);

  await testInfo.attach('axe-violations.json', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  if (results.violations.length > 0) {
    throw new Error(`Accessibility violations found (WCAG 2.2 AA):\n${summary}`);
  }
}

function formatViolations(violations: Result[]): string {
  if (violations.length === 0) return 'none';
  return violations
    .map((v) => `- [${v.impact ?? 'unknown'}] ${v.id}: ${v.help} (${v.nodes.length} element(s)) ${v.helpUrl}`)
    .join('\n');
}
