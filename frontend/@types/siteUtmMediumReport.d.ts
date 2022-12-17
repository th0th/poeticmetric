type HydratedSiteUtmMediumDatum = Overwrite<SiteUtmMediumDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteUtmMediumReport = PaginatedSiteReport<HydratedSiteUtmMediumDatum>;

type SiteUtmMediumDatum = {
  utmMedium: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmMediumReport = PaginatedSiteReport<SiteUtmMediumDatum>;
