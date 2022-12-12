type HydratedSiteLanguageDatum = Overwrite<SiteLanguageDatum, {
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteLanguageReport = Overwrite<SiteLanguageReport, {
  data: Array<HydratedSiteLanguageDatum>;
}>;

type SiteLanguageDatum = {
  language: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteLanguageReport = {
  data: Array<SiteLanguageDatum>;
  paginationCursor: string | null;
};
