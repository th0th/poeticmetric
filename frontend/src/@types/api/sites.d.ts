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

type HydratedSitePathReport = Overwrite<SitePathReport, {
  data: Array<HydratedSitePathReportDatum>;
}>;

type HydratedSitePathReportDatum = Overwrite<SitePathReportDatum, {
  averageDurationSecondsDisplay: string;
  bouncePercentageDisplay: string;
  viewCountDisplay: string;
  viewPercentageDisplay: string;
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteReferrerHostReport = Overwrite<SiteReferrerHostReport, {
  data: Array<HydratedSiteReferrerHostReportDatum>;
}>;

type HydratedSiteReferrerHostReportDatum = Overwrite<SiteReferrerHostReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteReferrerReport = Overwrite<SiteReferrerReport, {
  data: Array<HydratedSiteReferrerReportDatum>;
}>;

type HydratedSiteReferrerReportDatum = Overwrite<SiteReferrerReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
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

type SitePathReport = {
  data: Array<SitePathReportDatum>;
  paginationCursor: string | null;
};

type SitePathReportDatum = {
  averageDurationSeconds: number;
  bouncePercentage: number;
  path: string;
  url: string;
  viewCount: number;
  viewPercentage: number;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteReferrerHostReport = {
  data: Array<SiteReferrerHostReportDatum>;
  paginationCursor: string | null;
};

type SiteReferrerHostReportDatum = {
  referrerHost: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteReferrerReport = {
  data: Array<SiteReferrerReportDatum>;
  paginationCursor: string | null;
};

type SiteReferrerReportDatum = {
  referrer: string;
  referrerHost: string;
  referrerPath: string;
  visitorCount: number;
  visitorPercentage: number;
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
