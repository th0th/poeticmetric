import dayjs from "dayjs";
import { isEqual } from "lodash";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useMemo } from "react";
import { SiteReportsContext, SiteReportsContextValue } from "../../../contexts";

export type FiltersHandlerProps = {
  children: React.ReactNode;
  site: Site;
};

function getFilter(queryString: string | Array<string> | undefined): string | null {
  if (queryString === undefined) {
    return null;
  }

  return queryString.toString();
}

export function Handler({ children, site }: FiltersHandlerProps) {
  const router = useRouter();

  const value = useMemo<SiteReportsContextValue>(() => {
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
      filters: {
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
        siteId: site.id,
        start,
        utmCampaign: getFilter(router.query.utmCampaign),
        utmContent: getFilter(router.query.utmContent),
        utmMedium: getFilter(router.query.utmMedium),
        utmSource: getFilter(router.query.utmSource),
        utmTerm: getFilter(router.query.utmTerm),
      },
      site,
    };
  }, [
    router.query.browserName,
    router.query.browserVersion,
    router.query.countryIsoCode,
    router.query.deviceType,
    router.query.end,
    router.query.language,
    router.query.operatingSystemName,
    router.query.operatingSystemVersion,
    router.query.path,
    router.query.referrer,
    router.query.referrerSite,
    router.query.scheme,
    router.query.start,
    router.query.utmCampaign,
    router.query.utmContent,
    router.query.utmMedium,
    router.query.utmSource,
    router.query.utmTerm,
    site,
  ]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const correctedQuery: ParsedUrlQuery = {
      ...router.query,
      end: value.filters.end.toISOString(),
      start: value.filters.start.toISOString(),
    };

    if (!isEqual(correctedQuery, router.query)) {
      router.replace({
        pathname: router.pathname,
        query: correctedQuery,
      }, undefined, { scroll: false });
    }
  }, [value.filters.end, value.filters.start, router, router.isReady, router.query]);

  return (
    <SiteReportsContext.Provider value={value}>
      {children}
    </SiteReportsContext.Provider>
  );
}
