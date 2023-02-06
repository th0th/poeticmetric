import { expect } from "@playwright/test";
import { test } from "..";

test("auth", async ({ localStorageUserAccessTokenKey, page, user }) => {
  // Login
  await page.goto("/sign-in");
  await page.locator("input[name=\"email\"]").fill(user.email);
  await page.locator("input[name=\"password\"]").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).press("Enter");
  await page.waitForURL("/sites", { waitUntil: "load" });

  // Sign out
  await page.getByRole("button", { name: user.name }).click();
  await page.getByRole("link", { name: "Sign out" }).click();
  await page.waitForURL("/");

  await expect(await page.evaluate((localStorageUserAccessTokenKey) => {
    return window.localStorage.getItem(localStorageUserAccessTokenKey);
  }, localStorageUserAccessTokenKey)).toBeNull();
});

