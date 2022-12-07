type HydratedSiteUtmCampaignDatum = SiteUtmCampaignDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteUtmCampaignReport = Array<HydratedSiteUtmCampaignDatum>;

type SiteUtmCampaignDatum = {
  utmCampaign: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmCampaignReport = Array<SiteUtmCampaignDatum>;
