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
  pageViewCountPerVisitor: 1000;
  pageViewCountPerVisitorPercentageChange: 100;
  pageViewCountPercentageChange: 100;
  visitorCount: number;
  visitorCountPercentageChange: number;
};
