type HydratedSiteReferrerSiteDatum = SiteReferrerSiteDatum & {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
};

type HydratedSiteReferrerSiteReport = Overwrite<SiteReferrerSiteReport, {
  data: Array<HydratedSiteReferrerSiteDatum>;
}>;

type SiteReferrerSiteDatum = {
  domain: string;
  referrerSite: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteReferrerSiteReport = {
  data: Array<SiteReferrerSiteDatum>;
  paginationCursor: string;
};

