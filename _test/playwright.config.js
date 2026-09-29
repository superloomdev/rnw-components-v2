// Info: Browser gates. Settings are unconditional (no CI branch): a gate
// behaves identically locally and in CI.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /\.spec\.js$/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  reporter: [['list'], ['json', { outputFile: 'test-results/browser.json' }]],
  use: { baseURL: 'http://localhost:5299', viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' },
  webServer: {
    command: 'node harness/serve.js',
    url: 'http://localhost:5299',
    reuseExistingServer: false,
    timeout: 60000
  }
});
