type HydratedSiteUtmSourceDatum = Overwrite<SiteUtmSourceDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteUtmSourceReport = PaginatedSiteReport<HydratedSiteUtmSourceDatum>;

type SiteUtmSourceDatum = {
  utmSource: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmSourceReport = PaginatedSiteReport<SiteUtmSourceDatum>;
