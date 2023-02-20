import { expect } from "@playwright/test";
import { test } from ".";
import { deleteAccount, getEmailPage, signIn, signOut, signUp } from "./common";

const testAccount: TestAccount = {
  organizationName: "Organization",
  userEmail: "auth@poeticmetric.com",
  userName: "auth-test",
  userPassword: "zFLAkfS2xr7afa",
};

test("auth", async ({ context, page }) => {
  await signUp(test, context, page, testAccount);
  await signOut(test, page, testAccount);

  await test.step("password recovery", async () => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await page.waitForURL("/password-recovery");
    await page.locator("input[name='email']").fill(testAccount.userEmail);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Please check your inbox.")).toBeVisible();
  });

  await test.step("password reset", async () => {
    const emailPage = await getEmailPage(context);
    await emailPage.locator("a").filter({ hasText: testAccount.userEmail }).filter({ hasText: "Password reset request" }).click();
    const passwordResetPagePromise = emailPage.waitForEvent("popup");
    await emailPage.frameLocator("#preview-html").getByRole("link", { name: "Reset my password" }).click();
    const page2 = await passwordResetPagePromise;
    await page2.locator("input[name='newPassword']").fill(`${testAccount.userPassword}x`);
    await page2.locator("input[name='newPassword2']").fill(`${testAccount.userPassword}x`);
    await page2.getByRole("button", { name: "Reset password" }).click();
    await expect(page2.getByText("Your password is successfully reset. Now signing you in...")).toBeVisible();

    await emailPage.waitForLoadState("networkidle");
    await emailPage.getByRole("button", { name: "Delete" }).click();
    await emailPage.waitForLoadState("networkidle");
    await emailPage.close();
    await page2.close();
    await page.reload({ waitUntil: "networkidle" });
  });

  await signOut(test, page, testAccount);

  await signIn(test, page, { ...testAccount, userPassword: `${testAccount.userPassword}x` });

  await test.step("password change", async () => {
    await page.getByRole("button", { name: testAccount.userName }).click();
    await page.getByRole("link", { name: "Settings" }).click();
    await page.getByRole("tab", { name: "Password" }).click();
    await page.locator("input[name='password']").fill(`${testAccount.userPassword}x`);
    await page.locator("input[name='newPassword']").fill(testAccount.userPassword);
    await page.locator("input[name='newPassword2']").fill(testAccount.userPassword);
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(page.getByText("Your password has been changed.")).toBeVisible();
    await expect(page.locator("input[name='password']")).toHaveValue("");
    await expect(page.locator("input[name='newPassword']")).toHaveValue("");
    await expect(page.locator("input[name='newPassword2']")).toHaveValue("");
  });

  await deleteAccount(test, page, testAccount);
});
