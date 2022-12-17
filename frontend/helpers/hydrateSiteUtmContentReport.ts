import millify from "millify";

function hydrateSiteUtmContentDatum(d: SiteUtmContentDatum): HydratedSiteUtmContentDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmContentReport(r: SiteUtmContentReport): HydratedSiteUtmContentReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteUtmContentDatum),
  };
}
