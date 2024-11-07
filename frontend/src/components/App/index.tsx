import { Route, Switch } from "wouter";
import "../../styles/style.css";
import Bootstrap from "~/components/Bootstrap";
import Error from "~/components/Error";
import Header from "~/components/Header";
import Home from "~/components/Home";
import SignIn from "~/components/SignIn";
import SignUp from "~/components/SignUp";
import Sites from "~/components/Sites";

export default function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route component={Sites} path="/sites" />
        <Route component={SignUp} path="/sign-up" />
        <Route component={SignIn} path="/sign-in" />
        <Route component={Bootstrap} path="/bootstrap" />
        <Route component={Home} path="/" />

        <Route>
          <Error />
        </Route>
      </Switch>
    </>
  );
}
