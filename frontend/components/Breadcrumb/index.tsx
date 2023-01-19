import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import React, { useMemo } from "react";

type BreadcrumbItem = {
  href?: LinkProps["href"];
  title: string;
};

export type BreadcrumbProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  items?: Array<BreadcrumbItem>;
  title: string;
}>;

export function Breadcrumb({ className, items, title, ...props }: BreadcrumbProps) {
  const itemsNode = useMemo<React.ReactNode>(() => {
    if (items === undefined) {
      return null;
    }

    return items.map((item) => {
      return (
        <React.Fragment key={item.title}>
          {item.href !== undefined ? (
            <Link className="fs-5 fw-bold text-decoration-none" href={item.href}>{item.title}</Link>
          ) : (
            <span className="fs-5 fw-bold">{item.title}</span>
          )}

          <span className="px-2 text-primary">&rarr;</span>
        </React.Fragment>
      );
    });
  }, [items]);

  return (
    <div {...props} className={classNames("mb-3", className)}>
      <div>
        {itemsNode}
      </div>

      <h1 className="mb-0">{title}</h1>
    </div>
  );
}
