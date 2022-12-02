export function hydrateSiteBrowserVersionDatum(d: SiteBrowserVersionDatum): HydratedSiteBrowserVersionDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteBrowserVersionReport(r: SiteBrowserVersionReport): HydratedSiteBrowserVersionReport {
  return r.map(hydrateSiteBrowserVersionDatum);
}
