import classNames from "classnames";
import Link from "next/link";
import React, { HTMLAttributes } from "react";

export type FeatureLink = {
  href: string;
  title: string;
};

type Feature = {
  description: React.ReactNode;
  iconClassName: HTMLAttributes<"i">["className"];
  link?: FeatureLink;
  title: string;
};

export type FeaturesProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["section"]>, {
  features: Array<Feature>;
}>;

export default function Features({ children, className, features, ...props }: FeaturesProps) {
  return (
    <section {...props} className={classNames("py-5", className)}>
      <div className="container">
        <div className="fs-5 mw-34rem">{children}</div>

        <div className="mt-5">
          <div className="gx-4 gy-5 row row-cols-1 row-cols-lg-3 row-cols-md-2">
            {features.map((feature) => (
              <div className="col" key={feature.title}>
                <h5 className="d-inline-block lh-base">
                  <i className={classNames("align-middle fs-4 me-2 text-primary", feature.iconClassName)} />

                  {feature.title}
                </h5>

                <div>{feature.description}</div>

                {feature.link !== undefined ? (
                  <Link
                    className="d-block fs-sm fw-bold mt-3 text-decoration-none text-decoration-underline-hover"
                    href={feature.link.href}
                  >
                    {feature.link.title}

                    &rarr;
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
