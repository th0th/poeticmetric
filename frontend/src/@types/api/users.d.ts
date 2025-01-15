type HydratedUser = Overwrite<User, {
  createdAtDayjs: import("dayjs").Dayjs;
  updatedAtDayjs: import("dayjs").Dayjs;
}>;

type User = {
  createdAt: string;
  email: string;
  id: number;
  isEmailVerified: boolean;
  isOrganizationOwner: boolean;
  name: string;
  updatedAt: string;
};
