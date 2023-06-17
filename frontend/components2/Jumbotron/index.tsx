import Link from "next/link";
import React from "react";
import Auth from "~components/Auth";

export default function Jumbotron() {
  return (
    <section className="py-5">
      <div className="container text-center">
        <h1 className="fw-bold lh-base">
          Privacy-first, regulation compliant
          <br />
          Google Analytics alternative
        </h1>

        <div className="fs-5 fw-medium">
          PoeticMetric is a free as in freedom, open source, privacy-first and
          <br />
          regulation-compliant website analytics tool.
        </div>

        <div className="gap-3 hstack justify-content-center mt-3">
          <Auth
            ifAuthenticated={(
              <Link className="btn btn-lg btn-primary" href="/sites">Go to app</Link>
            )}
            ifUnauthenticated={(
              <Link className="btn btn-lg btn-primary" href="/sign-up">Sign up</Link>
            )}
          />

          <Link className="btn btn-lg btn-outline-primary" href="/s?d=www.poeticmetric.com">See demo</Link>
        </div>
      </div>
    </section>
  );
}
