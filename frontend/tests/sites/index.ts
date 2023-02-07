import { test as base } from "..";

export type Props = {
  site: {
    domain: string;
    name: string;
    name2: string;
  };
};

export const test = base.extend<Props>({
  site: {
    domain: "staging.poeticmetric.com",
    name: "Poeticmetric Staging",
    name2: "Poeticmetric Staging 1",
  },
});
