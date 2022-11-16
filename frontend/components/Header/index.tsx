import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Logo } from "..";
import { AuthAndApiContext } from "../../contexts";
import { Actions } from "./Actions";

export type HeaderProps = React.PropsWithoutRef<JSX.IntrinsicElements["header"]>;

const navbarId: string = "header-navbar";

export function Header({ className, ...props }: HeaderProps) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);

  const navbarToggleNode = useMemo(() => (user !== null ? (
    <Navbar.Toggle aria-controls={navbarId} className="me-3" />
  ) : null), [user]);

  const navbarCollapseNode = useMemo(() => (user !== null ? (
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
  ) : null), [router.pathname, user]);

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
