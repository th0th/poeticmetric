import { TooltipWithBounds } from "@visx/tooltip";
import classNames from "classnames";
import React from "react";
import { Portal } from "../Portal";

type ChartTooltipProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  left?: number,
  top?: number,
}>;

export function ChartTooltip({ children, className, ...props }: ChartTooltipProps) {
  return (
    <Portal>
      <TooltipWithBounds {...props} className={classNames("bg-dark fss-2 p-2 position-absolute rounded-1 text-white", className)} unstyled>
        {children}
      </TooltipWithBounds>
    </Portal>
  );
}
