type HydratedSitePathVisitorCountDatum = Overwrite<SitePathVisitorCountDatum, {
  visitorPercentageDisplay: string;
}>;

type HydratedSitePathVisitorCountReport = Overwrite<SitePathVisitorCountReport, {
  data: Array<HydratedSitePathVisitorCountDatum>;
}>;

type SitePathVisitorCountDatum = {
  path: string;
  url: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SitePathVisitorCountReport = {
  data: Array<SitePathVisitorCountDatum>;
  paginationCursor: string | null;
};
