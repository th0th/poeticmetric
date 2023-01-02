import React, { useMemo } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutKind = "app" | "website";

export type LayoutProps = {
  children: React.ReactNode;
  kind: LayoutKind;
};

export function Layout({ children, kind }: LayoutProps) {
  const headerNode = useMemo<React.ReactNode>(() => <Header kind={kind} />, [kind]);

  const footerNode = useMemo<React.ReactNode>(() => (kind === "website" ? <Footer /> : null), [kind]);

  return (
    <>
      {headerNode}

      <div className="flex-grow-1">{children}</div>

      {footerNode}
    </>
  );
}
