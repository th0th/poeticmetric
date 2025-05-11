import { Location } from "react-router";

type GetUpdatedLocationParams = {
  search?: Record<string, string | null>;
};

export function getUpdatedSearch(search: URLSearchParams | string, params?: Record<string, string | null>): string {
  const newSearchParams = getUpdatedSearchParams(new URLSearchParams(search), params);
  const s = newSearchParams.toString();

  return s === "" ? "" : `?${s}`;
}

export function getUpdatedSearchParams(searchParams: URLSearchParams, params?: Record<string, string | null>): URLSearchParams {
  const newSearchParams = new URLSearchParams(searchParams);

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

  newSearchParams.sort();

  return newSearchParams;
}

export function getUpdatedLocation(location: Location, params: GetUpdatedLocationParams) {
  const updatedSearchParams = getUpdatedSearch(location.search, params.search);
  const newSearch = updatedSearchParams.toString() === "" ? "" : updatedSearchParams.toString();

  const newLocation = { ...location };
  newLocation.search = newSearch;

  return locationToString(newLocation);
}

export function locationToString(location: Location) {
  const search = location.search === "" ? "" : location.search;
  const hash = location.hash === "" ? "" : location.hash;

  return `${location.pathname}${search}${hash}`;
}
