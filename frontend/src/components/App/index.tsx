import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import AppErrorBoundary from "~/components/AppErrorBoundary";
import Error from "~/components/Error";
import Home from "~/components/Home";
import SWRConfig from "~/components/SWRConfig";
import AuthenticationProvider from "../AuthenticationProvider";
import "~/styles/style.scss";

export type AppProps = {
  path?: string;
};

export default function App({ path }: AppProps) {
  return (
    <AppErrorBoundary>
      <Suspense fallback={(<h1>Loading</h1>)}>
        <Router ssrPath={path}>
          <SWRConfig>
            <AuthenticationProvider>
              <Switch>
                <Route component={lazy(() => import("~/components/Bootstrap"))} path="/bootstrap" />
                <Route component={Home} path="/" />
                <Route component={lazy(() => import("~/components/Manifesto"))} path="/manifesto" />
                <Route component={lazy(() => import("~/components/PasswordRecovery"))} path="/password-recovery" />
                <Route component={lazy(() => import("~/components/PasswordReset"))} path="/password-reset" />
                <Route component={lazy(() => import("~/components/SignIn"))} path="/sign-in" />

                <Route>
                  <Error />
                </Route>
              </Switch>
            </AuthenticationProvider>
          </SWRConfig>
        </Router>
      </Suspense>
    </AppErrorBoundary>
  );
}
