type HydratedSiteLanguageDatum = SiteLanguageDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteLanguageReport = Array<HydratedSiteLanguageDatum>;

type SiteLanguageDatum = {
  language: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteLanguageReport = Array<SiteLanguageDatum>;
