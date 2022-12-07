type HydratedSiteUtmMediumDatum = SiteUtmMediumDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteUtmMediumReport = Array<HydratedSiteUtmMediumDatum>;

type SiteUtmMediumDatum = {
  utmMedium: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmMediumReport = Array<SiteUtmMediumDatum>;
