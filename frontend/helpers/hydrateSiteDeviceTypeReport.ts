import { toLower, upperFirst } from "lodash";

export function hydrateSiteDeviceTypeDatum(d: SiteDeviceTypeDatum): HydratedSiteDeviceTypeDatum {
  return {
    ...d,
    deviceTypeDisplay: upperFirst(toLower(d.deviceType)),
    visitorPercentageDisplay: `${d.visitorPercentage}%`,
  };
}

export function hydrateSiteDeviceTypeReport(r: SiteDeviceTypeReport): HydratedSiteDeviceTypeReport {
  return r.map(hydrateSiteDeviceTypeDatum);
}
