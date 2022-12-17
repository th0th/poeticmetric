import millify from "millify";

function hydrateSiteUtmTermDatum(d: SiteUtmTermDatum): HydratedSiteUtmTermDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmTermReport(r: SiteUtmTermReport): HydratedSiteUtmTermReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteUtmTermDatum),
  };
}
