import { expect } from "@playwright/test";
import { test } from ".";
import { deleteAccount, getEmailPage, signIn, signOut, signUp } from "./common";

const testAccount: TestAccount = {
  organizationName: "Organization",
  userEmail: "team@poeticmetric.com",
  userName: "team-test",
  userPassword: "jVjhvoL89X9RUY",
};

const testAccount2: TestAccount = {
  ...testAccount,
  userEmail: "invited@poeticmetric.com",
  userName: "team-test-invited",
  userPassword: "3RBqjexvvZvLUZ",
};

test("team", async ({ context, page }) => {
  await signUp(test, context, page, testAccount);

  await test.step("invite team member", async () => {
    await page.getByRole("link", { name: "Team" }).click();
    await page.getByRole("link", { name: "Invite new team member" }).click();
    await page.locator("input[name='name']").fill(testAccount2.userName);
    await page.locator("input[name='email']").fill(testAccount2.userEmail);
    await page.getByRole("button", { name: "Invite team member" }).click();

    await expect(page.getByText("Invitation e-mail is sent.")).toBeVisible();
    const userCardLocator = page.locator("div[class='card']").filter({ hasText: testAccount2.userName });
    const statusIndicatorLocator = userCardLocator.locator("div[tabIndex='0']", { has: page.locator("i[class*='bi-hourglass-split']") });
    await expect(userCardLocator).toBeVisible();
    await expect(statusIndicatorLocator).toBeVisible();

    await statusIndicatorLocator.hover();
    await expect(page.getByText("Waiting for team member to accept the invite.")).toBeVisible();
  });

  await signOut(test, page, testAccount);

  await test.step("accept the invite", async () => {
    const emailPage = await getEmailPage(context);
    await emailPage.locator("a").filter({ hasText: testAccount2.userEmail }).filter({ hasText: "Join" }).click();
    const activationPagePromise = emailPage.waitForEvent("popup");
    await emailPage.frameLocator("#preview-html").getByRole("link", { name: "Accept the invite" }).click();
    const activationPage = await activationPagePromise;
    await activationPage.locator("input[name='newPassword']").fill(testAccount2.userPassword);
    await activationPage.locator("input[name='newPassword2']").fill(testAccount2.userPassword);
    await activationPage.getByRole("button", { name: "Continue" }).click();
    await expect(activationPage.getByText("Your account is successfully activated. Welcome!")).toBeVisible();
    await emailPage.getByRole("button", { name: "Delete" }).click();
    await emailPage.waitForLoadState("networkidle");
    await emailPage.close();
    await activationPage.close();
    await page.reload();
  });

  await signOut(test, page, testAccount2);

  await signIn(test, page, testAccount2);

  await signOut(test, page, testAccount2);

  await signIn(test, page, testAccount);

  await test.step("edit team member", async () => {
    const name2: TestAccount["userName"] = "team-test-invited-2";

    await page.getByRole("link", { name: "Team" }).click();
    await page.locator("div[class='card']").filter({ hasText: testAccount2.userName }).getByRole("link", { name: "Edit" }).click();
    await page.getByLabel("Name").fill(name2);
    await page.getByRole("button", { name: "Save team member" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("div[class='card']").filter({ hasText: name2 })).toBeVisible();

    await page.locator("div[class='card']").filter({ hasText: name2 }).getByRole("link", { name: "Edit" }).click();
    await page.getByLabel("Name").fill(testAccount2.userName);
    await page.getByRole("button", { name: "Save team member" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("div[class='card']").filter({ hasText: testAccount2.userName })).toBeVisible();
  });

  await test.step("delete team member", async () => {
    const userCardLocator = page.locator("div[class='card']").filter({ hasText: testAccount2.userName });

    await userCardLocator.getByRole("link", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForURL("/team");
    await expect(userCardLocator).toBeHidden();
  });

  await deleteAccount(test, page, testAccount);
});
