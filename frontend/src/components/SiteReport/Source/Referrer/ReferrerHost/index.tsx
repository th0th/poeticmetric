import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import FavIcon from "~/components/FavIcon";
import NoData from "~/components/NoData";
import useSiteReferrerHostReport from "~/hooks/api/useSiteReferrerHostReport";
import { getUpdatedSearch } from "~/lib/router";
import Modal from "./Modal";

export default function ReferrerHost() {
  const [location] = useLocation();
  const [searchParams] = useSearchParams();
  const { data: report } = useSiteReferrerHostReport();

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
          {data.length === 0 ? (
            <NoData />
          ) : (
            <>
              <table className="fs-7 mb-0 table table-borderless table-layout-fixed table-sm w-100">
                <thead>
                  <tr>
                    <th>Referrer</th>

                    <th className="text-end w-5rem">Visitors</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((d) => (
                    <tr className="parent" key={d.referrerHost}>
                      <td>
                        <Link
                          className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                          title={d.referrerHost}
                          to={`${location}${getUpdatedSearch(searchParams, { referrerHost: d.referrerHost })}`}
                        >
                          <FavIcon className="flex-grow-0 flex-shrink-0" domain={d.referrerHost} size={16} />

                          <span className="text-truncate">{d.referrerHost}</span>
                        </Link>
                      </td>

                      <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mb-n8 mt-auto mx-n8 p-3 text-center text-decoration-none"
                to={`${location}${getUpdatedSearch(searchParams, { detail: "referrer-host" })}`}
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
