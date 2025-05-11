import { IconArrowRight } from "@tabler/icons-react";
import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";
import { Link, LinkProps } from "react-router";

export type ItemProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  to?: LinkProps["to"];
}>;

export default function Item({ children, className, to, ...props }: ItemProps) {
  return (
    <div {...props} className={classNames("align-items-center d-inline-flex fs-5 fw-bold overflow-hidden", className)}>
      {to !== undefined ? (
        <Link className="text-decoration-none text-truncate" to={to}>
          {children}
        </Link>
      ) : (
        <span>{children}</span>
      )}

      <IconArrowRight className="mx-2" size="20" />
    </div>
  );
}
