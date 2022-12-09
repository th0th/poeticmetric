import millify from "millify";
import { humanizeDuration } from "./humanizeDuration";

function hydrateSitePathDatum(d: SitePathDatum): HydratedSitePathDatum {
  return {
    ...d,
    averageDurationDisplay: humanizeDuration(d.averageDuration),
    bouncePercentageDisplay: `${d.bouncePercentage}%`,
    viewCountDisplay: millify(d.viewCount),
    viewPercentageDisplay: `${d.viewPercentage}%`,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSitePathReport(r: SitePathReport): HydratedSitePathReport {
  return {
    ...r,
    data: r.data.map(hydrateSitePathDatum),
  };
}
