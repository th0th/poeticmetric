import { humanizeDuration } from "./humanizeDuration";

function hydrateSitePageViewDurationsDatum(d: SitePageViewDurationsDatum): HydratedSitePageViewDurationsDatum {
  return {
    ...d,
    viewDurationDisplay: humanizeDuration(d.viewDuration),
  };
}

export function hydrateSitePageViewDurationsReport(r: SitePageViewDurationsReport): HydratedSitePageViewDurationsReport {
  return {
    ...r,
    hydratedData: r.data.map(hydrateSitePageViewDurationsDatum),
  };
}
