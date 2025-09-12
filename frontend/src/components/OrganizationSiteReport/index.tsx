import { useEffect, useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useSearchParams } from "react-router";
import Breadcrumb from "~/components/Breadcrumb";
import NoEventsBlock from "~/components/NoEventsBlock";
import NotFound from "~/components/NotFound";
import SiteReport from "~/components/SiteReport";
import SiteReportDataProvider from "~/components/SiteReportDataProvider";
import Title from "~/components/Title";
import useSite from "~/hooks/api/useSite";

export default function OrganizationSiteReport() {
  const { showBoundary } = useErrorBoundary();
  const [searchParams] = useSearchParams();
  const siteID = useMemo(() => Number(searchParams.get("siteID")) || undefined, [searchParams]);
  const { data: site, error: siteError } = useSite(siteID);

  useEffect(() => {
    if (siteError !== undefined && siteError.message !== "Not found.") {
      showBoundary(siteError);
    }
  }, [showBoundary, siteError]);

  if (siteError !== undefined && siteError.message === "Not found.") {
    return <NotFound />;
  }

  if (site !== undefined) {
    const title = `Report for ${site.name}`;

    return (
      <>
        <Title>{title}</Title>

        <div className="container py-16">
          <Breadcrumb>
            <Breadcrumb.Items>
              <Breadcrumb.Item to="/sites">Sites</Breadcrumb.Item>
            </Breadcrumb.Items>

            <Breadcrumb.Title>{title}</Breadcrumb.Title>
          </Breadcrumb>

          {site.hasEvents ? (
            <SiteReportDataProvider site={{ ...site, isGoogleSearchConsoleSiteURLSet: site.googleSearchConsoleSiteURL !== null }}>
              <SiteReport />
            </SiteReportDataProvider>
          ) : (
            <NoEventsBlock siteID={site.id} />
          )}
        </div>
      </>
    );
  }

  return (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center">
      <div className="spinner spinner-border text-primary" role="status" />
    </div>
  );
}

export const Component = OrganizationSiteReport;
