import dayjs from "dayjs";

function hydrateSiteVisitorsTimeDatum(d: SiteVisitorsTimeDatum): HydratedSiteVisitorsTimeDatum {
  const dateTimeDayjs = dayjs(d.dateTime);

  return {
    ...d,
    dateTimeDate: dateTimeDayjs.toDate(),
    dateTimeDayjs,
  };
}

export function hydrateSiteVisitorsTimeReport(r: SiteVisitorsTimeReport): HydratedSiteVisitorsTimeReport {
  return {
    ...r,
    hydratedData: r.data.map(hydrateSiteVisitorsTimeDatum),
  };
}
