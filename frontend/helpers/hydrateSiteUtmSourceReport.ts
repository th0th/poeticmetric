import millify from "millify";

function hydrateSiteUtmSourceDatum(d: SiteUtmSourceDatum): HydratedSiteUtmSourceDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmSourceReport(r: SiteUtmSourceReport): HydratedSiteUtmSourceReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteUtmSourceDatum),
  };
}
