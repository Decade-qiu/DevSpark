import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    storageState: "tests/e2e/storageState.json",
  },
  webServer: [
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
    {
      command: "cd ../backend && ./gradlew bootRun",
      url: "http://127.0.0.1:8080",
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
  ],
});
