import { test as base } from "@playwright/test";

export type AuthOptions = {
    user: {
        email: string;
        name: string;
        password: string;
    };
};

export type AccessTokenOptions = {
    accessTokenKey: string;
};

export const test = base.extend<AccessTokenOptions & AuthOptions>({
    accessTokenKey: "poeticmetric-user-access-token",
    user: {
        email: "ilknurultanirsari@gmail.com",
        name: "ilknur ultanir sari 😽",
        password: "gokhanicokseviyorum",
    },
});