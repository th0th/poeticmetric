import { createElement, useMemo } from "react";
import { Link, useLocation } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import NoData from "~/components/NoData";
import useSiteBrowserNameReport from "~/hooks/api/useSiteBrowserNameReport";
import { getBrowserIcon } from "~/lib/icons";
import { getUpdatedLocation } from "~/lib/router";
import Modal from "./Modal";

type InnerBrowserNameProps = {
  report: Array<HydratedSiteBrowserNameReport>;
};

export default function BrowserName() {
  const { data: report } = useSiteBrowserNameReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      {report[0].data.length === 0 ? <NoData /> : <InnerBrowserName report={report} />}
    </>
  );
}

function InnerBrowserName({ report }: InnerBrowserNameProps) {
  const location = useLocation();

  const data = useMemo(() => report[0].data.slice(0, 5), [report]);

  return (
    <>
      <table className="fs-7 mb-0 table table-borderless table-layout-fixed table-sm w-100">
        <thead>
          <tr>
            <th>Browsers</th>

            <th className="text-end w-5rem">Visitors</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d) => (
            <tr className="parent" key={d.browserName}>
              <td>
                <Link
                  className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                  preventScrollReset
                  title={d.browserName}
                  to={getUpdatedLocation(location, { search: { browserName: d.browserName } })}
                >
                  {createElement(getBrowserIcon(d.browserName), { className: "flex-grow-0 flex-shrink-0", size: "1.2em" })}

                  <span className="text-truncate">{d.browserName}</span>
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
        to={getUpdatedLocation(location, { search: { detail: "browser-name" } })}
      >
        See more
      </Link>

      <Modal />
    </>
  );
}
