type HydratedSiteCountryDatum = Overwrite<SiteCountryDatum, {
  countryIsoAlpha2Code: string;
  visitorCountDisplay: string;
  visitorPercentageDisplay: string;
}>;

type HydratedSiteCountryReport = Overwrite<SiteCountryReport, {
  data: Array<HydratedSiteCountryDatum>;
}>;

type SiteCountryDatum = {
  country: string;
  countryIsoCode: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteCountryReport = {
  data: Array<SiteCountryDatum>;
  paginationCursor: string | null;
};
