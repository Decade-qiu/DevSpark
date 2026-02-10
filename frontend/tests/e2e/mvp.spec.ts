import { test, expect } from "@playwright/test";

test("user can go from feed to export", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
});
