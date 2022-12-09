function hydrateSitePathVisitorCountDatum(d: SitePathVisitorCountDatum): HydratedSitePathVisitorCountDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSitePathVisitorCountReport(r: SitePathVisitorCountReport): HydratedSitePathVisitorCountReport {
  return {
    ...r,
    data: r.data.map(hydrateSitePathVisitorCountDatum),
  };
}
