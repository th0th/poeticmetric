import { TickRendererProps } from "@visx/axis";
import { TextProps } from "@visx/text";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";

type AxisBottomTickProps = TickRendererProps;

export default function TimeChartAxisBottomTick({ formattedValue, ...props }: AxisBottomTickProps) {
  const d = useMemo<Dayjs | undefined>(() => {
    if (formattedValue === undefined) {
      return undefined;
    }

    return dayjs(formattedValue);
  }, [formattedValue]);

  return d === undefined ? null : (
    <text {...props}>
      <tspan>{d.format("LT")}</tspan>

      <tspan className="fs-10 fw-normal" dy="1.25em" x={props.x}>{d.format("MMM DD")}</tspan>
    </text>
  );
}

export function timeChartAxisBottomTickFormat(value: number | { valueOf(): number } | Date) {
  if (!(value instanceof Date)) {
    return;
  }

  return value.toISOString();
}

export function timeChartAxisBottomTickLabelProps(_: any, index: number): Partial<TextProps> {
  return {
    textAnchor: index === 0 ? "start" : "end",
  };
}
