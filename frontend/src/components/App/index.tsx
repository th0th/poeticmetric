import { Route, Switch } from "wouter";
import "../../styles/index.css";
import Bootstrap from "~/components/Bootstrap";
import Header from "~/components/Header";
import Home from "~/components/Home";

export default function Index() {
  return (
    <>
      <Header />

      <Switch>
        <Route component={Bootstrap} path="/bootstrap" />
        <Route component={Home} path="/" />

        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
}
