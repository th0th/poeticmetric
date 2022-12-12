import dayjs from "dayjs";
import { isEqual } from "lodash";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { SiteReportsFiltersContext, SiteReportsFiltersContextValue } from "../../contexts";
import { useQueryNumber } from "../../hooks";

export type SiteReportsFiltersHandlerProps = {
  children: React.ReactNode;
};

function getFilter(queryString: string | Array<string> | undefined): string | null {
  if (queryString === undefined) {
    return null;
  }

  return queryString.toString();
}

export function SiteReportsFiltersHandler({ children }: SiteReportsFiltersHandlerProps) {
  const router = useRouter();
  const siteId = useQueryNumber("id");
  // const { data: sites } = useSWR<Array<Site>>(correctSiteHost ? "/sites" : null);

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
      page: getFilter(router.query.page),
      path: getFilter(router.query.path),
      referrer: getFilter(router.query.referrer),
      referrerSite: getFilter(router.query.referrerSite),
      scheme: getFilter(router.query.scheme),
      siteId: siteId || 0,
      start,
      utmCampaign: getFilter(router.query.utmCampaign),
      utmContent: getFilter(router.query.utmContent),
      utmMedium: getFilter(router.query.utmMedium),
      utmSource: getFilter(router.query.utmSource),
      utmTerm: getFilter(router.query.utmTerm),
    };
  }, [router, siteId]);

  useEffect(() => {
    if (!router.isReady) return;

    const correctedQuery: ParsedUrlQuery = {
      ...router.query,
      end: reportFilters.end.toISOString(),
      start: reportFilters.start.toISOString(),
    };

    // if (
    //   sites !== undefined
    //   && sites.length > 0
    //   && (reportFilters.siteHost === null || sites.find((s) => s.host === reportFilters.siteHost) === undefined)
    // ) {
    //   correctedQuery.siteHost = sites[0].host;
    // }

    if (!isEqual(correctedQuery, router.query)) {
      router.replace({
        pathname: router.pathname,
        query: correctedQuery,
      }, undefined, { scroll: false });
    }
  }, [reportFilters.end, reportFilters.start, router, router.isReady, router.query]);

  const isReady = useMemo<boolean>(() => {
    return true;

    let v = reportFilters.start.isValid() && reportFilters.end.isValid();

    // if (
    //   correctSiteHost
    //   && reportFilters.siteHost === null
    //   && (sites === undefined || sites.length > 0)
    // ) {
    //   v = false;
    // }

    return v;
  }, [reportFilters.end, reportFilters.start]);

  return (
    <SiteReportsFiltersContext.Provider value={reportFilters}>
      {isReady ? children : (
        <Spinner animation="border" />
      )}
    </SiteReportsFiltersContext.Provider>
  );
}
