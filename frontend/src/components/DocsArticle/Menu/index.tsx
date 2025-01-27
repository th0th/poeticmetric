import { useWindowSize } from "@react-hookz/web";
import { IconChevronRight, IconFile, IconVocabulary } from "@tabler/icons-react";
import classNames from "classnames";
import { createElement, forwardRef, JSX, PropsWithoutRef, Ref, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Collapse } from "react-bootstrap";
import { Link } from "wouter";
import DocsArticleContext from "~/contexts/DocsArticleContext";
import { getDocsCategories } from "~/lib/docs";
import styles from "./Menu.module.scss";
import Search from "./Search";
import icons from "./icons";

export type MenuProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["nav"]>, "children">;

type State = {
  isOpen: boolean;
  openCategorySlugs: Array<string>;
};

const docsCategories = getDocsCategories();

function Menu({ className, ...props }: MenuProps, ref: Ref<HTMLElement>) {
  const isTransitionDisabled = useRef<boolean>(true);
  const { article: currentArticle, category: currentCategory } = useContext(DocsArticleContext);
  const [state, setState] = useState<State>({ isOpen: true, openCategorySlugs: [] });
  const { width } = useWindowSize();

  const toggle = useCallback(() => setState((state) => ({ ...state, isOpen: !state.isOpen })), []);
  const close = useCallback(() => setState((state) => ({ ...state, isOpen: false })), []);

  const toggleCategory = useCallback((categorySlug: string) => setState((state) => ({
    ...state,
    openCategorySlugs: state.openCategorySlugs.includes(categorySlug)
      ? state.openCategorySlugs.filter((slug) => slug !== categorySlug)
      : [...state.openCategorySlugs, categorySlug],
  })), []);

  const handleExited = useCallback(() => {
    isTransitionDisabled.current = false;
  }, []);

  useEffect(() => {
    setState((s) => {
      const isOpen = width >= Number(getComputedStyle(document.body).getPropertyValue("--bs-breakpoint-md").replace("px", ""));

      if (isOpen) {
        isTransitionDisabled.current = true;
      }

      return { ...s, isOpen };
    });
  }, [width]);

  return (
    <>
      <div className="align-items-center d-flex d-md-none flex-column pb-2 pt-8">
        <button
          className="align-items-center btn btn-primary btn-sm d-flex flex-row gap-2"
          onClick={toggle}
          type="button"
        >
          <IconVocabulary size={16} />

          <span>
            {state.isOpen ? "Hide" : "Show"}
          </span>
          {" docs menu"}
        </button>
      </div>

      <Collapse in={state.isOpen} onExited={handleExited} timeout={isTransitionDisabled.current ? 0 : undefined}>
        <nav
          {...props}
          className={classNames("gap-2 overflow-auto sticky-top vstack", styles.menu, className)}
          ref={ref}
        >
          <div>
            <Search onItemClick={close} />

            <div className="gap-2 py-4 vstack">
              {docsCategories.map((category) => (
                <div className="fs-7 fw-medium" key={category.slug}>
                  <button
                    className={classNames(
                      "align-items-center bg-body-secondary-focus-visible bg-body-secondary-hover bg-transparent border-0 d-flex flex-row",
                      "gap-4 fw-medium px-4 py-2 rounded text-start w-100",
                      currentCategory.slug === category.slug ? "text-body-emphasis" : "text-body",
                    )}
                    onClick={() => toggleCategory(category.slug)}
                    type="button"
                  >
                    <span>{category.title}</span>

                    <IconChevronRight
                      className={classNames(
                        "flex-shrink-0 ms-auto transition-all",
                        { "rotate-90deg": state.openCategorySlugs.includes(category.slug) },
                      )}
                      size={16}
                    />
                  </button>

                  <div className="mt-1">
                    <Collapse in={state.openCategorySlugs.includes(category.slug)}>
                      <ul className="gap-2 list-unstyled m-0 ms-3 vstack">
                        {category.articles.map((article) => (
                          <li {...props} key={article.slug}>
                            <Link
                              className={classNames(
                                "align-items-center d-flex flex-row gap-2 px-4 py-2 rounded text-decoration-none",
                                currentCategory.slug === category.slug && currentArticle.slug === article.slug
                                  ? "text-body bg-body-secondary text-body-emphasis" :
                                  "bg-body-secondary-focus-visible bg-body-secondary-hover text-body-secondary",
                              )}
                              to={`/docs/${category.slug}/${article.slug}`}
                            >
                              {createElement(icons[article.icon] || IconFile, { className: "flex-shrink-0", size: 16 })}

                              <span>{article.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </Collapse>
    </>
  );
}

export default forwardRef(Menu);
