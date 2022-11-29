type HydratedSiteReferrerPathDatum = SiteReferrerPathDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteReferrerPathReport = Array<HydratedSiteReferrerPathDatum>;

type SiteReferrerPathDatum = {
  referrer: string;
  referrerPath: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteReferrerPathReport = Array<SiteReferrerPathDatum>;

