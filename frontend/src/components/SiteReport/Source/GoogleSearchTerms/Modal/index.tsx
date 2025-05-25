import { useMemo } from "react";
import BaseModal from "react-bootstrap/Modal";
import { useSearchParams } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSiteGoogleSearchTermsReport from "~/hooks/api/useSiteGoogleSearchTermsReport";

export default function Modal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: report, isValidating, setSize } = useSiteGoogleSearchTermsReport();

  const data = useMemo<Array<HydratedSiteGoogleSearchAnalyticsReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report.reduce<Array<HydratedSiteGoogleSearchAnalyticsReportDatum>>((a, v) => [...a, ...v], []);
  }, [report]);

  const hasMore = useMemo<boolean>(() => report?.at(-1)?.length === 100, [report]);
  const isShown = useMemo(() => searchParams.get("detail") === "google-search-term", [searchParams]);

  function hide() {
    setSearchParams((s) => {
      s.delete("detail");

      return s;
    }, { preventScrollReset: true });
  }

  async function loadMore() {
    return setSize((s) => s + 1);
  }

  return (
    <BaseModal centered onHide={hide} show={isShown} size="lg">
      <BaseModal.Header closeButton>
        <BaseModal.Title>Google search terms</BaseModal.Title>
      </BaseModal.Header>

      <BaseModal.Body>
        <table className="fs-7 table table-borderless table-hover table-layout-fixed table-striped">
          <thead>
            <tr>
              <th className="w-8rem">Term</th>

              <th />

              <th className="text-center w-5rem">Position</th>

              <th className="text-center w-5rem">CTR</th>

              <th className="text-center w-5rem">Impressions</th>

              <th className="text-end w-5rem">Clicks</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent" key={d.query}>
                <td colSpan={2}>
                  <span className="text-truncate">{d.query}</span>
                </td>

                <td className="text-center">{d.position}</td>

                <td className="text-center">{d.ctr}</td>

                <td className="text-center">{d.impressionsDisplay}</td>

                <td className="text-end">{d.clicksDisplay}</td>
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
