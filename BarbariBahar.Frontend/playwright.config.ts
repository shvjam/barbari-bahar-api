import { defineConfig, devices } from '@playwright/test';

/**
 * Read about configuring Playwright config in:
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // The directory where tests are located
  testDir: './tests/ui',

  // Timeout for each test in milliseconds
  timeout: 30 * 1000, // 30 seconds

  // Browser configurations
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true, // Ensure running headless in CI
      },
    },
    // You can add more projects for firefox and webkit if needed
  ],

  // Local Server configuration
  webServer: {
    command: 'npm run dev', // Command to start the application
    url: 'http://localhost:5173', // Vite's default port
    timeout: 120 * 1000, // 2 minutes for the server to start
    reuseExistingServer: !process.env.CI, // Reuse server only in local environment
  },

  // ... other settings
});
