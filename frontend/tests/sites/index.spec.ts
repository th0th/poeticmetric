import { expect } from "@playwright/test";
import { test } from "./index";

test.beforeAll(async ({ page, user }) => {
    await page.goto("/sign-in");
    await page.locator('input[name="email"]').fill(user.email);
    await page.locator('input[name="password"]').fill(user.password);
    await page.getByRole("button", { name: "Sign in" }).press("Enter");
    await page.waitForLoadState("networkidle");
});

test("site-flow", async ({ page, site }) => {
    // Add site
    await page.getByRole("link", { name: "Add new site" }).click();
    await page.getByLabel("Domain").fill(site.domain);
    await page.getByLabel("Name").fill(site.name);
    await page.getByRole("button", { name: "Save" }).click();

    // View added site
    await page.waitForURL("/sites", { waitUntil: "load" });
    await expect(page.getByTitle(site.name)).toBeVisible();

    // Edit site
    await page.getByTitle(site.name).getByRole("link", { name: "Edit" }).click();

    await page.getByLabel("Name").fill(site.editedName);
    await page.getByRole("button", { name: "Save" }).click();

    // View edited site
    await page.waitForURL("/sites", { waitUntil: "load" });
    await expect(page.getByTitle(site.editedName)).toBeVisible();

    // Remove site
    await page.getByTitle(site.editedName).getByRole("link", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    // Removed site
    await page.waitForURL("/sites", { waitUntil: "load" });
    await expect(page.getByTitle(site.editedName)).toBeHidden();
});