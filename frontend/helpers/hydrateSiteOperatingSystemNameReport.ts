import millify from "millify";

function hydrateSiteOperatingSystemNameDatum(d: SiteOperatingSystemNameDatum): HydratedSiteOperatingSystemNameDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteOperatingSystemNameReport(r: SiteOperatingSystemNameReport): HydratedSiteOperatingSystemNameReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteOperatingSystemNameDatum),
  };
}
