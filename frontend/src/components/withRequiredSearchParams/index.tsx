import { FC, useMemo } from "react";
import NotFound from "~/components/NotFound";
import useSearchParams from "~/hooks/useSearchParams";

export default function withRequiredSearchParams(Component: FC, paramNames: Array<string>) {
  function Wrapped() {
    const [, searchParams] = useSearchParams();

    const shouldRender = useMemo<boolean>(() => {
      for (const paramName of paramNames) {
        if (!searchParams.has(paramName)) {
          return false;
        }
      }

      return true;
    }, [searchParams]);

    return shouldRender ? (
      <Component />
    ) : (
      <NotFound />
    );
  }

  return Wrapped;
}
