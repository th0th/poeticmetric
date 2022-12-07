function hydrateSiteBrowserNameDatum(d: SiteBrowserNameDatum): HydratedSiteBrowserNameDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteBrowserNameReport(r: SiteBrowserNameReport): HydratedSiteBrowserNameReport {
  return r.map(hydrateSiteBrowserNameDatum);
}
