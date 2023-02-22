type SiteOverviewReportChangeVariant = "muted" | "danger" | "success";

type HydratedSiteOverviewReport = SiteOverviewReport & {
  averagePageViewDurationDisplay: string;
  averagePageViewDurationPercentageChangeVariant: SiteOverviewReportChangeVariant;
  pageViewCountDisplay: string;
  pageViewCountPerVisitorPercentageChangeVariant: SiteOverviewReportChangeVariant;
  pageViewCountPercentageChangeVariant: SiteOverviewReportChangeVariant;
  visitorCountDisplay: string;
  visitorCountPercentageChangeVariant: SiteOverviewReportChangeVariant;
};

type SiteOverviewReport = {
  averagePageViewDuration: number;
  averagePageViewDurationPercentageChange: number;
  pageViewCount: number;
  pageViewCountPerVisitor: number;
  pageViewCountPerVisitorPercentageChange: number;
  pageViewCountPercentageChange: number;
  visitorCount: number;
  visitorCountPercentageChange: number;
};
