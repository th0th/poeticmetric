import { useRouter } from "next/router";
import { useMemo } from "react";

export function useQueryNumber(p: string) {
  const router = useRouter();
  const queryValue = router.query[p];

  return useMemo<number | undefined>(() => {
    if (queryValue === undefined) {
      return undefined;
    }

    const queryNumberValue = Number(queryValue);

    if (!Number.isInteger(queryNumberValue)) {
      return undefined;
    }

    return queryNumberValue;
  }, [queryValue]);
}
