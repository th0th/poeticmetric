import millify from "millify";

function hydrateSiteUtmMediumDatum(d: SiteUtmMediumDatum): HydratedSiteUtmMediumDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmMediumReport(r: SiteUtmMediumReport): HydratedSiteUtmMediumReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteUtmMediumDatum),
  };
}
