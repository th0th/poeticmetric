type HydratedSiteOperatingSystemNameDatum = SiteOperatingSystemNameDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteOperatingSystemNameReport = Array<HydratedSiteOperatingSystemNameDatum>;

type SiteOperatingSystemNameDatum = {
  operatingSystemName: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteOperatingSystemNameReport = Array<SiteOperatingSystemNameDatum>;
