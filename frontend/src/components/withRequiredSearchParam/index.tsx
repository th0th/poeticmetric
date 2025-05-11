import { useMemo } from "react";
import { Outlet, useSearchParams } from "react-router";
import NotFound from "~/components/NotFound";

export type WithRequiredSearchParamParams = {
  check?: (rawValue: string | null) => boolean;
  searchParamName: string;
};

export default function withRequiredSearchParam(params: WithRequiredSearchParamParams) {
  function Wrapped() {
    const [searchParams] = useSearchParams();

    const isPermitted = useMemo<boolean>(() => {
      const rawValue = searchParams.get(params.searchParamName);

      if (rawValue === null || rawValue === "") {
        return false;
      }

      if (params.check !== undefined) {
        return params.check(rawValue);
      }

      return true;
    }, [searchParams]);

    return isPermitted ? (
      <Outlet />
    ) : (
      <NotFound />
    );
  }

  return Wrapped;
}
