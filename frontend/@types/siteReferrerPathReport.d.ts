type HydratedSiteReferrerPathDatum = SiteReferrerPathDatum & {
  domain: string;
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
};

type HydratedSiteReferrerPathReport = Overwrite<SiteReferrerPathReport, {
  data: Array<HydratedSiteReferrerPathDatum>;
}>;

type SiteReferrerPathDatum = {
  referrer: string;
  referrerPath: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteReferrerPathReport = {
  data: Array<SiteReferrerPathDatum>;
  paginationCursor: string | null;
};

