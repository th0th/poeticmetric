import { useDebouncedEffect } from "@react-hookz/web";
import classNames from "classnames";
import { createElement, FocusEventHandler, JSX, PropsWithoutRef, useCallback, useEffect, useState } from "react";
import { Modal as BaseModal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import Portal from "~/components/Portal";
import { getDocsCache } from "~/lib/docs";
import icons from "../icons";

export type SearchProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  onItemClick?: () => void;
}>;

type State = {
  isInProgress: boolean;
  isModalShown: boolean;
  results: Array<Overwrite<DocsCacheItem, {
    body: string;
  }>>;
};

type Form = {
  term: string;
};

const cache = getDocsCache();

export default function Search({ className, onItemClick, ...props }: SearchProps) {
  const [state, setState] = useState<State>({ isInProgress: false, isModalShown: false, results: [] });
  const { register, setValue, watch } = useForm<Form>({ defaultValues: { term: "" } });
  const term = watch("term");

  const handleDecoyInputFocus = useCallback<FocusEventHandler<HTMLInputElement>>((event) => {
    event.target.blur();

    setState((s) => ({ ...s, isModalShown: true }));
  }, []);

  const hideModal = useCallback(() => {
    setState((state) => ({ ...state, isModalShown: false }));
  }, []);

  const resetTerm = useCallback(() => {
    setValue("term", "");
  }, [setValue]);

  const handleItemClick = useCallback(() => {
    hideModal();
    onItemClick?.();
  }, [hideModal, onItemClick]);

  useEffect(() => {
    setState((s) => ({ ...s, isInProgress: true }));
  }, [term]);

  useDebouncedEffect(() => {
    const results: State["results"] = term.length === 0 ? [] : cache.filter((item) => (
      item.category.title.toLowerCase().includes(term.toLowerCase())
      || item.article.title.toLowerCase().includes(term.toLowerCase())
      || item.article.content.toLowerCase().includes(term.toLowerCase())
    )).map((item) => {
      let body: string;

      if (item.article.content.toLowerCase().includes(term.toLowerCase())) {
        const index = item.article.content.toLowerCase().indexOf(term.toLowerCase());

        body = item.article.content.slice(index).slice(0, 300);

        if (index > 3) {
          body = `...${body}`;
        }
      } else {
        body = item.article.content.slice(0, 300);
      }

      return { ...item, body };
    });

    setState((s) => ({ ...s, isInProgress: false, results }));
  }, [term], 300);

  return (
    <>
      <div {...props} className={classNames("bg-body py-4 sticky-top", className)}>
        <input
          className="form-control"
          onFocus={handleDecoyInputFocus}
          placeholder="Search..."
          type="text"
        />
      </div>

      <Portal>
        <BaseModal
          centered
          onExited={resetTerm}
          onHide={hideModal}
          show={state.isModalShown}
        >
          <BaseModal.Header closeButton>
            <BaseModal.Title>Search in docs</BaseModal.Title>
          </BaseModal.Header>

          <BaseModal.Body className="p-0">
            <div className="p-6">
              <input
                autoFocus  
                className="form-control"
                placeholder="Search..."
                type="text"
                {...register("term")}
              />
            </div>

            <div className="mh-50vh overflow-auto p-6">
              {state.isInProgress ? (
                <div className="align-items-center d-flex flex-column">
                  <div className="spinner-border spinner-border-sm text-primary" />
                </div>
              ) : (
                <>
                  {state.results.length === 0 ? (
                    <>
                      {term.length === 0 ? null : (
                        <div className="text-center">
                          We couldn&apos;t find any relevant article.
                          {" "}

                          <a href="mailto:support@poeticmetric.com?subject=I%20can%27t%20find%20this%20on%20docs">Contact support</a>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="gap-8 vstack">
                      {state.results.map((result) => (
                        <Link
                          className="bg-primary-subtle-focus-visible bg-primary-subtle-hover border-primary-focus-visible
                           border-primary-hover card text-decoration-none transition-all"
                          key={`${result.category.slug}-${result.article.slug}`}
                          onClick={handleItemClick}
                          to={`/docs/${result.category.slug}/${result.article.slug}`}
                        >
                          <div className="card-body">
                            <div className="align-items-center fw-bold gap-2 hstack text-primary">
                              {createElement(icons[result.article.icon], { className: "flex-shrink-0", size: 16 })}

                              <span>{result.article.title}</span>
                            </div>

                            <div className="fs-7 fw-semi-bold">{result.category.title}</div>

                            <div className="card-text d-webkit-box fs-7 line-clamp-3 mt-4 overflow-hidden">{result.body}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </BaseModal.Body>
        </BaseModal>
      </Portal>
    </>
  );
}
