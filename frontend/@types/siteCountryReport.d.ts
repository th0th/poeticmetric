type HydratedSiteCountryDatum = SiteCountryDatum & {
  visitorPercentageDisplay: string;
};

type HydratedSiteCountryReport = Array<HydratedSiteCountryDatum>;

type SiteCountryDatum = {
  country: string;
  countryIsoCode: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteCountryReport = Array<SiteCountryDatum>;
