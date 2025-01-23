import { IconBrandLinkedin, IconMail, IconMenu2 } from "@tabler/icons-react";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, Nav, Navbar, NavItem, NavLink as BsNavLink, Offcanvas } from "react-bootstrap";
import { Link } from "wouter";
import Logo from "~/components/Logo";
import useAuthentication from "~/hooks/useAuthentication";
import useHeaderVariant from "~/hooks/useHeaderVariant";
import styles from "./Header.module.scss";
import UserDropdown from "./UserDropdown";

type State = {
  isOffcanvasShown: boolean;
};

type NavItemWithItems = {
  items: Array<NavItemWithTo>;
  title: string;
};

type NavItemWithTo = {
  title: string;
  to: string;
};

type NavItem = NavItemWithItems | NavItemWithTo;

export default function Header() {
  const offcanvasBody = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>({ isOffcanvasShown: false });
  const { user } = useAuthentication();
  const variant = useHeaderVariant();

  const navItems = useMemo<Array<NavItem>>(() => {
    if (variant === "application") {
      const v = [];

      if (user !== undefined && user !== null && user.isEmailVerified) {
        v.push(
          { title: "Sites", to: "/sites" },
          { title: "Team", to: "/team" },
        );
      }

      return v;
    }

    if (variant === "site") {
      return [
        { title: "Home", to: "/" },
        { title: "Manifesto", to: "/manifesto" },
        { title: "Pricing", to: "/pricing" },
        { title: "Docs", to: "/docs" },
        { title: "Blog", to: "/blog" },
      ];
    }

    return [];
  }, [user, variant]);

  const toggleOffcanvas = useCallback(() => {
    setState((s) => ({ ...s, isOffcanvasShown: !s.isOffcanvasShown }));
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.target !== null
        && "closest" in event.target
        && typeof event.target.closest === "function"
        && event.target.closest("a:not([role])") !== null
      ) {
        setState((s) => ({ ...s, isOffcanvasShown: false }));
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <Navbar
      as="header"
      className={classNames(
        "backdrop-blur bg-body bg-opacity-50 border-bottom position-sticky py-0 sticky-top z-1046",
        styles.header,
      )}
      expand="md"
    >
      <div className="container gap-4">
        <Navbar.Toggle onClick={toggleOffcanvas}>
          <IconMenu2 />
        </Navbar.Toggle>

        <Navbar.Brand as={Link} className={classNames("d-none d-sm-block me-1", styles.navbarBrand)} to="/">
          <Logo className="d-block h-100" logotype={variant === "site"} />
        </Navbar.Brand>

        <Navbar.Offcanvas
          backdrop={false}
          className={classNames("backdrop-blur backdrop-md-none h-auto", styles.offcanvas)}
          placement="top"
          show={state.isOffcanvasShown}
        >
          <Offcanvas.Body className="d-flex flex-column flex-md-row" ref={offcanvasBody}>
            <Nav className="me-md-auto px-4 px-md-0 py-3 py-md-0 text-center">
              {navItems.map((navItem) => "items" in navItem ? (
                <Dropdown as={NavItem} key={navItem.title}>
                  <Dropdown.Toggle as={BsNavLink}>{navItem.title}</Dropdown.Toggle>

                  <Dropdown.Menu className="text-center text-md-start">
                    {navItem.items.map((subNavItem) => (
                      <Dropdown.Item as={Link} key={subNavItem.title} to={subNavItem.to}>{subNavItem.title}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="nav-item" key={navItem.title}>
                  <Link className={(isActive) => classNames("nav-link", isActive && "active")} to={navItem.to}>
                    {navItem.title}
                  </Link>
                </div>
              ))}
            </Nav>

            <div className="align-items-center d-flex d-md-none flex-row gap-4 mt-auto">
              <div className="align-items-center d-flex flex-row gal-2">
                <a className="p-2" href="https://www.linkedin.com/company/webgazer/" target="_blank">
                  <IconBrandLinkedin />
                </a>

                <a className="p-2" href="mailto:info@webgazer.io">
                  <IconMail />
                </a>
              </div>

              <div className="mx-auto" />

              {user === null ? (
                <>
                  <Link className="btn btn-outline-primary" to="/sign-in">Sign in</Link>

                  <Link className="btn btn-primary" to="/sign-up">Sign up</Link>
                </>
              ) : (
                <>
                  {variant === "site" ? (
                    <Link className="btn btn-primary" to="/sites">Go to application</Link>
                  ) : null}
                </>
              )}
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        <div className="gap-4 align-items-center d-flex flex-row ms-auto">
          {user ? (
            <>
              {variant === "site" ? (
                <Link className="btn btn-primary btn-sm d-none d-md-block" to="/sites">Go to application</Link>
              ) : null}

              <UserDropdown />
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary btn-sm d-none d-sm-block" to="/sign-in">Sign in</Link>

              <Link className="btn btn-primary btn-sm" to="/sign-up">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </Navbar>
  );
}
