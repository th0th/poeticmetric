import dayjs from "dayjs";
import millify from "millify";

function getVariant(v: number): SiteOverviewReportChangeVariant {
  if (v > 0) {
    return "success";
  }

  if (v < 0) {
    return "danger";
  }

  return "muted";
}

export function hydrateSiteOverviewReport(r: SiteOverviewReport): HydratedSiteOverviewReport {
  return {
    ...r,
    averagePageViewDurationDisplay: dayjs.duration(r.averagePageViewDuration, "seconds").humanize(),
    averagePageViewDurationPercentageChangeVariant: getVariant(r.averagePageViewDurationPercentageChange),
    pageViewCountDisplay: millify(r.pageViewCount),
    pageViewCountPerVisitorPercentageChangeVariant: getVariant(r.pageViewCountPerVisitorPercentageChange),
    pageViewCountPercentageChangeVariant: getVariant(r.pageViewCountPercentageChange),
    visitorCountDisplay: millify(r.visitorCount),
    visitorCountPercentageChangeVariant: getVariant(r.visitorCountPercentageChange),
  };
}
