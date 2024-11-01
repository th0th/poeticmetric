import { Route, Switch } from "wouter";
import "../../styles/style.css";
import Bootstrap from "~/components/Bootstrap";
import Error from "~/components/Error";
import Header from "~/components/Header";
import Home from "~/components/Home";
import { ToastContextProvider } from "~/components/Toast";

export default function App() {
  return (
    <>
      <ToastContextProvider>
        <Header />

        <Switch>
          <Route component={Bootstrap} path="/bootstrap" />
          <Route component={Home} path="/" />

          <Route>
            <Error />
          </Route>
        </Switch>
      </ToastContextProvider>
    </>
  );
}
