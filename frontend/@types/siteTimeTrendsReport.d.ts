type HydratedSiteTimeTrendsDatum = SiteTimeTrendsDatum & {
  dayDisplay: string;
  hourEndDisplay: string;
  hourStartDisplay: string;
};

type HydratedSiteTimeTrendsReport = Array<HydratedSiteTimeTrendsDatum>;

type SiteTimeTrendsDatum = {
  day: number;
  hour: number;
  visitorCount: number;
};

type SiteTimeTrendsReport = Array<SiteTimeTrendsDatum>;
