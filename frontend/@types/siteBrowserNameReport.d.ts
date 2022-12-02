type HydratedSiteBrowserNameDatum = SiteBrowserNameDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteBrowserNameReport = Array<HydratedSiteBrowserNameDatum>;

type SiteBrowserNameDatum = {
  browserName: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteBrowserNameReport = Array<SiteBrowserNameDatum>;
