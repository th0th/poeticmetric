function hydrateSiteUtmCampaignDatum(d: SiteUtmCampaignDatum): HydratedSiteUtmCampaignDatum {
  return {
    ...d,
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmCampaignReport(r: SiteUtmCampaignReport): HydratedSiteUtmCampaignReport {
  return r.map(hydrateSiteUtmCampaignDatum);
}
