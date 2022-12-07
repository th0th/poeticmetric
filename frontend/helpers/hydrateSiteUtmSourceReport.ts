function hydrateSiteUtmSourceDatum(d: SiteUtmSourceDatum): HydratedSiteUtmSourceDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmSourceReport(r: SiteUtmSourceReport): HydratedSiteUtmSourceReport {
  return r.map(hydrateSiteUtmSourceDatum);
}