import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";

export type TitleProps = PropsWithoutRef<JSX.IntrinsicElements["h1"]>;

export default function Title({ children, className, ...props }: TitleProps) {
  return (
    <h1 {...props} className={classNames("mb-0 text-truncate", className)}>{children}</h1>
  );
}
