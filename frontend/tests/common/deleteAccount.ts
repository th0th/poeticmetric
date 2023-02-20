import { expect, Page } from "@playwright/test";
import { test as baseTest } from "../index";

export async function deleteAccount(test: typeof baseTest, page: Page, testAccount: TestAccount) {
  await test.step("delete organization", async () => {
    await page.getByRole("button", { name: testAccount.userName }).click();
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByRole("tab", { name: "Account deletion" }).click();
    await page.getByRole("link", { name: "Delete my account" }).click();
    await page.getByText("I can't afford the service.").click();
    await page.getByRole("textbox", { name: "Password" }).fill(testAccount.userPassword);
    await page.getByRole("button", { name: "I understand the consequences, delete my account" }).click();
    await expect(page.getByText("Your account, and all the associated data are deleted. Farewell!")).toBeVisible();
    await page.waitForURL("/");
  });
}
