import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";

export type ItemsProps = PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export default function Items({ className, ...props }: ItemsProps) {
  return (
    <div {...props} className={classNames("align-items-center d-flex flex-row mb-4", className)} />
  );
}
