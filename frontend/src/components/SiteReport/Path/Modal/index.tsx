import { IconExternalLink } from "@tabler/icons-react";
import { useMemo } from "react";
import BaseModal from "react-bootstrap/Modal";
import { Link, useLocation, useSearchParams } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSitePathReport from "~/hooks/api/useSitePathReport";
import { getUpdatedLocation } from "~/lib/router";

export default function Modal() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: report, isValidating, setSize } = useSitePathReport();

  const data = useMemo<Array<HydratedSitePathReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report.reduce<Array<HydratedSitePathReportDatum>>((a, v) => [...a, ...v.data], []);
  }, [report]);

  const hasMore = useMemo<boolean>(() => !!(report?.at(-1)?.paginationCursor), [report]);
  const isShown = useMemo(() => searchParams.get("detail") === "path", [searchParams]);

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
        <BaseModal.Title>Pages</BaseModal.Title>
      </BaseModal.Header>

      <BaseModal.Body>
        <table className="fs-7 table table-borderless table-hover table-layout-fixed table-striped">
          <thead>
            <tr>
              <th className="w-8rem">Page</th>

              <th />

              <th className="text-center w-7rem">Visitors</th>

              <th className="text-center w-7rem">Views</th>

              <th className="text-center w-5rem">Duration</th>

              <th className="text-end w-7rem">Bounce rate</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent" key={d.path}>
                <td colSpan={2}>
                  <div className="align-items-center d-flex gap-2">
                    <Link
                      className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                      preventScrollReset
                      title={d.path}
                      to={getUpdatedLocation(location, { search: { path: d.path } })}
                    >
                      {d.path}
                    </Link>

                    <a className="child-d-block" href={d.url} target="_blank">
                      <IconExternalLink className="d-block" size="1em" />
                    </a>
                  </div>
                </td>

                <td className="text-center">
                  <span title={d.visitorCount.toString()}>{d.visitorCountDisplay}</span>
                </td>

                <td className="text-center">
                  <span title={d.viewCount.toString()}>{d.viewCountDisplay}</span>
                </td>

                <td className="text-center">
                  <span>{d.averageDurationSecondsDisplay}</span>
                </td>

                <td className="text-end">
                  <span>{d.bouncePercentageDisplay}</span>
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
