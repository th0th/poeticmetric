import { expect } from "@playwright/test";
import { test } from ".";

test.beforeEach(async ({ page, user }) => {
  await page.goto("/sign-in");
  await page.locator("input[name=\"email\"]").fill(user.email);
  await page.locator("input[name=\"password\"]").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).press("Enter");
  await page.waitForLoadState("networkidle");
});

test("site-flow", async ({ page, site }) => {
  // add site
  await page.getByRole("link", { name: "Add new site" }).click();
  await page.getByLabel("Domain").fill(site.domain);
  await page.getByLabel("Name").fill(site.name);
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForURL("/sites/reports?id=*", { waitUntil: "load" });

  // make sure tracking code is shown
  await expect(page.getByRole("heading", { name: "There are no events registered from this site, yet..." })).toBeVisible();
  // await page.locator('div').filter({ hasText: '<script async src="https://dev.poeticmetric.com/pm.js"></script>' }).click();

  const copyButtonLocator = page.locator("button", { has: page.locator("i[class*='bi-clipboard-fill']") });

  await expect(copyButtonLocator).toBeVisible();
  await copyButtonLocator.click();

  // let clipboardText = await page.evaluate("navigator.clipboard.readText()");
  // expect(clipboardText).toContain("");

  // make sure site is created
  await page.goto("/sites", { waitUntil: "networkidle" });
  await expect(page.getByTitle(site.name)).toBeVisible();

  // edit site
  await page.getByTitle(site.name).getByRole("link", { name: "Edit" }).click();
  await page.getByLabel("Name").fill(site.name2);
  await page.getByRole("button", { name: "Save" }).click();

  // make sure site is updated
  await page.waitForURL("/sites", { waitUntil: "load" });
  await expect(page.getByTitle(site.name2)).toBeVisible();

  // delete site
  await page.getByTitle(site.name2).getByRole("link", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).click();

  // make sure site is deleted
  await page.waitForURL("/sites", { waitUntil: "load" });
  await expect(page.getByTitle(site.name2)).toBeHidden();
});
