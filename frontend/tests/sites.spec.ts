import { expect } from "@playwright/test";
import { test } from ".";
import { deleteAccount, signUp } from "./common";

type Site = {
  domain: string;
  name: string;
  name2: string;
};

const site: Site = {
  domain: "staging.poeticmetric.com",
  name: "Poeticmetric Staging",
  name2: "Poeticmetric Staging 1",
};

const testAccount: TestAccount = {
  organizationName: "Organization",
  userEmail: "sites@poeticmetric.com",
  userName: "sites-test",
  userPassword: "Mmnf9UUvkkCci8",
};

test("sites", async ({ context, page }) => {
  await signUp(test, context, page, testAccount);

  await test.step("create site", async () => {
    await page.getByRole("link", { name: "Add new site" }).click();
    await page.getByLabel("Domain").fill(site.domain);
    await page.getByLabel("Name").fill(site.name);
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForURL("/sites/reports?id=*");
    await expect(page.getByRole("heading", { name: "There are no events registered from this site, yet..." })).toBeVisible();
    // const copyButtonLocator = page.locator("button", { has: page.locator("i[class*='bi-clipboard-fill']") });
    // await expect(copyButtonLocator).toBeVisible();

    await page.locator("#header-navbar").getByRole("link", { name: "Sites" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTitle(site.name)).toBeVisible();
  });

  await test.step("edit site", async () => {
    await page.getByTitle(site.name).getByRole("link", { name: "Edit" }).click();
    await page.getByLabel("Name").fill(site.name2);
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTitle(site.name2)).toBeVisible();
  });

  await test.step("delete site", async () => {
    await page.getByTitle(site.name).getByRole("link", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByTitle(site.name2)).toBeHidden();
  });

  await deleteAccount(test, page, testAccount);
});
