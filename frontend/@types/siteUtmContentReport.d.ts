type HydratedSiteUtmContentDatum = Overwrite<SiteUtmContentDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteUtmContentReport = PaginatedSiteReport<HydratedSiteUtmContentDatum>;

type SiteUtmContentDatum = {
  utmContent: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmContentReport = PaginatedSiteReport<SiteUtmContentDatum>;
