export function hydrateSiteOperatingSystemVersionDatum(d: SiteOperatingSystemVersionDatum): HydratedSiteOperatingSystemVersionDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteOperatingSystemVersionReport(r: SiteOperatingSystemVersionReport): HydratedSiteOperatingSystemVersionReport {
  return r.map(hydrateSiteOperatingSystemVersionDatum);
}
