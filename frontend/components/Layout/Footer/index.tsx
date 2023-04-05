import Link from "next/link";
import React, { useContext } from "react";
import { Container, Nav } from "react-bootstrap";
import { LayoutContext } from "../../../contexts";
import { Logo } from "../../Logo";

export function Footer() {
  const { kind } = useContext(LayoutContext);

  return kind === "website" ? (
    <footer className="bg-white border-top">
      <Container className="py-4">
        <div className="d-flex flex-column-reverse flex-lg-row gap-4 gap-lg-5">
          <div className="align-items-center align-items-lg-start d-flex flex-column text-center text-lg-start">
            <Logo className="h-2rem" logotype />

            <div className="fs-sm mt-3">
              <div>Copyright &copy; WebGazer, Inc.</div>

              <div>All rights reserved.</div>
            </div>
          </div>

          <div className="justify-content-between d-flex flex-wrap gap-3 gap-lg-5">
            <div>
              <Nav className="flex-column">
                <Nav.Item className="fw-semibold px-2 py-1">PoeticMetric</Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="/"
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="/manifesto"
                  >
                    Manifesto
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="/pricing"
                  >
                    Pricing
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="https://status.poeticmetric.com"
                  >
                    Service status
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            <div>
              <Nav className="flex-column">
                <Nav.Item className="fw-semibold px-2 py-1">Resources</Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="/blog"
                  >
                    Blog
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="/docs"
                  >
                    Docs
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="/terms-of-service"
                  >
                    Terms of service
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="/privacy-policy"
                  >
                    Privacy policy
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            <div>
              <Nav className="flex-column">
                <Nav.Item className="fw-semibold px-2 py-1">Community</Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="https://github.com/th0th/poeticmetric"
                    target="_blank"
                  >
                    GitHub
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    className="d-inline-block fw-normal px-2 py-1 text-black text-decoration-underline-hover"
                    href="https://discord.poeticmetric.com"
                    target="_blank"
                  >
                    Discord
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  ) : null;
}
