import dayjs from "dayjs";

export function hydrateUser(d: User): HydratedUser {
  return {
    ...d,
    createdAtDayjs: dayjs(d.createdAt),
    updatedAtDayjs: dayjs(d.updatedAt),
  };
}

export function hydrateUsers(ds: Array<User>): Array<HydratedUser> {
  return ds.map(hydrateUser);
}
