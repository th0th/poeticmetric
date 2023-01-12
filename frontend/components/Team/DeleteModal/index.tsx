import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { AuthAndApiContext, ToastsContext } from "../../../contexts";
import { useQueryNumber, useSwrMatchMutate } from "../../../hooks";

const routerQueryKey = "deleteUserId";

type State = {
  user: User | undefined;
};

export function DeleteModal() {
  const router = useRouter();
  const { api } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const swrMatchMutate = useSwrMatchMutate();
  const id = useQueryNumber(routerQueryKey);
  const [state, setState] = useState<State>({ user: undefined });

  const handleHide = useCallback(() => {
    router.push({ pathname: router.pathname, query: omit(router.query, routerQueryKey) });
  }, [router]);

  const handleDelete = useCallback(async () => {
    const response = await api.delete(`/users/${id}`);

    if (response.ok) {
      addToast({ body: "Team member is deleted.", variant: "success" });

      await swrMatchMutate("/users");

      handleHide();
    } else {
      const responseJson = await response.json();

      addToast({ body: responseJson || "An error has occurred.", variant: "danger" });
    }
  }, [addToast, api, handleHide, id, swrMatchMutate]);

  const handleExited = useCallback(() => setState((s) => ({ ...s, user: undefined })), []);

  const contentNode = useMemo(() => {
    if (state.user === undefined) {
      return (
        <div className="d-flex flex-column align-items-center py-5">
          <Spinner animation="border" />
        </div>
      );
    }

    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Delete team member</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {"Are you sure you want to delete the team member "}

          <span className="fw-semibold">{state.user.name}</span>

          ?
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleHide} variant="secondary">Cancel</Button>

          <Button onClick={handleDelete} variant="danger">Delete</Button>
        </Modal.Footer>
      </>
    );
  }, [handleDelete, handleHide, state.user]);

  useEffect(() => {
    async function read() {
      const response = await api.get(`/users/${id}`);
      const responseJson = await response.json();

      if (response.ok) {
        setState((s) => ({ ...s, user: responseJson }));
      } else {
        addToast({ body: responseJson.detail || "An error has occurred.", variant: "danger" });

        handleHide();
      }
    }

    if (id !== undefined) {
      read();
    }
  }, [addToast, api, handleHide, id]);

  return (
    <Modal onExited={handleExited} onHide={handleHide} show={id !== undefined}>
      {contentNode}
    </Modal>
  );
}
