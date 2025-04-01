import { useMemo } from "react";
import BaseModal from "react-bootstrap/Modal";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSiteBrowserVersionReport from "~/hooks/api/useSiteBrowserVersionReport";
import useSiteReportData from "~/hooks/useSiteReportData";
import { getUpdatedSearch } from "~/lib/router";

export default function Modal() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters } = useSiteReportData();
  const { data: report, isValidating, setSize } = useSiteBrowserVersionReport();

  const data = useMemo<Array<HydratedSiteBrowserVersionReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report.reduce<Array<HydratedSiteBrowserVersionReportDatum>>((a, v) => [...a, ...v.data], []);
  }, [report]);

  const hasMore = useMemo<boolean>(() => !!(report?.at(-1)?.paginationCursor), [report]);
  const isShown = useMemo(() => searchParams.get("detail") === "browser-version", [searchParams]);

  function hide() {
    setSearchParams((s) => {
      s.delete("detail");

      return s;
    });
  }

  async function loadMore() {
    return setSize((s) => s + 1);
  }

  return (
    <BaseModal centered onHide={hide} show={isShown} size="lg">
      <BaseModal.Header closeButton>
        <BaseModal.Title>{filters.browserName} versions</BaseModal.Title>
      </BaseModal.Header>

      <BaseModal.Body>
        <table className="fs-7 table table-borderless table-hover table-layout-fixed table-striped">
          <thead>
            <tr>
              <th className="w-8rem">Version</th>
              <th />
              <th className="text-center w-5rem">Visitors</th>
              <th className="text-end w-5rem">%</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent" key={d.browserVersion}>
                <td colSpan={2}>
                  <Link
                    className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-hover"
                    title={d.browserVersion}
                    to={`${location}?${getUpdatedSearch(searchParams, { browserVersion: d.browserVersion, detail: null })}`}
                  >
                    <span className="text-truncate">{d.browserVersion}</span>
                  </Link>
                </td>

                <td className="text-center">{d.visitorCountDisplay}</td>
                <td className="text-end">{d.visitorPercentageDisplay}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {isValidating ? (
          <div className="d-flex justify-content-center mb-16">
            <ActivityIndicator />
          </div>
        ) : null}

        {hasMore ? (
          <button className="btn btn-primary d-block mx-auto" disabled={isValidating} onClick={loadMore}>
            Load more
          </button>
        ) : null}
      </BaseModal.Body>
    </BaseModal>
  );
}
