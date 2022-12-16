import millify from "millify";

function hydrateSiteBrowserVersionDatum(d: SiteBrowserVersionDatum): HydratedSiteBrowserVersionDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteBrowserVersionReport(r: SiteBrowserVersionReport): HydratedSiteBrowserVersionReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteBrowserVersionDatum),
  };
}
