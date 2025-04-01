import { TooltipWithBounds } from "@visx/tooltip";
import { TooltipWithBoundsProps } from "@visx/tooltip/lib/tooltips/TooltipWithBounds";
import classNames from "classnames";
import { ComponentClass, JSX, PropsWithoutRef } from "react";
import Portal from "~/components/Portal";

type ChartTooltipProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  left?: number;
  top?: number;
}>;

// TODO: Needed to overwrite the type since visx's type mismatches
// https://github.com/airbnb/visx/pull/1837
const CustomTooltipWithBounds = TooltipWithBounds as ComponentClass<TooltipWithBoundsProps>;

export default function ChartTooltip({ children, className, ...props }: ChartTooltipProps) {
  return (
    <Portal>
      <CustomTooltipWithBounds
        {...props}
        className={classNames("bg-inverted fs-7 position-absolute p-4 rounded shadow text-inverted", className)}
        unstyled
      >
        {children}
      </CustomTooltipWithBounds>
    </Portal>
  );
}
