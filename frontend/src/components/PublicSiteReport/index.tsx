import { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useSearchParams } from "react-router";
import NotFound from "~/components/NotFound";
import SiteReport from "~/components/SiteReport";
import SiteReportDataProvider from "~/components/SiteReportDataProvider";
import Title from "~/components/Title";
import usePublicSite from "~/hooks/api/usePublicSite";

export default function PublicSiteReport() {
  const { showBoundary } = useErrorBoundary();
  const [searchParams] = useSearchParams();
  const siteDomain = searchParams.get("d");
  const { data: publicSite, error: publicSiteError } = usePublicSite(siteDomain);

  useEffect(() => {
    if (publicSiteError !== undefined && publicSiteError.message !== "Not found.") {
      showBoundary(publicSiteError);
    }
  }, [publicSiteError, showBoundary]);

  if (publicSiteError !== undefined && publicSiteError.message === "Not found.") {
    return <NotFound />;
  }

  if (publicSite !== undefined) {
    return (
      <>
        <Title>{publicSite.name}</Title>

        <div className="container py-16">
          <h1>{publicSite.name}</h1>

          <SiteReportDataProvider site={publicSite}>
            <SiteReport />
          </SiteReportDataProvider>
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

export const Component = PublicSiteReport;
