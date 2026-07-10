import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.WORKSTREAM_FRONTEND_URL ?? "http://127.0.0.1:5173";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "chromium-tablet",
      use: {
        browserName: "chromium",
        viewport: { width: 1024, height: 768 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: true,
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
      },
    },
  ],
});
