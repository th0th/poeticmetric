import { Link } from "wouter";
import Logo from "~/components/Logo";
import clsx from "clsx";
import { JSX, PropsWithoutRef, useEffect, useState } from "react";
import { useIsLg } from "~/hooks/useMediaQuery";
import { IconMenu2 } from "@tabler/icons-react";

const links: Array<{ link: string, name: string }> = [
  { link: "/", name: "Home" },
  { link: "/manifesto", name: "Manifesto" },
  { link: "/pricing", name: "Pricing" },
  { link: "/docs", name: "Docs" },
];

export default function Header() {
  const { minLg } = useIsLg();
  const [collapsing, setCollapsing] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (collapsing) {
        setCollapsing(false);

        if (!minLg) {
          setIsDrawerOpen((prev) => !prev);
        }
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [minLg, collapsing]);

  useEffect(() => {
    if (minLg) {
      setIsDrawerOpen(false);
    }
  }, [minLg]);

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <Logo height="36" />
          </Link>

          <button
            className="button navbar-toggler"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
          >
            <IconMenu2 size={24} style={{ verticalAlign: "middle" }} />
          </button>

          <div
            // className={clsx("navbar-collapse", collapsing ? "collapsing" : "collapse", !collapsing && isDrawerOpen && "show")}
            className={clsx("navbar-collapse", "collapse", isDrawerOpen && "show")}
          >
            <ul className="navbar-nav">
              {links.map(({ link, name }) => (
                <li className="nav-item" key={name}>
                  <Link
                    className={(active) => clsx("nav-link", { active })}
                    to={link}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
