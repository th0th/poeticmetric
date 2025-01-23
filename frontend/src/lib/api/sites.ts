import dayjs from "dayjs";

export function hydrateSite(d: Site): HydratedSite {
  return {
    ...d,
    createdAtDayjs: dayjs(d.createdAt),
    updatedAtDayjs: dayjs(d.updatedAt),
  };
}
