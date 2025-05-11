import { useMemo } from "react";
import { Link, useLocation } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import NoData from "~/components/NoData";
import useSiteOperatingSystemVersionReport from "~/hooks/api/useSiteOperatingSystemVersionReport";
import useSiteReportData from "~/hooks/useSiteReportData";
import { getUpdatedLocation } from "~/lib/router";
import Modal from "./Modal";

type InnerOperatingSystemVersionProps = {
  report: Array<HydratedSiteOperatingSystemVersionReport>;
};

function InnerOperatingSystemVersion({ report }: InnerOperatingSystemVersionProps) {
  const location = useLocation();
  const { filters } = useSiteReportData();

  const data = useMemo(() => {
    if (report === undefined) {
      return null;
    }

    return report[0].data.slice(0, 5);
  }, [report]);

  return (
    <>
      {data === null ? (
        <div className="align-items-center d-flex flex-fill justify-content-center p-4">
          <ActivityIndicator />
        </div>
      ) : (
        <>
          <table className="fs-7 mb-0 table table-borderless table-layout-fixed table-sm w-100">
            <thead>
              <tr>
                <th>{filters.operatingSystemName} versions</th>

                <th className="text-end w-5rem">Visitors</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                <tr className="parent" key={d.operatingSystemVersion}>
                  <td>
                    <Link
                      className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                      preventScrollReset
                      title={d.operatingSystemVersion}
                      to={getUpdatedLocation(location, { search: { operatingSystemVersion: d.operatingSystemVersion } })}
                    >
                      <span className="text-truncate">{d.operatingSystemVersion}</span>
                    </Link>
                  </td>

                  <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link
            className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mb-n8 mt-auto mx-n8 p-3 text-center text-decoration-none"
            preventScrollReset
            to={getUpdatedLocation(location, { search: { detail: "operating-system-version" } })}
          >
            See more
          </Link>
        </>
      )}

      <Modal />
    </>
  );
}

export default function OperatingSystemVersion() {
  const { data: report } = useSiteOperatingSystemVersionReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      {report[0].data.length === 0 ? (
        <NoData />
      ) : (
        <InnerOperatingSystemVersion report={report} />
      )}
    </>
  );
}
