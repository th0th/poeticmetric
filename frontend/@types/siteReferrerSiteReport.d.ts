type HydratedSiteReferrerSiteDatum = SiteReferrerSiteDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteReferrerSiteReport = Array<HydratedSiteReferrerSiteDatum>;

type SiteReferrerSiteDatum = {
  referrerSite: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteReferrerSiteReport = Array<SiteReferrerSiteDatum>;

