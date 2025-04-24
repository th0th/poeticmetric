import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import classNames from "classnames";
import { JSX, PropsWithoutRef, ReactNode } from "react";
import { Link } from "wouter";
import animationAnalytics from "./analytics.lottie?url";

export type CallToActionProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["section"]>, "children">, {
  description: ReactNode;
  title: ReactNode;
}>;

export default function CallToAction({ className, description, title, ...props }: CallToActionProps) {
  return (
    <section {...props} className={classNames("py-64", className)}>
      <div className="container">
        <div className="gy-24 row">
          <div className="col-12 col-lg-5">
            <DotLottieReact
              autoplay
              className="flex-shrink-0"
              loop
              src={animationAnalytics}
            />
          </div>

          <div className="col-12 col-lg-7 d-flex flex-column justify-content-center">
            <h2 className="fs-3 fw-bold">{title}</h2>

            <div className="fs-5_5 mt-6 text-body-secondary">{description}</div>

            <div className="align-items-center d-flex flex-column flex-sm-row gap-6 mt-8">
              <Link className="btn btn-primary" to="/sign-up">Sign up now</Link>

              <Link className="btn btn-link gap-4 hstack justify-content-center text-decoration-none" to="/pricing">See plans and pricing</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
