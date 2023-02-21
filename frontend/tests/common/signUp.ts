import { BrowserContext, expect, Page } from "@playwright/test";
import { test as baseTest } from "../index";
import { getEmailPage } from "./getEmailPage";

export async function signUp(test: typeof baseTest, context: BrowserContext, page: Page, testAccount: TestAccount) {
  await test.step("sign up", async () => {
    await page.goto("/sign-up");

    await page.getByLabel("Full name").fill(testAccount.userName);
    await page.getByLabel("E-mail address").fill(testAccount.userEmail);
    await page.getByLabel("Password").fill(testAccount.userPassword);
    await page.getByLabel("Company name").fill(testAccount.organizationName);
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText("Welcome to PoeticMetric!")).toBeVisible();
    await page.waitForURL("/sites");

    await expect(page.getByRole("heading", { name: "Please verify your e-mail address" })).toBeVisible();
  });

  await test.step("e-mail address verification", async () => {
    const emailPage = await getEmailPage(context);
    await emailPage.locator("a").filter({ hasText: testAccount.userEmail }).filter({ hasText: "Welcome to PoeticMetric" }).click();
    const emailVerificationPagePromise = emailPage.waitForEvent("popup");
    await emailPage.frameLocator("#preview-html").getByRole("link", { name: "Verify my e-mail address" }).click();
    const emailVerificationPage = await emailVerificationPagePromise;
    await emailVerificationPage.waitForURL("/sites");

    await expect(
      emailVerificationPage.locator("div").filter({ hasText: "Congratulations! Your 30-day free trial of PoeticMetric has been enabled." }).nth(0),
    ).toBeVisible();
    await expect(emailVerificationPage.getByRole("heading", { name: "You don't have any sites yet." })).toBeVisible();
    await emailVerificationPage.close();

    await emailPage.locator("button").filter({ hasText: "Delete" }).nth(0).click();
    await emailPage.locator("a").filter({ hasText: testAccount.userEmail }).filter({ hasText: "30-Day Free Trial" }).click();
    await expect(emailPage.frameLocator("#preview-html").getByText("Thank you for choosing PoeticMetric.")).toBeVisible();
    await emailPage.waitForLoadState("networkidle");
    await emailPage.locator("button").filter({ hasText: "Delete" }).nth(0).click();
    await emailPage.waitForLoadState("networkidle");
    await emailPage.close();
    await page.reload({ waitUntil: "networkidle" });
  });
}
