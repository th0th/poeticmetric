import classNames from "classnames";
import { JSX, PropsWithoutRef, ReactNode } from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import useLayoutVariant from "~/hooks/useLayoutVariant";

export type LayoutProps = {
  children: ReactNode;
  mainClassName?: PropsWithoutRef<JSX.IntrinsicElements["main"]>["className"];
};

export default function Layout({ children, mainClassName }: LayoutProps) {
  const layoutVariant = useLayoutVariant();

  return (
    <>
      <Header layoutVariant={layoutVariant} />

      <main className={classNames("d-flex flex-grow-1", mainClassName)}>{children}</main>

      {layoutVariant === "site" ? (
        <Footer />
      ) : null}
    </>
  );
}
