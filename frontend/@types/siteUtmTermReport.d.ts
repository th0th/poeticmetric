type HydratedSiteUtmTermDatum = SiteUtmTermDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteUtmTermReport = Array<HydratedSiteUtmTermDatum>;

type SiteUtmTermDatum = {
  utmTerm: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmTermReport = Array<SiteUtmTermDatum>;
