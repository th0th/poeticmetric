import dayjs from "dayjs";

function hydrateSitePageViewsTimeDatum(d: SitePageViewsTimeDatum): HydratedSitePageViewsTimeDatum {
  const dateTimeDayjs = dayjs(d.dateTime);

  return {
    ...d,
    dateTimeDate: dateTimeDayjs.toDate(),
    dateTimeDayjs,
  };
}

export function hydrateSitePageViewsTimeReport(r: SitePageViewsTimeReport): HydratedSitePageViewsTimeReport {
  return {
    ...r,
    hydratedData: r.data.map(hydrateSitePageViewsTimeDatum),
  };
}
