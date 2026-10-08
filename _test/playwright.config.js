// Info: Browser gates. Settings are unconditional (no CI branch): a gate
// behaves identically locally and in CI.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /\.spec\.js$/,
  // The census reports, it does not gate; it runs on its own config
  testIgnore: /census\//,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  reporter: [['list'], ['json', { outputFile: 'test-results/browser.json' }]],
  // Text is rasterized the same on every OS: grayscale antialiasing (Linux
  // Chromium otherwise draws colored subpixel fringes) and no hinting (macOS
  // never hints), so a pixel gate compares components, not font rasterizers
  use: {
    baseURL: 'http://localhost:5299',
    viewport: { width: 1280, height: 720 },
    reducedMotion: 'reduce',
    launchOptions: { args: ['--disable-lcd-text', '--font-render-hinting=none'] }
  },
  webServer: {
    command: 'node harness/serve.js',
    url: 'http://localhost:5299',
    reuseExistingServer: false,
    timeout: 60000
  }
});
