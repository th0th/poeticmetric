import { useMemo } from "react";
import { useSearch } from "wouter";

export default function useSearchParams(): [string, URLSearchParams] {
  const search = useSearch();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  return [search, searchParams];
}
