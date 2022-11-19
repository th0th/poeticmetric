type HydratedSiteLanguageReportDatum = SiteLanguageReportDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteLanguageReport = SiteLanguageReport & {
  hydratedData: Array<HydratedSiteLanguageReportDatum>;
};

type SiteLanguageReportDatum = {
  language: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteLanguageReport = {
  data: Array<SiteLanguageReportDatum>;
};
