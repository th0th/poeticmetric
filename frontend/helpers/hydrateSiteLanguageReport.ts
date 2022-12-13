import millify from "millify";

function hydrateSiteLanguageDatum(d: SiteLanguageDatum): HydratedSiteLanguageDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteLanguageReport(r: SiteLanguageReport): HydratedSiteLanguageReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteLanguageDatum),
  };
}
