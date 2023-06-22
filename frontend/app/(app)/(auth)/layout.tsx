"use client";

import Auth from "~components/Auth";
import Header, { HeaderProps } from "~components/Header";
import useAuthUser from "~hooks/useAuthUser";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { data } = useAuthUser();

  const headerNavItems: HeaderProps["navItems"] = [
    { href: "/sites", title: "Sites" },
    { href: "/team", title: "Team" },
  ];

  if (data?.isOrganizationOwner) {
    headerNavItems.push({ href: "/billing", title: "Billing" });
  }

  return (
    <Auth
      ifAuthenticated={(
        <>
          <Header navItems={headerNavItems} />

          {children}
        </>
      )}
      ifUnauthenticated={(
        <div className="d-block m-auto spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      replaceIfUnauthenticated="/sign-in"
    />
  );
}
