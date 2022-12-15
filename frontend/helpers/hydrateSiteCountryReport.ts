import isoCountries from "i18n-iso-countries";
import millify from "millify";

function hydrateSiteCountryDatum(d: SiteCountryDatum): HydratedSiteCountryDatum {
  return {
    ...d,
    countryIsoAlpha2Code: isoCountries.alpha3ToAlpha2(d.countryIsoCode).toLowerCase(),
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteCountryReport(r: SiteCountryReport): HydratedSiteCountryReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteCountryDatum),
  };
}
