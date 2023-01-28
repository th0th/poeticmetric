import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const site = {
    domain: "staging.poeticmetric.com",
    editedName: "Poeticmetric Staging 1",
    name: "Poeticmetric Staging",
};

test.beforeAll(async ({ page }) => {
    await page.goto("/sign-in");
    await page.locator('input[name="email"]').fill("ilknurultanirsari@gmail.com");
    await page.locator('input[name="password"]').fill("gokhanicokseviyorum");
    await page.getByRole("button", { name: "Sign in" }).press("Enter");
    await page.waitForLoadState("networkidle");
});

test("site-flow", async ({ page }) => {
    test.slow();

    // Add site
    await page.goto("/sites");
    await page.getByRole("link", { name: "Add new site" }).click();
    await page.getByLabel("Domain").fill(site.domain);
    await page.getByLabel("Name").fill(site.name);
    await page.getByRole("button", { name: "Save" }).click();

    // View added site
    await page.goto("/sites", { waitUntil: "networkidle" });
    await expect(page.getByTitle(site.name)).toBeVisible();

    // Edit site
    await page.getByTitle(site.name).getByRole("link", { name: "Edit" }).click();

    await page.getByLabel("Name").fill(site.editedName);
    await page.getByRole("button", { name: "Save" }).click();

    // View edited site
    await page.goto("/sites", { waitUntil: "networkidle" });
    await expect(page.getByTitle(site.editedName)).toBeVisible();

    // Remove site
    await page.getByTitle(site.editedName).getByRole("link", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    // Removed site
    await page.goto("/sites", { waitUntil: "networkidle" });
    await expect(page.getByTitle(site.editedName)).toBeHidden();
});