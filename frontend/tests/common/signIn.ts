import { Page } from "@playwright/test";
import { test as baseTest } from "..";

export async function signIn(test: typeof baseTest, page: Page, testAccount: TestAccount) {
  await test.step("sign in", async () => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await page.locator("input[name='email']").fill(testAccount.userEmail);
    await page.locator("input[name='password']").fill(testAccount.userPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("/sites");
    await page.waitForLoadState("networkidle");
  });
}
