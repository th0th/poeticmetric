import copy from "copy-to-clipboard";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { Button, Container, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { mutate } from "swr";
import { Breadcrumb, Layout, SiteReports, SyntaxHighlighter, Title, withAuth } from "../../components";
import { ToastsContext } from "../../contexts";
import { useQueryParameter, useSite } from "../../hooks";

function Reports() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const { hasError: hasSiteIdError, value: siteId } = useQueryParameter("id", "number");
  const { data: site, error: siteError, isValidating: isSiteValidating } = useSite(siteId);

  const scriptCode = useMemo(() => {
    const src = `${process.env.NEXT_PUBLIC_HOSTED === "true" ? window.poeticMetric?.frontendBaseUrl : window.poeticMetric?.restApiBaseUrl}/pm.js`;

    return `<script async src="${src}"></script>`;
  }, []);

  const copyScriptCodeToClipboard = useCallback(() => {
    copy(scriptCode);

    addToast({ body: "Script code is copied to clipboard.", variant: "success" });
  }, [addToast, scriptCode]);

  useEffect(() => {
    if (hasSiteIdError || siteError !== undefined) {
      addToast({ body: siteError?.message || "An error has occurred.", variant: "danger" });

      router.replace("/sites");
    }
  }, [addToast, hasSiteIdError, router, siteError]);

  return (
    <Layout kind="app">
      <Title>{site === undefined ? "Site reports" : `Reports for ${site.name}`}</Title>

      <Container className="d-flex flex-column flex-grow-1 py-5">
        {site === undefined ? (
          <Spinner className="m-auto" variant="primary" />
        ) : (
          <>
            <Breadcrumb items={[{ href: "/sites", title: "Sites" }]} title={`Reports for ${site.name}`} />

            {!site.hasEvents ? (
              <div className="align-items-center d-flex flex-column m-auto text-center">
                <h2>There are no events registered from this site, yet...</h2>

                <div className="fs-5 fw-medium">
                  Please add the PoeticMetric tracking script to your site:
                </div>

                <div className="d-flex flex-row mt-4">
                  <SyntaxHighlighter className="rounded-bottom-start rounded-top-start mb-0" code={scriptCode} />

                  <OverlayTrigger
                    overlay={(
                      <Tooltip className="fs-xs fw-medium">
                        Click to copy
                      </Tooltip>
                    )}
                    placement="bottom"
                    trigger={["focus", "hover"]}
                  >
                    <Button
                      className="flex-grow-0 flex-shrink-0 rounded-bottom-start-0 rounded-top-start-0"
                      onClick={copyScriptCodeToClipboard}
                      size="lg"
                    >
                      <i className="bi bi-clipboard-fill" />
                    </Button>
                  </OverlayTrigger>
                </div>

                {process.env.NEXT_PUBLIC_HOSTED === "true" ? (
                  <div className="fs-sm mt-2">
                    {"Please see "}
                    <a href="/docs/websites/adding-the-script-to-your-website" target="_blank">docs</a>
                    {" if you need help about adding the script to your website."}
                  </div>
                ) : null}

                <Button className="mt-4" disabled={isSiteValidating} onClick={async () => await mutate(`/sites/${site?.id}`)}>
                  <i className="bi bi-arrow-clockwise me-1" />

                  Refresh
                </Button>
              </div>
            ) : (
              <SiteReports site={site} />
            )}
          </>
        )}
      </Container>
    </Layout>
  );
}

export default withAuth(Reports, true);
