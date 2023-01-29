import { omit } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { mutate } from "swr";
import { ToastsContext } from "../../../contexts";
import { api } from "../../../helpers";
import { useQueryParameter, useUser } from "../../../hooks";

const routerQueryKey = "deleteUserId";

type State = {
  user: User | undefined;
};

export function DeleteModal() {
  const router = useRouter();
  const { addToast } = useContext(ToastsContext);
  const { hasError: hasIdError, value: id } = useQueryParameter(routerQueryKey, "number");
  const { data: user, error: userError } = useUser(id);
  const [state, setState] = useState<State>({ user: undefined });

  const handleExited = useCallback(() => setState((s) => ({ ...s, user: undefined })), []);

  const handleHide = useCallback(
    () => router.push({ pathname: router.pathname, query: omit(router.query, [routerQueryKey]) }),
    [router],
  );

  const handleDelete = useCallback(async () => {
    if (user === undefined) {
      return;
    }

    const response = await api.delete(`/users/${user.id}`);

    if (!response.ok) {
      const responseJson = await response.json();
      addToast({ body: responseJson || "An error has occurred.", variant: "danger" });

      return;
    }

    addToast({ body: "Team member is deleted.", variant: "success" });
    await handleHide();
    await mutate("/team");
  }, [addToast, handleHide, user]);

  useEffect(() => {
    if (hasIdError || userError !== undefined) {
      addToast({ body: userError?.message || "Not found.", variant: "danger" });
      router.replace("/team");
    }
  }, [addToast, hasIdError, router, userError]);

  useEffect(() => {
    if (user !== undefined) {
      setState((s) => ({ ...s, user }));
    }
  }, [user]);

  return (
    <Modal onExited={handleExited} onHide={handleHide} show={user !== undefined}>
      <Modal.Header closeButton>
        <Modal.Title>Delete team member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {"Are you sure you want to delete the team member "}

        <span className="fw-semibold">{state.user?.name}</span>

        ?
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleHide} variant="secondary">Cancel</Button>

        <Button onClick={handleDelete} variant="danger">Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}
