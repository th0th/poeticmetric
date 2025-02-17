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
