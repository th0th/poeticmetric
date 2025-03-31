import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import NoData from "~/components/NoData";
import useSiteUTMMediumReport from "~/hooks/api/useSiteUTMMediumReport";
import { getUpdatedSearch } from "~/lib/router";
import Modal from "./Modal";

type InnerMediumProps = {
  report: Array<HydratedSiteUTMMediumReport>;
};

function InnerMedium({ report }: InnerMediumProps) {
  const [location] = useLocation();
  const [searchParams] = useSearchParams();

  const data = useMemo(() => report[0].data.slice(0, 5), [report]);

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      {data.length === 0 ? (
        <NoData />
      ) : (
        <>
          <table className="fs-7 mb-0 table table-borderless table-layout-fixed table-sm w-100">
            <thead>
              <tr>
                <th>UTM medium</th>

                <th className="text-end w-5rem">Visitors</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                <tr className="parent" key={d.utmMedium}>
                  <td>
                    <Link
                      className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                      title={d.utmMedium}
                      to={`${location}${getUpdatedSearch(searchParams, { utmMedium: d.utmMedium })}`}
                    >
                      <span className="text-truncate">{d.utmMedium}</span>
                    </Link>
                  </td>

                  <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link
            className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mb-n8 mt-auto mx-n8 p-3 text-center text-decoration-none"
            to={`${location}${getUpdatedSearch(searchParams, { detail: "utm-medium" })}`}
          >
            See more
          </Link>

          <Modal />
        </>
      )}
    </>
  );
}

export default function Medium() {
  const { data: report } = useSiteUTMMediumReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      {report[0].data.length === 0 ? (
        <NoData />
      ) : (
        <InnerMedium report={report} />
      )}
    </>
  );
}
