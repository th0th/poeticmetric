function hydrateSiteUtmMediumDatum(d: SiteUtmMediumDatum): HydratedSiteUtmMediumDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmMediumReport(r: SiteUtmMediumReport): HydratedSiteUtmMediumReport {
  return r.map(hydrateSiteUtmMediumDatum);
}
