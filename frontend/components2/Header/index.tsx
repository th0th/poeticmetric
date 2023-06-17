"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useMeasure } from "react-use";
import ColorModeDropdown from "~components/ColorModeDropdown";
import HeaderActions from "~components/HeaderActions";
import Logo from "~components/Logo";
import UserMenu from "~components/UserMenu";

type NavItem = {
  href: string;
  title: string;
};

export type HeaderProps = {
  navItems?: Array<NavItem>;
};

const offcanvasId = "header-offcanvas";

export default function Header({ navItems }: HeaderProps) {
  const pathname = usePathname();
  const [ref, { bottom, top }] = useMeasure<HTMLElement>();

  useEffect(() => {
    document.documentElement.style.setProperty("--header-height", `${top + bottom + 1}px`);
  }, [bottom, top]);

  return (
    <header className="bg-body border-1 border-bottom navbar navbar-expand-md sticky-top" ref={ref}>
      <div className="container">
        <button
          className="navbar-toggler"
          data-bs-target={`#${offcanvasId}`}
          data-bs-toggle="offcanvas"
          type="button"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="me-0 me-md-3 navbar-brand">
          <Link href="/">
            <Logo className="d-block" style={{ height: 38 }} />
          </Link>
        </div>

        <div className="offcanvas offcanvas-start" id={offcanvasId} tabIndex={-1}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">PoeticMetric</h5>

            <button className="btn-close" data-bs-dismiss="offcanvas" type="button"></button>
          </div>

          <div className="offcanvas-body pt-0">
            <hr className="d-md-none mb-2 mt-0 text-body-secondary" />

            {navItems !== undefined ? (
              <ul className="flex-row flex-wrap navbar-nav">
                {navItems.map((navItem) => (
                  <li className="col-6 col-md-auto nav-item" key={navItem.href}>
                    <Link
                      className={classNames(
                        "nav-link",
                        navItem.href === "/" && pathname === "/" && "active",
                        navItem.href !== "/" && pathname?.startsWith(navItem.href) && "active",
                      )}
                      href={navItem.href}
                    >
                  <span>
                    {navItem.title}
                  </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <hr className="d-md-none my-2 text-body-secondary" />

            <ColorModeDropdown className="ms-auto" />
          </div>
        </div>

        <div className="d-flex flex-nowrap flex-row gap-1">
          <HeaderActions />

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
