type HydratedSiteGoogleSearchQueryDatum = Overwrite<SiteGoogleSearchQueryDatum, {
  clicksDisplay: string;
  impressionsDisplay: string;
}>;

type HydratedSiteGoogleSearchQueryReport = Array<HydratedSiteGoogleSearchQueryDatum>;

type SiteGoogleSearchQueryDatum = {
  clicks: number;
  ctr: number;
  impressions: number;
  position: number;
  query: string;
};

type SiteGoogleSearchQueryReport = Array<SiteGoogleSearchQueryDatum>;
