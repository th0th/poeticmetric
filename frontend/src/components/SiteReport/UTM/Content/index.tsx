import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import NoData from "~/components/NoData";
import useSiteUTMContentReport from "~/hooks/api/useSiteUTMContentReport";
import { getUpdatedSearch } from "~/lib/router";
import Modal from "./Modal";

type InnerContentProps = {
  report: Array<HydratedSiteUTMContentReport>;
};

function InnerContent({ report }: InnerContentProps) {
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
                <th>UTM content</th>

                <th className="text-end w-5rem">Visitors</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                <tr className="parent" key={d.utmContent}>
                  <td>
                    <Link
                      className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                      title={d.utmContent}
                      to={`${location}${getUpdatedSearch(searchParams, { utmContent: d.utmContent })}`}
                    >
                      <span className="text-truncate">{d.utmContent}</span>
                    </Link>
                  </td>

                  <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link
            className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-content mb-n8 mt-auto mx-n8 p-3 text-center text-decoration-none"
            to={`${location}${getUpdatedSearch(searchParams, { detail: "utm-content" })}`}
          >
            See more
          </Link>

          <Modal />
        </>
      )}
    </>
  );
}

export default function Content() {
  const { data: report } = useSiteUTMContentReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      {report[0].data.length === 0 ? (
        <NoData />
      ) : (
        <InnerContent report={report} />
      )}
    </>
  );
}
