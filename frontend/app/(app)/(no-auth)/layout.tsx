"use client";

import Auth from "~components/Auth";
import Header from "~components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Auth
      ifAuthenticated={(
        <div className="d-block m-auto spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      ifUnauthenticated={(
        <>
          <Header />

          {children}
        </>
      )}
      replaceIfAuthenticated="/sites"
    />
  );
}
