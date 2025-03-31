import { useMemo } from "react";
import { Link, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSiteUTMSourceReport from "~/hooks/api/useSiteUTMSourceReport";
import { getUpdatedSearch } from "~/lib/router";
import Modal from "./Modal";

export default function Source() {
  const [searchParams] = useSearchParams();
  const { data: report } = useSiteUTMSourceReport();

  const data = useMemo<Array<HydratedSiteUTMSourceReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report[0].data.slice(0, 5);
  }, [report]);

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      <table className="fs-7 mb-0 table table-borderless table-layout-fixed table-sm w-100">
        <thead>
          <tr>
            <th>UTM source</th>

            <th className="text-end w-5rem">Visitors</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d) => (
            <tr className="parent" key={d.utmSource}>
              <td>
                <Link
                  className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                  title={d.utmSource}
                  to={`${location}${getUpdatedSearch(searchParams, { utmSource: d.utmSource })}`}
                >
                  <span className="text-truncate">{d.utmSource}</span>
                </Link>
              </td>

              <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link
        className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mb-n8 mt-auto mx-n8 p-3 text-center text-decoration-none"
        to={`${location}${getUpdatedSearch(searchParams, { detail: "utm-source" })}`}
      >
        See more
      </Link>

      <Modal />
    </>
  );
}
