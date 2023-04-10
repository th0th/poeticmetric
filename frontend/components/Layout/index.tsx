import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { LayoutContext, LayoutContextState, LayoutContextValue } from "../../contexts";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./Layout.module.scss";

type LayoutKind = "app" | "website";

export type LayoutProps = {
  children: React.ReactNode;
  kind: LayoutKind;
};

export function Layout({ children, kind }: LayoutProps) {
  const [layoutContextState, setLayoutContextState] = useState<LayoutContextState>({ headerHeight: 0 });

  const value = useMemo<LayoutContextValue>(() => ({
    ...layoutContextState,
    kind,
    set: setLayoutContextState,
  }), [kind, layoutContextState]);

  return (
    <LayoutContext.Provider value={value}>
      <Header />

      <div className={classNames("d-flex flex-column flex-grow-1", styles.body)}>{children}</div>

      <Footer />
    </LayoutContext.Provider>
  );
}
