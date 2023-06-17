import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import { Fragment } from "react";

type BreadcrumbItem = {
  href?: LinkProps["href"];
  title: string;
};

export type BreadcrumbProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  items?: Array<BreadcrumbItem>;
  title: string;
}>;

export default function Breadcrumb({ className, items, title, ...props }: BreadcrumbProps) {
  return (
    <div {...props} className={classNames("mb-3", className)}>
      <div>
        {items?.map((item) => (
          <Fragment key={item.title}>
            {item.href !== undefined ? (
              <Link className="fs-5 fw-bold text-decoration-none" href={item.href}>{item.title}</Link>
            ) : (
              <span className="fs-5 fw-bold">{item.title}</span>
            )}

            <span className="fw-medium px-2">&rarr;</span>
          </Fragment>
        ))}
      </div>

      <h1 className="mb-0">{title}</h1>
    </div>
  );
}
