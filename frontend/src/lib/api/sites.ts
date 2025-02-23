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

export function hydrateSitePageViewReport(d: SitePageViewReport): HydratedSitePageViewReport {
  return {
    ...d,
    averagePageViewCountDisplay: d.averagePageViewCount !== null
      ? millify(d.averagePageViewCount)
      : "N/A",
    data: d.data.map(hydrateSitePageViewReportDatum),
  };
}

export function hydrateSitePageViewReportDatum(d: SitePageViewReportDatum): HydratedSitePageViewReportDatum {
  const dateTimeDayjs = dayjs(d.dateTime);

  return {
    ...d,
    dateTimeDate: dateTimeDayjs.toDate(),
    dateTimeDayjs,
  };
}

export function hydrateSiteVisitorReport(d: SiteVisitorReport): HydratedSiteVisitorReport {
  return {
    ...d,
    averageVisitorCountDisplay: d.averageVisitorCount !== null
      ? d.averageVisitorCount.toString()
      : "N/A",
    data: d.data.map(hydrateSiteVisitorReportDatum),
  };
}

function hydrateSiteVisitorReportDatum(d: SiteVisitorReportDatum): HydratedSiteVisitorReportDatum {
  const dateTimeDayjs = dayjs(d.dateTime);

  return {
    ...d,
    dateTimeDate: dateTimeDayjs.toDate(),
    dateTimeDayjs,
  };
}
