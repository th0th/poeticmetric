import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Breadcrumb, Layout, SiteReports, withAuth } from "../../components";
import { ToastsContext } from "../../contexts";
import { useQueryNumber, useSite } from "../../hooks";

function Reports() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const siteId = useQueryNumber("id");
  const { data: site, error: siteError } = useSite(siteId);

  useEffect(() => {
    if (siteError !== undefined) {
      addToast({ body: siteError.message || "An error has occurred.", variant: "danger" });

      router.replace("/sites");
    }
  }, [addToast, router, siteError]);

  return (
    <Layout kind="app">
      <Container className="d-flex flex-column flex-grow-1 py-5">
        {site === undefined ? (
          <Spinner className="m-auto" variant="primary" />
        ) : (
          <>
            <Breadcrumb items={[{ href: "/sites", title: "Sites" }]} title={`Reports for ${site.name}`} />

            <SiteReports site={site} />
          </>
        )}
      </Container>
    </Layout>
  );
}

export default withAuth(Reports, true);
