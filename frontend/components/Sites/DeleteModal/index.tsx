import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { ToastsContext } from "../../../contexts";
import { api } from "../../../helpers";
import { useQueryNumber, useSwrMatchMutate } from "../../../hooks";

const routerQueryKey = "deleteSiteId";

type State = {
  site: Site | undefined;
};

export function DeleteModal() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const swrMatchMutate = useSwrMatchMutate();
  const id = useQueryNumber(routerQueryKey);
  const [state, setState] = useState<State>({ site: undefined });

  const handleHide = useCallback(() => {
    router.push({ pathname: router.pathname, query: omit(router.query, routerQueryKey) });
  }, [router]);

  const handleDelete = useCallback(async () => {
    const response = await api.delete(`/sites/${id}`);

    if (response.ok) {
      addToast({ body: "Site is deleted.", variant: "success" });

      await swrMatchMutate("/sites");

      handleHide();
    } else {
      const responseJson = await response.json();

      addToast({ body: responseJson || "An error has occurred.", variant: "danger" });
    }
  }, [addToast, handleHide, id, swrMatchMutate]);

  const handleExited = useCallback(() => setState((s) => ({ ...s, site: undefined })), []);

  const contentNode = useMemo(() => {
    if (state.site === undefined) {
      return (
        <div className="d-flex flex-column align-items-center py-5">
          <Spinner animation="border" />
        </div>
      );
    }

    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Delete site</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {"Are you sure you want to delete the site "}

          <span className="fw-semibold">{state.site.name}</span>

          ?
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleHide} variant="secondary">
            Cancel
          </Button>

          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
        </Modal.Footer>
      </>
    );
  }, [handleDelete, handleHide, state.site]);

  useEffect(() => {
    async function read() {
      const response = await api.get(`/sites/${id}`);
      const responseJson = await response.json();

      if (response.ok) {
        setState((s) => ({ ...s, site: responseJson }));
      } else {
        addToast({ body: responseJson.detail || "An error has occurred.", variant: "danger" });

        handleHide();
      }
    }

    if (id !== undefined) {
      read();
    }
  }, [addToast, handleHide, id]);

  return (
    <Modal onExited={handleExited} onHide={handleHide} show={id !== undefined}>
      {contentNode}
    </Modal>
  );
}
