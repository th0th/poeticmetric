import { IconMenu2 } from "@tabler/icons-react";
import clsx from "clsx";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import Collapse from "~/components/Collapse";
import styles from "./Header.module.css";
import Logo from "~/components/Logo";
import { useLocation } from "wouter";

const links: Array<{ link: string, name: string }> = [
  { link: "/", name: "Home" },
  { link: "/manifesto", name: "Manifesto" },
  { link: "/pricing", name: "Pricing" },
  { link: "/docs", name: "Docs" },
];

export default function Header() {
  const [location] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location]);

  const navLinks = useMemo<ReactNode>(() => (
    <ul className={clsx(styles.navbarNav)}>
      {links.map(({ link, name }) => (
        <li key={name}>
          <Link
            className={(active) => clsx(styles.navLink, { active })}
            to={link}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  ), []);

  return (
    <header>
      <nav className={clsx(styles.navbar)}>
        <div className={clsx("container")}>
          <Link className={clsx(styles.navbarBrand)} to="/">
            <Logo height="36" />
          </Link>

          <button
            className={clsx("button", styles.navbarToggler)}
            onClick={() => setIsDrawerOpen((prev) => !prev)}
          >
            <IconMenu2 size={24} style={{ verticalAlign: "middle" }} />
          </button>

          <Collapse className={styles.navbarCollapse} open={isDrawerOpen}>
            {navLinks}
          </Collapse>
        </div>
      </nav>
    </header>
  );
}
