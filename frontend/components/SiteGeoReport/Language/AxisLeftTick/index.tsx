import { TickRendererProps } from "@visx/axis";
import classNames from "classnames";
import React from "react";

export type AxisLeftTickProps = TickRendererProps;

export function AxisLeftTick({ className, fontFamily: _, fontSize: __, formattedValue, textAnchor: ___, ...props }: AxisLeftTickProps) {
  return formattedValue === undefined ? null : (
    <text {...props} className={classNames("fss-2 text-black", className)} dx={-80}>
      <tspan className="fw-medium">
        {formattedValue}
      </tspan>
    </text>
  );
}
