import React from "react";
import { LayoutContext } from "../../contexts";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutKind = "app" | "website";

export type LayoutProps = {
  children: React.ReactNode;
  kind: LayoutKind;
};

export function Layout({ children, kind }: LayoutProps) {
  return (
    <LayoutContext.Provider value={{ kind }}>
      <Header />

      <div className="flex-grow-1">{children}</div>

      <Footer />
    </LayoutContext.Provider>
  );
}
