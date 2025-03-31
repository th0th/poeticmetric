import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import NoData from "~/components/NoData";
import useSiteLanguageReport from "~/hooks/api/useSiteLanguageReport";
import { getUpdatedSearch } from "~/lib/router";
import Chart from "./Chart";

type InnerLanguageProps = {
  report: Array<HydratedSiteLanguageReport>;
};

function InnerLanguage({ report }: InnerLanguageProps) {
  const [location] = useLocation();
  const [searchParams] = useSearchParams();

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
                          title={d.language}
                          to={`${location}${getUpdatedSearch(searchParams, { language: d.language })}`}
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
                to={`${location}${getUpdatedSearch(searchParams, { detail: "language" })}`}
              >
                See more
              </Link>
            </div>
          </div>
        </div>
      </div>
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
