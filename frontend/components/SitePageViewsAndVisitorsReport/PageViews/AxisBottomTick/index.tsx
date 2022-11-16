import { TickRendererProps } from "@visx/axis";
import classNames from "classnames";
import dayjs, { Dayjs } from "dayjs";
import React, { useMemo } from "react";
import styles from "./AxisBottomTick.module.scss";

export type AxisBottomTickProps = TickRendererProps;

export function AxisBottomTick({ className, formattedValue, ...props }: AxisBottomTickProps) {
  const d = useMemo<Dayjs | undefined>(() => {
    if (formattedValue === undefined) {
      return undefined;
    }

    return dayjs(formattedValue);
  }, [formattedValue]);

  return d === undefined ? null : (
    <text {...props} className={classNames(styles.axisBottomTick, className)}>
      <tspan className="fw-semibold">
        {d.format("LT")}
      </tspan>

      <tspan className="text-muted" dy={12} x={props.x}>
        {d.format("MMM DD")}
      </tspan>
    </text>
  );
}
