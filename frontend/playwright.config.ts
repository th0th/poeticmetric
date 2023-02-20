import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

require("dotenv").config({ path: "../.env" });

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Google Chrome", use: { channel: "chrome" } },
  ],
  reportSlowTests: null,
  reporter: "html",
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests",
  timeout: 30000,
  use: {
    actionTimeout: 0,
    baseURL: process.env.FRONTEND_BASE_URL,
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
};

export default config;
