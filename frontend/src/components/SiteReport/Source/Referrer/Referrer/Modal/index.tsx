import { useMemo } from "react";
import BaseModal from "react-bootstrap/Modal";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import FavIcon from "~/components/FavIcon";
import useSiteReferrerReport from "~/hooks/api/useSiteReferrerReport";
import { getUpdatedSearch } from "~/lib/router";

export default function Modal() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: report, isValidating, setSize } = useSiteReferrerReport();

  const data = useMemo<Array<HydratedSiteReferrerReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report.reduce<Array<HydratedSiteReferrerReportDatum>>((a, v) => [...a, ...v.data], []);
  }, [report]);

  const hasMore = useMemo<boolean>(() => !!(report?.at(-1)?.paginationCursor), [report]);
  const isShown = useMemo(() => searchParams.get("detail") === "referrer", [searchParams]);

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
        <BaseModal.Title>Referrers</BaseModal.Title>
      </BaseModal.Header>

      <BaseModal.Body>
        <table className="fs-7 table table-borderless table-hover table-layout-fixed table-striped">
          <thead>
            <tr>
              <th className="w-8rem">Referrer</th>

              <th />

              <th className="text-center w-5rem">Visitors</th>

              <th className="text-end w-5rem">%</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent" key={d.referrer}>
                <td colSpan={2}>
                  <Link
                    className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-hover"
                    title={d.referrer}
                    to={`${location}?${getUpdatedSearch(searchParams, { referrer: d.referrer })}`}
                  >
                    <FavIcon className="flex-grow-0 flex-shrink-0" domain={d.referrer} size={16} />

                    <span className="text-truncate">{d.referrer}</span>
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
