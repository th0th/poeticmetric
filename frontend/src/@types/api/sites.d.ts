type HydratedSite = Overwrite<Site, {
  createdAtDayjs: import("dayjs").Dayjs;
  updatedAtDayjs: import("dayjs").Dayjs;
}>;

type HydratedSiteBrowserNameReport = Overwrite<SiteBrowserNameReport, {
  data: Array<HydratedSiteBrowserNameReportDatum>;
}>;

type HydratedSiteBrowserNameReportDatum = Overwrite<SiteBrowserNameReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteBrowserVersionReport = Overwrite<SiteBrowserVersionReport, {
  data: Array<HydratedSiteBrowserVersionReportDatum>;
}>;

type HydratedSiteBrowserVersionReportDatum = Overwrite<SiteBrowserVersionReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteCountryReport = Overwrite<SiteCountryReport, {
  data: Array<HydratedSiteCountryReportDatum>;
}>;

type HydratedSiteCountryReportDatum = Overwrite<SiteCountryReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteDeviceTypeReport = Array<HydratedSiteDeviceTypeReportDatum>;

type HydratedSiteDeviceTypeReportDatum = Overwrite<SiteDeviceTypeReportDatum, {
  deviceTypeDisplay: string;
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteLanguageReport = Overwrite<SiteLanguageReport, {
  data: Array<HydratedSiteLanguageReportDatum>;
}>;

type HydratedSiteLanguageReportDatum = Overwrite<SiteLanguageReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteOperatingSystemNameReport = Overwrite<SiteOperatingSystemNameReport, {
  data: Array<HydratedSiteOperatingSystemNameReportDatum>;
}>;

type HydratedSiteOperatingSystemNameReportDatum = Overwrite<SiteOperatingSystemNameReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteOperatingSystemVersionReport = Overwrite<SiteOperatingSystemVersionReport, {
  data: Array<HydratedSiteOperatingSystemVersionReportDatum>;
}>;

type HydratedSiteOperatingSystemVersionReportDatum = Overwrite<SiteOperatingSystemVersionReportDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
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

type HydratedSiteTimeOfWeekTrendsReport = Array<HydratedSiteTimeOfWeekTrendsReportDatum>;

type HydratedSiteTimeOfWeekTrendsReportDatum = Overwrite<SiteTimeOfWeekTrendsReportDatum, {
  dayOfWeekDisplay: string;
  hourOfDayEndDisplay: string;
  hourOfDayStartDisplay: string;
  viewCountDisplay: string;
  viewPercentageDisplay: string;
}>;

type HydratedSiteUTMSourceReport = Overwrite<SiteUTMSourceReport, {
  data: Array<HydratedSiteUTMSourceReportDatum>;
}>;

type HydratedSiteUTMSourceReportDatum = Overwrite<SiteUTMSourceReportDatum, {
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

type SiteBrowserNameReport = {
  data: Array<SiteBrowserNameReportDatum>;
  paginationCursor: string | null;
};

type SiteBrowserNameReportDatum = {
  browserName: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteBrowserVersionReport = {
  data: Array<SiteBrowserVersionReportDatum>;
  paginationCursor: string | null;
};

type SiteBrowserVersionReportDatum = {
  browserVersion: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteCountryReport = {
  data: Array<SiteCountryReportDatum>;
  paginationCursor: string | null;
};

type SiteCountryReportDatum = {
  country: string;
  countryISOCode: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteDeviceTypeReport = Array<SiteDeviceTypeReportDatum>;

type SiteDeviceTypeReportDatum = {
  deviceType: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteLanguageReport = {
  data: Array<SiteLanguageReportDatum>;
  paginationCursor: string | null;
};

type SiteLanguageReportDatum = {
  language: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteOperatingSystemNameReport = {
  data: Array<SiteOperatingSystemNameReportDatum>;
  paginationCursor: string | null;
};

type SiteOperatingSystemNameReportDatum = {
  operatingSystemName: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteOperatingSystemVersionReport = {
  data: Array<SiteOperatingSystemVersionReportDatum>;
  paginationCursor: string | null;
};

type SiteOperatingSystemVersionReportDatum = {
  operatingSystemVersion: string;
  visitorCount: number;
  visitorPercentage: number;
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

type SiteTimeOfWeekTrendsReport = Array<SiteTimeOfWeekTrendsReportDatum>;

type SiteTimeOfWeekTrendsReportDatum = {
  dayOfWeek: number;
  hourOfDay: number;
  viewCount: number;
  viewPercentage: number;
};

type SiteUTMSourceReport = {
  data: Array<SiteUTMSourceReportDatum>;
  paginationCursor: string | null;
};

type SiteUTMSourceReportDatum = {
  utmSource: string;
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
