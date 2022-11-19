type HydratedSitePageViewCountsReportDatum = SitePageViewCountsReportDatum & {
  viewCountPercentageDisplay: string;
};

type HydratedSitePageViewCountsReport = SitePageViewCountsReport & {
  hydratedData: Array<HydratedSitePageViewCountsReportDatum>;
};

type SitePageViewCountsReportDatum = {
  page: string;
  url: string;
  viewCount: number;
  viewCountPercentage: number;
};

type SitePageViewCountsReport = {
  data: Array<SitePageViewCountsReportDatum>;
};
