import { expect } from "@playwright/test";
import { test } from ".";
import { deleteAccount, getEmailPage, signUp } from "./common";

const testAccount: TestAccount = {
  organizationName: "Organization",
  userEmail: "subscription@poeticmetric.com",
  userName: "subscription-test",
  userPassword: "2PadLVksQUpoxZ",
};

const billing = {
  billingName: "Subscription test",
  cardCvc: "123",
  cardExpiry: "12 / 30",
  cardNumber: "4242424242424242",
};

test("subscription", async ({ context, page }) => {
  test.slow();

  await signUp(test, context, page, testAccount);

  await test.step("start subscription", async () => {
    await page.getByRole("link", { name: "Billing" }).click();
    await page.locator("div[class*='card']", { has: page.locator("h4", { hasText: "Basic" }) })
      .getByRole("button", { name: "Change plan" }).click();
    await page.waitForURL("https://checkout.stripe.com/**", { waitUntil: "networkidle" });
    await page.locator("input[name='cardNumber']").fill(billing.cardNumber);
    await page.locator("input[name='cardExpiry']").fill(billing.cardExpiry);
    await page.locator("input[name='cardCvc']").fill(billing.cardCvc);
    await page.getByLabel("Name on card").fill(billing.billingName);
    await page.getByRole("combobox", { name: "Country or region" }).selectOption("TR");
    await page.locator("button[class*='SubmitButton--complete']").click();
    await page.waitForURL("/billing", { waitUntil: "networkidle" });
    await expect(page.getByText("You are currently on Basic (monthly) plan.")).toBeVisible();

    const emailPage = await getEmailPage(context);
    await emailPage
      .locator("a").filter({ hasText: testAccount.userEmail })
      .filter({ hasText: "Thank you for choosing PoeticMetric" })
      .click();
    await emailPage.getByRole("button", { name: "Delete" }).click();
    await emailPage.waitForLoadState("networkidle");
    await emailPage.close();
  });

  await test.step("change subscription plan", async () => {
    await page.getByRole("button", { name: "Go to Billing Portal" }).click();
    await page.getByRole("link", { name: "Update plan" }).click();

    await page.getByTestId("pricing-table").locator("div").filter({ hasText: "Pro$20.00 per monthSelect" }).getByRole("button", { name: "Select" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await page.getByRole("link", { name: "PoeticMetric Test mode" }).click();

    const descriptionLocator = page.getByText("You are currently on Pro (monthly) plan.");

    await expect(descriptionLocator).toBeVisible().catch(async () => {
      await page.reload();
      await expect(descriptionLocator).toBeVisible();
    });
  });

  await test.step("cancel subscription", async () => {
    await page.getByRole("button", { name: "Go to Billing Portal" }).click();
    await page.getByRole("link", { name: "Cancel plan" }).click();
    await page.getByRole("button", { name: "Cancel plan" }).click();
    await page.getByRole("link", { name: "PoeticMetric Test mode" }).click();

    const descriptionLocator = page
      .getByText("You don't have an active subscription. Please start your subscription to continue to use PoeticMetric.");

    await expect(descriptionLocator).toBeVisible().catch(async () => {
      await page.reload();
      await expect(descriptionLocator).toBeVisible();
    });

    await expect(page.getByRole("button", { name: "Go to Billing Portal" })).toBeVisible();

    await expect(
      await page.locator("div[class*='card']", { has: page.locator("h4", { hasText: "Basic" }) })
        .getByRole("button", { name: "Subscribe" }),
    ).toBeVisible();
  });

  await deleteAccount(test, page, testAccount);
});

