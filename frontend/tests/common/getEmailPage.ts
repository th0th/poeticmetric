import { BrowserContext, Page } from "@playwright/test";

export async function getEmailPage(context: BrowserContext): Promise<Page> {
  const emailPage = await context.newPage();

  await emailPage.goto(process.env.MAILPIT_BASE_URL || "");
  await emailPage.waitForLoadState("networkidle");

  return emailPage;
}
