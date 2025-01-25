export function getUpdatedSearch(search: string, params?: Record<string, string | null>): string {
  const newSearchParams = new URLSearchParams(search);

  if (params !== undefined) {
    for (const v in Object.keys(params)) {
      const key = Object.keys(params)[v];
      const value = Object.values(params)[v];

      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    }
  }

  const newSearch = newSearchParams.toString();

  return newSearch === "" ? "" : `?${newSearch}`;
}
