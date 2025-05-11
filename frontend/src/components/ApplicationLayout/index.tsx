import { Outlet } from "react-router";
import Header from "~/components/Header";

export default function ApplicationLayout() {
  return (
    <>
      <Header layoutVariant="application" />

      <main className="d-flex flex-column flex-grow-1">
        <Outlet />
      </main>
    </>
  );
}
