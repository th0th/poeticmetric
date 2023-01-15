import classNames from "classnames";
import React from "react";

export type NoDataProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export function NoData({ className, ...props }: NoDataProps) {
  return (
    <div {...props} className={classNames("align-items-center d-flex flex-column flex-grow-1 justify-content-center text-center", className)}>
      <h6>No data</h6>

      <div className="fs-xs text-muted">There is no data available for the selected time window.</div>
    </div>
  );
}
