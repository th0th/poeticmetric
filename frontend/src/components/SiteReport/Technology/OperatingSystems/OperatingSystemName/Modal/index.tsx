import { createElement, useMemo } from "react";
import { Modal as BaseModal } from "react-bootstrap";
import { Link, useLocation, useSearchParams } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSiteOperatingSystemNameReport from "~/hooks/api/useSiteOperatingSystemNameReport";
import { getOperatingSystemIcon } from "~/lib/icons";
import { getUpdatedLocation } from "~/lib/router";

export default function Modal() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: report, isValidating, setSize } = useSiteOperatingSystemNameReport();

  const data = useMemo<Array<HydratedSiteOperatingSystemNameReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report.reduce<Array<HydratedSiteOperatingSystemNameReportDatum>>((a, v) => [...a, ...v.data], []);
  }, [report]);

  const hasMore = useMemo<boolean>(() => !!(report?.at(-1)?.paginationCursor), [report]);
  const isShown = useMemo(() => searchParams.get("detail") === "operating-system-name", [searchParams]);

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
        <BaseModal.Title>Operating systems</BaseModal.Title>
      </BaseModal.Header>

      <BaseModal.Body>
        <table className="fs-7 table table-borderless table-hover table-layout-fixed table-striped">
          <thead>
            <tr>
              <th>Operating system</th>
              <th />
              <th className="text-center w-5rem">Visitors</th>
              <th className="text-end w-5rem">%</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent" key={d.operatingSystemName}>
                <td colSpan={2}>
                  <Link
                    className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-hover"
                    preventScrollReset
                    title={d.operatingSystemName}
                    to={getUpdatedLocation(location, { search: { detail: null, operatingSystemName: d.operatingSystemName } })}
                  >
                    {createElement(getOperatingSystemIcon(d.operatingSystemName), { className: "flex-grow-0 flex-shrink-0", size: "1.2em" })}

                    <span className="text-truncate">{d.operatingSystemName}</span>
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
