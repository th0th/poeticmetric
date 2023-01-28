import dayjs from "dayjs";
import { isEqual } from "lodash";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useMemo } from "react";
import { SiteReportsFiltersContext, SiteReportsFiltersContextValue } from "../../../contexts";

export type FiltersHandlerProps = {
  children: React.ReactNode;
  siteId: number;
};

function getFilter(queryString: string | Array<string> | undefined): string | null {
  if (queryString === undefined) {
    return null;
  }

  return queryString.toString();
}

export function FiltersHandler({ children, siteId }: FiltersHandlerProps) {
  const router = useRouter();

  const reportFilters = useMemo<SiteReportsFiltersContextValue>(() => {
    // end
    let end = dayjs().endOf("day");

    if (router.query.end !== undefined) {
      const endTemp = dayjs(router.query.end.toString());

      if (endTemp.isValid()) {
        end = endTemp;
      }
    }

    // start
    let start = dayjs().subtract(29, "day").startOf("day");

    if (router.query.start !== undefined) {
      const startTemp = dayjs(router.query.start.toString());

      if (startTemp.isValid()) {
        start = startTemp;
      }
    }

    return {
      browserName: getFilter(router.query.browserName),
      browserVersion: getFilter(router.query.browserVersion),
      countryIsoCode: getFilter(router.query.countryIsoCode),
      deviceType: getFilter(router.query.deviceType),
      end,
      language: getFilter(router.query.language),
      operatingSystemName: getFilter(router.query.operatingSystemName),
      operatingSystemVersion: getFilter(router.query.operatingSystemVersion),
      path: getFilter(router.query.path),
      referrer: getFilter(router.query.referrer),
      referrerSite: getFilter(router.query.referrerSite),
      scheme: getFilter(router.query.scheme),
      siteId,
      start,
      utmCampaign: getFilter(router.query.utmCampaign),
      utmContent: getFilter(router.query.utmContent),
      utmMedium: getFilter(router.query.utmMedium),
      utmSource: getFilter(router.query.utmSource),
      utmTerm: getFilter(router.query.utmTerm),
    };
  }, [router, siteId]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const correctedQuery: ParsedUrlQuery = {
      ...router.query,
      end: reportFilters.end.toISOString(),
      start: reportFilters.start.toISOString(),
    };

    if (!isEqual(correctedQuery, router.query)) {
      router.replace({
        pathname: router.pathname,
        query: correctedQuery,
      }, undefined, { scroll: false });
    }
  }, [reportFilters.end, reportFilters.start, router, router.isReady, router.query]);

  return (
    <SiteReportsFiltersContext.Provider value={reportFilters}>
      {children}
    </SiteReportsFiltersContext.Provider>
  );
}
