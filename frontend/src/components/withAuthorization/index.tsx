import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import useAuthorization, { UseAuthorizationParams } from "~/hooks/useAuthorization";

export type WithAuthorizationParams<IsAuthenticated extends boolean> =
  UseAuthorizationParams<IsAuthenticated>;

type State = {
  isReady: boolean;
};

export default function withAuthorization<IsAuthenticated extends boolean>(
  Component: FC,
  params: WithAuthorizationParams<IsAuthenticated>,
) {
  function Wrapped() {
    const [location] = useLocation();
    const [state, setState] = useState<State>({ isReady: false });
    const isPermitted = useAuthorization(params);

    useEffect(() => {
      setState((s) => ({ ...s, isReady: true }));
    }, []);

    if (!state.isReady || isPermitted === undefined) {
      return (
        <div className="align-items-center d-flex flex-grow-1 justify-content-center">
          <ActivityIndicator />
        </div>
      );
    }

    if (!isPermitted) {
      const title = params.isAuthenticated ? "Sign in required" : "Not authorized";
      const description = params.isAuthenticated ? "You need to sign in to access this page." : "You are not authorized to access this page.";

      return (
        <div className="container mw-32rem py-16">
          <div className="text-center">
            <h1 className="fs-5_5 fw-bold text-primary-emphasis">Access denied</h1>
            <h2 className="display-5">{title}</h2>
            <div className="fs-5_5 text-body-emphasis">{description}</div>

            {params.isAuthenticated && params.isOrganizationOwner === undefined ? (
              <Link className="btn btn-lg btn-primary mt-12" to={`/sign-in?next=${location}`}>Sign in to continue</Link>
            ) : (
              <Link className="btn btn-lg btn-primary mt-12" to="/">Go back to home page</Link>
            )}
          </div>
        </div>
      );
    }

    return (
      <Component />
    );
  }

  return Wrapped;
}
