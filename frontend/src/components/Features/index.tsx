import { IconArrowRight, TablerIcon } from "@tabler/icons-react";
import classNames from "classnames";
import { createElement, JSX, PropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router";

type Feature = {
  description: ReactNode;
  detail: ReactNode;
  icon: TablerIcon;
  iconWrapperClassName?: string;
  link?: string;
  title: string;
};

export type FeaturesProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["section"]>, "children">, {
  description: ReactNode;
  features: Array<Feature>;
  title: string;
}>;

export default function Features({ className, description, features, title, ...props }: FeaturesProps) {
  return (
    <section {...props} className={classNames("pb-48", className)}>
      <div className="bg-body-tertiary pb-64 pt-40">
        <div className="container">
          <div className="text-center">
            <h2 className="fs-3 fw-semi-bold">{title}</h2>

            <div className="fs-5 mt-8 text-body-secondary">{description}</div>
          </div>
        </div>
      </div>

      <div className="container mt-n40">
        <div className="gx-xl-20 gy-12 row row-cols-1 row-cols-lg-2">
          {features.map((d) => (
            <div className="col d-flex flex-column" key={d.title}>
              <div className="border-0 card h-100 overflow-hidden rounded-4 shadow-lg">
                <div className="card-body d-flex flex-column p-16">
                  <div className="align-items-center d-flex flex-row gap-8">
                    <div
                      className={classNames(
                        "align-items-center d-flex flex-shrink-0 justify-content-center rounded-3 size-3rem text-inverted",
                        d.iconWrapperClassName,
                      )}
                    >
                      {createElement(d.icon, { size: "2rem" })}
                    </div>

                    <div className="overflow-hidden">
                      <h2 className="fs-5 fw-semi-bold mb-0">{d.title}</h2>

                      <div className="fw-medium mt-1 text-body-tertiary">{d.description}</div>
                    </div>
                  </div>

                  <div className="mt-10 text-body-secondary">{d.detail}</div>

                  <div className="mt-auto pt-8" />

                  {d.link !== undefined ? (
                    <Link
                      className="align-items-center bg-primary-focus-visible bg-primary-hover bg-opacity-10-focus-visible bg-opacity-10-hover
                    border-top d-flex fw-semi-bold mb-n16 me-n16 ms-n16 px-16 py-8 text-decoration-none transition-bg"
                      to={d.link}
                    >
                      <div className="flex-grow-1">Learn more</div>

                      <IconArrowRight />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
