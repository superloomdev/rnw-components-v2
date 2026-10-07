// Info: The fidelity census runs on its own, never inside `npm run batch` or
// `npm run verify`: it reports every difference, it does not gate. Same page
// settings as the gates.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /census\.spec\.js$/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 600000,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:5299', viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' },
  webServer: {
    command: 'node ../harness/serve.js',
    url: 'http://localhost:5299',
    reuseExistingServer: false,
    timeout: 60000
  }
});
