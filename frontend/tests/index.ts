import { expect, test as base } from "@playwright/test";

export type Fixtures = {
  localStorageUserAccessTokenKey: string;
  organization: {
    name: string;
  };
  user: {
    email: string;
    name: string;
    password: string;
  };
};

export const fixtures: Fixtures = {
  localStorageUserAccessTokenKey: "poeticmetric-user-access-token",
  organization: {
    name: "PoeticMetric",
  },
  user: {
    email: "gokhan@poeticmetric.com",
    name: "Gokhan",
    password: "gokhan123",
  },
};

export const test = base.extend<Fixtures>(fixtures);

test.beforeAll(async ({ baseURL, browser, organization, user }) => {
  const page = await browser.newPage();
  await page.goto("/bootstrap", { waitUntil: "networkidle" });

  if (page.url() === `${baseURL}/bootstrap`) {
    await page.getByLabel("Name").fill(user.name);
    await page.getByLabel("E-mail address").fill(user.email);
    await page.getByLabel("New password", { exact: true }).fill(user.password);
    await page.getByLabel("New password (again)").fill(user.password);
    await page.getByLabel("Organization").click();
    await page.getByLabel("Organization").fill(organization.name);
    await page.getByRole("button", { name: "Continue" }).click();

    await page.goto("/sign-out");
  } else {
    await expect(await page.getByText("Bootstrap seems to be done already.")).toBeVisible({ timeout: 1000 });
  }

  await page.close();
});
