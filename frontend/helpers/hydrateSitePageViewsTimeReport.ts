import dayjs from "dayjs";

export function hydrateSitePageViewsTimeDatum(d: SitePageViewsTimeDatum): HydratedSitePageViewsTimeDatum {
  return {
    ...d,
    dateTimeDayjs: dayjs(d.dateTime),
    pageViewCountDisplay: d.pageViewCount.toString(),
  };
}

export function hydrateSitePageViewsTimeReport(r: SitePageViewsTimeReport): HydratedSitePageViewsTimeReport {
  return {
    ...r,
    averagePageViewCountDisplay: r.averagePageViewCount.toString(),
    hydratedData: r.data.map(hydrateSitePageViewsTimeDatum),
    intervalSeconds: dayjs.duration(r.interval.factor, r.interval.unit).seconds()
  };
}
