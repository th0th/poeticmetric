import dayjs from "dayjs";
import millify from "millify";
import { humanizeSeconds } from "~/lib/humanize-seconds";

export function hydrateSite(d: Site): HydratedSite {
  return {
    ...d,
    createdAtDayjs: dayjs(d.createdAt),
    updatedAtDayjs: dayjs(d.updatedAt),
  };
}

export function hydrateSiteBrowserNameReport(d: SiteBrowserNameReport): HydratedSiteBrowserNameReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteBrowserNameReportDatum),
  };
}

export function hydrateSiteBrowserNameReportDatum(d: SiteBrowserNameReportDatum): HydratedSiteBrowserNameReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteBrowserVersionReport(d: SiteBrowserVersionReport): HydratedSiteBrowserVersionReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteBrowserVersionReportDatum),
  };
}

export function hydrateSiteBrowserVersionReportDatum(d: SiteBrowserVersionReportDatum): HydratedSiteBrowserVersionReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteCountryReport(d: SiteCountryReport): HydratedSiteCountryReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteCountryReportDatum),
  };
}

export function hydrateSiteCountryReportDatum(d: SiteCountryReportDatum): HydratedSiteCountryReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteDeviceTypeReport(d: SiteDeviceTypeReport): HydratedSiteDeviceTypeReport {
  return d.map(hydrateSiteDeviceTypeReportDatum);
}

export function hydrateSiteDeviceTypeReportDatum(d: SiteDeviceTypeReportDatum): HydratedSiteDeviceTypeReportDatum {
  return {
    ...d,
    deviceTypeDisplay: `${d.deviceType.slice(0, 1)}${d.deviceType.slice(1).toLowerCase()}`,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteLanguageReport(d: SiteLanguageReport): HydratedSiteLanguageReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteLanguageReportDatum),
  };
}

export function hydrateSiteLanguageReportDatum(d: SiteLanguageReportDatum): HydratedSiteLanguageReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteOperatingSystemNameReport(d: SiteOperatingSystemNameReport): HydratedSiteOperatingSystemNameReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteOperatingSystemNameReportDatum),
  };
}

export function hydrateSiteOperatingSystemNameReportDatum(
  d: SiteOperatingSystemNameReportDatum,
): HydratedSiteOperatingSystemNameReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteOperatingSystemVersionReport(
  d: SiteOperatingSystemVersionReport,
): HydratedSiteOperatingSystemVersionReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteOperatingSystemVersionReportDatum),
  };
}

export function hydrateSiteOperatingSystemVersionReportDatum(
  d: SiteOperatingSystemVersionReportDatum,
): HydratedSiteOperatingSystemVersionReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
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
      ? humanizeSeconds(d.averagePageViewDurationSeconds)
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

export function hydrateSitePathReport(d: SitePathReport): HydratedSitePathReport {
  return {
    ...d,
    data: d.data.map(hydrateSitePathReportDatum),
  };
}

export function hydrateSitePathReportDatum(d: SitePathReportDatum): HydratedSitePathReportDatum {
  return {
    ...d,
    averageDurationSecondsDisplay: humanizeSeconds(d.averageDurationSeconds),
    bouncePercentageDisplay: `${d.bouncePercentage}%`,
    viewCountDisplay: millify(d.viewCount),
    viewPercentageDisplay: `${d.viewPercentage}%`,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteReferrerHostReport(d: SiteReferrerHostReport): HydratedSiteReferrerHostReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteReferrerHostReportDatum),
  };
}

export function hydrateSiteReferrerHostReportDatum(d: SiteReferrerHostReportDatum): HydratedSiteReferrerHostReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteReferrerReport(d: SiteReferrerReport): HydratedSiteReferrerReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteReferrerReportDatum),
  };
}

export function hydrateSiteReferrerReportDatum(d: SiteReferrerReportDatum): HydratedSiteReferrerReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteTimeOfWeekTrendsReport(d: SiteTimeOfWeekTrendsReport): HydratedSiteTimeOfWeekTrendsReport {
  return d.map(hydrateSiteTimeOfWeekTrendsReportDatum);
}

export function hydrateSiteTimeOfWeekTrendsReportDatum(d: SiteTimeOfWeekTrendsReportDatum): HydratedSiteTimeOfWeekTrendsReportDatum {
  return {
    ...d,
    dayOfWeekDisplay: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][d.dayOfWeek - 1],
    hourOfDayEndDisplay: dayjs(`1996-01-30 ${d.hourOfDay + 2}:00:00`).format("h A"),
    hourOfDayStartDisplay: dayjs(`1996-01-30 ${d.hourOfDay}:00:00`).format("h A"),
    viewCountDisplay: millify(d.viewCount),
    viewPercentageDisplay: `${d.viewPercentage}%`,
  };
}

export function hydrateSiteUTMSourceReport(d: SiteUTMSourceReport): HydratedSiteUTMSourceReport {
  return {
    ...d,
    data: d.data.map(hydrateSiteUTMSourceReportDatum),
  };
}

export function hydrateSiteUTMSourceReportDatum(d: SiteUTMSourceReportDatum): HydratedSiteUTMSourceReportDatum {
  return {
    ...d,
    visitorCountDisplay: millify(d.visitorCount),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
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
