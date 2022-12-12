import millify from "millify";

function hydrateSiteReferrerPathDatum(d: SiteReferrerPathDatum): HydratedSiteReferrerPathDatum {
  return {
    ...d,
    domain: d.referrer.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)?.[1] || "",
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteReferrerPathReport(r: SiteReferrerPathReport): HydratedSiteReferrerPathReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteReferrerPathDatum),
  };
}
