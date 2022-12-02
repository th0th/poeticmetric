type HydratedSiteBrowserVersionDatum = SiteBrowserVersionDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteBrowserVersionReport = Array<HydratedSiteBrowserVersionDatum>;

type SiteBrowserVersionDatum = {
  browserVersion: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteBrowserVersionReport = Array<SiteBrowserVersionDatum>;
