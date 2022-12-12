type HydratedSitePathDatum = Overwrite<SitePathDatum, {
  averageDurationDisplay: string;
  bouncePercentageDisplay: string;
  viewCountDisplay: string;
  viewPercentageDisplay: string;
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSitePathReport = Overwrite<SitePathReport, {
  data: Array<HydratedSitePathDatum>;
}>;

type SitePathDatum = {
  averageDuration: number;
  bouncePercentage: number;
  path: string;
  url: string;
  viewCount: number;
  viewPercentage: number;
  visitorCount: number;
  visitorPercentage: number;
};

type SitePathReport = {
  data: Array<SitePathDatum>;
  paginationCursor: string | null;
};
