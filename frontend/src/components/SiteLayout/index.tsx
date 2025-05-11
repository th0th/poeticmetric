import { Outlet } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

export default function SiteLayout() {
  return (
    <>
      <Header layoutVariant="site" />

      <main className="d-flex flex-column flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
