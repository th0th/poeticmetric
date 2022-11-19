function hydrateSitePageViewCountsDatum(d: SitePageViewCountsReportDatum): HydratedSitePageViewCountsReportDatum {
  return {
    ...d,
    viewCountPercentageDisplay: `${d.viewCountPercentage}%`,
  };
}

export function hydrateSitePageViewCountsReport(r: SitePageViewCountsReport): HydratedSitePageViewCountsReport {
  return {
    ...r,
    hydratedData: r.data.map(hydrateSitePageViewCountsDatum),
  };
}
