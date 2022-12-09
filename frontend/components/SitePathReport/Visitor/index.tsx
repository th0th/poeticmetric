import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useSitePathVisitorCountReport } from "../../../hooks";
import { SiteReportNoDataIndicator } from "../../SiteReportNoDataIndicator";
import { Modal } from "./Modal";

type State = {
  data: Array<HydratedSitePathVisitorCountDatum>;
};

export type VisitorProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export function Visitor({ className, ...props }: VisitorProps) {
  const router = useRouter();
  const { data } = useSitePathVisitorCountReport();

  const state = useMemo<State | null>(() => {
    if (data === undefined) {
      return null;
    }

    return {
      // data: [],
      data: data[0].data.slice(0, 5),
    };
  }, [data]);

  return (
    <div {...props} className={`d-flex flex-column flex-grow-1 ${className}`}>
      {state === null ? (
        <Spinner animation="border" className="m-auto" />
      ) : (
        <>
          {state.data.length === 0 ? (
            <SiteReportNoDataIndicator />
          ) : (
            <>
              <div className="fss-1 lh-lg">
                <div className="d-flex flex-row py-1">
                  <div className="flex-grow-1 fw-semibold pe-1">Page</div>

                  <div className="fw-semibold ps-1 text-end w-4rem">Visitors</div>
                </div>

                {state.data.map((d) => (
                  <div className="align-items-center d-flex d-parent flex-row lh-lg" key={d.path}>
                    <div className="align-items-center d-flex flex-grow-1 flex-row min-w-0 pe-1">
                      <Link
                        className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                        href={{ pathname: router.pathname, query: { ...router.query, path: d.path } }}
                        scroll={false}
                        title={d.path}
                      >
                        {d.path}
                      </Link>

                      <a
                        className="d-parent-block flex-grow-0 flex-shrink-0 lh-1 ms-2 text-black text-primary-hover"
                        href={d.url}
                        rel="noreferrer"
                        target="_blank"
                        title="Go to the page"
                      >
                        <i className="bi-box-arrow-up-right h-1rem" />
                      </a>
                    </div>

                    <div className="text-end ps-1 w-4rem" title={d.visitorPercentageDisplay}>{d.visitorCount}</div>
                  </div>
                ))}
              </div>

              <div className="mx-n3 mb-n3 mt-auto pt-3">
                <Link
                  className="bg-light-hover border-1 border-top d-block fw-medium p-2 rounded-bottom text-center text-decoration-none"
                  href={{ pathname: router.pathname, query: { ...router.query, detail: "path-visitor" } }}
                >
                  See more
                </Link>
              </div>
            </>
          )}
        </>
      )}

      <Modal />
    </div>
  );
}
