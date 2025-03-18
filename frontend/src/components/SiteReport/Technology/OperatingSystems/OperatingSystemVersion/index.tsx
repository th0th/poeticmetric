import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSiteOperatingSystemVersionReport from "~/hooks/api/useSiteOperatingSystemVersionReport";
import useSiteReportData from "~/hooks/useSiteReportData";
import { getUpdatedSearch } from "~/lib/router";
import Modal from "./Modal";

export default function OperatingSystemVersion() {
  const [location] = useLocation();
  const [searchParams] = useSearchParams();
  const { filters } = useSiteReportData();
  const { data: report } = useSiteOperatingSystemVersionReport();

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
                      title={d.operatingSystemVersion}
                      to={`${location}${getUpdatedSearch(searchParams, { operatingSystemVersion: d.operatingSystemVersion })}`}
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
            to={`${location}${getUpdatedSearch(searchParams, { detail: "operating-system-version" })}`}
          >
            See more
          </Link>
        </>
      )}

      <Modal />
    </>
  );
}
