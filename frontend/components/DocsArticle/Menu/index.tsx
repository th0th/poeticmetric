import classNames from "classnames";
import Link from "next/link";
import React, { useId } from "react";
import { Dropdown } from "react-bootstrap";
import styles from "./Menu.module.scss";

export type MenuProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  article: DocsArticle;
  categories: Array<DocsCategory>;
}>;

export function Menu({ categories, className, article: articleFromProps, ...props }: MenuProps) {
  const dropdownToggleId = useId();

  return (
    <div {...props} className={classNames("bg-md-white d-flex flex-column flex-shrink-0 justify-content-start", className)}>
      <div className={classNames("position-sticky", styles.innerWrapper)}>
        <div className="px-3 pt-4">
          <Dropdown className="d-md-none">
            <Dropdown.Toggle className="d-block m-auto" id={dropdownToggleId}>
              <span className="bi-journal-text me-2" />

              Show docs menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="gap-2 pt-1 vstack">
                {categories.map((category) => (
                  <div key={category.slug}>
                    <h6 className="px-3">{category.title}</h6>

                    {category.articles.map((article) => (
                      <Dropdown.Item key={article.slug}>{article.title}</Dropdown.Item>
                    ))}
                  </div>
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className={classNames("d-none d-md-block overflow-auto px-3 py-4", styles.categories)}>
          <nav className="gap-3 vstack">
            {categories.map((category) => (
              <div key={category.slug}>
                <h6>{category.title}</h6>

                <div className="gap-1 vstack">
                  {category.articles.map((article) => (
                    <Link
                      className={classNames(
                        "d-block text-decoration-none",
                        articleFromProps.category.slug === category.slug && articleFromProps.slug === article.slug
                          ? "text-primary"
                          : "text-decoration-underline-hover text-black",
                      )}
                      href={`/docs/${category.slug}/${article.slug}`}
                      key={article.slug}
                    >
                      {article.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
