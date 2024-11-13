import { Route, Switch } from "wouter";
import "../../styles/style.css";
import Bootstrap from "~/components/Bootstrap";
import Error from "~/components/Error";
import Home from "~/components/Home";
import Manifesto from "~/components/Manifesto";
import SignIn from "~/components/SignIn";

export default function App() {
  return (
    <>
      <Switch>
        <Route component={Bootstrap} path="/bootstrap" />
        <Route component={Home} path="/" />
        <Route component={Manifesto} path="/manifesto" />
        <Route component={SignIn} path="/sign-in" />

        <Route>
          <Error />
        </Route>
      </Switch>
    </>
  );
}
