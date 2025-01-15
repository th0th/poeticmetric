import { useCallback, useMemo } from "react";
import { useLocation, useSearch } from "wouter";

export default function useSearchParams() {
  const [location, navigate] = useLocation();
  const search = useSearch();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useCallback((params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    for (const v in Object.keys(params)) {
      const key = Object.keys(params)[v];
      const value = Object.values(params)[v];

      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    }

    const newSearch = newSearchParams.toString();
    return newSearch === "" ? "" : `?${newSearch}`;
  }, [searchParams]);

  const navigateWithSearchParams = useCallback((params: Record<string, string | null>) => {
    const newSearchParams = setSearchParams(params);

    const newSearch = newSearchParams.toString();

    navigate(newSearch === "" ? location : `${location}?${newSearch}`);
  }, [location, navigate, setSearchParams]);

  return { navigateWithSearchParams, searchParams, setSearchParams };
}
