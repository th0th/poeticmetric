import { domAnimation, LazyMotion } from "framer-motion";
import { lazy, Suspense, useMemo } from "react";
import { Route, Router, Switch } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import AppErrorBoundary from "~/components/AppErrorBoundary";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Home from "~/components/Home";
import NotFound from "~/components/NotFound";
import SWRConfig from "~/components/SWRConfig";
import withRequiredSearchParams from "~/components/withRequiredSearchParams";
import AuthenticationProvider from "../AuthenticationProvider";
import "~/styles/style.scss";

export type AppProps = {
  path?: string;
};

const Bootstrap = lazy(() => import("~/components/Bootstrap"));
const Manifesto = lazy(() => import("~/components/Manifesto"));
const PasswordRecovery = lazy(() => import("~/components/PasswordRecovery"));
const PasswordReset = lazy(() => import("~/components/PasswordReset"));
const Settings = lazy(() => import("~/components/Settings"));
const SignIn = lazy(() => import("~/components/SignIn"));
const Team = lazy(() => import("~/components/Team"));
const TeamMemberForm = lazy(() => import("~/components/TeamMemberForm"));

export default function App({ path }: AppProps) {
  const suspenseFallback = useMemo(() => (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center">
      <ActivityIndicator />
    </div>
  ), []);

  return (
    <AppErrorBoundary>
      <LazyMotion features={domAnimation}>
        <Router ssrPath={path}>
          <SWRConfig>
            <AuthenticationProvider>
              <Header />

              <Suspense fallback={suspenseFallback}>
                <Switch>
                  <Route component={Home} path="/" />
                  <Route component={Bootstrap} path="/bootstrap" />
                  <Route component={Manifesto} path="/manifesto" />
                  <Route component={PasswordRecovery} path="/password-recovery" />
                  <Route component={PasswordReset} path="/password-reset" />
                  <Route component={Settings} path="/settings" />
                  <Route component={Settings} path="/settings/organization-details" />
                  <Route component={Settings} path="/settings/password" />
                  <Route component={Settings} path="/settings/profile" />
                  <Route component={SignIn} path="/sign-in" />
                  <Route component={Team} path="/team" />
                  <Route component={withRequiredSearchParams(TeamMemberForm, ["userID"])} path="/team/edit" />
                  <Route component={TeamMemberForm} path="/team/invite" />

                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </Suspense>

              <Footer />
            </AuthenticationProvider>
          </SWRConfig>
        </Router>
      </LazyMotion>
    </AppErrorBoundary>
  );
}
