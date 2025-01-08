import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";
import ActivityIndicator from "~/components/ActivityIndicator";

export type ActivityOverlayProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  isActive: boolean;
}>;

export default function ActivityOverlay({ className, isActive, ...props }: ActivityOverlayProps) {
  return isActive ? (
    <div
      {...props}
      className={classNames("align-items-center backdrop-blur d-flex justify-content-center position-absolute z-2 inset-0", className)}
    >
      <ActivityIndicator />
    </div>
  ) : null;
}
