import { useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import Title from "~/components/Title";
import ImageError from "./error.svg";

export type ErrorProps = {
  error: any;
  resetErrorBoundary: (...args: any[]) => void;
};

export default function Error({ error, resetErrorBoundary }: ErrorProps) {
  const [location, navigate] = useLocation();

  const isAuthenticationFailed = useMemo(() => error.message === "Invalid credentials.", [error]);

  useEffect(() => {
    if (isAuthenticationFailed) {
      window.location.href = "/sign-in";
    }
  }, [isAuthenticationFailed, navigate, resetErrorBoundary]);

  return isAuthenticationFailed ? (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center">
      <div className="spinner spinner-border text-primary" role="status" />
    </div>
  ) : (
    <>
      <Title>An error has occurred</Title>

      <main className="align-items-center d-flex flex-grow-1">
        <div className="container py-16">
          <div className="align-items-center row row-cols-1 row-cols-md-2">
            <div className="col">
              <img alt="error" className="d-block mw-100 w-32rem" src={ImageError} />
            </div>

            <div className="col">
              <h1>An error has occurred.</h1>

              <div className="fs-5 mt-8">
                <p>
                  We apologize for the inconvenience. Our team has been notified, and we&apos;re working to fix the issue. Please try
                  again later.
                </p>

                <p>
                  If the problem persists, please
                  {" "}
                  <a href={`mailto:support@poeticmetric.com?subject=I%20encounter%20an%20error%20in%20${location}`}>contact support</a>
                  {" "}
                  for assistance.
                </p>
              </div>

              <div className="mt-12">
                <Link className="btn btn-lg btn-primary" to="/">Return to the home page</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
