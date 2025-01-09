import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";

export type DetailProps = PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export default function Detail({ className, ...props }: DetailProps) {
  return (
    <div {...props} className={classNames("fw-medium mt-2 text-body-secondary text-truncate", className)} />
  );
}
