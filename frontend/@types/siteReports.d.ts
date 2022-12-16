type SiteReportChangeColor = "green" | "red";

type PaginatedSiteReport<T> = {
  data: Array<T>;
  paginationCursor: string | null;
};
