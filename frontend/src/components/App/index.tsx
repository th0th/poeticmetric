import { Route, Switch } from "wouter";
import "../../styles/style.css";
import AuthProvider from "~/components/AuthProvider";
import Bootstrap from "~/components/Bootstrap";
import Error from "~/components/Error";
import Home from "~/components/Home";
import Manifesto from "~/components/Manifesto";
import PasswordRecovery from "~/components/PasswordRecovery";
import PasswordReset from "~/components/PasswordReset";
import SignIn from "~/components/SignIn";

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
