import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";
import useAuthorization, { ERR_EMAIL_NOT_VERIFIED, ERR_NOT_AUTHENTICATED, UseAuthorizationParams } from "~/hooks/useAuthorization";
import { locationToString } from "~/lib/router";

export type WithAuthorizationParams<IsAuthenticated extends boolean> = UseAuthorizationParams<IsAuthenticated>;

type State = {
  isReady: boolean;
};

const titles: Record<string, string> = {
  ERR_AUTHENTICATED: "Already signed in",
  ERR_EMAIL_NOT_VERIFIED: "Not authorized",
  ERR_EMAIL_VERIFIED: "Not authorized",
  ERR_NOT_AUTHENTICATED: "Sign in required",
  ERR_NOT_ORGANIZATION_OWNER: "Not authorized",
  ERR_ORGANIZATION_OWNER: "Not authorized",
};

const descriptions: Record<string, string> = {
  ERR_AUTHENTICATED: "You are already authenticated.",
  ERR_EMAIL_NOT_VERIFIED: "You are not authorized to access this page.",
  ERR_EMAIL_VERIFIED: "You are not authorized to access this page.",
  ERR_NOT_AUTHENTICATED: "You need to sign in to access this page.",
  ERR_NOT_ORGANIZATION_OWNER: "You are not authorized to access this page.",
  ERR_ORGANIZATION_OWNER: "You are not authorized to access this page.",
};

export default function withAuthorization<IsAuthenticated extends boolean>(
  params: WithAuthorizationParams<IsAuthenticated>,
) {
  function Wrapped() {
    const location = useLocation();
    const next = useMemo(() => encodeURIComponent(locationToString(location)), [location]);
    const [state, setState] = useState<State>({ isReady: false });
    const { state: authenticationState } = useAuthentication();
    const { error: authorizationError, isAuthorized } = useAuthorization(params);
    const title = useMemo(() => authorizationError === undefined ? "" : titles[authorizationError], [authorizationError]);
    const description = useMemo(() => authorizationError === undefined ? "" : descriptions[authorizationError], [authorizationError]);
    const isSignInButtonShown = useMemo(() => [ERR_NOT_AUTHENTICATED].includes(authorizationError || ""), [authorizationError]);
    const isVerifyEmailButtonShown = useMemo(() => [ERR_EMAIL_NOT_VERIFIED].includes(authorizationError || ""), [authorizationError]);

    const setIsReady = useEffectEvent((isReady: State["isReady"]) => {
      setState((s) => ({ ...s, isReady }));
    });

    useEffect(() => {
      setIsReady(true);
    }, []);

    if (!state.isReady || isAuthorized === undefined || authenticationState.isNavigationInProgress) {
      return (
        <div className="align-items-center d-flex flex-grow-1 justify-content-center">
          <ActivityIndicator />
        </div>
      );
    }

    if (isAuthorized) {
      return <Outlet />;
    }

    return (
      <>
        <Title>{title}</Title>

        <div className="container mw-32rem py-16">
          <div className="text-center">
            <h1 className="fs-5_5 fw-bold text-primary-emphasis">Access denied</h1>

            <h2 className="display-5">{title}</h2>

            <div className="fs-5_5 text-body-emphasis">{description}</div>

            <div className="align-items-center d-flex flex-column flex-sm-row gap-8 justify-content-center mt-12">
              {isSignInButtonShown ? (
                <Link className="btn btn-primary" to={`/sign-in?next=${next}`}>Sign in to continue</Link>
              ) : null}

              {isVerifyEmailButtonShown ? (
                <Link className="btn btn-primary" to={`/email-address-verification?next=${next}`}>Verify e-mail address</Link>
              ) : null}

              <Link className="btn btn-outline-primary" to="/">Go back to home page</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return Wrapped;
}
