import Link from "next/link";
import React from "react";
import Logo from "~components/Logo";

export default function Footer() {
  return (
    <footer className="bg-body border-top mt-auto">
      <div className="container py-4">
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
              <ul className="flex-column nav">
                <li className="fw-semibold nav-item px-2 py-1">PoeticMetric</li>

                <li className="nav-item">
                  <Link className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover" href="/">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="/manifesto"
                  >
                    Manifesto
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="/open-source"
                  >
                    Open source
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="https://status.poeticmetric.com"
                  >
                    Service status
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <ul className="flex-column nav">
                <li className="fw-semibold nav-item px-2 py-1">Resources</li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="/blog"
                  >
                    Blog
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="/docs"
                  >
                    Docs
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="/terms-of-service"
                  >
                    Terms of service
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="/privacy-policy"
                  >
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <ul className="flex-column nav">
                <li className="fw-semibold nav-item px-2 py-1">Community</li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="https://github.com/th0th/poeticmetric"
                    target="_blank"
                  >
                    GitHub
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="d-inline-block fw-normal nav-link px-2 py-1 text-body text-decoration-underline-hover"
                    href="https://discord.poeticmetric.com"
                    target="_blank"
                  >
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
