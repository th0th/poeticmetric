import millify from "millify";

function hydrateSiteReferrerSiteDatum(d: SiteReferrerSiteDatum): HydratedSiteReferrerSiteDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteReferrerSiteReport(r: SiteReferrerSiteReport): HydratedSiteReferrerSiteReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteReferrerSiteDatum),
  };
}
