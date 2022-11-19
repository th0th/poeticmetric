type HydratedSitePageViewDurationsDatum = SitePageViewDurationsDatum & {
  viewDurationDisplay: string;
};

type HydratedSitePageViewDurationsReport = SitePageViewDurationsReport & {
  hydratedData: Array<HydratedSitePageViewDurationsDatum>;
};

type SitePageViewDurationsDatum = {
  page: string;
  url: string;
  viewDuration: number;
};

type SitePageViewDurationsReport = {
  data: Array<SitePageViewDurationsDatum>;
};
