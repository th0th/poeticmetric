import { Page } from "@playwright/test";
import { test as baseTest } from "..";

export async function signOut(test: typeof baseTest, page: Page, testAccount: TestAccount) {
  await test.step("sign out", async () => {
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: testAccount.userName }).click();
    await page.getByRole("link", { name: "Sign out" }).click();
    await page.waitForURL("/");
  });
}
