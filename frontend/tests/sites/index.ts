import { test as base } from "@playwright/test";

export type AuthOptions = {
    user: {
        email: string;
        name: string;
        password: string;
    };
};

export type SiteOptions = {
    site: {
        domain: string;
        editedName: string;
        name: string;
    };
};

export const test = base.extend<AuthOptions & SiteOptions>({
    site: {
        domain: "staging.poeticmetric.com",
        editedName: "Poeticmetric Staging 1",
        name: "Poeticmetric Staging",
    },
    user: {
        email: "ilknurultanirsari@gmail.com",
        name: "ilknur ultanir sari 😽",
        password: "gokhanicokseviyorum",
    },
});