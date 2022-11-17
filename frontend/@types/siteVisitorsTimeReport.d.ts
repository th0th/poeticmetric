type HydratedSiteVisitorsTimeDatum = SiteVisitorsTimeDatum & {
  dateTimeDate: Date,
  dateTimeDayjs: import("dayjs").Dayjs,
};

type HydratedSiteVisitorsTimeReport = SiteVisitorsTimeReport & {
  hydratedData: Array<HydratedSiteVisitorsTimeDatum>,
};

type SiteVisitorsTimeDatum = {
  dateTime: string,
  visitorCount: number,
};

type SiteVisitorsTimeInterval = {
  factor: number,
  unit: import("dayjs/plugin/duration").DurationUnitType,
};

type SiteVisitorsTimeReport = {
  averageVisitorCount: number,
  data: Array<SiteVisitorsTimeDatum>,
  interval: SiteVisitorsTimeInterval,
};

