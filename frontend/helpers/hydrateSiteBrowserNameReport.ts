import millify from "millify";

function hydrateSiteBrowserNameDatum(d: SiteBrowserNameDatum): HydratedSiteBrowserNameDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteBrowserNameReport(r: SiteBrowserNameReport): HydratedSiteBrowserNameReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteBrowserNameDatum),
  };
}
