const userAccessTokenLocalStorageKey = "poeticmetric-user-access-token";

export function getUserAccessToken(): string | null {
  return window.localStorage.getItem(userAccessTokenLocalStorageKey);
}

export function setUserAccessToken(userAccessToken: string | null): void {
  if (userAccessToken === null) {
    window.localStorage.removeItem(userAccessTokenLocalStorageKey);

    return;
  }

  window.localStorage.setItem(userAccessTokenLocalStorageKey, userAccessToken);
}
