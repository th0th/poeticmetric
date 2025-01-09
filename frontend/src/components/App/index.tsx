import { domAnimation, LazyMotion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import AppErrorBoundary from "~/components/AppErrorBoundary";
import Error from "~/components/Error";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Home from "~/components/Home";
import SWRConfig from "~/components/SWRConfig";
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

export default function App({ path }: AppProps) {
  return (
    <AppErrorBoundary>
      <LazyMotion features={domAnimation}>
        <Router ssrPath={path}>
          <SWRConfig>
            <AuthenticationProvider>
              <Header />

              <Suspense fallback={(<h1>Loading</h1>)}>
                <Switch>
                  <Route component={Home} path="/" />
                  <Route component={Bootstrap} path="/bootstrap" />
                  <Route component={Manifesto} path="/manifesto" />
                  <Route component={PasswordRecovery} path="/password-recovery" />
                  <Route component={PasswordReset} path="/password-reset" />
                  <Route component={Settings} path="/settings" />
                  <Route component={Settings} path="/settings/password" />
                  <Route component={Settings} path="/settings/profile" />
                  <Route component={SignIn} path="/sign-in" />

                  <Route>
                    <Error />
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
