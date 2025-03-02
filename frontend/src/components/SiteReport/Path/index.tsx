import { IconExternalLink } from "@tabler/icons-react";
import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import useSitePathReport from "~/hooks/api/useSitePathReport";
import { getUpdatedSearch } from "~/lib/router";
import Modal from "./Modal";

export default function Path() {
  const [location] = useLocation();
  const [searchParams] = useSearchParams();
  const { data: rawData } = useSitePathReport();

  const data = useMemo(() => {
    if (rawData === undefined) {
      return null;
    }

    return rawData[0].data.slice(0, 5);
  }, [rawData]);

  return (
    <>
      <div className="card">
        <div className="card-body d-flex flex-column h-18rem">
          <div className="align-items-center d-flex flex-grow-0 flex-shrink-0 h-2rem mb-6">
            <div className="fw-medium">Pages</div>
          </div>

          {data === null ? (
            <div className="align-items-center d-flex flex-fill justify-content-center p-4">
              <ActivityIndicator />
            </div>
          ) : (
            <>
              <table className="fs-7 mb-0 table table-borderless table-sm w-100">
                <thead>
                  <tr>
                    <th>Page</th>

                    <th className="text-end w-5rem">Visitors</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((d) => (
                    <tr className="parent" key={d.path}>
                      <td>
                        <div className="align-items-center d-flex gap-2">
                          <Link
                            className="text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                            title={d.path}
                            to={`${location}${getUpdatedSearch(searchParams, { path: d.path })}`}
                          >
                            {d.path}
                          </Link>

                          <a className="child-d-block" href={d.url} target="_blank">
                            <IconExternalLink className="d-block" size="1em" />
                          </a>
                        </div>
                      </td>

                      <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mb-n8 mt-auto mx-n8 p-3 text-center text-decoration-none"
                to={`${location}${getUpdatedSearch(searchParams, { detail: "path" })}`}
              >
                See more
              </Link>
            </>
          )}
        </div>
      </div>

      <Modal />
    </>
  );
}
