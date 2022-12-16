type HydratedSiteOperatingSystemVersionDatum = Overwrite<SiteOperatingSystemVersionDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteOperatingSystemVersionReport = PaginatedSiteReport<HydratedSiteOperatingSystemVersionDatum>;

type SiteOperatingSystemVersionDatum = {
  operatingSystemName: string;
  operatingSystemVersion: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteOperatingSystemVersionReport = PaginatedSiteReport<SiteOperatingSystemVersionDatum>;
