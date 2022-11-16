import dayjs from "dayjs";

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
    pageViewCountPerVisitorPercentageChangeVariant: getVariant(r.pageViewCountPercentageChange),
    pageViewCountPercentageChangeVariant: getVariant(r.pageViewCountPercentageChange),
    visitorCountPercentageChangeVariant: getVariant(r.visitorCountPercentageChange),
  };
}
