type HydratedSiteVisitorPageViewDatum = Overwrite<SiteVisitorPageViewDatum, {
  dateTimeDate: Date;
  dateTimeDayjs: import("dayjs").Dayjs;
  pageViewCountDisplay: string;
  visitorCountDisplay: string;
}>;

type HydratedSiteVisitorPageViewReport = Overwrite<SiteVisitorPageViewReport, {
  data: Array<HydratedSiteVisitorPageViewDatum>;
}>;

type SiteVisitorPageViewDatum = {
  dateTime: string;
  pageViewCount: number;
  visitorCount: number;
};

type SiteVisitorPageViewReport = {
  averagePageViewCount: number;
  averageVisitorCount: number;
  data: Array<SiteVisitorPageViewDatum>;
  interval: SiteReportInterval;
};
