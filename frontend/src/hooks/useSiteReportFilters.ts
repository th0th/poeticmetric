import dayjs from "dayjs";
import { useContext, useEffect, useMemo } from "react";
import { useSearchParams } from "wouter";
import SiteReportFiltersContext, { SiteReportFiltersContextValue } from "~/contexts/SiteReportFiltersContext";
import { getUpdatedSearch } from "~/lib/router";

export type SiteReportFilters = Exclude<SiteReportFiltersContextValue, undefined>;

export default function useSiteReportFilters(): SiteReportFilters {
  const [searchParams, setSearchParams] = useSearchParams();
  const contextValue = useContext(SiteReportFiltersContext);

  const value = useMemo<SiteReportFilters>(() => {
    if (contextValue !== undefined) {
      return contextValue;
    }

    const endQueryParam = searchParams.get("end");
    const startQueryParam = searchParams.get("start");

    if (endQueryParam !== null && startQueryParam !== null) {
      const endParsed = dayjs(endQueryParam);
      const startParsed = dayjs(startQueryParam);

      if (endParsed.isValid() && startParsed.isValid()) {
        return { end: endParsed, start: startParsed };
      }
    }

    const now = dayjs();

    return { end: now.startOf("day").add(1, "day"), start: now.startOf("day") };
  }, [contextValue, searchParams]);

  useEffect(() => {
    if (
      contextValue === undefined &&
      (searchParams.get("end") !== value.end.toISOString() || searchParams.get("start") !== value.start.toISOString())
    ) {
      setSearchParams(getUpdatedSearch(searchParams, {
        end: value.end.toISOString(),
        start: value.start.toISOString(),
      }), {
        replace: true,
      });
    }
  }, [contextValue, searchParams, setSearchParams, value]);

  return value;
}
