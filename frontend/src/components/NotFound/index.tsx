import { Link } from "wouter";
import Title from "~/components/Title";
import ImageNotFound from "./not-found.svg";

export default function NotFound() {
  return (
    <>
      <Title>404 - Page not found</Title>

      <div className="align-items-center container d-flex flex-grow-1 py-16">
        <div className="align-items-center row row-cols-1 row-cols-md-2">
          <div className="col">
            <img alt="error" className="d-block mw-100 w-32rem" src={ImageNotFound} />
          </div>

          <div className="col fs-5 text-center text-md-start">
            <h1>404 - Page not found</h1>

            <p className="mt-8">
              The page you requested could not be found, it might be removed or had its name changed.
            </p>

            <Link className="btn btn-primary" to="/">Go to home page</Link>
          </div>
        </div>
      </div>
    </>
  );
}
