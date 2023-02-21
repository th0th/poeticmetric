import { Page } from "@playwright/test";
import { test as baseTest } from "..";

export async function signIn(test: typeof baseTest, page: Page, testAccount: TestAccount) {
  await test.step("sign in", async () => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByLabel("E-mail address").fill(testAccount.userEmail);
    await page.getByLabel("Password").fill(testAccount.userPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("/sites", { waitUntil: "networkidle" });
  });
}
