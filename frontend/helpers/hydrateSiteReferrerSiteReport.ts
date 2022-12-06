function hydrateSiteReferrerSiteDatum(d: SiteReferrerSiteDatum): HydratedSiteReferrerSiteDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteReferrerSiteReport(r: SiteReferrerSiteReport): HydratedSiteReferrerSiteReport {
  return r.map(hydrateSiteReferrerSiteDatum);
}
