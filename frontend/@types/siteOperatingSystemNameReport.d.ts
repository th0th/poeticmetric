type HydratedSiteOperatingSystemNameDatum = Overwrite<SiteOperatingSystemNameDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteOperatingSystemNameReport = PaginatedSiteReport<HydratedSiteOperatingSystemNameDatum>;

type SiteOperatingSystemNameDatum = {
  operatingSystemName: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteOperatingSystemNameReport = PaginatedSiteReport<SiteOperatingSystemNameDatum>;
