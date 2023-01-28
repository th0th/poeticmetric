import { expect, test } from "@playwright/test";

test("auth", async ({ page }) => {
    // Login
    await page.goto("/sign-in");
    await page.locator('input[name="email"]').fill("ilknurultanirsari@gmail.com");
    await page.locator('input[name="password"]').fill("gokhanicokseviyorum");
    await page.getByRole("button", { name: "Sign in" }).press("Enter");

    // Sign out
    await page.waitForURL("/sites");
    await page.getByRole("button", { name: "ilknur ultanir sari 😽" }).click();
    await page.getByRole("link", { name: "Sign out" }).click();
    await page.waitForURL("/");

    await expect(await page.evaluate(() => {
        return window.localStorage.getItem("poeticmetric-user-access-token");
    })).toBeNull();
});

