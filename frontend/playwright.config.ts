import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

require("dotenv").config({ path: "../.env" });

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Google Chrome", retries: 0, use: { channel: "chrome" } },
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
