import { MutatorCallback, MutatorOptions, useSWRConfig } from "swr";

export function useSwrMatchMutate() {
  const { cache, mutate } = useSWRConfig();

  return (matcher: string | RegExp, data?: any | Promise<any> | MutatorCallback, opts?: boolean | MutatorOptions) => {
    if (!(cache instanceof Map)) {
      throw new Error("matchMutate requires the cache provider to be a Map instance");
    }

    const keys: Array<string> = [];

    cache.forEach((_, key) => {
      let push = false;

      if (typeof matcher === "string") {
        if (matcher === key) {
          push = true;
        }
      } else {
        if (matcher.test(key)) {
          push = true;
        }
      }

      if (push) {
        keys.push(key);
      }
    });

    const mutations = keys.map((key) => {
      if (data === undefined && opts === undefined) {
        return mutate(key);
      }

      return mutate(key, data, opts);
    });

    return Promise.all(mutations);
  };
}
