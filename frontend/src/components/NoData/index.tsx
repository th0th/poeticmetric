import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";

export type NoDataProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export default function NoData({ className }: NoDataProps) {
  return (
    <div className={classNames("d-flex flex-column flex-grow-1 justify-content-center mx-auto p-4 text-center", className)}>
      <div className="fs-7 fw-semi-bold">No data</div>

      <div className="fs-8 mt-2 text-body-secondary">There is no data available for the selected time window.</div>
    </div>
  );
}
