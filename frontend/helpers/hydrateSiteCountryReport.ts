function hydrateSiteCountryDatum(d: SiteCountryDatum): HydratedSiteCountryDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteCountryReport(r: SiteCountryReport): HydratedSiteCountryReport {
  return r.map((d) => hydrateSiteCountryDatum(d));
}
