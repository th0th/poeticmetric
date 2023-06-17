import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";


export default function Dayjs() {
  dayjs.extend(updateLocale);
  dayjs.extend(duration);
  dayjs.extend(isoWeek);
  dayjs.extend(localeData);
  dayjs.extend(localizedFormat);
  dayjs.extend(relativeTime);
  dayjs.updateLocale("en", { weekStart: 1 });
}
