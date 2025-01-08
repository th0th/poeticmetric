import classNames from "classnames";
import { JSX, PropsWithoutRef, ReactNode } from "react";
import Header from "~/components/Header";

export type LayoutProps = {
  children: ReactNode;
  mainClassName?: PropsWithoutRef<JSX.IntrinsicElements["main"]>["className"];
};

export default function Layout({ children, mainClassName }: LayoutProps) {
  return (
    <>
      <Header />

      <main className={classNames("d-flex flex-grow-1", mainClassName)}>{children}</main>
    </>
  );
}
