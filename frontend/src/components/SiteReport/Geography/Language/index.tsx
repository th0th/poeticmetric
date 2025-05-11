import { useMemo } from "react";
import { Link, useLocation } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import NoData from "~/components/NoData";
import useSiteLanguageReport from "~/hooks/api/useSiteLanguageReport";
import { getUpdatedLocation } from "~/lib/router";
import Chart from "./Chart";
import Modal from "./Modal";

type InnerLanguageProps = {
  report: Array<HydratedSiteLanguageReport>;
};

function InnerLanguage({ report }: InnerLanguageProps) {
  const location = useLocation();

  const data = useMemo(() => {
    if (report === undefined) {
      return null;
    }

    return report[0].data.slice(0, 5);
  }, [report]);

  return data === null ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      <div className="d-flex flex-column flex-grow-1">
        <div className="flex-grow-1 row">
          <div className="col-12 col-lg-7 d-flex flex-column">
            <Chart />
          </div>

          <div className="col-12 col-lg-5 d-flex flex-column mb-n8">
            <div className="border-1 border-start-lg d-flex flex-column flex-grow-1 ps-lg-8">
              <table className="fs-7 mb-0 table table-borderless table-layout-fixed table-sm w-100">
                <thead>
                  <tr>
                    <th>Language</th>

                    <th className="text-end w-5rem">Visitors</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((d) => (
                    <tr className="parent" key={d.language}>
                      <td>
                        <Link
                          className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                          preventScrollReset
                          title={d.language}
                          to={getUpdatedLocation(location, { search: { language: d.language } })}
                        >
                          <span className="text-truncate">{d.language}</span>
                        </Link>
                      </td>

                      <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mt-auto mx-n8 p-3 text-center text-decoration-none"
                preventScrollReset
                to={getUpdatedLocation(location, { search: { detail: "language" } })}
              >
                See more
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal />
    </>
  );
}

export default function Language() {
  const { data: report } = useSiteLanguageReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : report[0].data.length === 0 ? (
    <NoData />
  ) : (
    <InnerLanguage report={report} />
  );
}
