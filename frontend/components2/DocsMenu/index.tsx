"use client";

import classNames from "classnames";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment } from "react";

export type DocsMenuProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["nav"]>, "children">, {
  items: DocsItems;
}>;

export default function DocsMenu({ className, items, ...props }: DocsMenuProps) {
  const params = useParams();

  return (
    <>
      <div className="d-md-none dropdown">
        <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" type="button">
          <i className="bi bi-journal-text me-2" />

          Show docs menu
        </button>

        <ul className="dropdown-menu">
          {items.map((category) => (
            <Fragment key={category.slug}>
              <li>
                <Link className="dropdown-item fs-6 fw-bold" href={`/docs/${category.slug}`}>{category.title}</Link>
              </li>

              {category.articles.map((article) => (
                <li key={article.slug}>
                  <Link className="dropdown-item" href={`/docs/${category.slug}/${article.slug}`}>{article.title}</Link>
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      </div>

      <nav {...props} className={classNames("d-md-flex d-none px-3 py-4 vstack", className)}>
        <ul className="list-unstyled">
          <li>
            <Link
              className={classNames(
                "text-decoration-none text-decoration-underline-hover",
                params.categorySlug === undefined ? "text-primary" : "text-body",
              )}
              href="/docs"
            >
              Foreword
            </Link>
          </li>
        </ul>

        {items.map((category) => (
          <ul className="gap-1 list-unstyled vstack" key={category.title}>
            <li>
              <Link
                className={classNames(
                  "fw-bold text-decoration-none text-decoration-underline-hover",
                  params.categorySlug === category.slug && params.articleSlug === undefined ? "text-primary" : "text-body"
                )}
                href={`/docs/${category.slug}`}
              >
                {category.title}
              </Link>
            </li>

            {category.articles.map((article) => (
              <li key={article.title}>
                <Link
                  className={classNames(
                    "text-decoration-none text-decoration-underline-hover",
                    params.categorySlug === category.slug && params.articleSlug === article.slug ? "text-primary" : "text-body"
                  )}
                  href={`/docs/${category.slug}/${article.slug}`}
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </nav>
    </>
  );
}
