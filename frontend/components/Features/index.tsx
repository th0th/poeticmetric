import classNames from "classnames";
import Link from "next/link";
import React, { HTMLAttributes } from "react";
import { Col, Container, Row } from "react-bootstrap";

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

export function Features({ children, className, features, ...props }: FeaturesProps) {
  return (
    <section {...props} className={classNames("py-5", className)}>
      <Container>
        <div className="fs-5 mw-34rem">{children}</div>

        <div className="mt-5">
          <Row className="gx-4 gy-5" lg={3} md={2} xs={1}>
            {features.map((feature) => (
              <Col key={feature.title}>
                <h5 className="d-inline-block lh-base">
                  <i className={classNames("align-middle fs-4 me-2 text-primary", feature.iconClassName)} />

                  {feature.title}
                </h5>

                <div>{feature.description}</div>

                {feature.link !== undefined ? (
                  <Link className="d-block fs-sm fw-bold mt-3 text-decoration-none text-decoration-underline-hover" href={feature.link.href}>
                    {feature.link.title}

                    &rarr;
                  </Link>
                ) : null}
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
}
