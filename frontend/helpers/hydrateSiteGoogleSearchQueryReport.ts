import millify from "millify";

function hydrateSiteGoogleSearchQueryDatum(d: SiteGoogleSearchQueryDatum): HydratedSiteGoogleSearchQueryDatum {
  return {
    ...d,
    clicksDisplay: millify(d.clicks),
    impressionsDisplay: millify(d.impressions),
  };
}

export function hydrateSiteGoogleSearchQueryReport(r: SiteGoogleSearchQueryReport): HydratedSiteGoogleSearchQueryReport {
  return r.map(hydrateSiteGoogleSearchQueryDatum);
}
