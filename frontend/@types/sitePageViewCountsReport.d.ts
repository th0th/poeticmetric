type HydratedSitePageViewCountsDatum = SitePageViewCountsDatum & {
  viewCountPercentageDisplay: string,
};

type HydratedSitePageViewCountsReport = SitePageViewCountsReport & {
  hydratedData: Array<HydratedSitePageViewCountsDatum>,
};

type SitePageViewCountsDatum = {
  page: string,
  url: string,
  viewCount: number,
  viewCountPercentage: number,
};

type SitePageViewCountsReport = {
  data: Array<SitePageViewCountsDatum>,
};
