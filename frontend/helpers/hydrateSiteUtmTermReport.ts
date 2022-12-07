function hydrateSiteUtmTermDatum(d: SiteUtmTermDatum): HydratedSiteUtmTermDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmTermReport(r: SiteUtmTermReport): HydratedSiteUtmTermReport {
  return r.map(hydrateSiteUtmTermDatum);
}
