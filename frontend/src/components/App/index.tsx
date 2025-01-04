import { Suspense } from "react";
import { Route, Switch } from "wouter";
import SWRConfig from "~/components/SWRConfig";
import AuthenticationProvider from "../AuthenticationProvider";
import Bootstrap from "~/components/Bootstrap";
import Error from "~/components/Error";
import Home from "~/components/Home";
import Manifesto from "~/components/Manifesto";
import PasswordRecovery from "~/components/PasswordRecovery";
import PasswordReset from "~/components/PasswordReset";
import SignIn from "~/components/SignIn";
import "~/styles/style.scss";

export default function App() {
  return (
    <Suspense fallback={(<h1>Loading...</h1>)}>
      <SWRConfig>
        <AuthenticationProvider>
          <Switch>
            <Route component={Bootstrap} path="/bootstrap" />
            <Route component={Home} path="/" />
            <Route component={Manifesto} path="/manifesto" />
            <Route component={PasswordRecovery} path="/forgot-password" />
            <Route component={PasswordReset} path="/password-reset" />
            <Route component={SignIn} path="/sign-in" />

            <Route>
              <Error />
            </Route>
          </Switch>
        </AuthenticationProvider>
      </SWRConfig>
    </Suspense>
  );
}
