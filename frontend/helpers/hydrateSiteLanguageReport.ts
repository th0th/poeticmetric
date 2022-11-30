function hydrateSiteLanguageDatum(d: SiteLanguageDatum): HydratedSiteLanguageDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteLanguageReport(r: SiteLanguageReport): HydratedSiteLanguageReport {
  return r.map(hydrateSiteLanguageDatum);
}
