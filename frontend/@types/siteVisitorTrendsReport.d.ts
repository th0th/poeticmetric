type HydratedSiteVisitorTrendsDatum = SiteVisitorTrendsDatum & {
  dayDisplay: string;
  hourEndDisplay: string;
  hourStartDisplay: string;
};

type HydratedSiteVisitorTrendsReport = Array<HydratedSiteVisitorTrendsDatum>;

type SiteVisitorTrendsDatum = {
  day: number;
  hour: number;
  visitorCount: number;
};

type SiteVisitorTrendsReport = Array<SiteVisitorTrendsDatum>;