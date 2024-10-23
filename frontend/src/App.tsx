import { Route, Switch } from "wouter";
import "./index.css";
import Home from "~/components/Home";

export default function App() {
  return (
    <Switch>
      <Route component={Home} path="/" />

      <Route>404: No such page!</Route>
    </Switch>
  );
}
