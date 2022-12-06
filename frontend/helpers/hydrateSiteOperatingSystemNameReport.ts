function hydrateSiteOperatingSystemNameDatum(d: SiteOperatingSystemNameDatum): HydratedSiteOperatingSystemNameDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteOperatingSystemNameReport(r: SiteOperatingSystemNameReport): HydratedSiteOperatingSystemNameReport {
  return r.map(hydrateSiteOperatingSystemNameDatum);
}
