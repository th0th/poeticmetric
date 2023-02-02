import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { Card, Form, Modal, Spinner, Stack } from "react-bootstrap";
import { useDebounce } from "react-use";
import cache from "./cache.json";

type Result = {
  category: string;
  href: string;
  node: string;
  title: string;
};

type State = {
  filter: string;
  input: string;
  isModalShown: boolean;
};

export function Search() {
  const [state, setState] = useState<State>({ filter: "", input: "", isModalShown: false });

  useDebounce(() => setState((s) => ({ ...s, filter: s.input })), state.input === "" ? 0 : 1000, [state.input]);

  const contentNode = useMemo<React.ReactNode>(() => {
    if (state.input === "") {
      return null;
    }

    if (state.filter !== state.input) {
      return (
        <Spinner className="d-block mx-auto" variant="primary" />
      );
    }

    let results: Array<Result> = [];

    results = (cache as Array<DocsCacheItem>).filter((a) => (
      a.category.toLowerCase().includes(state.filter)
      || a.title.toLowerCase().includes(state.filter)
      || a.content.toLowerCase().includes(state.filter)
    )).map((a) => {
      let text: string;

      if (a.content.toLowerCase().includes(state.filter)) {
        const index = a.content.indexOf(state.filter);

        text = a.content.slice(index);
        text = text.slice(0, 200);

        if (index > 0) {
          text = `...${text}`;
        }
      } else {
        text = a.content.slice(0, 200);
      }

      return { category: a.category, href: a.href, node: text, title: a.title };
    });

    if (results.length === 0) {
      return (
        <div className="text-center">
          {"We couldn't find any relevant article. "}

          <a href="mailto:support@poeticmetric.com?subject=I%20can%27t%20find%20this%20on%20docs">Contact support</a>
        </div>
      );
    }

    return (
      <Stack gap={2}>
        {results.map((result) => (
          <Link
            className="bg-light-hover border-primary-focus border-primary-hover card text-decoration-none text-dark"
            href={result.href}
            key={`${result.category}-${result.title}`}
            onClick={() => setState((s) => ({ ...s, isModalShown: false }))}
          >
            <Card.Body>
              <h6 className="fw-bold text-primary">{result.title}</h6>

              <div className="fs-sm fw-medium">{result.category}</div>

              <div className="fs-xs mt-2 text-truncate">{result.node}</div>
            </Card.Body>
          </Link>
        ))}
      </Stack>
    );
  }, [state.filter, state.input]);

  const handleDecoyInputFocus = useCallback<React.FocusEventHandler<HTMLInputElement>>((event) => {
    event.target.blur();

    setState((s) => ({ ...s, isModalShown: true }));
  }, []);

  const handleInputChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setState((s) => ({ ...s, input: event.target.value }));
  }, []);

  const handleModalHide = useCallback(() => {
    setState((s) => ({ ...s, isModalShown: false }));
  }, []);

  return (
    <>
      <div>
        <Form.Control onFocus={handleDecoyInputFocus} placeholder="Search..." />
      </div>

      <Modal centered onHide={handleModalHide} scrollable show={state.isModalShown}>
        <Modal.Header className="border-bottom-0" closeButton>
          <Modal.Title>Search on docs</Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex flex-column pb-0">
          <div className="bg-white">
            <Form.Control autoFocus onChange={handleInputChange} placeholder="Search..." value={state.input} />
          </div>

          <div className="mt-3 mx-n3 overflow-auto pb-3 px-3">
            {contentNode}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
