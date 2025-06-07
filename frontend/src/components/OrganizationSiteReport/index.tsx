import { useMemo } from "react";
import { useSearchParams } from "react-router";
import Breadcrumb from "~/components/Breadcrumb";
import Error from "~/components/Error";
import NotFound from "~/components/NotFound";
import SiteReport from "~/components/SiteReport";
import SiteReportDataProvider from "~/components/SiteReportDataProvider";
import Title from "~/components/Title";
import useSite from "~/hooks/api/useSite";

export default function OrganizationSiteReport() {
  const [searchParams] = useSearchParams();
  const siteID = useMemo(() => Number(searchParams.get("siteID")) || undefined, [searchParams]);
  const { data: site, error: siteError } = useSite(siteID);

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

          <SiteReportDataProvider site={{ ...site, isGoogleSearchConsoleSiteURLSet: site.googleSearchConsoleSiteURL !== null }}>
            <SiteReport />
          </SiteReportDataProvider>
        </div>
      </>
    );
  }

  if (siteError !== undefined) {
    if (siteError.message === "Not found.") {
      return <NotFound />;
    } else {
      return <Error error={siteError} />;
    }
  }

  return (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center">
      <div className="spinner spinner-border text-primary" role="status" />
    </div>
  );
}

export const Component = OrganizationSiteReport;
