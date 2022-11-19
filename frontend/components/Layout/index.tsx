import React from "react";
import { Header } from "..";

export type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />

      {children}
    </>
  );
}
