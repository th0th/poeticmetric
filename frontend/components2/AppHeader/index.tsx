import Header, { HeaderProps } from "~components/Header";
import useAuthUser from "~hooks/useAuthUser";

export default function AppHeader() {
  const { data } = useAuthUser();

  const headerNavItems: HeaderProps["navItems"] = [
    { href: "/sites", title: "Sites" },
    { href: "/team", title: "Team" },
  ];

  if (data?.isOrganizationOwner) {
    headerNavItems.push({ href: "/billing", title: "Billing" });
  }

  return (
    <Header navItems={data !== undefined ? headerNavItems : undefined} />
  );
}
