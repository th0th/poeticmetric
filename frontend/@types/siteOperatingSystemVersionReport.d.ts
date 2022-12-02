type HydratedSiteOperatingSystemVersionDatum = SiteOperatingSystemVersionDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteOperatingSystemVersionReport = Array<HydratedSiteOperatingSystemVersionDatum>;

type SiteOperatingSystemVersionDatum = {
  operatingSystemVersion: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteOperatingSystemVersionReport = Array<SiteOperatingSystemVersionDatum>;
