type HydratedSiteUtmContentDatum = SiteUtmContentDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteUtmContentReport = Array<HydratedSiteUtmContentDatum>;

type SiteUtmContentDatum = {
  utmContent: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmContentReport = Array<SiteUtmContentDatum>;
