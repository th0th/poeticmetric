import millify from "millify";

function hydrateSiteUtmCampaignDatum(d: SiteUtmCampaignDatum): HydratedSiteUtmCampaignDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteUtmCampaignReport(r: SiteUtmCampaignReport): HydratedSiteUtmCampaignReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteUtmCampaignDatum),
  };
}
