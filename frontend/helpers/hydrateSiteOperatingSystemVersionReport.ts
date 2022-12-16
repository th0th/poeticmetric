import millify from "millify";

function hydrateSiteOperatingSystemVersionDatum(d: SiteOperatingSystemVersionDatum): HydratedSiteOperatingSystemVersionDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteOperatingSystemVersionReport(r: SiteOperatingSystemVersionReport): HydratedSiteOperatingSystemVersionReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteOperatingSystemVersionDatum),
  };
}
