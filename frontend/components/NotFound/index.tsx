import Link from "next/link";
import React from "react";
import { Container } from "react-bootstrap";
import { Description, Layout, Title } from "..";
import Visual from "./404.svg";

export function NotFound() {
  return (
    <Layout kind={process.env.NEXT_PUBLIC_HOSTED === "true" ? "website" : "app"}>
      <Title>404 - Page not found</Title>
      <Description>
        Sorry, the page you&apos;re looking for could not be found. Please check the URL and try again or visit our homepage for more
        information.
      </Description>

      <Container className="d-flex flex-column flex-grow-1 justify-content-center py-5">
        <div className="align-items-center d-flex flex-column flex-lg-row mw-50rem mx-auto text-center text-lg-start">
          <Visual className="d-block w-16rem" />

          <div className="mw-34rem ps-lg-5 pt-3 pt-lg-0">
            <h1>Page not found</h1>

            <div className="fs-5">
              <p>
                We&apos;re sorry, but the page you&apos;re looking for can&apos;t be found. It may have been moved or removed.
              </p>
            </div>

            <Link className="btn btn-primary" href="/">Go to home page</Link>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
