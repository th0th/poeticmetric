import dayjs from "dayjs";
import millify from "millify";

export function hydrateSite(d: Site): HydratedSite {
  return {
    ...d,
    createdAtDayjs: dayjs(d.createdAt),
    updatedAtDayjs: dayjs(d.updatedAt),
  };
}

export function hydrateSiteOverviewReport(d: SiteOverviewReport): HydratedSiteOverviewReport {
  function getVariant(v: number | null): DisplayVariant {
    if (v === null) {
      return "secondary";
    }

    if (v > 0) {
      return "success";
    }

    if (v < 0) {
      return "danger";
    }

    return "secondary";
  }

  return {
    ...d,
    averagePageViewDurationSecondsDisplay: d.averagePageViewDurationSeconds !== null
      ? dayjs.duration(d.averagePageViewDurationSeconds, "seconds").humanize()
      : "N/A",
    averagePageViewDurationSecondsPercentageChangeVariant: getVariant(d.averagePageViewDurationSecondsPercentageChange),
    pageViewCountDisplay: millify(d.pageViewCount),
    pageViewCountPerVisitorDisplay: d.pageViewCountPerVisitor !== null
      ? d.pageViewCountPerVisitor.toFixed(1)
      : "N/A",
    pageViewCountPerVisitorPercentageChangeVariant: getVariant(d.pageViewCountPerVisitorPercentageChange),
    pageViewCountPercentageChangeVariant: getVariant(d.pageViewCountPercentageChange),
    visitorCountDisplay: millify(d.visitorCount),
    visitorCountPercentageChangeVariant: getVariant(d.visitorCountPercentageChange),
  };
}
