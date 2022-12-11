import dayjs from "dayjs";
import millify from "millify";

function hydrateSiteVisitorPageViewDatum(d: SiteVisitorPageViewDatum): HydratedSiteVisitorPageViewDatum {
  const dateTimeDayjs = dayjs(d.dateTime);

  return {
    ...d,
    dateTimeDate: dateTimeDayjs.toDate(),
    dateTimeDayjs,
    pageViewCountDisplay: millify(d.pageViewCount),
    visitorCountDisplay: millify(d.visitorCount),
  };
}

export function hydrateSiteVisitorPageViewReport(r: SiteVisitorPageViewReport): HydratedSiteVisitorPageViewReport {
  return {
    ...r,
    data: r.data.map(hydrateSiteVisitorPageViewDatum),
  };
}
