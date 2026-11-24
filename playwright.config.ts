import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for AgenticQA.
 *
 * Environment variables (see .env.example):
 *   QA_BASE_URL          Base URL of the environment under test (required).
 *   AGENTICQA_TICKET     Ticket ID used to name the report folder, e.g. PROJ-123.
 *   AGENTICQA_HEADED     Set to "1" to run headed on desktop (the skill default).
 */
const ticket = process.env.AGENTICQA_TICKET ?? 'unassigned';
const reportDir = `reports/${ticket}`;

export default defineConfig({
  testDir: 'tests',
  // Templates are reference material and never run.
  testIgnore: ['**/templates/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Two retries let a flaky test pass on re-run. Playwright reports those as "flaky",
  // which the skill treats as a risk, never a Pass.
  retries: 2,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  outputDir: `${reportDir}/playwright/test-results`,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${reportDir}/playwright`, open: 'never' }],
    ['json', { outputFile: `${reportDir}/playwright/results.json` }],
  ],

  use: {
    baseURL: process.env.QA_BASE_URL,
    // Screenshot for every test, pass or fail, so each AC has evidence.
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        headless: process.env.AGENTICQA_HEADED !== '1',
      },
    },
    {
      // iPhone 13 is 390x844 with touch enabled, matching the skill's mobile profile.
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
    },
  ],
});
