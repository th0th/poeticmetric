function hydrateSiteTimeTrendsDatum(d: SiteTimeTrendsDatum): HydratedSiteTimeTrendsDatum {
  return {
    ...d,
    dayDisplay: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][d.day - 1],
    hourEndDisplay: `${(d.hour + 2) % 12 || 12} ${d.hour + 2 < 12 ? "AM" : "PM"}`,
    hourStartDisplay: `${d.hour % 12 || 12} ${d.hour < 12 ? "AM" : "PM"}`,
  };
}

export function hydrateSiteTimeTrendsReport(r: SiteTimeTrendsReport): HydratedSiteTimeTrendsReport {
  return r.map(hydrateSiteTimeTrendsDatum);
}
