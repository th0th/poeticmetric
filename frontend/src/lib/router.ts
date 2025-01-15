export function setSearchParams(searchParams: string, params: Record<string, string | null>): URLSearchParams {
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

  return newSearchParams;
}
