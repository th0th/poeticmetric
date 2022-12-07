function hydrateSiteUtmContentDatum(d: SiteUtmContentDatum): HydratedSiteUtmContentDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmContentReport(r: SiteUtmContentReport): HydratedSiteUtmContentReport {
  return r.map(hydrateSiteUtmContentDatum);
}
