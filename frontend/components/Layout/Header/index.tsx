import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LayoutProps, Logo } from "../..";
import { AuthAndApiContext } from "../../../contexts";
import { Actions } from "./Actions";

export type HeaderProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["header"]>, {
  kind: LayoutProps["kind"];
}>;

const navbarId: string = "header-navbar";

export function Header({ className, kind, ...props }: HeaderProps) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);

  const navbarToggleNode = useMemo<React.ReactNode>(() => (kind === "app" && user !== null) || kind === "website" ? (
    <Navbar.Toggle aria-controls={navbarId} className="me-3" />
  ) : null, [kind, user]);

  const navbarCollapseNode = useMemo<React.ReactNode>(() => {
    if (kind === "app") {
      return (
        <Navbar.Collapse id={navbarId}>
          <Nav>
            <Nav.Item>
              <Nav.Link active={router.pathname.startsWith("/sites")} as={Link} href="/sites">Sites</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link active={router.pathname.startsWith("/team")} as={Link} href="/team">Team</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link active={router.pathname.startsWith("/billing")} as={Link} href="/billing">Billing</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      );
    }

    return (
      <Navbar.Collapse id={navbarId}>
        <Nav>
          <Nav.Item>
            <Nav.Link active={router.pathname === "/"} as={Link} href="/">Home</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link active={router.pathname.startsWith("/manifesto")} as={Link} href="/manifesto">Manifesto</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link active={router.pathname.startsWith("/pricing")} as={Link} href="/pricing">Pricing</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link active={router.pathname.startsWith("/docs")} as={Link} href="/docs">Docs</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link active={router.pathname.startsWith("/blog")} as={Link} href="/blog">Blog</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    );
  }, [kind, router.pathname]);

  return (
    <header {...props} className={classNames("border-bottom border-1 bg-white", className)}>
      <Navbar className="justify-content-start" collapseOnSelect expand="md">
        <Container>
          {navbarToggleNode}

          <Navbar.Brand className="d-flex flex-row flex-grow-1 flex-md-grow-0">
            <Link href="/">
              <Logo className="d-block" style={{ height: 38 }} />
            </Link>

            <Actions className="d-md-none ms-auto" />
          </Navbar.Brand>

          {navbarCollapseNode}

          <Actions className="d-none d-md-flex" />
        </Container>
      </Navbar>
    </header>
  );
}
