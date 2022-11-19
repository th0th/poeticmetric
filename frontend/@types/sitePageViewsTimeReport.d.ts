type HydratedSitePageViewsTimeDatum = SitePageViewsTimeDatum & {
  dateTimeDate: Date;
  dateTimeDayjs: import("dayjs").Dayjs;
};

type HydratedSitePageViewsTimeReport = SitePageViewsTimeReport & {
  hydratedData: Array<HydratedSitePageViewsTimeDatum>;
};

type SitePageViewsTimeDatum = {
  dateTime: string;
  pageViewCount: number;
};

type SitePageViewsTimeInterval = {
  factor: number;
  unit: import("dayjs/plugin/duration").DurationUnitType;
};

type SitePageViewsTimeReport = {
  averagePageViewCount: number;
  data: Array<SitePageViewsTimeDatum>;
  interval: SitePageViewsTimeInterval;
};

