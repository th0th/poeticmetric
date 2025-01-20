import { IconCircleCheck, TablerIcon } from "@tabler/icons-react";
import classNames from "classnames";
import { JSX, PropsWithoutRef, ReactNode } from "react";
import { Link, LinkProps } from "wouter";

export type ResultProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  description: ReactNode;
  icon?: TablerIcon;
  title: ReactNode;
  to: Exclude<LinkProps["to"], undefined>;
  toTitle: string;
  variant?: ResultVariant;
}>;

type ResultVariant = "success";

const iconClassNames: Record<ResultVariant, string> = {
  success: "text-success",
};

export default function Result(
  {
    className,
    description,
    icon: Icon = IconCircleCheck,
    title,
    to,
    toTitle,
    variant = "success",
    ...props
  }: ResultProps,
) {
  return (
    <div {...props} className={classNames("align-items-center d-flex flex-column", className)}>
      <Icon className={classNames(iconClassNames[variant])} size="6rem" />

      <div className="mt-6 mw-32rem text-center">
        <h2 className="fs-2">{title}</h2>

        <div className="fs-5_5 text-body-emphasis">{description}</div>

        <Link className="btn btn-primary mt-8" to={to}>{toTitle}</Link>
      </div>
    </div>
  );
}
