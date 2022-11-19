import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { Spinner } from "react-bootstrap";
import { useSitePageViewDurationReport } from "../../../hooks";

export type DurationsProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export function Durations({ className, ...props }: DurationsProps) {
  const { hydratedData: data } = useSitePageViewDurationReport();

  return data === undefined ? (
    <Spinner animation="border" />
  ) : (
    <div {...props} className={classNames("small", className)}>
      <div className="d-flex flex-row py-1">
        <div className="flex-grow-1 fw-semibold pe-1">Page</div>

        <div className="fw-semibold ps-1 text-end w-6rem" title="Average duration">Duration</div>
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

          <div className="text-end ps-1 w-6rem" title="Average duration">{d.viewDurationDisplay}</div>
        </div>
      ))}
    </div>
  );
}
