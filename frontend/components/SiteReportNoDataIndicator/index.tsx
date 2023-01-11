import React from "react";

export type SiteReportNoDataIndicatorProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export function SiteReportNoDataIndicator({ className, ...props }: SiteReportNoDataIndicatorProps) {
  return (
    <div {...props} className={`align-items-center d-flex flex-column flex-grow-1 justify-content-center text-center ${className}`}>
      <h6>No data</h6>

      <div className="fs-xs text-muted">There is no data available for the selected time window.</div>
    </div>
  );
}
