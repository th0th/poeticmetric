import { useMemo } from "react";
import { Link, useLocation } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import NoData from "~/components/NoData";
import useSiteGoogleSearchTermsReport from "~/hooks/api/useSiteGoogleSearchTermsReport";
import { getUpdatedLocation } from "~/lib/router";
import Modal from "./Modal";

export default function GoogleSearchTerms() {
  const location = useLocation();
  const { data: report } = useSiteGoogleSearchTermsReport();

  const data = useMemo(() => {
    if (report === undefined) {
      return null;
    }

    return report[0].slice(0, 5);
  }, [report]);

  return (
    <>
      {data === null ? (
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
                    <th>Term</th>

                    <th className="text-end w-5rem">Clicks</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((d) => (
                    <tr className="parent" key={d.query}>
                      <td>
                        <span className="text-truncate">{d.query}</span>
                      </td>

                      <td className="text-end w-5rem">{d.clicksDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mb-n8 mt-auto mx-n8 p-3 text-center text-decoration-none"
                preventScrollReset
                to={getUpdatedLocation(location, { search: { detail: "google-search-term" } })}
              >
                See more
              </Link>

              <Modal />
            </>
          )}
        </>
      )}
    </>
  );
}
