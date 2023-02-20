import Link from "next/link";
import React, { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { AuthContext } from "../../../contexts";

export function Jumbotron() {
  const { user } = useContext(AuthContext);

  return (
    <section className="py-5">
      <Container className="text-center">
        <h1 className="fw-bold lh-base">
          Privacy-first, regulation compliant
          <br />
          Google Analytics alternative
        </h1>

        <div className="fs-5 fw-medium">
          PoeticMetric is a free as in freedom, open source, privacy-first and
          <br />
          regulation-compliant web analytics tool.
        </div>

        <Stack className="justify-content-center mt-3" direction="horizontal" gap={3}>
          {user === null ? (
            <Link className="btn btn-lg btn-primary" href="/sign-up">Sign up</Link>
          ) : (
            <Link className="btn btn-lg btn-primary" href="/sites">Go to app</Link>
          )}

          <Link className="btn btn-lg btn-outline-primary" href="/s?d=www.poeticmetric.com">See demo</Link>
        </Stack>
      </Container>
    </section>
  );
}
