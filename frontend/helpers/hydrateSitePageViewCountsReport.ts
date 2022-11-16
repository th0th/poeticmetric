function hydrateSitePageViewCountsDatum(d: SitePageViewCountsDatum): HydratedSitePageViewCountsDatum {
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
