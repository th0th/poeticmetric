type HydratedSitePageViewsTimeDatum = SitePageViewsTimeDatum & {
  dateTimeDayjs: import("dayjs").Dayjs,
  pageViewCountDisplay: string,
};

type HydratedSitePageViewsTimeReport = SitePageViewsTimeReport & {
  averagePageViewCountDisplay: string,
  hydratedData: Array<HydratedSitePageViewsTimeDatum>,
  intervalSeconds: number,
};

type SitePageViewsTimeDatum = {
  dateTime: string,
  pageViewCount: number,
};

type SitePageViewsTimeInterval = {
  factor: number,
  unit: import("dayjs/plugin/duration").DurationUnitType,
};

type SitePageViewsTimeReport = {
  averagePageViewCount: number,
  data: Array<SitePageViewsTimeDatum>,
  interval: SitePageViewsTimeInterval,
};

