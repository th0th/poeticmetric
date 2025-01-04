import clsx from "clsx";
import { JSX, PropsWithoutRef, ReactNode } from "react";
import Header, { HeaderProps } from "~/components/Header";

export type LayoutProps = {
  children: ReactNode;
  headerProps?: HeaderProps;
  mainClassName?: PropsWithoutRef<JSX.IntrinsicElements["main"]>["className"];
};

export default function Layout({ children, headerProps, mainClassName }: LayoutProps) {
  return (
    <>
      <Header {...headerProps} />

      <main className={clsx("d-flex flex-grow-1", mainClassName)}>{children}</main>
    </>
  );
}
