import { expect, test } from "@playwright/test";

const testAccount: TestAccount = {
  organizationName: "PoeticMetric",
  userEmail: "bootstrap@poeticmetric.com",
  userName: "bootstrap",
  userPassword: "UxsU2kB9eaBVzt",
};

test.beforeAll(async ({ baseURL, browser }) => {
  const page = await browser.newPage();

  if (process.env.PLAYWRIGHT_IS_BOOTSTRAP_CHECK_DONE === "true") {
    return;
  }

  await page.goto("/bootstrap", { waitUntil: "networkidle" });

  if (page.url() === `${baseURL}/bootstrap`) {
    await page.getByLabel("Name").fill(testAccount.userName);
    await page.getByLabel("E-mail address").fill(testAccount.userEmail);
    await page.getByLabel("New password", { exact: true }).fill(testAccount.userPassword);
    await page.getByLabel("New password (again)").fill(testAccount.userPassword);
    await page.getByLabel("Organization").fill(testAccount.organizationName);
    await page.getByRole("button", { name: "Continue" }).click();

    await page.goto("/sign-out");
  } else {
    await expect(await page.getByText("Bootstrap seems to be done already.")).toBeVisible();
  }

  await page.close();

  process.env.PLAYWRIGHT_IS_BOOTSTRAP_CHECK_DONE = "true";
});

export { test };
