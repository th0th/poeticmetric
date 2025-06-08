import { IconBrandLinkedin, IconBrandMastodon, IconCode, TablerIcon } from "@tabler/icons-react";
import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";
import { Link } from "react-router";
import Logo from "~/components/Logo";

export type FooterProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["footer"]>, "children">;

type NavColumn = {
  items: Array<NavColumnItem>;
  title: string;
};

type NavColumnAnchor = NavColumnItemCommon & {
  href: string;
};

type NavColumnLink = NavColumnItemCommon & {
  to: string;
};

type NavColumnItemCommon = {
  fontWeight?: "semi-bold";
  title: string;
  variant?: "primary";
};

type NavColumnItem = NavColumnAnchor | NavColumnLink;

type SocialLink = {
  href: string;
  icon: TablerIcon;
  title: string;
};

const navColumns: Array<NavColumn> = [
  {
    items: [
      { fontWeight: "semi-bold", title: "Start free trial", to: "/sign-up", variant: "primary" },
      { title: "Manifesto", to: "/manifesto" },
      { title: "Open source", to: "/open-source" },
      { title: "Pricing", to: "/pricing" },
      { href: "https://status.poeticmetric.com", title: "Service status" },
    ],
    title: "Product",
  },
  {
    items: [
      { title: "Documentation", to: "/docs" },
      { title: "Blog", to: "/blog" },
    ],
    title: "Resources",
  },
  {
    items: [
      { title: "Contact", to: "/contact" },
      { title: "Terms of service", to: "/terms-of-service" },
      { title: "Privacy policy", to: "/privacy-policy" },
    ],
    title: "Company",
  },
];

const socialLinks: Array<SocialLink> = [
  {
    href: "https://codeberg.org/poeticmetric/poeticmetric",
    icon: IconCode,
    title: "Source code",
  },
  {
    href: "https://fosstodon.org/@poeticmetric",
    icon: IconBrandMastodon,
    title: "Mastodon",
  },
  {
    href: "https://linkedin.com/company/PoeticMetric",
    icon: IconBrandLinkedin,
    title: "LinkedIn",
  },
];

function isNavColumnAnchor(item: NavColumnItem): item is NavColumnAnchor {
  return (item as NavColumnAnchor).href !== undefined;
}

export default function Footer({ className, ...props }: FooterProps) {
  return (
    <footer {...props} className={classNames("bg-body border-top mt-auto", className)}>
      <div className="container py-16">
        <div className="d-flex flex-column-reverse flex-lg-row gap-8">
          <div
            className="align-items-center align-items-lg-start d-flex flex-column flex-lg-column flex-md-row gap-8 mw-lg-20rem text-center
            text-lg-start text-md-end"
          >
            <Logo className="flex-shrink-0 h-2rem" logotype />

            <div className="fs-7 text-body-secondary">
              PoeticMetric gives you clear, privacy-friendly analytics to help your business grow. Get insights you trust, stay compliant,
              and keep control of your data. All made easy with open source.
            </div>
          </div>

          <div className="mx-auto" />

          <div>
            <div className="d-flex flex-column flex-md-row gap-8 gap-md-0 justify-content-between">
              {navColumns.map((navColumn) => (
                <div className="d-flex flex-column text-center text-md-start" key={navColumn.title}>
                  <ul className="flex-column nav">
                    <li className="nav-item">
                      <div className="fw-semi-bold nav-link text-body">{navColumn.title}</div>
                    </li>

                    {navColumn.items.map((item) => (
                      <li className="nav-item" key={item.title}>
                        {isNavColumnAnchor(item) ? (
                          <a className={getNavColumnItemClassName(item)} href={item.href} target="_blank">
                            {item.title}
                          </a>
                        ) : (
                          <Link className={getNavColumnItemClassName(item)} to={item.to}>
                            {item.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-top">
        <div className="container py-10">
          <div className="align-items-center d-flex">
            <div className="fs-7 text-body-secondary">
              Copyright &copy;
              {" "}
              <span className="text-body">WebGazer, Inc.</span>
              {" "}
              All rights reserved.
            </div>

            <div className="mx-auto px-4"></div>

            <div className="gap-2 hstack">
              {socialLinks.map((d) => (
                <a
                  className="bg-body-secondary-focus-visible bg-body-secondary-hover p-2 rounded size-2rem text-body-secondary
                  text-body-emphasis-focus-visible text-body-emphasis-hover"
                  href={d.href}
                  key={d.title}
                  target="_blank"
                >
                  <d.icon size="100%" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function getNavColumnItemClassName(item: NavColumnItem) {
  return classNames(
    "fw-regular my-1 nav-link py-1 text-decoration-underline-focus-visible text-decoration-underline-hover",
    item.fontWeight !== undefined ? `fw-${item.fontWeight}` : undefined,
    item.variant !== undefined ? `text-${item.variant}` : "text-body",
  );
}
