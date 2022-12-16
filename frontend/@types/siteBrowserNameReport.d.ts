type HydratedSiteBrowserNameDatum = Overwrite<SiteBrowserNameDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteBrowserNameReport = Overwrite<SiteBrowserNameReport, {
  data: Array<HydratedSiteBrowserNameDatum>;
}>;

type SiteBrowserNameDatum = {
  browserName: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteBrowserNameReport = {
  data: Array<HydratedSiteBrowserNameDatum>;
  paginationCursor: string | null;
};
