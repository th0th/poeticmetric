type HydratedSiteUtmCampaignDatum = Overwrite<SiteUtmCampaignDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteUtmCampaignReport = PaginatedSiteReport<HydratedSiteUtmCampaignDatum>;

type SiteUtmCampaignDatum = {
  utmCampaign: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmCampaignReport = PaginatedSiteReport<SiteUtmCampaignDatum>;
