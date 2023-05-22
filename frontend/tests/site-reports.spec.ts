import { expect } from "@playwright/test";
import { test } from ".";
import { deleteAccount, signUp } from "./common";

type Site = {
  domain: string;
  name: string;
};

const site: Site = {
  domain: "dev.poeticmetric.com",
  name: "Poeticmetric Dev",
};

const testAccount: TestAccount = {
  organizationName: "Organization",
  userEmail: "site-reports@poeticmetric.com",
  userName: "site-reports-test",
  userPassword: "SQtvgXspeXz8boR7",
};

test("site-reports", async ({ context, page }) => {
  await signUp(test, context, page, testAccount);

  await test.step("create site", async () => {
    await page.getByRole("link", { name: "Add new site" }).click();
    await page.getByLabel("Domain").fill(site.domain);
    await page.getByLabel("Name").fill(site.name);
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForURL("/sites/reports?id=*");

    await page.locator("#header-navbar").getByRole("link", { name: "Sites" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTitle(site.name)).toBeVisible();
  });

  await test.step("download site reports export", async () => {
    await page.getByRole("link", { name: "View reports" }).click();

    await page.getByRole("button", { name: "Export" }).click();
    const exportReportsPagePromise = page.waitForEvent("popup");
    const downloadReportsExportPromise = page.waitForEvent("download");
    await page.getByRole("button", { exact: true, name: "Reports" }).click();
    await exportReportsPagePromise;
    await downloadReportsExportPromise;

    await page.getByRole("button", { name: "Export" }).click();
    const exportEventsPagePromise = page.waitForEvent("popup");
    const downloadEventsExportPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Raw events" }).click();
    await exportEventsPagePromise;
    await downloadEventsExportPromise;
  });

  await test.step("delete site", async () => {
    await page.locator("#header-navbar").getByRole("link", { name: "Sites" }).click();
    await page.getByTitle(site.name).getByRole("link", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTitle(site.name)).toBeHidden();
  });

  await deleteAccount(test, page, testAccount);
});
