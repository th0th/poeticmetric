import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { Spinner } from "react-bootstrap";
import { useSitePageViewCountReport } from "../../../hooks";

export type ViewCountsProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export function ViewCounts({ className, ...props }: ViewCountsProps) {
  const { hydratedData: data } = useSitePageViewCountReport();

  return data === undefined ? (
    <Spinner animation="border" />
  ) : (
    <div {...props} className={classNames("fss-1 lh-lg", className)}>
      <div className="d-flex flex-row py-1">
        <div className="flex-grow-1 fw-semibold pe-1">Page</div>

        <div className="fw-semibold ps-1 text-end w-4rem" title="View count">Views</div>
      </div>

      {data.hydratedData.slice(0, 5).map((d) => (
        <div className="align-items-center d-flex d-parent flex-row lh-lg" key={d.page}>
          <div className="align-items-center d-flex flex-grow-1 flex-row pe-1 overflow-hidden">
            <Link className="text-body text-decoration-none text-decoration-underline-hover text-truncate" href="/" title={d.page}>
              {d.page}
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

          <div className="text-end ps-1 w-4rem" title="View count">{d.viewCount}</div>
        </div>
      ))}
    </div>
  );
}
