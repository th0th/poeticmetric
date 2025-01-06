import clsx from "clsx";
import { JSX, PropsWithoutRef } from "react";

export type ActivityOverlayProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  isActive: boolean;
}>;

export default function ActivityOverlay({ className, isActive, ...props }: ActivityOverlayProps) {
  return isActive ? (
    <div
      {...props}
      className={clsx("align-items-center backdrop-blur d-flex justify-content-center position-absolute z-2 inset-0", className)}
    >
      <div className="spinner spinner-border text-primary-emphasis" />
    </div>
  ) : null;
}
