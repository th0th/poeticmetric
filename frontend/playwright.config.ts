import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

require("dotenv").config({ path: "../.env" });

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  projects: [
    { name: "Google Chrome", retries: 0, use: { channel: "chrome" } },
    ...(process.env.PLAYWRIGHT_ALL_BROWSERS === "true" ? [
      { name: "chromium", use: { ...devices["Desktop Chrome"] } },
      { name: "firefox", use: { ...devices["Desktop Firefox"] } },
      { name: "webkit", use: { ...devices["Desktop Safari"] } }] : []
    ),
  ],
  reportSlowTests: null,
  reporter: "html",
  testDir: "./tests",
  timeout: 60000,
  use: {
    baseURL: process.env.FRONTEND_BASE_URL,
    trace: "on",
    video: "on",
  },
};

export default config;
