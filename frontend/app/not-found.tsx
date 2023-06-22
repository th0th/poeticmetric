import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Footer from "~components/Footer";
import Header from "~components/Header";
import NotFoundVisual from "./not-found-visual.svg";

export const metadata: Metadata = {
  description: "Sorry, the page you are looking for could not be found. Please check the URL and try again or visit our homepage for information.",
  title: "404 - Page not found",
};

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="container d-flex flex-column flex-grow-1 justify-content-center py-5">
        <div className="align-items-center d-flex flex-column flex-lg-row mw-50rem mx-auto text-center text-lg-start">
          <NotFoundVisual className="d-block w-16rem" />

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
      </div>

      <Footer />
    </>
  );
}
