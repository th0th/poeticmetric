import { useMemo } from "react";
import BaseModal from "react-bootstrap/Modal";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSiteCountryReport from "~/hooks/api/useSiteCountryReport";
import { getUpdatedSearch } from "~/lib/router";

export default function Modal() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: report, isValidating, setSize } = useSiteCountryReport();

  const data = useMemo<Array<HydratedSiteCountryReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report.reduce<Array<HydratedSiteCountryReportDatum>>((a, v) => [...a, ...v.data], []);
  }, [report]);

  const hasMore = useMemo<boolean>(() => !!(report?.at(-1)?.paginationCursor), [report]);
  const isShown = useMemo(() => searchParams.get("detail") === "country", [searchParams]);

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
        <BaseModal.Title>Countries</BaseModal.Title>
      </BaseModal.Header>

      <BaseModal.Body>
        <table className="fs-7 table table-borderless table-hover table-layout-fixed table-striped">
          <thead>
            <tr>
              <th className="w-8rem">Country</th>

              <th />

              <th className="text-center w-7rem">Visitors</th>

              <th className="text-center w-5rem">%</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent" key={d.countryISOCode}>
                <td colSpan={2}>
                  <div className="align-items-center d-flex gap-2">
                    <Link
                      className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                      title={d.country}
                      to={`${location}?${getUpdatedSearch(searchParams, { countryISOCode: d.countryISOCode })}`}
                    >
                      {d.country}
                    </Link>
                  </div>
                </td>
                <td className="text-center">
                  <span title={d.visitorCount.toString()}>{d.visitorCountDisplay}</span>
                </td>

                <td className="text-center">
                  <span title={d.visitorPercentageDisplay}>{d.visitorPercentageDisplay}</span>
                </td>
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
