import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  reporter: "html",
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests",
  timeout: 30000,
  use: {
    actionTimeout: 0,
    baseURL: process.env.FRONTEND_BASE_URL,
    trace: "on-first-retry",
  },
  workers: 1,
};

export default config;
