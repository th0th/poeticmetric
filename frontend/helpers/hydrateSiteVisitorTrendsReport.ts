function hydrateSiteVisitorTrendsDatum(d: SiteVisitorTrendsDatum): HydratedSiteVisitorTrendsDatum {
  return {
    ...d,
    dayDisplay: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][d.day - 1],
    hourEndDisplay: `${(d.hour + 2) % 12 || 12} ${d.hour + 2 < 12 ? "AM" : "PM"}`,
    hourStartDisplay: `${d.hour % 12 || 12} ${d.hour < 12 ? "AM" : "PM"}`,
  };
}

export function hydrateSiteVisitorTrendsReport(r: SiteVisitorTrendsReport): HydratedSiteVisitorTrendsReport {
  return r.map(hydrateSiteVisitorTrendsDatum);
}