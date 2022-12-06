type HydratedSiteUtmSourceDatum = SiteUtmSourceDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteUtmSourceReport = Array<HydratedSiteUtmSourceDatum>;

type SiteUtmSourceDatum = {
  utmSource: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmSourceReport = Array<SiteUtmSourceDatum>;
