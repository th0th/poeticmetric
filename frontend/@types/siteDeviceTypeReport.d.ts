type HydratedSiteDeviceTypeDatum = SiteDeviceTypeDatum & {
  deviceTypeDisplay: string;
  visitorPercentageDisplay: string;
};

type HydratedSiteDeviceTypeReport = Array<HydratedSiteDeviceTypeDatum>;

type SiteDeviceTypeDatum = {
  deviceType: string;
  visitorCount: number;
  visitorPercentage: number;
};

type SiteDeviceTypeReport = Array<SiteDeviceTypeDatum>;
