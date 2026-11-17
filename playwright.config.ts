import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4413', screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm run preview -- --ignore-lock --host 127.0.0.1 --port 4413',
    url: 'http://127.0.0.1:4413',
    reuseExistingServer: false,
  },
});
