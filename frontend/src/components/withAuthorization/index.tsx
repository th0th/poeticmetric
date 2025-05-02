import { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import Title from "~/components/Title";
import useAuthorization, { ERR_EMAIL_NOT_VERIFIED, ERR_NOT_AUTHENTICATED, UseAuthorizationParams } from "~/hooks/useAuthorization";

export type WithAuthorizationParams<IsAuthenticated extends boolean> = UseAuthorizationParams<IsAuthenticated>;

type State = {
  isReady: boolean;
};

const titles: Record<string, string> = {
  ERR_AUTHENTICATED: "Not authorized",
  ERR_EMAIL_NOT_VERIFIED: "Not authorized",
  ERR_EMAIL_VERIFIED: "Not authorized",
  ERR_NOT_AUTHENTICATED: "Sign in required",
  ERR_NOT_ORGANIZATION_OWNER: "Not authorized",
  ERR_ORGANIZATION_OWNER: "Not authorized",
};

const descriptions: Record<string, string> = {
  ERR_AUTHENTICATED: "You are not authorized to access this page.",
  ERR_EMAIL_NOT_VERIFIED: "You are not authorized to access this page.",
  ERR_EMAIL_VERIFIED: "You are not authorized to access this page.",
  ERR_NOT_AUTHENTICATED: "You need to sign in to access this page.",
  ERR_NOT_ORGANIZATION_OWNER: "You are not authorized to access this page.",
  ERR_ORGANIZATION_OWNER: "You are not authorized to access this page.",
};

export default function withAuthorization<IsAuthenticated extends boolean>(
  Component: FC,
  params: WithAuthorizationParams<IsAuthenticated>,
) {
  function Wrapped() {
    const [location] = useLocation();
    const [state, setState] = useState<State>({ isReady: false });
    const { error: authorizationError, isAuthorized } = useAuthorization(params);
    const title = useMemo(() => authorizationError === undefined ? "" : titles[authorizationError], [authorizationError]);
    const description = useMemo(() => authorizationError === undefined ? "" : descriptions[authorizationError], [authorizationError]);
    const isSignInButtonShown = useMemo(() => [ERR_NOT_AUTHENTICATED].includes(authorizationError || ""), [authorizationError]);
    const isVerifyEmailButtonShown = useMemo(() => [ERR_EMAIL_NOT_VERIFIED].includes(authorizationError || ""), [authorizationError]);

    useEffect(() => {
      setState((s) => ({ ...s, isReady: true }));
    }, []);

    return !state.isReady || isAuthorized === undefined ? (
      <div className="align-items-center d-flex flex-grow-1 justify-content-center">
        <ActivityIndicator />
      </div>
    ) : (
      <>
        {isAuthorized ? (
          <Component />
        ) : (
          <>
            <Title>{title}</Title>

            <div className="container mw-32rem py-16">
              <div className="text-center">
                <h1 className="fs-5_5 fw-bold text-primary-emphasis">Access denied</h1>

                <h2 className="display-5">{title}</h2>

                <div className="fs-5_5 text-body-emphasis">{description}</div>

                <div className="align-items-center d-flex flex-column flex-sm-row gap-8 justify-content-center mt-12">
                  {isSignInButtonShown ? (
                    <Link className="btn btn-primary" to={`/sign-in?next=${location}`}>Sign in to continue</Link>
                  ) : null}

                  {isVerifyEmailButtonShown ? (
                    <Link className="btn btn-primary" to={`/email-address-verification?next=${location}`}>Verify e-mail address</Link>
                  ) : null}

                  <Link className="btn btn-outline-primary" to="/">Go back to home page</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return Wrapped;
}
