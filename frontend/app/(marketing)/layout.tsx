import Footer from "~components/Footer";
import Header, { HeaderProps } from "~components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

const headerNavItems: HeaderProps["navItems"] = [
  { href: "/", title: "Home" },
  { href: "/manifesto", title: "Manifesto" },
  { href: "/pricing", title: "Pricing" },
  { href: "/docs", title: "Docs" },
  { href: "/blog", title: "Blog" },
];

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header navItems={headerNavItems} />

      {children}

      <Footer />
    </>
  );
}
