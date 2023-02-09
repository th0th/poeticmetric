import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { Container } from "react-bootstrap";

export type CallToActionProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["section"]>, "children">, {
  buttonTitle?: string;
  showPricingLink?: boolean;
  title: string;
}>;

export function CallToAction({ buttonTitle = "Get started", className, showPricingLink = false, title, ...props }: CallToActionProps) {
  return (
    <section {...props} className={classNames("py-5", className)}>
      <Container className="text-center">
        <h2>{title}</h2>

        <Link className="btn btn-lg btn-primary mt-3" href="/sign-up">{buttonTitle}</Link>

        {showPricingLink ? (
          <div className="mt-2">
            <Link className="fw-bold text-decoration-none text-decoration-underline-hover text-primary" href="/pricing">See plans and pricing</Link>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
