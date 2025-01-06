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

export default function App({ path }: AppProps) {
  return (
    <AppErrorBoundary>
      <LazyMotion features={domAnimation}>
        <Router ssrPath={path}>
          <SWRConfig>
            <AuthenticationProvider>
              <Suspense fallback={(<h1>Loading</h1>)}>
                <Header />

                <Switch>
                  <Route component={Home} path="/" />
                  <Route component={lazy(() => import("~/components/Bootstrap"))} path="/bootstrap" />
                  <Route component={lazy(() => import("~/components/Manifesto"))} path="/manifesto" />
                  <Route component={lazy(() => import("~/components/PasswordRecovery"))} path="/password-recovery" />
                  <Route component={lazy(() => import("~/components/PasswordReset"))} path="/password-reset" />
                  <Route component={lazy(() => import("~/components/SignIn"))} path="/sign-in" />

                  <Route>
                    <Error />
                  </Route>
                </Switch>

                <Footer />
              </Suspense>
            </AuthenticationProvider>
          </SWRConfig>
        </Router>
      </LazyMotion>
    </AppErrorBoundary>
  );
}
