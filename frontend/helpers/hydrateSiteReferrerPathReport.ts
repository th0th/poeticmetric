export function hydrateSiteReferrerPathDatum(d: SiteReferrerPathDatum): HydratedSiteReferrerPathDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteReferrerPathReport(r: SiteReferrerPathReport): HydratedSiteReferrerPathReport {
  return r.map(hydrateSiteReferrerPathDatum);
}
