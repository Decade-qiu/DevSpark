import { test, expect } from "@playwright/test";

test("workspace pages render", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();

  await page.goto("/");
  await expect(page.locator(".feed-list__title", { hasText: /today/i })).toBeVisible();
  await expect(page.getByLabel(/add rss source/i)).toBeVisible();

  await page.goto("/feed");
  await expect(page.locator(".panel__title", { hasText: /sources/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /refresh/i })).toBeVisible();

  await page.goto("/drafts");
  await expect(page.getByRole("heading", { name: /drafts/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /export markdown/i })).toBeVisible();

  await page.goto("/reader");
  await expect(page.getByRole("heading", { name: /draft/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /insert citation/i })).toBeVisible();
});
