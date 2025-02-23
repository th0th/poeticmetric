type HydratedSite = Overwrite<Site, {
  createdAtDayjs: import("dayjs").Dayjs;
  updatedAtDayjs: import("dayjs").Dayjs;
}>;

type HydratedSiteOverviewReport = Overwrite<SiteOverviewReport, {
  averagePageViewDurationSecondsDisplay: string;
  averagePageViewDurationSecondsPercentageChangeVariant: DisplayVariant;
  pageViewCountDisplay: string;
  pageViewCountPerVisitorDisplay: string;
  pageViewCountPerVisitorPercentageChangeVariant: DisplayVariant;
  pageViewCountPercentageChangeVariant: DisplayVariant;
  visitorCountDisplay: string;
  visitorCountPercentageChangeVariant: DisplayVariant;
}>;

type HydratedSitePageViewReport = Overwrite<SitePageViewReport, {
  averagePageViewCountDisplay: string;
  data: Array<HydratedSitePageViewReportDatum>;
}>;

type HydratedSitePageViewReportDatum = Overwrite<SitePageViewReportDatum, {
  dateTimeDate: Date;
  dateTimeDayjs: import("dayjs").Dayjs;
}>;

type HydratedSiteVisitorReport = Overwrite<SiteVisitorReport, {
  averageVisitorCountDisplay: string;
  data: Array<HydratedSiteVisitorReportDatum>;
}>;

type HydratedSiteVisitorReportDatum = Overwrite<SiteVisitorReportDatum, {
  dateTimeDate: Date;
  dateTimeDayjs: import("dayjs").Dayjs;
}>;

type Site = {
  createdAt: string;
  domain: string;
  googleSearchConsoleSiteUrl: string | null;
  hasEvents: boolean;
  id: number;
  isPublic: boolean;
  name: string;
  safeQueryParameters: Array<string>;
  updatedAt: string;
};

type SiteOverviewReport = {
  averagePageViewDurationSeconds: number | null;
  averagePageViewDurationSecondsPercentageChange: number | null;
  pageViewCount: number;
  pageViewCountPerVisitor: number | null;
  pageViewCountPerVisitorPercentageChange: number | null;
  pageViewCountPercentageChange: number;
  visitorCount: number;
  visitorCountPercentageChange: number;
};

type SitePageViewReport = {
  averagePageViewCount: number | null;
  data: Array<SitePageViewReportDatum>;
  intervalSeconds: number;
};

type SitePageViewReportDatum = {
  dateTime: string;
  pageViewCount: number | null;
};

type SiteVisitorReport = {
  averageVisitorCount: number | null;
  data: Array<SiteVisitorReportDatum>;
  intervalSeconds: number;
};

type SiteVisitorReportDatum = {
  dateTime: string;
  visitorCount: number | null;
};
