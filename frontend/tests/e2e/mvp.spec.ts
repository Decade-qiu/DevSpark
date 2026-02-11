import { test, expect } from "@playwright/test";

test("workspace pages render", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /continue/i })).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /today/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /add rss/i })).toBeVisible();

  await page.goto("/feed");
  await expect(page.getByRole("heading", { name: /feed/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /import opml/i })).toBeVisible();

  await page.goto("/drafts");
  await expect(page.getByRole("heading", { name: /drafts/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /export markdown/i })).toBeVisible();

  await page.goto("/reader");
  await expect(page.getByRole("heading", { name: /draft/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /insert citation/i })).toBeVisible();
});
