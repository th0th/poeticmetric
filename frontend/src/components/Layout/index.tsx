import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";
import { Outlet } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import useLayoutVariant from "~/hooks/useLayoutVariant";

export type LayoutProps = {
  mainClassName?: PropsWithoutRef<JSX.IntrinsicElements["main"]>["className"];
};

export default function Layout({ mainClassName }: LayoutProps) {
  const layoutVariant = useLayoutVariant();

  return (
    <>
      <Header layoutVariant={layoutVariant} />

      <main className={classNames("d-flex flex-column flex-grow-1", mainClassName)}>
        <Outlet />
      </main>

      {layoutVariant === "site" ? (
        <Footer />
      ) : null}
    </>
  );
}
