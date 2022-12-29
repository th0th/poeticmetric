import React from "react";
import { Header, HeaderProps } from "./Header";

export type LayoutProps = {
  children: React.ReactNode;
  headerKind: HeaderProps["kind"];
};

export function Layout({ children, headerKind }: LayoutProps) {
  return (
    <>
      <Header kind={headerKind} />

      {children}
    </>
  );
}
