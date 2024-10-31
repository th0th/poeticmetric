import { Link } from "wouter";
import Logo from "~/components/Logo";
import clsx from "clsx";

const links: Array<{ link: string, name: string }> = [
  { link: "/", name: "Home" },
  { link: "/manifesto", name: "Manifesto" },
  { link: "/pricing", name: "Pricing" },
  { link: "/docs", name: "Docs" },
];

export default function Header() {
  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <Logo height="36" />
          </Link>

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
      </nav>
    </header>
  );
}
