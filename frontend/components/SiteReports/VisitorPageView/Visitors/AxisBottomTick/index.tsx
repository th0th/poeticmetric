import { TickRendererProps } from "@visx/axis";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo } from "react";

export type AxisBottomTickProps = TickRendererProps;

export function AxisBottomTick({ className, formattedValue, ...props }: AxisBottomTickProps) {
  const d = useMemo<Dayjs | undefined>(() => {
    if (formattedValue === undefined) {
      return undefined;
    }

    return dayjs(formattedValue);
  }, [formattedValue]);

  return d === undefined ? null : (
    <text
      {...props}
      className={classNames("fs-xxs text-black", className)}
      fill={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-black")}
    >
      <tspan className="fw-medium">
        {d.format("LT")}
      </tspan>

      <tspan className="text-muted" dy={12} x={props.x}>
        {d.format("MMM DD")}
      </tspan>
    </text>
  );
}
