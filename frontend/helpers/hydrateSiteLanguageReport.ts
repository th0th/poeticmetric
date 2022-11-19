function hydrateSiteLanguageReportDatum(d: SiteLanguageReportDatum): HydratedSiteLanguageReportDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteLanguageReport(r: SiteLanguageReport): HydratedSiteLanguageReport {
  return {
    ...r,
    hydratedData: r.data.map(hydrateSiteLanguageReportDatum),
  };
}
