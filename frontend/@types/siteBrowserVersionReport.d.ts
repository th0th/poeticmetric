type HydratedSiteBrowserVersionDatum = Overwrite<SiteBrowserVersionDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteBrowserVersionReport = Overwrite<SiteBrowserVersionReport, {
  data: Array<HydratedSiteBrowserVersionDatum>;
}>;

type SiteBrowserVersionDatum = {
  browserName: string;
  browserVersion: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteBrowserVersionReport = {
  data: Array<SiteBrowserVersionDatum>;
  paginationCursor: string | null;
};
