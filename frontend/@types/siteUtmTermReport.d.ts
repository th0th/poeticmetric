type HydratedSiteUtmTermDatum = Overwrite<SiteUtmTermDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteUtmTermReport = PaginatedSiteReport<HydratedSiteUtmTermDatum>;

type SiteUtmTermDatum = {
  utmTerm: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteUtmTermReport = PaginatedSiteReport<SiteUtmTermDatum>;
