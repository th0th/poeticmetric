import classNames from "classnames";
import { Metadata } from "next";
import DocsMenu from "~components/DocsMenu";
import Footer from "~components/Footer";
import Header, { HeaderProps } from "~components/Header";
import getItems from "~helpers/docs/getItems";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
  params: Record<string, string>;
};

export const metadata: Metadata = {
  title: {
    default: "Free and open source, privacy-friendly Google Analytics alternative",
    template: "%s | PoeticMetric Docs",
  },
};

const headerNavItems: HeaderProps["navItems"] = [
  { href: "/", title: "Home" },
  { href: "/manifesto", title: "Manifesto" },
  { href: "/pricing", title: "Pricing" },
  { href: "/docs", title: "Docs" },
  { href: "/blog", title: "Blog" },
];

export default async function Layout({ children }: LayoutProps) {
  const docsItems = await getItems();

  return (
    <>
      <Header navItems={headerNavItems} />

      <div className="bg-body d-flex flex-column flex-grow-1 flex-md-row">
        <div
          className={classNames(
            "align-items-center align-self-md-start d-flex flex-column flex-shrink-0 px-3 pt-3 p-md-0 sticky-top w-md-16rem",
            styles.docsMenuWrapper,
          )}
        >
          <DocsMenu items={docsItems} />
        </div>

        <div className="border-start-md flex-grow-1 min-w-0 mw-50rem p-5 pt-4 pt-md-5">
          {children}
        </div>
      </div>

      <Footer />
    </>
  );
}
